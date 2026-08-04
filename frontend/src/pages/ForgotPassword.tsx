import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail } from "lucide-react";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
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

        {!sent ? (
          <>
            <h1 className="text-xl font-semibold text-white text-center mb-1">Forgot Password</h1>
            <p className="text-gray-400 text-sm text-center mb-6">
              Enter your email and we'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-neonGreen font-semibold mb-2">Check your email</p>
            <p className="text-gray-400 text-sm">
              If an account with that email exists, a reset link has been sent. It expires in 30 minutes.
            </p>
          </div>
        )}

        <p className="text-gray-400 text-sm text-center mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-neonGreen hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}