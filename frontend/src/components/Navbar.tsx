import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/cyberverse-logo.svg";

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
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CyberVerse" className="w-8 h-8" />
          <span className="text-2xl font-bold text-white">
            CYBER<span className="text-neonGreen">VERSE</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-8 text-gray-300 text-sm">
          <a href="#features" className="hover:text-neonGreen transition">Features</a>
          <a href="#stats" className="hover:text-neonGreen transition">Stats</a>
          <a href="#faq" className="hover:text-neonGreen transition">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-gray-300 hover:text-white text-sm font-medium transition"
          >
            Log In
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-neonGreen text-black font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}