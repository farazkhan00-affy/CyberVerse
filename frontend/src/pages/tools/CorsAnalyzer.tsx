import { useState } from "react";
import { motion } from "framer-motion";
import { Network, Search } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import api from "../../lib/api";
import { addActivity } from "../../lib/activity";

export default function CorsAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cors, setCors] = useState<{ [key: string]: string } | null>(null);

  const handleCheck = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setCors(null);

    try {
      const res = await api.get("/web/cors-analyzer", { params: { url: url.trim() } });
      setCors(res.data.cors);
      addActivity("CORS analysis performed");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not reach this URL");
    } finally {
      setLoading(false);
    }
  };

  const labels: { [key: string]: string } = {
    "access-control-allow-origin": "Allow-Origin",
    "access-control-allow-methods": "Allow-Methods",
    "access-control-allow-headers": "Allow-Headers",
    "access-control-allow-credentials": "Allow-Credentials",
  };

  return (
    <div className="bg-cyberDark min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-64 flex-1 pt-14 md:pt-0">
        <Topbar />
        <div className="p-4 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Network className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-white">CORS Analyzer</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Check a website's Cross-Origin Resource Sharing configuration</p>

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

            {cors && (
              <div className="space-y-2">
                {Object.entries(cors).map(([key, value]) => (
                  <div key={key} className="bg-cyberDark border border-white/10 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-gray-400 text-sm">{labels[key] || key}</span>
                    <span className="text-white text-sm font-mono break-all sm:text-right">{value}</span>
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