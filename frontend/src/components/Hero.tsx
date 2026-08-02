import { useNavigate } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import { motion } from "framer-motion";
import { Zap, LayoutGrid, Globe, Search, Settings, User, Database } from "lucide-react";

const orbitIcons = [
  { Icon: Globe, position: "top-4 left-4" },
  { Icon: Search, position: "top-1/2 -left-8 -translate-y-1/2" },
  { Icon: Settings, position: "bottom-4 left-4" },
  { Icon: Database, position: "top-4 right-4" },
  { Icon: User, position: "bottom-4 right-4" },
];

export default function Hero() {
  const navigate = useNavigate();

  const handleProtectedNav = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/login");
  };

  return (
    <section className="relative min-h-screen flex items-center bg-cyberDark overflow-hidden pt-24 pb-16">
      <ParticleBackground />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonGreen/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonBlue/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 text-neonGreen text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse" />
            All-in-One Cybersecurity Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            SECURE. ANALYZE.
            <br />
            <span className="text-neonGreen">PROTECT.</span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-lg">
            Powerful tools to protect, analyze and secure your digital world — all from one dashboard.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={handleProtectedNav}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,200,83,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold px-8 py-3 rounded-lg transition"
            >
              <Zap size={18} /> Explore Tools
            </motion.button>
            <motion.button
              onClick={handleProtectedNav}
              whileHover={{ scale: 1.05, borderColor: "rgba(0,200,83,0.6)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 border border-neonGreen/40 text-white px-8 py-3 rounded-lg hover:bg-neonGreen/10 transition"
            >
              <LayoutGrid size={18} /> View Dashboard
            </motion.button>
          </div>
        </motion.div>

        {/* Right: shield illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative flex items-center justify-center h-[380px] lg:h-[440px]"
        >
          {/* Radar rings */}
          <div className="absolute w-full h-full rounded-full border border-neonGreen/10" />
          <div className="absolute w-[80%] h-[80%] rounded-full border border-neonGreen/15" />
          <div className="absolute w-[60%] h-[60%] rounded-full border border-neonGreen/20" />

          {/* Glow behind shield */}
          <div className="absolute w-64 h-64 bg-neonGreen/20 rounded-full blur-3xl" />

          {/* Orbit icons */}
          {orbitIcons.map(({ Icon, position }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`absolute ${position} w-11 h-11 rounded-full border border-neonGreen/30 bg-cyberDark flex items-center justify-center`}
            >
              <Icon size={18} className="text-neonGreen" />
            </motion.div>
          ))}

          {/* Shield with lock */}
          <motion.svg
            width="180"
            height="200"
            viewBox="0 0 200 220"
            className="relative z-10"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <defs>
              <linearGradient id="heroShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E676" />
                <stop offset="100%" stopColor="#00B0FF" />
              </linearGradient>
              <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M100 15 L165 40 L165 95 C165 140 138 172 100 188 C62 172 35 140 35 95 L35 40 Z"
              fill="#0A0A0A"
              stroke="url(#heroShieldGrad)"
              strokeWidth="4"
              filter="url(#heroGlow)"
            />
            <rect x="78" y="98" width="44" height="36" rx="6" fill="url(#heroShieldGrad)" />
            <path
              d="M86 98 L86 82 C86 71 92 64 100 64 C108 64 114 71 114 82 L114 98"
              stroke="url(#heroShieldGrad)"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="100" cy="112" r="5" fill="#0A0A0A" />
            <rect x="97.5" y="114" width="5" height="10" fill="#0A0A0A" />
          </motion.svg>
        </motion.div>
      </div>
    </section>
  );
}