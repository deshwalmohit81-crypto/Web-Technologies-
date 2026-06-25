import { useState } from 'react';
import { PhoneCall, MessageCircle, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = '919389667600';
  const customMessage = 'Hello DESHWAL WEB TECHNOLOGIES, I visited your website and would like to inquire about your software development services.';

  const handleOpenChat = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div id="whatsapp-floating-widget" className="fixed bottom-24 right-6 z-40 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 w-72 mb-4 relative overflow-hidden"
          >
            {/* Top green banner */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full bg-neutral-950/40 border border-neutral-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center space-x-3 mb-4 mt-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  WhatsApp Consultation
                </h4>
                <p className="text-xs text-emerald-400 font-mono">
                  Online • Typically replies instantly
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Connect directly with our lead solution architect, **Mohit Deshwal**, to fast-track your product discussion.
            </p>

            <button
              onClick={handleOpenChat}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
            >
              <span>Launch Chat</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 cursor-pointer border border-emerald-400/40 relative group"
      >
        <span className="absolute right-full mr-3 bg-neutral-900 border border-neutral-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap font-medium tracking-wide">
          Quick WhatsApp Chat
        </span>
        <PhoneCall className="w-6 h-6 animate-pulse" />
      </motion.button>
    </div>
  );
}
