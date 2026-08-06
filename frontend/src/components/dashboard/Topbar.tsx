import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getActivities, subscribeActivity, getUnreadCount, markAllSeen, timeAgo } from "../../lib/activity";
import { userKey } from "../../lib/session";

const allTools = [
  { name: "Password Generator", link: "/tools/password-generator" },
  { name: "Password Analyzer", link: "/tools/password-analyzer" },
  { name: "Entropy Calculator", link: "/tools/password-entropy" },
  { name: "Policy Validator", link: "/tools/password-policy" },
  { name: "IP Lookup", link: "/tools/ip-lookup" },
  { name: "DNS Lookup", link: "/tools/dns-lookup" },
  { name: "WHOIS Lookup", link: "/tools/whois-lookup" },
  { name: "Port Scanner", link: "/tools/port-scanner" },
  { name: "Security Headers Checker", link: "/tools/security-headers" },
  { name: "Robots.txt Viewer", link: "/tools/robots-viewer" },
  { name: "XSS/SQLi Pattern Checker", link: "/tools/vuln-checker" },
  { name: "Base64 / URL / HTML Encoder", link: "/tools/encoder-decoder" },
  { name: "JWT Decoder", link: "/tools/jwt-decoder" },
  { name: "Hash Generator", link: "/tools/hash-generator" },
  { name: "Hash Compare", link: "/tools/hash-compare" },
  { name: "Cookie Analyzer", link: "/tools/cookie-analyzer" },
  { name: "CORS Analyzer", link: "/tools/cors-analyzer" },
  { name: "SSL Certificate Checker", link: "/tools/ssl-checker" },
  { name: "QR Code Generator", link: "/tools/qr-generator" },
  { name: "Caesar Cipher", link: "/tools/caesar-cipher" },
  { name: "AES Encrypt/Decrypt", link: "/tools/aes-tool" },
  { name: "Hex/Binary Converter", link: "/tools/hex-binary" },
];

export default function Topbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState(getActivities());
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("User");
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeActivity(() => {
      setActivities(getActivities());
      setUnreadCount(getUnreadCount());
    });
  }, []);

  useEffect(() => {
    const load = () => {
      setAvatar(localStorage.getItem(userKey("profile_avatar")));
      setProfileName(localStorage.getItem(userKey("profile_name")) || "User");
    };
    load();
    window.addEventListener("profile-updated", load);
    return () => window.removeEventListener("profile-updated", load);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setOpen(!open);
    if (!open) markAllSeen();
  };

  const filteredTools = query.trim()
    ? allTools.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelectTool = (link: string) => {
    setQuery("");
    setShowResults(false);
    navigate(link);
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 bg-cyberDark sticky top-0 z-10 gap-3">
      <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-sm md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => query.trim() && setShowResults(true)}
          placeholder="Search tools..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"
        />

        <AnimatePresence>
          {showResults && query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 mt-2 bg-cyberDark border border-white/10 rounded-lg shadow-lg overflow-hidden z-30 max-h-72 overflow-y-auto"
            >
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => (
                  <button
                    key={tool.link}
                    onClick={() => handleSelectTool(tool.link)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
                  >
                    {tool.name}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-gray-500 text-sm">No tools found for "{query}"</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="relative text-gray-400 hover:text-white transition"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neonGreen text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-72 bg-cyberDark border border-white/10 rounded-xl shadow-lg overflow-hidden z-20"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white text-sm font-semibold">Notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {activities.slice(0, 8).map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition">
                      <p className="text-gray-300 text-xs">{n.text}</p>
                      <p className="text-gray-600 text-xs mt-1">{timeAgo(n.time)}</p>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="px-4 py-3 text-gray-600 text-xs">No notifications yet</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-9 h-9 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen font-semibold text-sm overflow-hidden">
          {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : profileName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}