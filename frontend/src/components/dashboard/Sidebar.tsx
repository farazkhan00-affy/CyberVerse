import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Home, Lock, Globe, Monitor, Code2, Hash, ShieldCheck, Grid3x3,
  History, FileText, Star, Settings, ChevronDown, LogOut,
  KeyRound, Gauge, ClipboardCheck, Server, UserSearch, Braces, GitCompare,
  Radar, QrCode, ShieldAlert, Bug,
} from "lucide-react";

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
    tools: [],
  },
  {
    name: "Other Tools",
    icon: Grid3x3,
    tools: [
      { name: "QR Code Generator", link: "/tools/qr-generator", icon: QrCode },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleGroup = (name: string) => {
    setOpenGroup(openGroup === name ? null : name);
  };

  return (
    <aside className="w-64 h-screen bg-cyberDark border-r border-white/10 fixed left-0 top-0 flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <Shield className="text-neonGreen" size={26} />
        <div>
          <p className="text-white font-bold leading-tight">CYBERVERSE</p>
          <p className="text-gray-500 text-xs">Protect. Analyze. Secure.</p>
        </div>
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
            { name: "Scans History", icon: History },
            { name: "Reports", icon: FileText },
            { name: "Favorites", icon: Star },
            { name: "Settings", icon: Settings },
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition text-sm mb-1"
            >
              <item.icon size={18} /> {item.name}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-4 border-t border-white/10">
        <div className="w-9 h-9 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen font-semibold">
          F
        </div>
        <div>
          <p className="text-white text-sm font-medium">Faraz</p>
          <p className="text-neonGreen text-xs">Premium User</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-red-400 text-sm border-t border-white/10 transition"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}