import { useState } from "react";
import { motion } from "framer-motion";
import { Binary, Copy, Check } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

export default function HexBinaryConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState("");

  const textToHex = (str: string) =>
    Array.from(str).map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ");

  const textToBinary = (str: string) =>
    Array.from(str).map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");

  const hexToText = (hex: string) => {
    try {
      return hex.trim().split(/\s+/).map((h) => String.fromCharCode(parseInt(h, 16))).join("");
    } catch {
      return "";
    }
  };

  const binaryToText = (bin: string) => {
    try {
      return bin.trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join("");
    } catch {
      return "";
    }
  };

  const isHexInput = /^[0-9a-fA-F\s]+$/.test(text.trim()) && text.trim().length > 0;
  const isBinaryInput = /^[01\s]+$/.test(text.trim()) && text.trim().length > 0;

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  const results = [
    { key: "hex", label: "Hex", value: isBinaryInput ? textToHex(binaryToText(text)) : textToHex(text) },
    { key: "binary", label: "Binary", value: isHexInput && !isBinaryInput ? textToBinary(hexToText(text)) : textToBinary(text) },
    { key: "text", label: "Text (from Hex or Binary input)", value: isBinaryInput ? binaryToText(text) : isHexInput ? hexToText(text) : "" },
  ];

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Binary className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Hex / Binary Converter</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Convert between text, hexadecimal, and binary</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <p className="text-white text-sm font-semibold mb-2">Input (text, hex, or binary)</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type text, or paste hex (48 65 6c 6c 6f) or binary (01001000...)..."
              rows={3}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm mb-6 focus:outline-none focus:border-neonGreen/40 resize-none"
            />

            {text && (
              <div className="space-y-3">
                {results.filter((r) => r.value).map((r) => (
                  <div key={r.key}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-neonGreen">{r.label.toUpperCase()}</p>
                      <button onClick={() => handleCopy(r.key, r.value)} className="text-gray-500 hover:text-neonGreen transition">
                        {copied === r.key ? <Check size={14} className="text-neonGreen" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="bg-cyberDark border border-white/10 rounded-lg p-3 text-white font-mono text-xs break-all">{r.value}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}