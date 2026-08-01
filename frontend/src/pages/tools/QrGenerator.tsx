import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Download } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import Topbar from "../../components/dashboard/Topbar";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [qrUrl, setQrUrl] = useState("");

  const generate = () => {
    if (!text.trim()) return;
    const encoded = encodeURIComponent(text.trim());
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`);
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    const res = await fetch(qrUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cyberverse-qrcode.png";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <QrCode className="text-pink-400" size={24} />
            <h1 className="text-2xl font-bold text-white">QR Code Generator</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Generate a QR code from any text, URL, or data</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <p className="text-white text-sm font-semibold mb-2">Text or URL</p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type text or paste a URL..."
              rows={3}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-4 py-3 text-white text-sm mb-4 focus:outline-none focus:border-neonGreen/40 resize-none"
            />

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Size</span>
                <span className="text-neonGreen font-semibold">{size}px</span>
              </div>
              <input
                type="range"
                min={150}
                max={500}
                step={50}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-neonGreen"
              />
            </div>

            <button
              onClick={generate}
              disabled={!text.trim()}
              className="w-full bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-40 mb-6"
            >
              Generate QR Code
            </button>

            {qrUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="bg-white p-4 rounded-lg">
                  <img src={qrUrl} alt="Generated QR Code" width={size} height={size} />
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 border border-neonGreen/40 text-white px-5 py-2 rounded-lg hover:bg-neonGreen/10 transition text-sm"
                >
                  <Download size={16} /> Download PNG
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}