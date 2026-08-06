import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Search } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { addActivity } from "../../lib/activity";

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

const recordTypes = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"];

export default function DnsLookup() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ [key: string]: DnsAnswer[] }>({});

  const handleSearch = async () => {
    const target = domain.trim();
    if (!target) return;

    setLoading(true);
    setError("");
    setResults({});

    try {
      const allResults: { [key: string]: DnsAnswer[] } = {};

      await Promise.all(
        recordTypes.map(async (type) => {
          const res = await fetch(`https://dns.google/resolve?name=${target}&type=${type}`);
          const data = await res.json();
          if (data.Answer) {
            allResults[type] = data.Answer;
          }
        })
      );

      if (Object.keys(allResults).length === 0) {
        setError("No DNS records found for this domain");
      } else {
        setResults(allResults);
        addActivity("DNS lookup performed");
      }
    } catch {
      setError("Failed to fetch DNS records. Check your connection.");
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
            <Server className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-white">DNS Lookup</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Look up DNS records for any domain</p>

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
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter a domain (e.g. google.com)"
                className="flex-1 bg-cyberDark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neonGreen/40"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                <Search size={16} /> {loading ? "Looking up..." : "Lookup"}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            {Object.keys(results).length > 0 && (
              <div className="space-y-4">
                {Object.entries(results).map(([type, records]) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-xs font-semibold text-neonGreen mb-2">{type} RECORDS</p>
                    <div className="space-y-2">
                      {records.map((r, i) => (
                        <div key={i} className="bg-cyberDark border border-white/10 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <p className="text-white text-sm font-mono break-all">{r.data}</p>
                          <span className="text-gray-500 text-xs flex-shrink-0">TTL {r.TTL}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}