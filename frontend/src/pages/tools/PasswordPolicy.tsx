import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Check, X } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

export default function PasswordPolicy() {
  const [password, setPassword] = useState("");
  const [minLength, setMinLength] = useState(8);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumber, setRequireNumber] = useState(true);
  const [requireSymbol, setRequireSymbol] = useState(true);

  const rules = [
    { label: `Minimum ${minLength} characters`, pass: password.length >= minLength, active: true },
    { label: "Contains uppercase letter", pass: /[A-Z]/.test(password), active: requireUppercase },
    { label: "Contains lowercase letter", pass: /[a-z]/.test(password), active: requireLowercase },
    { label: "Contains a number", pass: /[0-9]/.test(password), active: requireNumber },
    { label: "Contains a symbol", pass: /[^A-Za-z0-9]/.test(password), active: requireSymbol },
  ].filter((r) => r.active);

  const allPass = password.length > 0 && rules.every((r) => r.pass);

  const toggles = [
    { label: "Require uppercase", value: requireUppercase, setter: setRequireUppercase },
    { label: "Require lowercase", value: requireLowercase, setter: setRequireLowercase },
    { label: "Require number", value: requireNumber, setter: setRequireNumber },
    { label: "Require symbol", value: requireSymbol, setter: setRequireSymbol },
  ];

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <ClipboardCheck className="text-neonGreen" size={24} />
            <h1 className="text-2xl font-bold text-white">Password Policy Validator</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Check a password against a custom policy</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <p className="text-white text-sm font-semibold mb-3">Policy Settings</p>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Minimum Length</span>
                <span className="text-neonGreen font-semibold">{minLength}</span>
              </div>
              <input
                type="range"
                min={4}
                max={24}
                value={minLength}
                onChange={(e) => setMinLength(Number(e.target.value))}
                className="w-full accent-neonGreen"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {toggles.map((t) => (
                <label
                  key={t.label}
                  className="flex items-center gap-2 bg-cyberDark border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 cursor-pointer hover:border-neonGreen/30 transition"
                >
                  <input
                    type="checkbox"
                    checked={t.value}
                    onChange={(e) => t.setter(e.target.checked)}
                    className="accent-neonGreen"
                  />
                  {t.label}
                </label>
              ))}
            </div>

            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type a password to validate..."
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono mb-4 focus:outline-none focus:border-neonGreen/40"
            />

            {password && (
              <div className={`text-sm font-semibold mb-4 ${allPass ? "text-neonGreen" : "text-red-400"}`}>
                {allPass ? "✓ Password meets policy" : "✗ Password does not meet policy"}
              </div>
            )}

            <div className="space-y-2">
              {rules.map((r) => (
                <div key={r.label} className="flex items-center gap-2 text-sm">
                  {r.pass ? (
                    <Check size={16} className="text-neonGreen flex-shrink-0" />
                  ) : (
                    <X size={16} className="text-gray-600 flex-shrink-0" />
                  )}
                  <span className={r.pass ? "text-gray-300" : "text-gray-600"}>{r.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}