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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 gap-2">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <img src={logo} alt="CyberVerse" className="w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-lg sm:text-2xl font-bold text-white tracking-tight sm:tracking-normal">
            CYBER<span className="text-neonGreen">VERSE</span>
          </span>
        </Link>

        {/* Center Nav Links (Hidden on Mobile) */}
        <div className="hidden md:flex gap-8 text-gray-300 text-sm">
          <a href="#features" className="hover:text-neonGreen transition">Features</a>
          <a href="#stats" className="hover:text-neonGreen transition">Stats</a>
          <a href="#faq" className="hover:text-neonGreen transition">FAQ</a>
        </div>

        {/* Right Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/login"
            className="text-gray-300 hover:text-white text-xs sm:text-sm font-medium px-1.5 py-1 transition whitespace-nowrap"
          >
            Log In
          </Link>
          <Link to="/register" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-neonGreen text-black font-semibold text-xs sm:text-sm px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg hover:brightness-110 transition whitespace-nowrap"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}