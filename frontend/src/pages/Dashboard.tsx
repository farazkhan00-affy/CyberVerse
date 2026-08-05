import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatCards from "../components/dashboard/StatCards";
import PopularTools from "../components/dashboard/PopularTools";
import RightPanel from "../components/dashboard/RightPanel";
import { userKey } from "../lib/session";

export default function Dashboard() {
  const [profileName, setProfileName] = useState("User");

  useEffect(() => {
    const load = () => setProfileName(localStorage.getItem(userKey("profile_name")) || "User");
    load();
    window.addEventListener("profile-updated", load);
    return () => window.removeEventListener("profile-updated", load);
  }, []);

  return (
    <div className="bg-cyberDark min-h-screen flex">
      <Sidebar />
      <div className="ml-64 flex-1 flex">
        <div className="flex-1 p-8">
          <Topbar />
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {profileName} 👋</h1>
            <p className="text-gray-400 text-sm mb-6">Here's what's happening with your security today.</p>
            <StatCards />
            <PopularTools />
          </div>
        </div>
        <div className="p-8 pl-0">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}