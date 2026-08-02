import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Search, ShieldCheck, ShieldAlert } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import api from "../../lib/api";
import { addActivity } from "../../lib/activity";

interface SslInfo {
  domain: string;
  issuer: string;
  subject: string;
  valid_from: string;
  valid_until: string;
  days_remaining: number;
  expired: boolean;
}

export default function SslChecker() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SslInfo | null>(null);

  const handleCheck = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.get("/web/ssl-check", { params: { domain: domain.trim() } });
      setResult(res.data);
      addActivity("SSL certificate checked");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not check SSL certificate");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Lock className="text-neonGreen" size={24} />
            <h1 className="text-2xl font-bold text-white">SSL Certificate Checker</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Check a domain's SSL/TLS certificate details and expiry</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="Enter a domain (e.g. github.com)"
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

            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className={`flex items-center gap-2 rounded-lg px-4 py-3 border ${
                  result.expired
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-neonGreen/10 border-neonGreen/30 text-neonGreen"
                }`}>
                  {result.expired ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                  <span className="text-sm font-semibold">
                    {result.expired ? "Certificate has expired" : `Valid — ${result.days_remaining} days remaining`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Issued To</p>
                    <p className="text-white text-sm mt-1">{result.subject}</p>
                  </div>
                  <div className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Issued By</p>
                    <p className="text-white text-sm mt-1">{result.issuer}</p>
                  </div>
                  <div className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Valid From</p>
                    <p className="text-white text-sm mt-1">{formatDate(result.valid_from)}</p>
                  </div>
                  <div className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Valid Until</p>
                    <p className="text-white text-sm mt-1">{formatDate(result.valid_until)}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}