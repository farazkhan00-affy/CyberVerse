import { useState } from "react";
import { motion } from "framer-motion";
import { UserSearch, Search } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { addActivity } from "../../lib/activity";

interface RdapEvent {
  eventAction: string;
  eventDate: string;
}

interface RdapResult {
  ldhName?: string;
  status?: string[];
  events?: RdapEvent[];
  nameservers?: { ldhName: string }[];
  entities?: { roles?: string[]; vcardArray?: any[] }[];
}

export default function WhoisLookup() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RdapResult | null>(null);

  const getEventDate = (data: RdapResult, action: string) => {
    return data.events?.find((e) => e.eventAction === action)?.eventDate;
  };

  const getRegistrar = (data: RdapResult) => {
    const registrarEntity = data.entities?.find((e) => e.roles?.includes("registrar"));
    const fnField = registrarEntity?.vcardArray?.[1]?.find((f: any) => f[0] === "fn");
    return fnField?.[3] || "Unknown";
  };

  const handleSearch = async () => {
    const target = domain.trim().toLowerCase();
    if (!target) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`https://rdap.org/domain/${target}`);
      if (!res.ok) {
        setError("Domain not found or WHOIS data unavailable");
        return;
      }
      const data = await res.json();
      setResult(data);
      addActivity("WHOIS lookup performed");
    } catch {
      setError("Failed to fetch WHOIS data. Check the domain and your connection.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <UserSearch className="text-purple-400" size={24} />
            <h1 className="text-2xl font-bold text-white">WHOIS Lookup</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Look up domain registration information</p>

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
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter a domain (e.g. google.com)"
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
                <p className="text-white font-semibold text-lg">{result.ldhName}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Registrar</p>
                    <p className="text-white text-sm mt-1">{getRegistrar(result)}</p>
                  </div>
                  <div className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Status</p>
                    <p className="text-white text-sm mt-1">{result.status?.[0] || "—"}</p>
                  </div>
                  <div className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Registered On</p>
                    <p className="text-white text-sm mt-1">{formatDate(getEventDate(result, "registration"))}</p>
                  </div>
                  <div className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <p className="text-gray-500 text-xs">Expires On</p>
                    <p className="text-white text-sm mt-1">{formatDate(getEventDate(result, "expiration"))}</p>
                  </div>
                </div>

                {result.nameservers && result.nameservers.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-neonGreen mb-2">NAMESERVERS</p>
                    <div className="space-y-2">
                      {result.nameservers.map((ns, i) => (
                        <div key={i} className="bg-cyberDark border border-white/10 rounded-lg p-3">
                          <p className="text-white text-sm font-mono">{ns.ldhName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}