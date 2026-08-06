import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Search, CheckCircle2, XCircle } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import api from "../../lib/api";

const importantHeaders = [
  { key: "content-security-policy", label: "Content-Security-Policy" },
  { key: "strict-transport-security", label: "Strict-Transport-Security" },
  { key: "x-frame-options", label: "X-Frame-Options" },
  { key: "x-content-type-options", label: "X-Content-Type-Options" },
  { key: "referrer-policy", label: "Referrer-Policy" },
  { key: "permissions-policy", label: "Permissions-Policy" },
];

export default function SecurityHeaders() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState<{ [key: string]: string } | null>(null);

  const handleCheck = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setHeaders(null);

    try {
      const res = await api.get("/web/security-headers", { params: { url: url.trim() } });
      setHeaders(res.data.headers);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not reach this URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cyberDark min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-64 flex-1 pt-14 md:pt-0">
        <Topbar />
        <div className="p-4 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <ShieldAlert className="text-yellow-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Security Headers Checker</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Check which security headers a website has enabled</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="Enter a URL (e.g. github.com)"
                className="flex-1 bg-cyberDark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neonGreen/40"
              />
              <button
                onClick={handleCheck}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                <Search size={16} /> {loading ? "Checking..." : "Check"}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            {headers && (
              <div className="space-y-2">
                {importantHeaders.map((h) => {
                  const present = headers[h.key];
                  return (
                    <div key={h.key} className="bg-cyberDark border border-white/10 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {present ? (
                            <CheckCircle2 size={16} className="text-neonGreen flex-shrink-0" />
                          ) : (
                            <XCircle size={16} className="text-red-400 flex-shrink-0" />
                          )}
                          <span className="text-white text-sm">{h.label}</span>
                        </div>
                        <span className={`text-xs font-semibold ${present ? "text-neonGreen" : "text-red-400"}`}>
                          {present ? "Present" : "Missing"}
                        </span>
                      </div>
                      {present && <p className="text-gray-500 text-xs mt-2 break-all font-mono">{present}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}