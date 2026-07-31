import { motion } from "framer-motion";
import { Lock, Hash, Globe, Cpu } from "lucide-react";

const features = [
  { icon: Lock, title: "Password Tools", desc: "Generate, analyze, and validate strong passwords." },
  { icon: Hash, title: "Hash Tools", desc: "MD5, SHA1, SHA256, SHA512, and file hash utilities." },
  { icon: Globe, title: "Network Tools", desc: "IP lookup, DNS, WHOIS, port scanning, and more." },
  { icon: Cpu, title: "AI Security Assistant", desc: "AI-powered phishing detection and code review." },
];

export default function Features() {
  return (
    <section id="features" className="bg-cyberDark py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Everything You Need, <span className="text-neonGreen">One Platform</span>
        </h2>
      </motion.div>

      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6, borderColor: "rgba(0,200,83,0.4)" }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 transition"
          >
            <f.icon className="text-neonGreen mb-4" size={32} />
            <h3 className="text-white font-semibold text-lg">{f.title}</h3>
            <p className="text-gray-400 text-sm mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}