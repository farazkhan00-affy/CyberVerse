import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Send, Heart } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import logo from "../assets/cyberverse-logo.svg";

const socials = [
  { icon: FaGithub, url: "https://github.com/farazkhan00-affy" },
  { icon: FaLinkedin, url: "https://www.linkedin.com/in/faraz-hussain-a50b7b288" },
  { icon: Mail, url: "mailto:fh210642@gmail.com" },
];

export default function Footer() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    const subject = encodeURIComponent(`CyberVerse Contact from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:fh210642@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <footer className="bg-cyberDark border-t border-white/10 pt-14 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={logo} alt="CyberVerse" className="w-7 h-7" />
            <span className="text-xl font-bold text-white">
              CYBER<span className="text-neonGreen">VERSE</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            CyberVerse is your all-in-one cybersecurity platform with powerful tools to secure, analyze and protect your digital world.
          </p>
          <div className="flex gap-3">
            {socials.map(({ icon: Icon, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-neonGreen hover:border-neonGreen/40 transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <a href="#features" className="text-gray-400 hover:text-neonGreen transition">Features</a>
            <Link to="/dashboard" className="text-gray-400 hover:text-neonGreen transition">Dashboard</Link>
            <Link to="/tools" className="text-gray-400 hover:text-neonGreen transition">Tools</Link>
            <span className="text-gray-600">Privacy Policy</span>
            <a href="#stats" className="text-gray-400 hover:text-neonGreen transition">Stats</a>
            <span className="text-gray-600">Terms of Service</span>
            <a href="#faq" className="text-gray-400 hover:text-neonGreen transition">FAQ</a>
            <a href="mailto:fh210642@gmail.com" className="text-gray-400 hover:text-neonGreen transition">Contact Us</a>
          </div>
        </div>

        {/* Contact form */}
        <div>
          <h3 className="text-white font-semibold mb-1">Have Questions? We're Here to Help</h3>
          <p className="text-gray-500 text-sm mb-4">Send us a message and it'll open in your email app, ready to send.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-1/2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-1/2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"
              />
            </div>
            <textarea
              placeholder="Your Message"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40 resize-none"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition"
            >
              Send Message <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-500 text-xs">
        <p>© 2026 CyberVerse. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built for a safer digital world <Heart size={12} className="text-neonGreen fill-neonGreen" />
        </p>
      </div>
    </footer>
  );
}