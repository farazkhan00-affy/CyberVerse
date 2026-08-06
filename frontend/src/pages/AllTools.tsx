import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import {
  Lock, Globe, Monitor, Code2, Hash, ShieldCheck, Grid3x3,
  KeyRound, Gauge, ClipboardCheck, Server, UserSearch, Braces, GitCompare,
  Radar, QrCode, ShieldAlert, Bug, Cookie, Network,
  KeySquare, ShieldEllipsis, Binary, FileText,
} from "lucide-react";

const toolGroups = [
  {
    name: "Password Tools",
    icon: Lock,
    tools: [
      { name: "Password Generator", desc: "Generate strong passwords", link: "/tools/password-generator", icon: KeyRound },
      { name: "Password Analyzer", desc: "Check password strength", link: "/tools/password-analyzer", icon: ShieldCheck },
      { name: "Entropy Calculator", desc: "Measure password randomness", link: "/tools/password-entropy", icon: Gauge },
      { name: "Policy Validator", desc: "Check against a custom policy", link: "/tools/password-policy", icon: ClipboardCheck },
    ],
  },
  {
    name: "Network Tools",
    icon: Globe,
    tools: [
      { name: "IP Lookup", desc: "Get IP information", link: "/tools/ip-lookup", icon: Globe },
      { name: "DNS Lookup", desc: "Lookup DNS records", link: "/tools/dns-lookup", icon: Server },
      { name: "WHOIS Lookup", desc: "Domain WHOIS info", link: "/tools/whois-lookup", icon: UserSearch },
      { name: "Port Scanner", desc: "Scan open ports", link: "/tools/port-scanner", icon: Radar },
    ],
  },
  {
    name: "Web Tools",
    icon: Monitor,
    tools: [
      { name: "Security Headers Checker", desc: "Check security headers", link: "/tools/security-headers", icon: ShieldAlert },
      { name: "Robots.txt Viewer", desc: "View a site's robots.txt", link: "/tools/robots-viewer", icon: FileText },
      { name: "XSS/SQLi Pattern Checker", desc: "Educational pattern checker", link: "/tools/vuln-checker", icon: Bug },
    ],
  },
  {
    name: "Encoder / Decoder",
    icon: Code2,
    tools: [
      { name: "Base64 / URL / HTML", desc: "Encode or decode data", link: "/tools/encoder-decoder", icon: Code2 },
      { name: "JWT Decoder", desc: "Decode JWT tokens", link: "/tools/jwt-decoder", icon: Braces },
    ],
  },
  {
    name: "Hash Tools",
    icon: Hash,
    tools: [
      { name: "Hash Generator", desc: "Generate file hashes", link: "/tools/hash-generator", icon: Hash },
      { name: "Hash Compare", desc: "Compare two hashes", link: "/tools/hash-compare", icon: GitCompare },
    ],
  },
  {
    name: "Security Tools",
    icon: ShieldCheck,
    tools: [
      { name: "Cookie Analyzer", desc: "Analyze site cookies", link: "/tools/cookie-analyzer", icon: Cookie },
      { name: "CORS Analyzer", desc: "Check CORS configuration", link: "/tools/cors-analyzer", icon: Network },
      { name: "SSL Certificate Checker", desc: "Check SSL/TLS certificate", link: "/tools/ssl-checker", icon: Lock },
    ],
  },
  {
    name: "Other Tools",
    icon: Grid3x3,
    tools: [
      { name: "QR Code Generator", desc: "Generate QR codes", link: "/tools/qr-generator", icon: QrCode },
      { name: "Caesar Cipher", desc: "Shift cipher encode/decode", link: "/tools/caesar-cipher", icon: KeySquare },
      { name: "AES Encrypt/Decrypt", desc: "Encrypt with a password", link: "/tools/aes-tool", icon: ShieldEllipsis },
      { name: "Hex/Binary Converter", desc: "Convert text, hex, binary", link: "/tools/hex-binary", icon: Binary },
    ],
  },
];

export default function AllTools() {
  return (
    <div className="bg-cyberDark min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-64 flex-1 pt-14 md:pt-0">
        <Topbar />
        <div className="p-4 sm:p-8">
          <h1 className="text-2xl font-bold text-white mb-1">All Tools</h1>
          <p className="text-gray-400 text-sm mb-8">Browse every tool available on CyberVerse</p>

          {toolGroups.map((group, gi) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: gi * 0.05 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-4">
                <group.icon className="text-neonGreen" size={20} />
                <h2 className="text-white font-semibold text-lg">{group.name}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.tools.map((tool, ti) => (
                  <Link key={tool.link} to={tool.link}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: gi * 0.05 + ti * 0.03 }}
                      whileHover={{ y: -4, borderColor: "rgba(0,200,83,0.4)" }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-5 text-left cursor-pointer transition"
                    >
                      <tool.icon className="text-neonGreen mb-3" size={24} />
                      <p className="text-white text-sm font-semibold">{tool.name}</p>
                      <p className="text-gray-500 text-xs mt-1">{tool.desc}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}