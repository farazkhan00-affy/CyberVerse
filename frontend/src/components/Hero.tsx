import ParticleBackground from "./ParticleBackground";
import { motion } from "framer-motion";
import { Zap, BarChart3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-cyberDark overflow-hidden pt-20">
      <ParticleBackground />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonGreen/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonBlue/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          CYBER<span className="text-neonGreen">VERSE</span>
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-300 font-medium">
          Your All-in-One Cybersecurity Platform
        </p>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Powerful tools to protect, analyze and secure your digital world — all from one dashboard.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,200,83,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold px-8 py-3 rounded-lg transition"
          >
            <Zap size={18} /> Explore Tools
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, borderColor: "rgba(0,200,83,0.6)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 border border-neonGreen/40 text-white px-8 py-3 rounded-lg hover:bg-neonGreen/10 transition"
          >
            <BarChart3 size={18} /> View Dashboard
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}