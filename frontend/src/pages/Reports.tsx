import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { getActivities, subscribeActivity, timeAgo } from "../lib/activity";

export default function Reports() {
  const [activities, setActivities] = useState(getActivities());

  useEffect(() => {
    return subscribeActivity(() => setActivities(getActivities()));
  }, []);

  const handleDownload = (text: string, time: number) => {
    const content = `CyberVerse Report\n\nAction: ${text}\nDate: ${new Date(time).toLocaleString()}\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cyberverse-report-${time}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-1">
            <FileText className="text-pink-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Reports</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">View and download your generated reports</p>

          {activities.length === 0 && (
            <p className="text-gray-500 text-sm">No reports yet — use a tool to generate activity.</p>
          )}

          <div className="space-y-3">
            {activities.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white text-sm font-semibold">{r.text}</p>
                  <p className="text-gray-500 text-xs mt-1">{timeAgo(r.time)}</p>
                </div>
                <button
                  onClick={() => handleDownload(r.text, r.time)}
                  className="flex items-center gap-2 text-neonGreen text-sm hover:underline"
                >
                  <Download size={14} /> Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}