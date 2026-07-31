import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      animate={{
        backgroundColor: scrolled ? "rgba(10,10,10,0.95)" : "rgba(10,10,10,0.4)",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.4)" : "none",
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-neonGreen/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Shield className="text-neonGreen" size={28} />
          <span className="text-2xl font-bold text-white">
            CYBER<span className="text-neonGreen">VERSE</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-300 text-sm">
          <a href="#features" className="hover:text-neonGreen transition">Features</a>
          <a href="#stats" className="hover:text-neonGreen transition">Stats</a>
          <a href="#faq" className="hover:text-neonGreen transition">FAQ</a>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-neonGreen text-black font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition"
        >
          Get Started
        </motion.button>
      </div>
    </motion.nav>
  );
}