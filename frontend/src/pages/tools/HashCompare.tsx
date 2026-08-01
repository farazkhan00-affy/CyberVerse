import { useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, CheckCircle2, XCircle } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

export default function HashCompare() {
  const [hash1, setHash1] = useState("");
  const [hash2, setHash2] = useState("");

  const normalize = (h: string) => h.trim().toLowerCase();
  const bothFilled = hash1.trim() !== "" && hash2.trim() !== "";
  const isMatch = bothFilled && normalize(hash1) === normalize(hash2);

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <GitCompare className="text-purple-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Hash Compare</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Check if two hashes match — useful for verifying file integrity</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="mb-4">
              <p className="text-white text-sm font-semibold mb-2">Hash 1</p>
              <textarea
                value={hash1}
                onChange={(e) => setHash1(e.target.value)}
                placeholder="Paste first hash here..."
                rows={2}
                className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neonGreen/40 resize-none"
              />
            </div>

            <div className="mb-6">
              <p className="text-white text-sm font-semibold mb-2">Hash 2</p>
              <textarea
                value={hash2}
                onChange={(e) => setHash2(e.target.value)}
                placeholder="Paste second hash here..."
                rows={2}
                className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neonGreen/40 resize-none"
              />
            </div>

            {bothFilled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${
                  isMatch
                    ? "bg-neonGreen/10 border-neonGreen/30 text-neonGreen"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {isMatch ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                <span className="text-sm font-semibold">
                  {isMatch ? "Hashes match — integrity verified" : "Hashes do not match"}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}