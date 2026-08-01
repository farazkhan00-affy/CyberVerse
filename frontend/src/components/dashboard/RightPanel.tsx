import { ShieldCheck, Search } from "lucide-react";

const activity = [
  { text: "Password strength checked", time: "2 mins ago", color: "text-neonGreen" },
  { text: "Port scan completed", time: "15 mins ago", color: "text-neonGreen" },
  { text: "WHOIS lookup performed", time: "32 mins ago", color: "text-neonBlue" },
  { text: "Hash generated", time: "1 hour ago", color: "text-purple-400" },
  { text: "IP lookup performed", time: "2 hours ago", color: "text-neonBlue" },
];

export default function RightPanel() {
  return (
    <div className="w-80 flex-shrink-0 space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonGreen opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neonGreen"></span>
          </span>
          <p className="text-white font-semibold text-sm">System Status</p>
        </div>
        <p className="text-gray-400 text-xs mb-4">All Systems Operational</p>
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-neonGreen/30 flex items-center justify-center">
            <ShieldCheck className="text-neonGreen" size={36} />
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Threat Level</span>
            <span className="text-neonGreen font-medium">LOW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Scan</span>
            <span className="text-white">2 hours ago</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Database</span>
            <span className="text-neonGreen">Connected</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <p className="text-white font-semibold text-sm mb-1">Quick Scan</p>
        <p className="text-gray-500 text-xs mb-4">Perform a quick security scan</p>
        <select className="w-full bg-cyberDark border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-3">
  <option className="bg-cyberDark text-white">Quick Scan (Basic)</option>
  <option className="bg-cyberDark text-white">Deep Scan (Advanced)</option>
</select>
        <button className="w-full flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition">
          <Search size={16} /> Start Scan
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white font-semibold text-sm">Recent Activity</p>
          <a href="#" className="text-neonGreen text-xs hover:underline">View All</a>
        </div>
        <div className="space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${a.color === "text-neonGreen" ? "bg-neonGreen" : a.color === "text-neonBlue" ? "bg-neonBlue" : "bg-purple-400"}`} />
              <div>
                <p className="text-gray-300 text-xs">{a.text}</p>
                <p className="text-gray-600 text-xs">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}