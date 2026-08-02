import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { showToast } from "../lib/toast";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    showToast("Settings saved!");
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition relative ${value ? "bg-neonGreen" : "bg-white/10"}`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        className="w-5 h-5 bg-white rounded-full absolute top-0.5"
      />
    </button>
  );

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <Settings className="text-gray-300" size={24} />
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Manage your account and preferences</p>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-neonBlue" />
                <div>
                  <p className="text-white text-sm font-medium">Email Notifications</p>
                  <p className="text-gray-500 text-xs">Get notified about scan results</p>
                </div>
              </div>
              <Toggle value={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-neonGreen" />
                <div>
                  <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-gray-500 text-xs">Add an extra layer of security</p>
                </div>
              </div>
              <Toggle value={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 bg-neonGreen text-black font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}