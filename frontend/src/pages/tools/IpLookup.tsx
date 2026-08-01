import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Search, MapPin } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

interface IpInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  isp: string;
  org: string;
  timezone: { id: string };
  connection: { asn: number; org: string };
}

export default function IpLookup() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<IpInfo | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const target = query.trim();
      const url = target ? `https://ipwho.is/${target}` : `https://ipwho.is/`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success === false) {
        setError(data.message || "Could not find information for this IP");
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to fetch IP information. Check your connection.");
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
            <Globe className="text-neonGreen" size={24} />
            <h1 className="text-2xl font-bold text-white">IP Lookup</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Get geolocation and network info for any IP address</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter an IP address (leave blank for your own)"
                className="flex-1 bg-cyberDark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neonGreen/40"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center gap-2 bg-neonGreen text-black font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                <Search size={16} /> {loading ? "Looking up..." : "Lookup"}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-neonGreen" />
                  <p className="text-white font-semibold text-lg">{result.ip}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Country", value: result.country },
                    { label: "Region", value: result.region },
                    { label: "City", value: result.city },
                    { label: "Timezone", value: result.timezone?.id },
                    { label: "ISP", value: result.isp },
                    { label: "Organization", value: result.org },
                    { label: "ASN", value: result.connection?.asn ? `AS${result.connection.asn}` : "—" },
                  ].map((item) => (
                    <div key={item.label} className="bg-cyberDark border border-white/10 rounded-lg p-3">
                      <p className="text-gray-500 text-xs">{item.label}</p>
                      <p className="text-white text-sm mt-1 break-words">{item.value || "—"}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}