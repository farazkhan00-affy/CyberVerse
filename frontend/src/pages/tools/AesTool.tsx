import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldEllipsis, Copy, Check } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export default function AesTool() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    setError("");
    setResult("");
    if (!text || !password) return;

    try {
      if (mode === "encrypt") {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);
        const encoded = new TextEncoder().encode(text);
        const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

        const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(new Uint8Array(encrypted), salt.length + iv.length);

        setResult(bufferToBase64(combined.buffer));
      } else {
        const combined = base64ToBuffer(text);
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const data = combined.slice(28);

        const key = await deriveKey(password, salt);
        const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
        setResult(new TextDecoder().decode(decrypted));
      }
    } catch {
      setError(mode === "encrypt" ? "Encryption failed" : "Decryption failed — wrong password or invalid data");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
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
            <ShieldEllipsis className="text-neonGreen" size={24} />
            <h1 className="text-2xl font-bold text-white">AES Encrypt / Decrypt</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Encrypt or decrypt text using AES-256-GCM with a password</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setMode("encrypt"); setResult(""); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "encrypt" ? "bg-neonGreen text-black" : "bg-white/5 text-gray-400"}`}
              >
                Encrypt
              </button>
              <button
                onClick={() => { setMode("decrypt"); setResult(""); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "decrypt" ? "bg-neonGreen text-black" : "bg-white/5 text-gray-400"}`}
              >
                Decrypt
              </button>
            </div>

            <p className="text-white text-sm font-semibold mb-2">{mode === "encrypt" ? "Text to Encrypt" : "Encrypted Text (Base64)"}</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={mode === "encrypt" ? "Type your secret message..." : "Paste encrypted Base64 text..."}
              rows={3}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm mb-4 focus:outline-none focus:border-neonGreen/40 resize-none"
            />

            <p className="text-white text-sm font-semibold mb-2">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password"
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm mb-4 focus:outline-none focus:border-neonGreen/40"
            />

            <button
              onClick={handleProcess}
              disabled={!text || !password}
              className="w-full bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-40 mb-4"
            >
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
                {error}
              </div>
            )}

            {result && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-neonGreen">RESULT</p>
                  <button onClick={handleCopy} className="text-gray-500 hover:text-neonGreen transition">
                    {copied ? <Check size={14} className="text-neonGreen" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="bg-cyberDark border border-white/10 rounded-lg p-3 text-white font-mono text-xs break-all">{result}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}