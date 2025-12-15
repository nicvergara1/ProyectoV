'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <div 
        className={`
          w-[calc(100vw-2rem)] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col 
          transition-all duration-300 origin-bottom-right
          ${isOpen 
            ? 'h-[500px] sm:h-[600px] opacity-100 translate-y-0 mb-4 pointer-events-auto' 
            : 'h-0 opacity-0 translate-y-4 mb-0 pointer-events-none'
          }
        `}
      >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center shadow-md shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-white font-semibold text-sm tracking-wide">Asistente Virtual</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Chat Content */}
          <div className="flex-1 bg-slate-50 relative">
            <iframe
              src="/n8n-chat"
              className="absolute inset-0 w-full h-full border-none"
              title="Chatbot"
            />
          </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 
          focus:outline-none focus:ring-4 focus:ring-blue-200
          ${isOpen 
            ? 'bg-slate-100 text-slate-600 rotate-90' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-blue-500/25'
          }
        `}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
