import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, Copy, Check, AlertTriangle } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

function base64UrlDecode(str: string) {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return decodeURIComponent(escape(atob(s)));
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [expiry, setExpiry] = useState<{ label: string; expired: boolean } | null>(null);

  const decodeToken = (value: string) => {
    setToken(value);
    setError("");
    setHeader("");
    setPayload("");
    setSignature("");
    setExpiry(null);

    if (!value.trim()) return;

    const parts = value.trim().split(".");
    if (parts.length !== 3) {
      setError("Not a valid JWT — must have 3 parts separated by dots");
      return;
    }

    try {
      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));
      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setSignature(parts[2]);

      if (decodedPayload.exp) {
        const expDate = new Date(decodedPayload.exp * 1000);
        const isExpired = expDate.getTime() < Date.now();
        setExpiry({
          label: `${isExpired ? "Expired" : "Expires"} on ${expDate.toLocaleString()}`,
          expired: isExpired,
        });
      }
    } catch {
      setError("Could not decode this token — invalid format");
    }
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <KeyRound className="text-pink-400" size={24} />
            <h1 className="text-2xl font-bold text-white">JWT Decoder</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Decode and inspect JSON Web Tokens</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <p className="text-white text-sm font-semibold mb-2">JWT Token</p>
            <textarea
              value={token}
              onChange={(e) => decodeToken(e.target.value)}
              placeholder="Paste your JWT here (eyJhbGci...)"
              rows={3}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-xs mb-4 focus:outline-none focus:border-neonGreen/40 resize-none break-all"
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            {expiry && (
              <div className={`flex items-center gap-2 text-sm rounded-lg px-4 py-2 mb-4 border ${
                expiry.expired
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-neonGreen/10 border-neonGreen/30 text-neonGreen"
              }`}>
                <AlertTriangle size={16} />
                {expiry.label}
              </div>
            )}

            {header && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-blue-400">HEADER</p>
                  <button onClick={() => handleCopy("header", header)} className="text-gray-500 hover:text-neonGreen transition">
                    {copied === "header" ? <Check size={14} className="text-neonGreen" /> : <Copy size={14} />}
                  </button>
                </div>
                <pre className="bg-cyberDark border border-white/10 rounded-lg p-3 text-white text-xs overflow-x-auto">{header}</pre>
              </div>
            )}

            {payload && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-purple-400">PAYLOAD</p>
                  <button onClick={() => handleCopy("payload", payload)} className="text-gray-500 hover:text-neonGreen transition">
                    {copied === "payload" ? <Check size={14} className="text-neonGreen" /> : <Copy size={14} />}
                  </button>
                </div>
                <pre className="bg-cyberDark border border-white/10 rounded-lg p-3 text-white text-xs overflow-x-auto">{payload}</pre>
              </div>
            )}

            {signature && (
              <div>
                <p className="text-xs font-semibold text-neonGreen mb-1">SIGNATURE</p>
                <p className="bg-cyberDark border border-white/10 rounded-lg p-3 text-gray-400 text-xs break-all">{signature}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}