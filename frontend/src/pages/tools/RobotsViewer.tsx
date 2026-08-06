import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import api from "../../lib/api";

export default function RobotsViewer() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  const handleFetch = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    setContent("");

    try {
      const res = await api.get("/web/robots-txt", { params: { domain: domain.trim() } });
      setContent(res.data.content || "robots.txt is empty");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not fetch robots.txt");
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
            <FileText className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Robots.txt Viewer</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">View a website's robots.txt file</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                placeholder="Enter a domain (e.g. google.com)"
                className="flex-1 bg-cyberDark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neonGreen/40"
              />
              <button
                onClick={handleFetch}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                <Search size={16} /> {loading ? "Fetching..." : "Fetch"}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            {content && (
              <pre className="bg-cyberDark border border-white/10 rounded-lg p-4 text-gray-300 text-xs overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
                {content}
              </pre>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}