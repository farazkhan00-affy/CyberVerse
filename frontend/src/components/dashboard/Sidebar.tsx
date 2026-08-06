import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Lock, Globe, Monitor, Code2, Hash, ShieldCheck, Grid3x3,
  History, FileText, Star, Settings, ChevronDown, LogOut,
  KeyRound, Gauge, ClipboardCheck, Server, UserSearch, Braces, GitCompare,
  Radar, QrCode, ShieldAlert, Bug, Cookie, Network,
  KeySquare, ShieldEllipsis, Binary, Menu, X,
} from "lucide-react";
import logo from "../../assets/cyberverse-logo.svg";
import { userKey } from "../../lib/session";

const toolGroups = [
  {
    name: "Password Tools",
    icon: Lock,
    tools: [
      { name: "Password Generator", link: "/tools/password-generator", icon: KeyRound },
      { name: "Password Analyzer", link: "/tools/password-analyzer", icon: ShieldCheck },
      { name: "Entropy Calculator", link: "/tools/password-entropy", icon: Gauge },
      { name: "Policy Validator", link: "/tools/password-policy", icon: ClipboardCheck },
    ],
  },
  {
    name: "Network Tools",
    icon: Globe,
    tools: [
      { name: "IP Lookup", link: "/tools/ip-lookup", icon: Globe },
      { name: "DNS Lookup", link: "/tools/dns-lookup", icon: Server },
      { name: "WHOIS Lookup", link: "/tools/whois-lookup", icon: UserSearch },
      { name: "Port Scanner", link: "/tools/port-scanner", icon: Radar },
    ],
  },
  {
    name: "Web Tools",
    icon: Monitor,
    tools: [
      { name: "Security Headers Checker", link: "/tools/security-headers", icon: ShieldAlert },
      { name: "Robots.txt Viewer", link: "/tools/robots-viewer", icon: FileText },
      { name: "XSS/SQLi Pattern Checker", link: "/tools/vuln-checker", icon: Bug },
    ],
  },
  {
    name: "Encoder / Decoder",
    icon: Code2,
    tools: [
      { name: "Base64 / URL / HTML", link: "/tools/encoder-decoder", icon: Code2 },
      { name: "JWT Decoder", link: "/tools/jwt-decoder", icon: Braces },
    ],
  },
  {
    name: "Hash Tools",
    icon: Hash,
    tools: [
      { name: "Hash Generator", link: "/tools/hash-generator", icon: Hash },
      { name: "Hash Compare", link: "/tools/hash-compare", icon: GitCompare },
    ],
  },
  {
    name: "Security Tools",
    icon: ShieldCheck,
    tools: [
      { name: "Cookie Analyzer", link: "/tools/cookie-analyzer", icon: Cookie },
      { name: "CORS Analyzer", link: "/tools/cors-analyzer", icon: Network },
      { name: "SSL Certificate Checker", link: "/tools/ssl-checker", icon: Lock },
    ],
  },
  {
    name: "Other Tools",
    icon: Grid3x3,
    tools: [
      { name: "QR Code Generator", link: "/tools/qr-generator", icon: QrCode },
      { name: "Caesar Cipher", link: "/tools/caesar-cipher", icon: KeySquare },
      { name: "AES Encrypt/Decrypt", link: "/tools/aes-tool", icon: ShieldEllipsis },
      { name: "Hex/Binary Converter", link: "/tools/hex-binary", icon: Binary },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("User");
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      setProfileName(localStorage.getItem(userKey("profile_name")) || "User");
      setProfileAvatar(localStorage.getItem(userKey("profile_avatar")));
    };
    load();
    window.addEventListener("profile-updated", load);
    return () => window.removeEventListener("profile-updated", load);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const toggleGroup = (name: string) => {
    setOpenGroup(openGroup === name ? null : name);
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CyberVerse" className="w-7 h-7" />
          <div>
            <p className="text-white font-bold leading-tight">CYBERVERSE</p>
            <p className="text-gray-500 text-xs">Protect. Analyze. Secure.</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neonGreen/10 text-neonGreen font-medium mb-4"
        >
          <Home size={18} /> Dashboard
        </Link>

        <p className="text-gray-500 text-xs font-semibold px-3 mb-2 tracking-wider">TOOLS</p>
        {toolGroups.map((group) => {
          const isOpen = openGroup === group.name;
          const hasTools = group.tools.length > 0;

          return (
            <div key={group.name} className="mb-1">
              <button
                onClick={() => toggleGroup(group.name)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
              >
                <span className="flex items-center gap-3 text-sm">
                  <group.icon size={18} /> {group.name}
                </span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 py-1 space-y-1">
                      {hasTools ? (
                        group.tools.map((tool) => (
                          <Link
                            key={tool.link}
                            to={tool.link}
                            className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded transition ${
                              location.pathname === tool.link
                                ? "text-neonGreen bg-neonGreen/10"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <tool.icon size={14} />
                            {tool.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-xs text-gray-600 py-1.5 px-2">Coming soon</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="mt-6 border-t border-white/10 pt-4">
          {[
            { name: "Scans History", icon: History, link: "/scans-history" },
            { name: "Reports", icon: FileText, link: "/reports" },
            { name: "Favorites", icon: Star, link: "/tools" },
            { name: "Settings", icon: Settings, link: "/settings" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition text-sm mb-1"
            >
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </div>
      </div>

      <Link to="/profile" className="flex items-center gap-3 px-4 py-4 border-t border-white/10 hover:bg-white/5 transition">
        <div className="w-9 h-9 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen font-semibold overflow-hidden flex-shrink-0">
          {profileAvatar ? (
            <img src={profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            profileName.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{profileName}</p>
          <p className="text-neonGreen text-xs">Premium User</p>
        </div>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-red-400 text-sm border-t border-white/10 transition"
      >
        <LogOut size={16} /> Logout
      </button>
    </>
  );

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-cyberDark border-b border-white/10 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CyberVerse" className="w-6 h-6" />
          <span className="text-white font-bold text-sm">CYBERVERSE</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-white">
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-cyberDark border-r border-white/10 fixed left-0 top-0 flex-col z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="md:hidden fixed left-0 top-0 w-72 h-screen bg-cyberDark border-r border-white/10 flex flex-col z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}