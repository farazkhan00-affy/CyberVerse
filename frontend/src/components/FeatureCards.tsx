import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Hash, Globe, Bot, ArrowRight } from "lucide-react";

const features = [
  { icon: Lock, title: "Password Tools", desc: "Generate, analyze, and validate strong passwords.", link: "/tools/password-generator" },
  { icon: Hash, title: "Hash Tools", desc: "MD5, SHA1, SHA256, SHA512, and file hash utilities.", link: "/tools/hash-generator" },
  { icon: Globe, title: "Network Tools", desc: "IP lookup, DNS, WHOIS, port scanning and more.", link: "/tools/ip-lookup" },
  { icon: Bot, title: "AI Security Assistant", desc: "AI-powered phishing detection and code review.", link: "/tools" },
];

export default function FeatureCards() {
  return (
    <section className="bg-cyberDark py-10 px-6">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <Link key={f.title} to={f.link}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4, borderColor: "rgba(0,200,83,0.4)" }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer transition group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-neonGreen/10 flex items-center justify-center">
                  <f.icon size={18} className="text-neonGreen" />
                </div>
                <p className="text-white font-semibold">{f.title}</p>
              </div>
              <p className="text-gray-500 text-sm mb-3">{f.desc}</p>
              <ArrowRight size={16} className="text-neonGreen group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}