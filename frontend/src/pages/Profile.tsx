import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Camera } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import { showToast } from "../lib/toast";
import { userKey } from "../lib/session";

export default function Profile() {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedName = localStorage.getItem(userKey("profile_name"));
    const savedEmail = localStorage.getItem(userKey("profile_email"));
    const savedAvatar = localStorage.getItem(userKey("profile_avatar"));
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(userKey("profile_name"), name);
    localStorage.setItem(userKey("profile_email"), email);
    if (avatar) localStorage.setItem(userKey("profile_avatar"), avatar);
    window.dispatchEvent(new Event("profile-updated"));
    showToast("Profile updated!");
  };

  return (
    <div className="bg-cyberDark min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-64 flex-1 pt-14 md:pt-0">
        <Topbar />
        <div className="p-4 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <User className="text-neonGreen" size={24} />
            <h1 className="text-2xl font-bold text-white">Profile</h1>
          </div>
          <p className="text-gray-400 text-sm mb-6">Manage your account information</p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleAvatarClick}
                className="relative w-16 h-16 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen font-bold text-2xl overflow-hidden group flex-shrink-0"
              >
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase()
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Camera size={18} className="text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div>
                <p className="text-white font-semibold">{name}</p>
                <p className="text-neonGreen text-xs">Premium User</p>
                <button onClick={handleAvatarClick} className="text-gray-400 text-xs hover:text-neonGreen transition mt-1">
                  Change photo
                </button>
              </div>
            </div>

            <p className="text-white text-sm font-semibold mb-2">Full Name</p>
            <div className="relative mb-4">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cyberDark border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-neonGreen/40"
              />
            </div>

            <p className="text-white text-sm font-semibold mb-2">Email</p>
            <div className="relative mb-4">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-cyberDark border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-neonGreen/40"
              />
            </div>

            <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
              <Calendar size={14} /> Member since August 2026
            </div>

            <button
              onClick={handleSave}
              className="bg-neonGreen text-black font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition w-full sm:w-auto"
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}