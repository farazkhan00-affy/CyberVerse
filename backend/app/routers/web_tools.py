import ssl
import socket
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
import requests

router = APIRouter(prefix="/web", tags=["Web Tools"])


@router.get("/security-headers")
def get_security_headers(url: str = Query(...)):
    target = url if url.startswith("http") else f"https://{url}"
    try:
        res = requests.get(target, timeout=8, allow_redirects=True)
        headers = {k.lower(): v for k, v in res.headers.items()}
        return {"url": target, "headers": headers}
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Could not reach the URL: {str(e)}")


@router.get("/robots-txt")
def get_robots_txt(domain: str = Query(...)):
    clean_domain = domain.replace("https://", "").replace("http://", "").rstrip("/")
    target = f"https://{clean_domain}/robots.txt"
    try:
        res = requests.get(target, timeout=8)
        if res.status_code != 200:
            raise HTTPException(status_code=404, detail="robots.txt not found for this domain")
        return {"domain": clean_domain, "content": res.text}
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Could not fetch robots.txt: {str(e)}")


@router.get("/cookie-analyzer")
def analyze_cookies(url: str = Query(...)):
    target = url if url.startswith("http") else f"https://{url}"
    try:
        res = requests.get(target, timeout=8)
        cookies = []
        for cookie in res.cookies:
            cookies.append({
                "name": cookie.name,
                "value": cookie.value[:40] + ("..." if len(cookie.value) > 40 else ""),
                "domain": cookie.domain,
                "path": cookie.path,
                "secure": cookie.secure,
                "httponly": "httponly" in [k.lower() for k in cookie._rest.keys()],
                "samesite": cookie._rest.get("SameSite", "Not set"),
                "expires": datetime.fromtimestamp(cookie.expires).isoformat() if cookie.expires else "Session",
            })
        return {"url": target, "cookies": cookies}
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Could not reach the URL: {str(e)}")


@router.get("/cors-analyzer")
def analyze_cors(url: str = Query(...)):
    target = url if url.startswith("http") else f"https://{url}"
    try:
        res = requests.options(target, timeout=8, headers={"Origin": "https://example.com"})
        if res.status_code == 405 or "access-control-allow-origin" not in [h.lower() for h in res.headers.keys()]:
            res = requests.get(target, timeout=8, headers={"Origin": "https://example.com"})

        headers = {k.lower(): v for k, v in res.headers.items()}
        cors_headers = {
            "access-control-allow-origin": headers.get("access-control-allow-origin", "Not set"),
            "access-control-allow-methods": headers.get("access-control-allow-methods", "Not set"),
            "access-control-allow-headers": headers.get("access-control-allow-headers", "Not set"),
            "access-control-allow-credentials": headers.get("access-control-allow-credentials", "Not set"),
        }
        return {"url": target, "cors": cors_headers}
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Could not reach the URL: {str(e)}")


@router.get("/ssl-check")
def check_ssl(domain: str = Query(...)):
    clean_domain = domain.replace("https://", "").replace("http://", "").rstrip("/").split("/")[0]
    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((clean_domain, 443), timeout=8) as sock:
            with ctx.wrap_socket(sock, server_hostname=clean_domain) as ssock:
                cert = ssock.getpeercert()

        issuer = dict(x[0] for x in cert.get("issuer", []))
        subject = dict(x[0] for x in cert.get("subject", []))
        not_before = datetime.strptime(cert["notBefore"], "%b %d %H:%M:%S %Y %Z")
        not_after = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
        days_remaining = (not_after - datetime.utcnow()).days

        return {
            "domain": clean_domain,
            "issuer": issuer.get("organizationName", issuer.get("commonName", "Unknown")),
            "subject": subject.get("commonName", clean_domain),
            "valid_from": not_before.isoformat(),
            "valid_until": not_after.isoformat(),
            "days_remaining": days_remaining,
            "expired": days_remaining < 0,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not check SSL certificate: {str(e)}")