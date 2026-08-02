import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { subscribeToast } from "../lib/toast";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let nextId = 0;

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToast((message, type) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2500);
    });
  }, []);

  const icons = {
    success: <CheckCircle2 size={18} className="text-neonGreen" />,
    error: <XCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-neonBlue" />,
  };

  return (
    <div className="fixed top-6 right-6 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex items-center gap-2 bg-cyberDark border border-white/10 rounded-lg px-4 py-3 shadow-lg min-w-[220px]"
          >
            {icons[t.type]}
            <span className="text-white text-sm">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}