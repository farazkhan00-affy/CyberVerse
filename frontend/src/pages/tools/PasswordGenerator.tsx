import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Copy, RefreshCw, Check } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { showToast } from "../../lib/toast";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let charset = "";
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === "") {
      setPassword("Select at least one option");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    showToast("Password copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 2) return { label: "Weak", color: "text-red-400", bar: "w-1/3 bg-red-400" };
    if (score <= 4) return { label: "Medium", color: "text-yellow-400", bar: "w-2/3 bg-yellow-400" };
    return { label: "Strong", color: "text-neonGreen", bar: "w-full bg-neonGreen" };
  };

  const strength = getStrength();

  const options = [
    { label: "Uppercase (A-Z)", value: includeUppercase, setter: setIncludeUppercase },
    { label: "Lowercase (a-z)", value: includeLowercase, setter: setIncludeLowercase },
    { label: "Numbers (0-9)", value: includeNumbers, setter: setIncludeNumbers },
    { label: "Symbols (!@#$)", value: includeSymbols, setter: setIncludeSymbols },
  ];

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Lock className="text-neonGreen" size={24} />
            <h1 className="text-2xl font-bold text-white">Password Generator</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Generate strong, random passwords instantly</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 bg-cyberDark border border-white/10 rounded-lg px-4 py-3 mb-2">
              <p className="flex-1 text-white font-mono text-lg break-all">
                {password || "Click generate to create a password"}
              </p>
              <button
                onClick={handleCopy}
                disabled={!password}
                className="text-gray-400 hover:text-neonGreen transition disabled:opacity-30"
              >
                {copied ? <Check size={20} className="text-neonGreen" /> : <Copy size={20} />}
              </button>
            </div>

            {password && (
              <div className="mb-6">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${strength.bar}`} />
                </div>
                <p className={`text-xs mt-1 ${strength.color}`}>{strength.label}</p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Password Length</span>
                <span className="text-neonGreen font-semibold">{length}</span>
              </div>
              <input
                type="range"
                min={6}
                max={32}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-neonGreen"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {options.map((opt) => (
                <label
                  key={opt.label}
                  className="flex items-center gap-2 bg-cyberDark border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-pointer hover:border-neonGreen/30 transition"
                >
                  <input
                    type="checkbox"
                    checked={opt.value}
                    onChange={(e) => opt.setter(e.target.checked)}
                    className="accent-neonGreen"
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePassword}
              className="w-full flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold py-3 rounded-lg hover:brightness-110 transition"
            >
              <RefreshCw size={18} /> Generate Password
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}