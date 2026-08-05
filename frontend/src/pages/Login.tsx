import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import api from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "oauth_failed") {
      setError("Social login failed. Please try again or use email.");
    } else if (searchParams.get("error") === "no_email") {
      setError("Could not retrieve email from provider.");
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // FIX 4: Changed http://127.0.0.1:8000 to http://localhost:8000
  const API_BASE = "http://localhost:8000";

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

        <h1 className="text-xl font-semibold text-white text-center mb-1">
          Welcome back
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Log in to access your dashboard
        </p>

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
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
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
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
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

          <div className="text-right -mt-2">
            <Link
              to="/forgot-password"
              className="text-neonGreen text-xs hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-neonGreen text-black font-semibold py-2.5 rounded-lg hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </motion.button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-neonGreen hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}