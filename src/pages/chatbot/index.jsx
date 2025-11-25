import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';

// UI strings (no preset answers)
const translations = {
  en: {
    title: "AI Chatbot",
    welcome: "Welcome to the NoteNetra AI Chatbot. Ask anything related to NoteNetra project, business, finance, accounting, and compliance for Indian MSMEs.",
    placeholder: "Type your question here...",
    send: "Send",
    language: "Language:"
  },
  hi: { // Hindi
    title: "एआई चैटबॉट",
    welcome: "नोटनेत्रा एआई चैटबॉट में आपका स्वागत है। NoteNetra प्रोजेक्ट, भारतीय MSME बिज़नेस, फाइनेंस, अकाउंटिंग और कंप्लायंस से जुड़े सवाल पूछें।",
    placeholder: "अपना प्रश्न यहां टाइप करें...",
    send: "भेजें",
    language: "भाषा:"
  }
};

const ChatbotPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const t = translations[currentLanguage];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const systemPrompt = useMemo(() => {
    const english = `You are NoteNetra's AI assistant. Your sole purpose is to provide highly accurate, actionable, and concise answers (6-10 sentences max, unless more detail is explicitly requested) related to NoteNetra's project, Indian MSME finance, business operations, and accounting. Focus strictly on:
    - NoteNetra Project Specifics (if data is provided or context is given)
    - Accounting (cash vs accrual, ledgers, reconciliation, invoice best-practices, financial statements)
    - Finance & Lending (MSME loans, working capital, credit score factors, documentation, investment basics for MSMEs)
    - Compliance & Taxes (GST - GSTR-1, GSTR-3B, input tax credit, registration, composition vs regular, e-invoicing; TDS/TCS basics, due dates, turnover thresholds)
    - Business Operations (inventory management, pricing strategies, margin calculation, basic CAC/LTV, operational efficiency)
    Rules: If a question falls outside these specific domains, you MUST politely refuse to answer and state that you can only assist with NoteNetra project, finance, and accounting related queries. Avoid generic information, always prioritize project-specific context, do not answer questions outside these domains. Include disclaimers when needed, ask clarifying questions if the query is broad, and prefer examples with INR.`;
    const hindi = `आप NoteNetra के एआई सहायक हैं। आपका एकमात्र उद्देश्य NoteNetra प्रोजेक्ट, भारतीय MSME फाइनेंस, बिज़नेस ऑपरेशन और अकाउंटिंग से संबंधित अत्यधिक सटीक, कार्यवाही योग्य और संक्षिप्त उत्तर (अधिकतम 6-10 वाक्य, जब तक कि स्पष्ट रूप से अधिक विवरण का अनुरोध न किया जाए) प्रदान करना है। सख्ती से इन पर ध्यान दें: NoteNetra प्रोजेक्ट विवरण (यदि डेटा या संदर्भ प्रदान किया गया है), अकाउंटिंग, फाइनेंस और लेंडिंग, कंप्लायंस और टैक्स, बिज़नेस ऑपरेशन। नियम: यदि कोई प्रश्न इन विशिष्ट डोमेन से बाहर आता है, तो आपको विनम्रतापूर्वक जवाब देने से इनकार करना चाहिए और यह बताना चाहिए कि आप केवल NoteNetra प्रोजेक्ट, फाइनेंस और अकाउंटिंग से संबंधित प्रश्नों में सहायता कर सकते हैं। सामान्य जानकारी से बचें, हमेशा प्रोजेक्ट-विशिष्ट संदर्भ को प्राथमिकता दें, इन डोमेन के बाहर के सवालों का जवाब न दें। आवश्यकता पड़ने पर अस्वीकरण शामिल करें, यदि प्रश्न व्यापक हो तो स्पष्टीकरण के लिए पूछें, और INR में उदाहरणों को प्राथमिकता दें।`;
    return currentLanguage === 'hi' ? hindi : english;
  }, [currentLanguage]);

  const suggestedPrompts = useMemo(() => ([
    'What is the core functionality of NoteNetra?',
    'How does NoteNetra help with GST filing for MSMEs?',
    'Explain the impact of credit score on MSME loan eligibility in India.',
    'What are the key differences between cash basis and accrual basis accounting?',
    'How can I improve my business\'s cash flow using NoteNetra features?',
  ]), []);


  // Removed custom fallback endpoint; Gemini is the sole source for answers

  const callGeminiAI = async (userText, history) => {
    const apiKey = import.meta?.env?.VITE_GEMINI_API_KEY || 'AIzaSyBNIQxuEHEQvP1JZIloAI0WFNIP2EWqhj8';

    const preferred = import.meta?.env?.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
    const candidateModels = [preferred, 'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro'];

    const contents = [];
    history.forEach(m => {
      contents.push({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] });
    });
    contents.push({ role: 'user', parts: [{ text: userText }] });

    let lastError = null;
    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.2, topP: 0.9, topK: 40, maxOutputTokens: 1024 }
          })
        });
        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} ${res.statusText} ${errText}`);
        }
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text || !text.trim()) throw new Error('Empty response');
        return text;
      } catch (err) {
        lastError = err;
        continue;
      }
    }
    throw lastError || new Error('Gemini request failed');
  };

  // Removed all rule-based preset answers; Gemini generates all responses

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    setError('');
    const userText = input;
    const newUserMessage = { text: userText, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiReply = await callGeminiAI(userText, messages);
      setMessages(prev => [...prev, { text: aiReply, sender: 'bot' }]);
    } catch (e) {
      setError((currentLanguage === 'hi' ? 'एआई सेवा उपलब्ध नहीं है: ' : 'AI service is unavailable: ') + (e?.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <Helmet>
        <title>{t.title} - NoteNetra</title>
        <meta name="description" content="AI-powered chatbot for NoteNetra business and finance queries" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
          <p className="text-muted-foreground mb-6">{t.welcome}</p>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-sm">{t.language}</span>
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="px-3 py-1 border border-border rounded-md bg-background text-foreground"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col h-[60vh] bg-card rounded-lg shadow-lg border border-border">
          <div className="p-3 border-b border-border flex flex-wrap gap-2">
            {suggestedPrompts.map((sp, idx) => (
              <button
                key={idx}
                onClick={() => setInput(sp)}
                className="text-xs px-2 py-1 rounded-md bg-muted-foreground/20 hover:bg-muted-foreground/30 text-foreground"
              >
                {sp}
              </button>
            ))}
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg max-w-[70%] ${msg.sender === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-muted/20 text-foreground'}`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto bg-muted/20 text-foreground p-3 rounded-lg max-w-[70%]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
          </div>
          <div className="p-4 border-t border-border flex space-x-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (currentLanguage === 'hi' ? 'सोच रहा/रही…' : 'Thinking…') : t.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
