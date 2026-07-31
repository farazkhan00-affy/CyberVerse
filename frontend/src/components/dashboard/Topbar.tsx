import { Search, Bell } from "lucide-react";

export default function Topbar() {
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
        <button className="relative text-gray-400 hover:text-white transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-neonGreen text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            3
          </span>
        </button>
        <div className="w-9 h-9 rounded-full bg-neonGreen/20 flex items-center justify-center text-neonGreen font-semibold text-sm">
          F
        </div>
      </div>
    </div>
  );
}