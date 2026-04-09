import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  return (
    <div className="animate-bounce-in transition-all duration-500">
      <div className="relative bg-red-950/90 border-2 border-red-500 p-4 rounded-bl-xl rounded-tr-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-3 min-w-[280px] overflow-hidden group">
        
        {/* Línea de escaneo animada */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent h-1 w-full animate-scan"></div>
        
        <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-bold">
          !
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-red-400 font-bold uppercase italic">System Alert</span>
          <p className="text-white text-[11px] font-mono tracking-widest uppercase">
            {message}
          </p>
        </div>

        <button 
          onClick={onClose} 
          className="ml-auto text-red-500 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;