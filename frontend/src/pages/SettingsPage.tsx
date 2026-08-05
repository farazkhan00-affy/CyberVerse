import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, KeyRound, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { showToast } from "../lib/toast";
import api from "../lib/api";
import { userKey } from "../lib/session";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
  const savedNotifs = localStorage.getItem(userKey("setting_email_notifs"));
  const saved2fa = localStorage.getItem(userKey("setting_2fa"));
  if (savedNotifs !== null) setEmailNotifs(savedNotifs === "true");
  if (saved2fa !== null) setTwoFactor(saved2fa === "true");
}, []);

  const handleToggleNotifs = () => {
    const newVal = !emailNotifs;
    setEmailNotifs(newVal);
    localStorage.setItem("setting_email_notifs", String(newVal));
    showToast(newVal ? "Email notifications enabled" : "Email notifications disabled");
  };

  const handleToggle2fa = () => {
    const newVal = !twoFactor;
    setTwoFactor(newVal);
    localStorage.setItem("setting_2fa", String(newVal));
    showToast(newVal ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
  };

  const handleChangePassword = async () => {
    const email = localStorage.getItem("profile_email");
    if (!email) {
      showToast("No email on file — update your profile first", "error");
      return;
    }
    if (!currentPassword || !newPassword) return;

    setChangingPassword(true);
    try {
      await api.post("/auth/change-password", {
        email,
        current_password: currentPassword,
        new_password: newPassword,
      });
      showToast("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to change password", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const email = localStorage.getItem("profile_email");
    if (!email) {
      showToast("No email on file — update your profile first", "error");
      return;
    }
    if (!deletePassword) return;

    setDeleting(true);
    try {
      await api.post("/auth/delete-account", { email, password: deletePassword });
      localStorage.clear();
      showToast("Account deleted");
      navigate("/register");
    } catch (err: any) {
      showToast(err.response?.data?.detail || "Failed to delete account", "error");
    } finally {
      setDeleting(false);
    }
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

          <div className="space-y-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-neonBlue" />
                <div>
                  <p className="text-white text-sm font-medium">Email Notifications</p>
                  <p className="text-gray-500 text-xs">Get notified about scan results</p>
                </div>
              </div>
              <Toggle value={emailNotifs} onChange={handleToggleNotifs} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-neonGreen" />
                <div>
                  <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-gray-500 text-xs">Add an extra layer of security</p>
                </div>
              </div>
              <Toggle value={twoFactor} onChange={handleToggle2fa} />
            </div>
          </div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <KeyRound size={18} className="text-neonGreen" />
              <p className="text-white text-sm font-medium">Change Password</p>
            </div>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white mb-2 focus:outline-none focus:border-neonGreen/40"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-cyberDark border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white mb-3 focus:outline-none focus:border-neonGreen/40"
            />
            <button
              onClick={handleChangePassword}
              disabled={!currentPassword || !newPassword || changingPassword}
              className="bg-neonGreen text-black font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition disabled:opacity-40 text-sm"
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </motion.div>

          {/* Delete Account */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/5 border border-red-500/20 rounded-xl p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trash2 size={18} className="text-red-400" />
              <p className="text-white text-sm font-medium">Delete Account</p>
            </div>
            <p className="text-gray-500 text-xs mb-3">This action is permanent and cannot be undone.</p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 text-sm font-medium hover:underline"
              >
                Delete my account
              </button>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-yellow-400 text-xs mb-3">
                  <AlertTriangle size={14} /> Enter your password to confirm deletion
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full bg-cyberDark border border-red-500/30 rounded-lg px-3 py-2.5 text-sm text-white mb-3 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={!deletePassword || deleting}
                    className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition disabled:opacity-40 text-sm"
                  >
                    {deleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                  <button
                    onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); }}
                    className="text-gray-400 text-sm px-4 py-2 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}