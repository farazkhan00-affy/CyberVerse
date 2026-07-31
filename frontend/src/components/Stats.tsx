import { motion } from "framer-motion";
import CountUpNumber from "./CountUpNumber";

const stats = [
  { label: "Tools Available", value: 20, suffix: "+" },
  { label: "Active Users", value: 1.2, suffix: "K+", decimals: 1 },
  { label: "Scans Performed", value: 3.4, suffix: "K+", decimals: 1 },
  { label: "Reports Generated", value: 850, suffix: "+" },
];

export default function Stats() {
  return (
    <section id="stats" className="bg-cyberDark py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/5 border border-neonGreen/10 rounded-xl p-6 text-center backdrop-blur-sm hover:border-neonGreen/40 transition"
          >
            <p className="text-3xl font-bold text-neonGreen">
              <CountUpNumber end={s.value} decimals={s.decimals || 0} suffix={s.suffix} duration={2} />
            </p>
            <p className="text-gray-400 text-sm mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}