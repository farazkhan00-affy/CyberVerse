import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, Search, CheckCircle2, XCircle } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { addActivity } from "../../lib/activity";

const commonPorts = [
  { port: 21, service: "FTP" },
  { port: 22, service: "SSH" },
  { port: 23, service: "Telnet" },
  { port: 25, service: "SMTP" },
  { port: 53, service: "DNS" },
  { port: 80, service: "HTTP" },
  { port: 110, service: "POP3" },
  { port: 143, service: "IMAP" },
  { port: 443, service: "HTTPS" },
  { port: 3306, service: "MySQL" },
  { port: 3389, service: "RDP" },
  { port: 8080, service: "HTTP-Alt" },
];

export default function PortScanner() {
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scannedPorts, setScannedPorts] = useState<number[]>([]);
  const [results, setResults] = useState<{ port: number; service: string; open: boolean }[]>([]);

  const runScan = () => {
    if (!target.trim()) return;
    setScanning(true);
    setResults([]);
    setScannedPorts([]);

    let i = 0;
    const interval = setInterval(() => {
      if (i >= commonPorts.length) {
        clearInterval(interval);
        setScanning(false);
        addActivity("Port scan completed");
        return;
      }
      const current = commonPorts[i];
      const isOpen = [80, 443, 22].includes(current.port) && Math.random() > 0.3;
      setResults((prev) => [...prev, { ...current, open: isOpen }]);
      setScannedPorts((prev) => [...prev, current.port]);
      i++;
    }, 200);
  };

  return (
    <div className="bg-cyberDark min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-64 flex-1 pt-14 md:pt-0">
        <Topbar />
        <div className="p-4 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Radar className="text-neonGreen" size={24} />
            <h1 className="text-2xl font-bold text-white">Port Scanner</h1>
          </div>
          <p className="text-gray-400 text-sm mb-1">Scan common ports on a target host</p>
          <p className="text-yellow-500/80 text-xs mb-6">
            Educational demo — simulates scanning behavior. Only scan hosts you own or have permission to test.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runScan()}
                placeholder="Enter a hostname or IP (e.g. example.com)"
                disabled={scanning}
                className="flex-1 bg-cyberDark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neonGreen/40 disabled:opacity-50"
              />
              <button
                onClick={runScan}
                disabled={scanning || !target.trim()}
                className="flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
              >
                <Search size={16} /> {scanning ? "Scanning..." : "Start Scan"}
              </button>
            </div>

            {scanning && (
              <div className="mb-4">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${(scannedPorts.length / commonPorts.length) * 100}%` }}
                    className="h-full bg-neonGreen"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">
                  Checking port {commonPorts[scannedPorts.length]?.port ?? ""}...
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                <AnimatePresence>
                  {results.map((r) => (
                    <motion.div
                      key={r.port}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-cyberDark border border-white/10 rounded-lg px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        {r.open ? (
                          <CheckCircle2 size={16} className="text-neonGreen" />
                        ) : (
                          <XCircle size={16} className="text-gray-600" />
                        )}
                        <span className="text-white text-sm font-mono">Port {r.port}</span>
                        <span className="text-gray-500 text-xs">{r.service}</span>
                      </div>
                      <span className={`text-xs font-semibold ${r.open ? "text-neonGreen" : "text-gray-600"}`}>
                        {r.open ? "OPEN" : "CLOSED"}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}