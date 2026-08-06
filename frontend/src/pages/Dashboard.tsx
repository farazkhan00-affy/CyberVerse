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
    <div className="bg-cyberDark min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="md:ml-64 flex-1 flex flex-col lg:flex-row pt-14 md:pt-0">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Topbar />
          <div className="mt-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Welcome back, {profileName} 👋</h1>
            <p className="text-gray-400 text-sm mb-6">Here's what's happening with your security today.</p>
            <StatCards />
            <PopularTools />
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 lg:pl-0 w-full lg:w-auto">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}