import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Trash2 } from "lucide-react";
import api from "../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = () => !!localStorage.getItem("token");

  const handleButtonClick = () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    setOpen(true);
    if (messages.length === 0) {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 2200);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 2200);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {  
      const res = await api.post("/ai/chat", { messages: newMessages });  
      setMessages([...newMessages, { role: "assistant", content: res.data.reply }]);  
    } catch {  
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);  
    } finally {  
      setLoading(false);  
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      {/* Floating button - Dynamic padding & position for mobile */}
      <motion.button
        onClick={handleButtonClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 bg-neonGreen text-black font-semibold px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg shadow-neonGreen/20 text-sm sm:text-base"
      >
        <Bot size={18} className="sm:w-5 sm:h-5" />
        CyberVerse AI
      </motion.button>

      {/* Chat window - Responsive sizing for Mobile vs Desktop */}  
      <AnimatePresence>  
        {open && (  
          <motion.div  
            initial={{ opacity: 0, y: 30, scale: 0.95 }}  
            animate={{ opacity: 1, y: 0, scale: 1 }}  
            exit={{ opacity: 0, y: 30, scale: 0.95 }}  
            transition={{ duration: 0.25 }}  
            className="fixed bottom-16 right-3 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-96 max-w-md h-[460px] sm:h-[520px] bg-cyberDark border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"  
          >  
            {/* Header */}  
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">  
              <div className="flex items-center gap-2">  
                <div className="w-8 h-8 rounded-full bg-neonGreen/20 flex items-center justify-center">  
                  <Bot size={16} className="text-neonGreen" />  
                </div>  
                <div>  
                  <p className="text-white text-sm font-semibold">CyberVerse AI</p>  
                  <p className="text-neonGreen text-xs flex items-center gap-1">  
                    <span className="w-1.5 h-1.5 rounded-full bg-neonGreen animate-pulse" /> Online  
                  </p>  
                </div>  
              </div>  

              {/* Header Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleClearChat} 
                  title="Clear chat" 
                  className="text-gray-400 hover:text-white transition"
                >
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition">  
                  <X size={18} />  
                </button>  
              </div>
            </div>  

            {/* Messages */}  
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">  
              <AnimatePresence>  
                {showWelcome && (  
                  <motion.div  
                    initial={{ opacity: 0, scale: 0.9 }}  
                    animate={{ opacity: 1, scale: 1 }}  
                    exit={{ opacity: 0 }}  
                    className="flex flex-col items-center justify-center h-full text-center gap-3 py-10"  
                  >  
                    <motion.div  
                      animate={{ rotate: [0, 10, -10, 0] }}  
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}  
                    >  
                      <Sparkles size={32} className="text-neonGreen sm:w-9 sm:h-9" />  
                    </motion.div>  
                    <p className="text-white font-semibold text-base sm:text-lg">Welcome to CyberVerse AI</p>  
                    <p className="text-gray-500 text-xs sm:text-sm px-4 sm:px-6">  
                      Ask me anything about cybersecurity or the tools on this platform.  
                    </p>  
                  </motion.div>  
                )}  
              </AnimatePresence>  

              {!showWelcome && messages.length === 0 && (  
                <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-gray-500 text-xs sm:text-sm">  
                  <Bot size={26} className="text-neonGreen/50 sm:w-7 sm:h-7" />  
                  Ask me anything to get started  
                </div>  
              )}  

              {messages.map((m, i) => (  
                <motion.div  
                  key={i}  
                  initial={{ opacity: 0, y: 10 }}  
                  animate={{ opacity: 1, y: 0 }}  
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}  
                >  
                  <div  
                    className={`max-w-[85%] sm:max-w-[80%] rounded-xl px-3 py-2 text-xs sm:text-sm ${  
                      m.role === "user"  
                        ? "bg-neonGreen text-black"  
                        : "bg-white/5 border border-white/10 text-gray-200"  
                    }`}  
                  >  
                    {m.content}  
                  </div>  
                </motion.div>  
              ))}  

              {loading && (  
                <div className="flex justify-start">  
                  <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex gap-1">  
                    {[0, 1, 2].map((i) => (  
                      <motion.span  
                        key={i}  
                        className="w-1.5 h-1.5 bg-neonGreen rounded-full"  
                        animate={{ opacity: [0.3, 1, 0.3] }}  
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}  
                      />  
                    ))}  
                  </div>  
                </div>  
              )}  
            </div>  

            {/* Input */}  
            <div className="p-2.5 sm:p-3 border-t border-white/10 flex gap-2 bg-cyberDark">  
              <input  
                type="text"  
                value={input}  
                onChange={(e) => setInput(e.target.value)}  
                onKeyDown={(e) => e.key === "Enter" && handleSend()}  
                placeholder="Type a message..."  
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen/40"  
              />  
              <button  
                onClick={handleSend}  
                disabled={!input.trim() || loading}  
                className="bg-neonGreen text-black p-2 rounded-lg hover:brightness-110 transition disabled:opacity-40 flex-shrink-0"  
              >  
                <Send size={16} />  
              </button>  
            </div>  
          </motion.div>  
        )}  
      </AnimatePresence>  
    </>
  );
}