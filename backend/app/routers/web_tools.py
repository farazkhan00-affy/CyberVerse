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