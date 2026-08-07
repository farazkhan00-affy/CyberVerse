import { motion } from "framer-motion";
import CountUpNumber from "../CountUpNumber";
import { Boxes, Users, ShieldCheck, FileText } from "lucide-react";

const stats = [
  { label: "Tools Available", sub: "All in one place", value: 20, suffix: "+", icon: Boxes, color: "text-purple-400" },
  { label: "Active Users", sub: "Growing community", value: 1.2, suffix: "K+", decimals: 1, icon: Users, color: "text-blue-400" },
  { label: "Scans Performed", sub: "Total scans done", value: 3.4, suffix: "K+", decimals: 1, icon: ShieldCheck, color: "text-neonGreen" },
  { label: "Reports Generated", sub: "Detailed reports", value: 850, suffix: "+", icon: FileText, color: "text-pink-400" },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ y: -4 }}
          className="bg-[#141414] border border-white/10 rounded-xl p-5 flex items-center gap-4 transition"
        >
          <div className={`p-3 rounded-lg bg-white/5 ${s.color}`}>
            <s.icon size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              <CountUpNumber end={s.value} decimals={s.decimals || 0} suffix={s.suffix} duration={1.5} />
            </p>
            <p className="text-gray-300 text-sm">{s.label}</p>
            <p className="text-gray-500 text-xs">{s.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}