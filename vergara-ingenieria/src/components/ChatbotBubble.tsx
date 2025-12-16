'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Establecer posición inicial
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 100,
      y: window.innerHeight - 100
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!position) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setHasMoved(false);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !position) return;
    
    setHasMoved(true);
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Limitar a los bordes de la ventana (con margen de 50px)
    const margin = 50;
    const maxX = window.innerWidth - margin;
    const maxY = window.innerHeight - margin;
    
    setPosition({
      x: Math.max(margin, Math.min(newX, maxX)),
      y: Math.max(margin, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Solo abrir/cerrar si no hubo movimiento (es decir, fue un click real)
    if (!hasMoved) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, position]);

  // No renderizar hasta tener posición
  if (!position) return null;

  return (
    <div 
      ref={bubbleRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Chat Window */}
      <div 
        className={`
          absolute bottom-16 right-0 w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col 
          transition-all duration-300 origin-bottom-right
          ${isOpen 
            ? 'h-[600px] opacity-100 scale-100 pointer-events-auto' 
            : 'h-0 opacity-0 scale-95 pointer-events-none'
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
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className={`
          p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 
          focus:outline-none focus:ring-4 focus:ring-blue-200
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${isOpen 
            ? 'bg-slate-100 text-slate-600' 
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
