import { useEffect, useState } from "react";
import { ShieldCheck, Search, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getActivities, subscribeActivity, addActivity, timeAgo } from "../../lib/activity";

const scanSteps = [
  "Checking password policies...",
  "Scanning for weak credentials...",
  "Analyzing network exposure...",
  "Checking SSL/TLS configuration...",
  "Reviewing security headers...",
];

const basicFindings = [
  { text: "No weak passwords detected", severity: "pass" },
  { text: "SSL certificate valid", severity: "pass" },
  { text: "2 security headers missing", severity: "warn" },
];

const deepFindings = [
  { text: "No weak passwords detected", severity: "pass" },
  { text: "SSL certificate valid", severity: "pass" },
  { text: "2 security headers missing", severity: "warn" },
  { text: "Outdated dependency detected", severity: "warn" },
  { text: "No open ports found on common services", severity: "pass" },
];

export default function RightPanel() {
  const [scanType, setScanType] = useState("Quick Scan (Basic)");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [results, setResults] = useState<typeof basicFindings | null>(null);
  const [lastScan, setLastScan] = useState("2 hours ago");
  const [activities, setActivities] = useState(getActivities());

  useEffect(() => {
    return subscribeActivity(() => setActivities(getActivities()));
  }, []);

  const runScan = () => {
    setScanning(true);
    setResults(null);
    setProgress(0);

    let step = 0;
    const stepInterval = setInterval(() => {
      setCurrentStep(scanSteps[step % scanSteps.length]);
      step++;
    }, 500);

    let pct = 0;
    const progressInterval = setInterval(() => {
      pct += 10;
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(progressInterval);
        clearInterval(stepInterval);
        setScanning(false);
        setResults(scanType.includes("Deep") ? deepFindings : basicFindings);
        setLastScan("Just now");
        addActivity(`${scanType.includes("Deep") ? "Deep" : "Quick"} scan completed`);
      }
    }, 250);
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
      {/* System Status */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonGreen opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neonGreen"></span>
          </span>
          <p className="text-white font-semibold text-sm">System Status</p>
        </div>
        <p className="text-gray-400 text-xs mb-4">All Systems Operational</p>
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-neonGreen/30 flex items-center justify-center">
            <ShieldCheck className="text-neonGreen" size={36} />
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Threat Level</span>
            <span className="text-neonGreen font-medium">LOW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Scan</span>
            <span className="text-white">{lastScan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Database</span>
            <span className="text-neonGreen">Connected</span>
          </div>
        </div>
      </div>

      {/* Quick Scan */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <p className="text-white font-semibold text-sm mb-1">Quick Scan</p>
        <p className="text-gray-500 text-xs mb-4">Perform a quick security scan</p>

        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          disabled={scanning}
          className="w-full bg-cyberDark border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-3 disabled:opacity-50"
        >
          <option className="bg-cyberDark text-white">Quick Scan (Basic)</option>
          <option className="bg-cyberDark text-white">Deep Scan (Advanced)</option>
        </select>

        <button
          onClick={runScan}
          disabled={scanning}
          className="w-full flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-60"
        >
          <Search size={16} /> {scanning ? "Scanning..." : "Start Scan"}
        </button>

        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-neonGreen"
                />
              </div>
              <p className="text-gray-400 text-xs">{currentStep}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results && !scanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs font-semibold">Scan Results</p>
                <button onClick={() => setResults(null)} className="text-gray-600 hover:text-white transition">
                  <X size={14} />
                </button>
              </div>
              {results.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {r.severity === "pass" ? (
                    <CheckCircle2 size={14} className="text-neonGreen flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-gray-300">{r.text}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-semibold text-sm">Recent Activity</p>
          <a href="/scans-history" className="text-neonGreen text-xs hover:underline">View All</a>
        </div>
        <div className="space-y-3">
          {activities.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 bg-neonGreen" />
              <div>
                <p className="text-gray-300 text-xs">{a.text}</p>
                <p className="text-gray-600 text-xs">{timeAgo(a.time)}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && <p className="text-gray-600 text-xs">No activity yet</p>}
        </div>
      </div>
    </div>
  );
}