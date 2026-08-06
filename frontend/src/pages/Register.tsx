import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, User, Mail, Lock } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import api from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);

      // Save the entered name/email now, keyed by email —
      // so as soon as they log in and get a token, Sidebar/Topbar/Dashboard
      // can find the correct name for this exact account.
      localStorage.setItem(`profile_name_${form.email}`, form.name);
      localStorage.setItem(`profile_email_${form.email}`, form.email);

      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const API_BASE = "http://127.0.0.1:8000";

  return (
    <div className="min-h-screen bg-cyberDark flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="text-neonGreen" size={28} />
          <span className="text-2xl font-bold text-white">
            CYBER<span className="text-neonGreen">VERSE</span>
          </span>
        </div>

        <h1 className="text-xl font-semibold text-white text-center mb-1">Create your account</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Start securing your digital world today</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-5">
          <a
            href={`${API_BASE}/auth/google/login`}
            className="flex items-center justify-center gap-2 border border-white/10 rounded-lg py-2.5 text-sm text-white hover:bg-white/5 transition"
          >
            <FaGoogle size={15} /> Google
          </a>
          <a
            href={`${API_BASE}/auth/github/login`}
            className="flex items-center justify-center gap-2 border border-white/10 rounded-lg py-2.5 text-sm text-white hover:bg-white/5 transition"
          >
            <FaGithub size={15} /> GitHub
          </a>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-gray-500 text-xs">OR</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </motion.button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-neonGreen hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}