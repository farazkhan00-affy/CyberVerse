import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, Check, X } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { addActivity } from "../../lib/activity";

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (password && !logged) {
      addActivity("Password strength checked");
      setLogged(true);
    }
    if (!password) setLogged(false);
  }, [password, logged]);

  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "At least 12 characters (recommended)", pass: password.length >= 12 },
    { label: "Contains uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", pass: /[a-z]/.test(password) },
    { label: "Contains a number", pass: /[0-9]/.test(password) },
    { label: "Contains a symbol", pass: /[^A-Za-z0-9]/.test(password) },
    { label: "No repeated characters (aaa, 111)", pass: !/(.)\1{2,}/.test(password) },
  ];

  const passedCount = checks.filter((c) => c.pass).length;
  const score = password ? (passedCount / checks.length) * 100 : 0;

  const getStrength = () => {
    if (!password) return { label: "—", color: "text-gray-500", bar: "bg-gray-600" };
    if (score < 40) return { label: "Weak", color: "text-red-400", bar: "bg-red-400" };
    if (score < 70) return { label: "Medium", color: "text-yellow-400", bar: "bg-yellow-400" };
    if (score < 100) return { label: "Strong", color: "text-neonGreen", bar: "bg-neonGreen" };
    return { label: "Very Strong", color: "text-neonGreen", bar: "bg-neonGreen" };
  };

  const strength = getStrength();

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <ShieldCheck className="text-neonBlue" size={24} />
            <h1 className="text-2xl font-bold text-white">Password Analyzer</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Check how strong your password really is</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type a password to analyze..."
                className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 pr-12 text-white font-mono focus:outline-none focus:border-neonGreen/40"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mb-6">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${strength.bar}`}
                />
              </div>
              <p className={`text-sm mt-2 font-semibold ${strength.color}`}>{strength.label}</p>
            </div>

            <div className="space-y-2">
              {checks.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  {c.pass ? (
                    <Check size={16} className="text-neonGreen flex-shrink-0" />
                  ) : (
                    <X size={16} className="text-gray-600 flex-shrink-0" />
                  )}
                  <span className={c.pass ? "text-gray-300" : "text-gray-600"}>{c.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}