import { useState } from "react";
import { motion } from "framer-motion";
import { Bug, AlertTriangle, ShieldCheck } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

const xssPatterns = [
  { regex: /<script.*?>.*?<\/script>/i, label: "Script tag detected" },
  { regex: /on\w+\s*=\s*["'].*?["']/i, label: "Inline event handler (onerror, onload, etc.)" },
  { regex: /javascript:/i, label: "javascript: URI scheme" },
  { regex: /<iframe/i, label: "Iframe injection" },
  { regex: /<img[^>]+src[^>]*onerror/i, label: "Image tag with onerror payload" },
];

const sqliPatterns = [
  { regex: /'\s*or\s*'?1'?\s*=\s*'?1/i, label: "Classic OR 1=1 pattern" },
  { regex: /union\s+select/i, label: "UNION SELECT statement" },
  { regex: /;\s*drop\s+table/i, label: "DROP TABLE statement" },
  { regex: /--/, label: "SQL comment sequence" },
  { regex: /'\s*;\s*--/i, label: "Query termination with comment" },
];

export default function VulnPatternChecker() {
  const [input, setInput] = useState("");

  const xssMatches = xssPatterns.filter((p) => p.regex.test(input));
  const sqliMatches = sqliPatterns.filter((p) => p.regex.test(input));
  const hasIssues = xssMatches.length > 0 || sqliMatches.length > 0;

  return (
    <div className="bg-cyberDark min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-64 flex-1 pt-14 md:pt-0">
        <Topbar />
        <div className="p-4 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Bug className="text-red-400" size={24} />
            <h1 className="text-2xl font-bold text-white">XSS / SQLi Pattern Checker</h1>
          </div>
          <p className="text-gray-400 text-sm mb-1">Educational tool — checks input for common attack patterns</p>
          <p className="text-yellow-500/80 text-xs mb-6">
            This is a basic pattern matcher for learning purposes, not a substitute for proper input validation or a WAF.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <p className="text-white text-sm font-semibold mb-2">Test Input</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a value you'd normally put in a form field..."
              rows={4}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm mb-6 focus:outline-none focus:border-neonGreen/40 resize-none"
            />

            {input && !hasIssues && (
              <div className="flex items-center gap-2 bg-neonGreen/10 border border-neonGreen/30 text-neonGreen text-sm rounded-lg px-4 py-3">
                <ShieldCheck size={18} /> No common attack patterns detected
              </div>
            )}

            {xssMatches.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-red-400 mb-2">XSS PATTERNS DETECTED</p>
                <div className="space-y-2">
                  {xssMatches.map((m) => (
                    <div key={m.label} className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-sm text-red-300">
                      <AlertTriangle size={14} /> {m.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sqliMatches.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-yellow-400 mb-2">SQLI PATTERNS DETECTED</p>
                <div className="space-y-2">
                  {sqliMatches.map((m) => (
                    <div key={m.label} className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-yellow-300">
                      <AlertTriangle size={14} /> {m.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}