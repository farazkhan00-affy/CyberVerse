import { useState } from "react";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

export default function PasswordEntropy() {
  const [password, setPassword] = useState("");

  const calculateEntropy = () => {
    if (!password) return 0;
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) poolSize += 32;

    if (poolSize === 0) return 0;
    return password.length * Math.log2(poolSize);
  };

  const entropy = calculateEntropy();

  const getRating = () => {
    if (!password) return { label: "—", color: "text-gray-500" };
    if (entropy < 28) return { label: "Very Weak", color: "text-red-500" };
    if (entropy < 36) return { label: "Weak", color: "text-red-400" };
    if (entropy < 60) return { label: "Reasonable", color: "text-yellow-400" };
    if (entropy < 128) return { label: "Strong", color: "text-neonGreen" };
    return { label: "Very Strong", color: "text-neonGreen" };
  };

  const estimateCrackTime = () => {
    if (entropy === 0) return "—";
    const guesses = Math.pow(2, entropy);
    const guessesPerSecond = 1e10; // 10 billion/sec, offline fast attack estimate
    const seconds = guesses / guessesPerSecond;

    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    const years = seconds / 31536000;
    if (years < 1000) return `${Math.round(years)} years`;
    if (years < 1e6) return `${Math.round(years / 1000)} thousand years`;
    if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
    return "Billions of years";
  };

  const rating = getRating();

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Gauge className="text-purple-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Password Entropy Calculator</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Measure password unpredictability in bits</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type a password..."
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono mb-6 focus:outline-none focus:border-neonGreen/40"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyberDark border border-white/10 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">Entropy</p>
                <p className="text-2xl font-bold text-white">{entropy.toFixed(1)} <span className="text-sm text-gray-500">bits</span></p>
                <p className={`text-sm mt-1 font-semibold ${rating.color}`}>{rating.label}</p>
              </div>
              <div className="bg-cyberDark border border-white/10 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-xs mb-1">Est. Crack Time</p>
                <p className="text-lg font-bold text-white mt-2">{estimateCrackTime()}</p>
              </div>
            </div>

            <p className="text-gray-500 text-xs mt-6">
              Entropy measures how many bits of randomness a password contains — higher is better. Crack time assumes an offline brute-force attack at 10 billion guesses/second.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}