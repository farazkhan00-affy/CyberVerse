import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Is CyberVerse free to use?",
    a: "Yes, CyberVerse is currently free to use. All tools are available once you create an account.",
  },
  {
    q: "Do I need to create an account to use the tools?",
    a: "Yes, you need to register and log in to access the dashboard and use any of the security tools.",
  },
  {
    q: "Are the network and security tools safe to use on any website?",
    a: "Tools like Port Scanner and the vulnerability pattern checker are meant for educational use and testing systems you own or have permission to test. Always use responsibly.",
  },
  {
    q: "What technologies power CyberVerse?",
    a: "The frontend is built with React, TypeScript, and Tailwind CSS. The backend runs on FastAPI with a PostgreSQL database.",
  },
  {
    q: "How do I report a bug or suggest a feature?",
    a: "Reach out through the contact form below, or message directly via the GitHub or LinkedIn links in the footer.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-cyberDark py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-8">
          <HelpCircle className="text-neonGreen" size={22} />
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            Frequently Asked <span className="text-neonGreen">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-white text-sm font-medium">{item.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-neonGreen flex-shrink-0" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-gray-400 text-sm">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}