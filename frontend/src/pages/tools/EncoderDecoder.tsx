import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Copy, Check, ArrowDownUp } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

type Mode = "base64" | "url" | "html";

export default function EncoderDecoder() {
  const [mode, setMode] = useState<Mode>("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const tabs: { key: Mode; label: string }[] = [
    { key: "base64", label: "Base64" },
    { key: "url", label: "URL" },
    { key: "html", label: "HTML" },
  ];

  const encode = () => {
    setError("");
    try {
      if (mode === "base64") setOutput(btoa(unescape(encodeURIComponent(input))));
      if (mode === "url") setOutput(encodeURIComponent(input));
      if (mode === "html") {
        const div = document.createElement("div");
        div.textContent = input;
        setOutput(div.innerHTML);
      }
    } catch {
      setError("Could not encode this input");
      setOutput("");
    }
  };

  const decode = () => {
    setError("");
    try {
      if (mode === "base64") setOutput(decodeURIComponent(escape(atob(input))));
      if (mode === "url") setOutput(decodeURIComponent(input));
      if (mode === "html") {
        const div = document.createElement("div");
        div.innerHTML = input;
        setOutput(div.textContent || "");
      }
    } catch {
      setError("Invalid input — could not decode");
      setOutput("");
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setInput(output);
    setOutput("");
  };

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Code2 className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Encoder / Decoder</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Encode or decode Base64, URL, and HTML entities</p>

          <div className="flex gap-2 mb-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setMode(t.key);
                  setOutput("");
                  setError("");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  mode === t.key
                    ? "bg-neonGreen text-black"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <p className="text-white text-sm font-semibold mb-2">Input</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text here..."
              rows={4}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm mb-4 focus:outline-none focus:border-neonGreen/40 resize-none"
            />

            <div className="flex gap-3 mb-4">
              <button
                onClick={encode}
                disabled={!input}
                className="flex-1 bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-40"
              >
                Encode
              </button>
              <button
                onClick={decode}
                disabled={!input}
                className="flex-1 border border-neonGreen/40 text-white font-semibold py-2.5 rounded-lg hover:bg-neonGreen/10 transition disabled:opacity-40"
              >
                Decode
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            {output && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-sm font-semibold">Output</p>
                  <div className="flex gap-2">
                    <button onClick={swap} className="text-gray-400 hover:text-neonGreen transition" title="Use output as input">
                      <ArrowDownUp size={16} />
                    </button>
                    <button onClick={handleCopy} className="text-gray-400 hover:text-neonGreen transition">
                      {copied ? <Check size={16} className="text-neonGreen" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="bg-cyberDark border border-white/10 rounded-lg px-4 py-3">
                  <p className="text-white font-mono text-sm break-all">{output}</p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}