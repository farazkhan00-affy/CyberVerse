import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const refresh = searchParams.get("refresh");
    if (token) {
      localStorage.setItem("token", token);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      navigate("/dashboard");
    } else {
      navigate("/login?error=oauth_failed");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-cyberDark flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      >
        <Shield className="text-neonGreen" size={40} />
      </motion.div>
    </div>
  );
}