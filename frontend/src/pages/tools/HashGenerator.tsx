import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, Copy, Check, Upload } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";
import { md5, md5FromArrayBuffer } from "../../lib/md5";

async function sha(algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512", buffer: ArrayBuffer) {
  const hashBuffer = await crypto.subtle.digest(algo, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [hashes, setHashes] = useState<{ [key: string]: string }>({});
  const [copiedKey, setCopiedKey] = useState("");

  const generateFromText = async () => {
    if (!input) return;
    const encoder = new TextEncoder();
    const buffer = encoder.encode(input).buffer;
    setFileName("");
    setHashes({
      MD5: md5(input),
      SHA1: await sha("SHA-1", buffer),
      SHA256: await sha("SHA-256", buffer),
      SHA512: await sha("SHA-512", buffer),
    });
  };

  const generateFromFile = async (file: File) => {
    setFileName(file.name);
    setInput("");
    const buffer = await file.arrayBuffer();
    setHashes({
      MD5: await md5FromArrayBuffer(buffer),
      SHA1: await sha("SHA-1", buffer),
      SHA256: await sha("SHA-256", buffer),
      SHA512: await sha("SHA-512", buffer),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) generateFromFile(file);
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 1500);
  };

  const hasResults = Object.keys(hashes).length > 0;

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Hash className="text-purple-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Hash Generator</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Generate MD5, SHA1, SHA256, and SHA512 hashes</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <p className="text-white text-sm font-semibold mb-2">Text Input</p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text here..."
              rows={3}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm mb-3 focus:outline-none focus:border-neonGreen/40 resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateFromText}
              disabled={!input}
              className="w-full bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-40 mb-4"
            >
              Generate from Text
            </motion.button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-gray-500 text-xs">OR</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <label className="flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-lg py-4 text-gray-400 hover:border-neonGreen/40 hover:text-neonGreen cursor-pointer transition mb-6">
              <Upload size={18} />
              {fileName ? fileName : "Upload a file to hash"}
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>

            {hasResults && (
              <div className="space-y-3">
                {Object.entries(hashes).map(([key, value]) => (
                  <div key={key} className="bg-cyberDark border border-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-400">{key}</span>
                      <button
                        onClick={() => handleCopy(key, value)}
                        className="text-gray-500 hover:text-neonGreen transition"
                      >
                        {copiedKey === key ? <Check size={14} className="text-neonGreen" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-white font-mono text-xs break-all">{value}</p>
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