import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import api from "../lib/api";
import { showToast } from "../lib/toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset link");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: newPassword });
      showToast("Password reset successfully! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Reset link is invalid or expired");
    } finally {
      setLoading(false);
    }
  };

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

        <h1 className="text-xl font-semibold text-white text-center mb-1">Reset Password</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Enter your new password below</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          <Link to="/login" className="text-neonGreen hover:underline">
            Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}