import { useState } from "react";
import { motion } from "framer-motion";
import { KeySquare, Copy, Check } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

function caesarShift(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char === char.toUpperCase() ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
  });
}

export default function CaesarCipher() {
  const [input, setInput] = useState("");
  const [shift, setShift] = useState(3);
  const [copied, setCopied] = useState(false);

  const encoded = input ? caesarShift(input, shift) : "";
  const decoded = input ? caesarShift(input, -shift) : "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <KeySquare className="text-purple-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Caesar Cipher</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Encode or decode text using a Caesar shift cipher</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <p className="text-white text-sm font-semibold mb-2">Text</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your text here..."
              rows={3}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white text-sm mb-4 focus:outline-none focus:border-neonGreen/40 resize-none"
            />

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Shift Amount</span>
                <span className="text-neonGreen font-semibold">{shift}</span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                value={shift}
                onChange={(e) => setShift(Number(e.target.value))}
                className="w-full accent-neonGreen"
              />
            </div>

            {input && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-neonGreen">ENCODED (shift +{shift})</p>
                    <button onClick={() => handleCopy(encoded)} className="text-gray-500 hover:text-neonGreen transition">
                      {copied ? <Check size={14} className="text-neonGreen" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="bg-cyberDark border border-white/10 rounded-lg p-3 text-white text-sm break-all">{encoded}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-400 mb-1">DECODED (shift -{shift})</p>
                  <p className="bg-cyberDark border border-white/10 rounded-lg p-3 text-white text-sm break-all">{decoded}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}