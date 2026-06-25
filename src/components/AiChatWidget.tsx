import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, HelpCircle, CornerDownLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "### **Welcome to DESHWAL WEB TECHNOLOGIES!**\n\nI am **Deshwal AI**, your interactive digital technology consultant. We specialize in custom web software, full-stack e-commerce stores, responsive mobile applications, and advanced technical SEO campaigns.\n\nHow can we help you transform your business ideas today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: 'Explore Services', prompt: 'Tell me about all the services Deshwal Web Technologies offers.' },
    { label: 'View Pricing Plans', prompt: 'What are your pricing plans for website development?' },
    { label: 'Book a Consultation', prompt: 'How can I schedule a consultation call with your development team?' },
    { label: 'Contact Details', prompt: 'Provide the official phone number and email for Deshwal Web Technologies.' }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 11),
      role: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Map history format safely
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history })
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: 'msg_' + Math.random().toString(36).substring(2, 11),
          role: 'model',
          text: data.response
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error();
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_err_' + Math.random().toString(36).substring(2, 11),
          role: 'model',
          text: "I apologize, but I encountered a temporary connection issue. Please feel free to reach out to our team directly at **+91 9389667600** or email **deshwalmohit.81@gmail.com**!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe markdown simplifier for chat bubbles (renders headers, list items and links beautifully)
  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      
      // Headers
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="font-display font-semibold text-white text-sm mt-3 mb-1">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="font-display font-semibold text-white text-base mt-4 mb-2">{trimmed.replace('##', '').trim()}</h3>;
      }
      
      // List items
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        return (
          <div key={idx} className="flex items-start space-x-2 pl-2 my-1 text-slate-300">
            <span className="text-violet-400 mt-1 shrink-0">•</span>
            <span>{processInlineMarkdown(trimmed.substring(1).trim())}</span>
          </div>
        );
      }

      if (/^\d+\./.test(trimmed)) {
        const num = trimmed.match(/^\d+\./)?.[0] || '';
        return (
          <div key={idx} className="flex items-start space-x-2 pl-2 my-1 text-slate-300">
            <span className="text-violet-400 font-semibold font-mono shrink-0">{num}</span>
            <span>{processInlineMarkdown(trimmed.replace(/^\d+\./, '').trim())}</span>
          </div>
        );
      }

      // Default paragraph
      if (!trimmed) return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-slate-300 leading-relaxed text-xs my-1">{processInlineMarkdown(trimmed)}</p>;
    });
  };

  const processInlineMarkdown = (text: string) => {
    // Bold matching
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      // Link rendering [text](url)
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      const match = linkRegex.exec(part);
      if (match) {
        return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{match[1]}</a>;
      }
      return part;
    });
  };

  return (
    <div id="ai-chat-assistant-widget" className="fixed bottom-6 right-6 z-40 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-32px)] h-[550px] mb-4 flex flex-col overflow-hidden glass-panel-heavy"
          >
            {/* Header */}
            <div className="bg-neutral-900 px-4 py-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white relative">
                  <Bot className="w-5 h-5 animate-pulse" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-neutral-950" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
                    <span>Deshwal AI Assistant</span>
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  </h3>
                  <p className="text-[10px] text-slate-400">Software Solutions Agent</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-neutral-950/40 border border-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-tr-none'
                        : 'bg-neutral-900 border border-neutral-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'model' ? formatText(msg.text) : <p>{msg.text}</p>}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick options panel when messages are short */}
            <div className="px-3 pb-2 pt-1 border-t border-neutral-900 flex flex-wrap gap-1.5 bg-neutral-950/40">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.prompt)}
                  className="text-[10px] text-slate-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800/80 px-2.5 py-1.5 rounded-full transition-colors font-medium tracking-wide flex items-center space-x-1"
                >
                  <HelpCircle className="w-3 h-3 text-violet-400 shrink-0" />
                  <span>{q.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask Deshwal AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 text-white p-2.5 rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-violet-600 via-blue-600 to-fuchsia-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 cursor-pointer border border-white/10 relative group"
        >
          <span className="absolute right-full mr-3 bg-neutral-900 border border-neutral-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap font-medium tracking-wide">
            Consult Deshwal AI
          </span>
          <Bot className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
}
