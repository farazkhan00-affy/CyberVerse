import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getActivities, subscribeActivity, getUnreadCount, markAllSeen, timeAgo } from "../../lib/activity";
import { userKey } from "../../lib/session";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [activities, setActivities] = useState(getActivities());
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("User");

  useEffect(() => {
    return subscribeActivity(() => {
      setActivities(getActivities());
      setUnreadCount(getUnreadCount());
    });
  }, []);

  useEffect(() => {
    const load = () => {
      setAvatar(localStorage.getItem(userKey("profile_avatar")));
      setProfileName(localStorage.getItem(userKey("profile_name")) || "User");
    };
    load();
    window.addEventListener("profile-updated", load);
    return () => window.removeEventListener("profile-updated", load);
  }, []);

  const handleBellClick = () => {
    setOpen(!open);
    if (!open) markAllSeen();
  };

  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-cyberDark sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search tools..."
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="relative text-gray-400 hover:text-white transition"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neonGreen text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-72 bg-cyberDark border border-white/10 rounded-xl shadow-lg overflow-hidden z-20"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white text-sm font-semibold">Notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {activities.slice(0, 8).map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition">
                      <p className="text-gray-300 text-xs">{n.text}</p>
                      <p className="text-gray-600 text-xs mt-1">{timeAgo(n.time)}</p>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="px-4 py-3 text-gray-600 text-xs">No notifications yet</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-9 h-9 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen font-semibold text-sm overflow-hidden">
          {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : profileName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}