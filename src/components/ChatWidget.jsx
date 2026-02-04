import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './AppIcon';
import { LOGO_CONFIG } from '../utils/logoConfig';
import '../styles/chatWidget.css';

const ChatWidget = ({ catchyLine = "Smart insights for your business", agentImage = LOGO_CONFIG.imagePath }) => {
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to NoteNetra! I'm your AI assistant. How can I help you grow your business today?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Predefined questions and answers for quick responses (Logic unchanged)
  const predefinedResponses = {
    "what is notenetra": "NoteNetra is a smart IIoT platform that helps Indian MSMEs track cash and UPI transactions, gain business insights, build credit visibility, and improve loan eligibility.",
    "how does the notenetra device work": "Our plug-and-play device automatically captures and categorizes every cash and UPI transaction in real-time. It then processes this data to provide insights and update your financial profile.",
    "what features does notenetra offer": "NoteNetra offers features like smart transaction tracking, a credit score engine, one-click invoicing, and ONDC storefront integration to help grow your business.",
    "how can notenetra help my business": "NoteNetra can help your business by transforming offline transactions into actionable insights, improving your credit score, simplifying invoicing, and expanding your market reach through ONDC.",
    "where can i buy the notenetra device": "You can order the NoteNetra device directly from our website by visiting the 'Contact Us' page to get started.",
    "order device": "You can order the NoteNetra device directly from our website by visiting the 'Contact Us' page to get started.",
  };

  useEffect(() => {
    // Initial greeting bubble logic removed - now triggered by hover
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChatPanel = () => {
    setIsChatPanelOpen((prev) => !prev);
  };

  const handleSendMessage = (text = inputMessage) => {
    if (text.trim() === "") return;

    const newUserMessage = { id: Date.now(), text: text, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");

    let normalizedText = text.toLowerCase().trim().replace(/[?.,!]/g, '');
    const botResponseText = predefinedResponses[normalizedText] || "I'm specialized in NoteNetra's platform and products. For specific queries, please visit our documentation or contact support.";

    setTimeout(() => {
      const botResponse = { id: Date.now() + 1, text: botResponseText, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  const handleQuickOptionClick = (option) => {
    handleSendMessage(option);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none md:bottom-8 md:right-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Greeting Bubble (Only visible on hover) */}
      <AnimatePresence>
        {isHovered && !isChatPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20, y: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20, y: 10 }}
            className="pointer-events-auto bg-[#1a1c24] border border-white/10 rounded-[1.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-5 mb-4 max-w-[320px] transition-all duration-300"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                <img src={LOGO_CONFIG.imagePath} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-primary uppercase tracking-[0.1em] mb-0.5">NoteNetra AI</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <p className="text-[11px] text-gray-400 font-semibold">Online</p>
                </div>
              </div>
            </div>

            <p className="text-[15px] font-semibold text-white/90 mb-5 leading-tight">
              {catchyLine}
            </p>

            <button
              onClick={toggleChatPanel}
              className="w-full py-3.5 bg-[#4b91b0] hover:bg-[#3d7a94] text-white text-sm font-bold rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Ask a question</span>
              <Icon name="ArrowRight" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Panel */}
      <AnimatePresence>
        {isChatPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="pointer-events-auto md:w-[420px] md:h-[600px] w-[calc(100vw-48px)] h-[calc(100vh-120px)] bg-white dark:bg-[#0c0c0e] border border-border/60 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden mb-4 relative"
          >
            {/* Premium Header Container */}
            <div className="relative border-b border-border/40 overflow-hidden bg-[#0c0c0e]">
              <div className="h-28 w-full relative overflow-hidden bg-white/5">
                <img
                  src={LOGO_CONFIG.imagePath}
                  alt="Cover"
                  className="w-full h-full object-cover opacity-20 transform scale-100"
                />

                <button
                  onClick={toggleChatPanel}
                  className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl transition-all z-20"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>

              <div className="px-8 pb-6 -mt-12 relative z-10 flex items-end space-x-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[2rem] bg-[#1a1c24] shadow-2xl border-4 border-[#0c0c0e] overflow-hidden flex items-center justify-center">
                    <img src={LOGO_CONFIG.imagePath} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-[#0c0c0e] rounded-full shadow-lg" />
                </div>
                <div className="mb-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">NoteNetra AI</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Active Support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col bg-background">
              <div
                ref={chatContainerRef}
                className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar-premium bg-slate-50/20 dark:bg-transparent"
              >
                {messages.map((msg) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                      <div
                        className={`px-5 py-3.5 shadow-sm ${msg.sender === "user"
                          ? "bg-primary text-white rounded-[1.5rem] rounded-tr-none font-medium"
                          : "bg-white dark:bg-[#1a1c24] border border-border/50 text-foreground rounded-[1.5rem] rounded-tl-none font-medium"
                          }`}
                      >
                        <p className="text-[14.5px] leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-2 px-2 font-bold uppercase tracking-wider opacity-60">
                        {msg.sender === "user" ? "You" : "Assistant"}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Quick Actions */}
              <div className="px-6 py-4 bg-background/50 backdrop-blur-md border-t border-border/40 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex space-x-2">
                  {["What is NoteNetra", "Pricing", "Features"].map(
                    (option) => (
                      <button
                        key={option}
                        onClick={() => handleQuickOptionClick(option)}
                        className="px-5 py-2.5 rounded-2xl text-[13px] font-bold bg-[#1a1c24] text-white/80 hover:bg-primary/20 hover:text-primary transition-all border border-white/5 active:scale-95"
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Chat Input Area */}
              <div className="p-6 bg-background/80 backdrop-blur-xl">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Ask anything about NoteNetra..."
                    className="w-full pl-6 pr-14 py-4.5 bg-[#1a1c24] border border-white/5 rounded-[1.5rem] text-sm font-medium text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-inner"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    className="absolute right-2.5 w-11 h-11 flex items-center justify-center rounded-2xl bg-[#4b91b0] text-white hover:bg-[#3d7a94] transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-blue-500/10"
                  >
                    <Icon name="Send" size={20} />
                  </button>
                </div>
                <div className="flex justify-center mt-5">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] opacity-50">NoteNetra Intelligence</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!isChatPanelOpen && (
        <motion.button
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleChatPanel}
          className="pointer-events-auto relative w-16 h-16 bg-[#1a1c24] rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all group overflow-hidden border border-white/10"
        >
          {/* Progress ring/glow */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 w-full h-full p-0 flex items-center justify-center">
            <img
              src={LOGO_CONFIG.imagePath}
              alt="Logo"
              className="w-full h-full object-cover drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
            />
          </div>

          {/* Notification Badge */}
          <div className="absolute top-3 right-3 w-3.5 h-3.5 bg-[#d94e4e] border-2 border-[#1a1c24] rounded-full shadow-sm" />
        </motion.button>
      )}
    </div>
  );
};

export default ChatWidget;
