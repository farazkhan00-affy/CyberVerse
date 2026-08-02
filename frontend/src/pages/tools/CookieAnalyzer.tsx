import { useState } from "react";
import { motion } from "framer-motion";
import { Cookie, Search, CheckCircle2, XCircle } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import api from "../../lib/api";
import { addActivity } from "../../lib/activity";

interface CookieInfo {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httponly: boolean;
  samesite: string;
  expires: string;
}

export default function CookieAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cookies, setCookies] = useState<CookieInfo[] | null>(null);

  const handleCheck = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setCookies(null);

    try {
      const res = await api.get("/web/cookie-analyzer", { params: { url: url.trim() } });
      setCookies(res.data.cookies);
      addActivity("Cookie analysis performed");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not reach this URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Cookie className="text-yellow-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Cookie Analyzer</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Analyze cookies set by a website and their security attributes</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex gap-3 mb-6">
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
                className="flex items-center gap-2 bg-neonGreen text-black font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                <Search size={16} /> {loading ? "Checking..." : "Check"}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            {cookies && cookies.length === 0 && (
              <p className="text-gray-500 text-sm">No cookies were set by this site.</p>
            )}

            {cookies && cookies.length > 0 && (
              <div className="space-y-3">
                {cookies.map((c, i) => (
                  <div key={i} className="bg-cyberDark border border-white/10 rounded-lg p-4">
                    <p className="text-white font-semibold text-sm mb-2 font-mono">{c.name}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {c.secure ? <CheckCircle2 size={13} className="text-neonGreen" /> : <XCircle size={13} className="text-red-400" />}
                        <span className="text-gray-400">Secure</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {c.httponly ? <CheckCircle2 size={13} className="text-neonGreen" /> : <XCircle size={13} className="text-red-400" />}
                        <span className="text-gray-400">HttpOnly</span>
                      </div>
                      <div className="text-gray-400">SameSite: <span className="text-white">{c.samesite}</span></div>
                      <div className="text-gray-400">Path: <span className="text-white">{c.path}</span></div>
                      <div className="text-gray-400 col-span-2">Expires: <span className="text-white">{c.expires}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}