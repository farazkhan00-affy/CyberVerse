import { useNavigate } from "react-router-dom";
import { Shield, Home, Lock, Globe, Monitor, Code2, Hash, ShieldCheck, Grid3x3, History, FileText, Star, Settings, ChevronDown, LogOut } from "lucide-react";

const toolGroups = [
  { name: "Password Tools", icon: Lock },
  { name: "Network Tools", icon: Globe },
  { name: "Web Tools", icon: Monitor },
  { name: "Encoder / Decoder", icon: Code2 },
  { name: "Hash Tools", icon: Hash },
  { name: "Security Tools", icon: ShieldCheck },
  { name: "Other Tools", icon: Grid3x3 },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-cyberDark border-r border-white/10 fixed left-0 top-0 flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <Shield className="text-neonGreen" size={26} />
        <div>
          <p className="text-white font-bold leading-tight">CYBERVERSE</p>
          <p className="text-gray-500 text-xs">Protect. Analyze. Secure.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neonGreen/10 text-neonGreen font-medium mb-4">
          <Home size={18} /> Dashboard
        </a>

        <p className="text-gray-500 text-xs font-semibold px-3 mb-2 tracking-wider">TOOLS</p>
        {toolGroups.map((group) => (
          <button
            key={group.name}
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition mb-1"
          >
            <span className="flex items-center gap-3 text-sm">
              <group.icon size={18} /> {group.name}
            </span>
            <ChevronDown size={14} />
          </button>
        ))}

        <div className="mt-6 border-t border-white/10 pt-4">
          {[
            { name: "Scans History", icon: History },
            { name: "Reports", icon: FileText },
            { name: "Favorites", icon: Star },
            { name: "Settings", icon: Settings },
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition text-sm mb-1"
            >
              <item.icon size={18} /> {item.name}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-4 border-t border-white/10">
        <div className="w-9 h-9 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen font-semibold">
          F
        </div>
        <div>
          <p className="text-white text-sm font-medium">Faraz</p>
          <p className="text-neonGreen text-xs">Premium User</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-red-400 text-sm border-t border-white/10 transition"
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}