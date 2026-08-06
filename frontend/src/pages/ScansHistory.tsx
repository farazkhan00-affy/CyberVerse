import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { getActivities, subscribeActivity, timeAgo } from "../lib/activity";

export default function ScansHistory() {
  const [activities, setActivities] = useState(getActivities());

  useEffect(() => {
    return subscribeActivity(() => setActivities(getActivities()));
  }, []);

  return (
    <div className="bg-cyberDark min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-64 flex-1 pt-14 md:pt-0">
        <Topbar />
        <div className="p-4 sm:p-8 max-w-3xl">
          <div className="flex items-center gap-3 mb-1">
            <History className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Scans History</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Your recent scan and tool activity</p>

          {activities.length === 0 && (
            <p className="text-gray-500 text-sm">No activity yet — use a tool to see it appear here.</p>
          )}

          <div className="space-y-2">
            {activities.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-neonGreen flex-shrink-0" />
                  <span className="text-white text-sm">{h.text}</span>
                </div>
                <span className="text-gray-500 text-xs">{timeAgo(h.time)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}