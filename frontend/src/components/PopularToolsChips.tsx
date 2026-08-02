import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Globe, UserSearch, Radar, Lock, Server, Bug, Plus, ArrowRight } from "lucide-react";

const chips = [
  { name: "IP Lookup", icon: Globe, link: "/tools/ip-lookup" },
  { name: "WHOIS Lookup", icon: UserSearch, link: "/tools/whois-lookup" },
  { name: "Port Scanner", icon: Radar, link: "/tools/port-scanner" },
  { name: "SSL Checker", icon: Lock, link: "/tools/ssl-checker" },
  { name: "DNS Lookup", icon: Server, link: "/tools/dns-lookup" },
  { name: "XSS Checker", icon: Bug, link: "/tools/vuln-checker" },
];

export default function PopularToolsChips() {
  return (
    <section className="bg-cyberDark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-neonGreen" />
            <h2 className="text-white font-semibold">Popular Tools</h2>
          </div>
          <Link to="/tools" className="flex items-center gap-1 text-neonGreen text-sm hover:underline">
            View All Tools <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {chips.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                to={c.link}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 hover:border-neonGreen/40 hover:text-white transition"
              >
                <c.icon size={14} className="text-neonGreen" />
                {c.name}
              </Link>
            </motion.div>
          ))}
          <Link
            to="/tools"
            className="flex items-center gap-2 bg-neonGreen/10 border border-neonGreen/30 rounded-full px-4 py-2 text-sm text-neonGreen hover:bg-neonGreen/20 transition"
          >
            <Plus size={14} /> More Tools
          </Link>
        </div>
      </div>
    </section>
  );
}