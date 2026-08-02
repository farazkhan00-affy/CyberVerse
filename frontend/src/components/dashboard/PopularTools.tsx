import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Hash, Code2, KeyRound, Globe, Server, User, Radar, QrCode, GitCompare } from "lucide-react";

const tools = [
  { name: "Password Generator", desc: "Generate strong passwords", icon: Lock, color: "text-neonGreen", link: "/tools/password-generator" },
  { name: "Password Analyzer", desc: "Check password strength", icon: ShieldCheck, color: "text-neonBlue", link: "/tools/password-analyzer" },
  { name: "Hash Generator", desc: "Generate file hashes", icon: Hash, color: "text-purple-400", link: "/tools/hash-generator" },
  { name: "Hash Compare", desc: "Compare two hashes", icon: GitCompare, color: "text-purple-400", link: "/tools/hash-compare" },
  { name: "Base64 Encoder/Decoder", desc: "Encode or decode data", icon: Code2, color: "text-blue-400", link: "/tools/encoder-decoder" },
  { name: "JWT Decoder", desc: "Decode JWT tokens", icon: KeyRound, color: "text-pink-400", link: "/tools/jwt-decoder" },
  { name: "IP Lookup", desc: "Get IP information", icon: Globe, color: "text-neonGreen", link: "/tools/ip-lookup" },
  { name: "DNS Lookup", desc: "Lookup DNS records", icon: Server, color: "text-blue-400", link: "/tools/dns-lookup" },
  { name: "WHOIS Lookup", desc: "Domain WHOIS info", icon: User, color: "text-purple-400", link: "/tools/whois-lookup" },
  { name: "Port Scanner", desc: "Scan open ports", icon: Radar, color: "text-neonGreen", link: "/tools/port-scanner" },
  { name: "QR Code Generator", desc: "Generate QR codes", icon: QrCode, color: "text-pink-400", link: "/tools/qr-generator" },
];

export default function PopularTools() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Popular Tools</h2>
        <Link to="/tools" className="text-neonGreen text-sm hover:underline">View All Tools →</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {tools.map((tool, i) => (
          <Link key={tool.name} to={tool.link}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -5, borderColor: "rgba(0,200,83,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-left cursor-pointer transition"
            >
              <tool.icon className={`${tool.color} mb-3`} size={26} />
              <p className="text-white text-sm font-semibold">{tool.name}</p>
              <p className="text-gray-500 text-xs mt-1">{tool.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}