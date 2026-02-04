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
    const timer = setTimeout(() => {
      setShowGreetingBubble(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChatPanel = () => {
    setIsChatPanelOpen((prev) => !prev);
    setShowGreetingBubble(false);
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none md:bottom-8 md:right-8">
      {/* Greeting Bubble */}
      <AnimatePresence>
        {showGreetingBubble && !isChatPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="pointer-events-auto bg-white dark:bg-gray-900 border border-border/50 rounded-2xl shadow-2xl p-4 mb-4 max-w-[280px] relative overflow-hidden group"
          >
            {/* Progress bar decoration */}
            <div className="absolute top-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-1000" />

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 p-1 overflow-hidden">
                <img src={LOGO_CONFIG.imagePath} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">NoteNetra AI</p>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-muted-foreground font-medium">Online</p>
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-foreground mb-3 leading-relaxed">
              {catchyLine}
            </p>

            <button
              onClick={toggleChatPanel}
              className="w-full py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
            >
              <span>Ask a question</span>
              <Icon name="ArrowRight" size={14} />
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
            className="pointer-events-auto md:w-[420px] md:h-[600px] w-[calc(100vw-48px)] h-[calc(100vh-120px)] bg-white dark:bg-[#0c0c0e] border border-border/60 rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden mb-4 relative"
          >
            {/* Premium Header with Cover Image */}
            <div className="relative border-b border-border/40 overflow-hidden">
              {/* Cover Image Banner */}
              <div className="h-32 w-full relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                <img
                  src={LOGO_CONFIG.imagePath}
                  alt="Cover"
                  className="w-full h-full object-cover blur-[2px] opacity-40 transform scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                {/* Close Button on top of cover */}
                <button
                  onClick={toggleChatPanel}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all z-20"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>

              <div className="px-6 pb-6 -mt-10 relative z-10 flex items-end space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-4 border-white dark:border-gray-900 p-2 overflow-hidden flex items-center justify-center">
                    <img src={LOGO_CONFIG.imagePath} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full shadow-md" />
                </div>
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-foreground tracking-tight leading-none mb-1">NoteNetra AI</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-xs text-muted-foreground font-semibold">Active Support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Messages Group */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar-premium bg-slate-50/30 dark:bg-transparent"
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
                        className={`px-4 py-3 shadow-sm ${msg.sender === "user"
                          ? "bg-primary text-white rounded-[1.25rem] rounded-tr-none font-medium"
                          : "bg-white dark:bg-gray-800 border border-border/50 text-foreground rounded-[1.25rem] rounded-tl-none"
                          }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1.5 font-medium px-1">
                        {msg.sender === "user" ? "You" : "NoteNetra Bot"} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Quick Actions */}
              <div className="px-6 py-4 bg-background border-t border-border/40 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex space-x-2">
                  {["What is NoteNetra", "Pricing", "Order Device", "Features"].map(
                    (option) => (
                      <button
                        key={option}
                        onClick={() => handleQuickOptionClick(option)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-muted/40 hover:bg-primary/10 hover:text-primary transition-all border border-border/40"
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Chat Input Area */}
              <div className="p-6 bg-background">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full pl-4 pr-12 py-3.5 bg-muted/30 border border-border/60 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    className="absolute right-2 w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white hover:opacity-90 transition-all disabled:opacity-30 disabled:grayscale"
                  >
                    <Icon name="Send" size={18} />
                  </button>
                </div>
                <div className="flex justify-center mt-4">
                  <p className="text-[10px] text-muted-foreground/50 font-medium">Powered by NoteNetra AI Engine</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!isChatPanelOpen && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChatPanel}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto relative w-16 h-16 bg-primary rounded-[1.5rem] shadow-[0_12px_24px_-8px_rgba(8,145,178,0.5)] flex items-center justify-center transition-all group overflow-hidden"
        >
          {/* Internal Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 text-white">
            <AnimatePresence mode="wait">
              {isChatPanelOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Icon name="X" size={28} strokeWidth={2.5} />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                  <Icon name="MessageCircle" size={28} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Badge */}
          {!isChatPanelOpen && (
            <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-red-500 border-2 border-primary rounded-full" />
          )}
        </motion.button>
      )}
    </div>
  );
};

export default ChatWidget;

