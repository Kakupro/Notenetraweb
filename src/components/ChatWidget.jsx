import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// The `useNavigate` hook is no longer used in this component as the "View Full Chat" button has been removed.
// import { useNavigate } from 'react-router-dom';
import Icon from './AppIcon'; // Assuming AppIcon is available
import '../styles/chatWidget.css'; // Import custom chat styles

const ChatWidget = ({ catchyLine = "Hi there! Have a question?", agentImage = "/assets/images/note.jpeg" }) => {
  const [showGreetingBubble, setShowGreetingBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false); // Controls the main sliding chat panel
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to NoteNetra! How can I help you today with our platform or products?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  // const navigate = useNavigate(); // Removed as per user request

  // Predefined questions and answers for quick responses
  const predefinedResponses = {
    "what is notenetra": "NoteNetra is a smart IIoT platform that helps Indian MSMEs track cash and UPI transactions, gain business insights, build credit visibility, and improve loan eligibility.",
    "how does the notenetra device work": "Our plug-and-play device automatically captures and categorizes every cash and UPI transaction in real-time. It then processes this data to provide insights and update your financial profile.",
    "what features does notenetra offer": "NoteNetra offers features like smart transaction tracking, a credit score engine, one-click invoicing, and ONDC storefront integration to help grow your business.",
    "how can notenetra help my business": "NoteNetra can help your business by transforming offline transactions into actionable insights, improving your credit score, simplifying invoicing, and expanding your market reach through ONDC.",
    "where can i buy the notenetra device": "You can order the NoteNetra device directly from our website by visiting the 'Contact Us' page to get started.",
    "order device": "You can order the NoteNetra device directly from our website by visiting the 'Contact Us' page to get started.",
  };

  // Show greeting bubble after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreetingBubble(true);
    }, 2000); // Show bubble after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // Enhanced auto-scroll functionality
  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      // Check if user is already at the bottom
      const chatContainer = chatContainerRef.current;
      const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
      
      if (isAtBottom) {
        // Smooth scroll to bottom
        messagesEndRef.current.scrollIntoView({ 
          behavior: "smooth",
          block: "end"
        });
      } else {
        // If user has scrolled up, don't auto-scroll but show a subtle indicator
        // You could add a "new message" indicator here if needed
      }
    }
  }, [messages]);

  // Handle opening/closing the main chat panel
  const toggleChatPanel = () => {
    setIsChatPanelOpen((prev) => !prev);
    setShowGreetingBubble(false); // Hide greeting bubble when panel opens
  };

  const handleSendMessage = (text = inputMessage) => {
    if (text.trim() === "") return;

    const newUserMessage = { id: messages.length + 1, text: text, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");

    // Check for predefined response
    let normalizedText = text.toLowerCase().trim();
    // Remove punctuation for better matching against predefined responses
    normalizedText = normalizedText.replace(/[?.,!]/g, '');

    const botResponseText = predefinedResponses[normalizedText] || "I can only answer questions related to NoteNetra's website and products in this chat. Please refine your question.";

    // Simulate bot response (replace with actual Gemini API call or live agent integration)
    setTimeout(() => {
      const botResponse = { id: messages.length + 2, text: botResponseText, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000); // Simulate network delay
  };

  const handleQuickOptionClick = (option) => {
    handleSendMessage(option);
  };

  // The "View Full Chat" button and its associated logic have been removed as per user request.

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 md:bottom-8 md:right-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Greeting Bubble */}
      <AnimatePresence>
        {showGreetingBubble && !isChatPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs"
          >
            <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">{catchyLine}</p>
            <button
              onClick={toggleChatPanel}
              className="text-xs bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
            >
              Start Chat
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatPanelOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 md:left-auto md:w-[400px] md:h-[500px] md:rounded-lg md:right-8 md:bottom-8 chat-panel shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b chat-header">
              <h3 className="text-lg font-semibold">Chat with an Expert</h3>
              <button
                onClick={toggleChatPanel}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Close chat panel"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Message Area */}
            <div 
              ref={chatContainerRef}
              className="flex-grow p-4 space-y-4 overflow-y-auto custom-scrollbar"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === "user"
                        ? "chat-user-message rounded-br-none"
                        : "chat-bot-message rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-medium">{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Scroll anchor */}
            </div>

            {/* Quick Action Buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-2">
              {[ "What is NoteNetra", "How does the NoteNetra device work", "What features does NoteNetra offer", "How can NoteNetra help my business", "Where can I buy the NoteNetra device" , "order device" ].map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => handleQuickOptionClick(option)}
                    className="px-3 py-1 rounded-full text-xs chat-quick-button hover:opacity-80 transition-colors"
                  >
                    {option}
                  </button>
                )
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex space-x-2 bg-gray-50 dark:bg-gray-800">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 chat-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Agent Icon and optional Greeting Bubble */}
      <AnimatePresence>
        {!isChatPanelOpen && !showGreetingBubble && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChatPanel}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            aria-label="Open chat"
          >
            <AnimatePresence mode="wait">
              {isHovered ? (
                <motion.div
                  key="message"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon name="MessageCircle" size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon name="MessageCircle" size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatWidget;
