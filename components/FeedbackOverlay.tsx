
import React, { useEffect, useState } from 'react';

interface FeedbackOverlayProps {
  message: string;
  subMessage?: string;
  type: 'in' | 'out';
  onClose: () => void;
}

const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ message, subMessage, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Exit animation starts slightly before auto-dismiss
    const exitTimer = setTimeout(() => setIsExiting(true), 4300);
    const closeTimer = setTimeout(onClose, 5000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className={`fixed top-10 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none transition-all duration-700 ${isExiting ? 'opacity-0 -translate-y-12 scale-95' : 'animate-in fade-in slide-in-from-top-12 duration-1000'}`}>
      <div className="bg-white/90 backdrop-blur-3xl border border-white/40 shadow-[0_40px_100px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-6 md:p-8 flex items-center gap-6 max-w-lg w-full pointer-events-auto relative overflow-hidden group">
        {/* Animated Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-slate-100/50">
          <div className={`h-full ${type === 'in' ? 'bg-emerald-500' : 'bg-orange-500'} animate-[progress_5s_linear_forwards]`}></div>
        </div>

        {/* Decorative Background Icon */}
        <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 select-none">
           <i className={`fa-solid ${type === 'in' ? 'fa-sun' : 'fa-moon'} text-[12rem] animate-[spin_20s_linear_infinite]`}></i>
        </div>

        <div className={`w-16 h-16 shrink-0 rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-xl transition-transform duration-500 hover:rotate-12 ${type === 'in' ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-orange-500 shadow-orange-500/30'}`}>
          <i className={`fa-solid ${type === 'in' ? 'fa-fingerprint' : 'fa-check-double'} animate-in zoom-in duration-500 delay-300`}></i>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${type === 'in' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Trợ Lý Thông Minh</p>
          </div>
          <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none">
            {message}
          </h4>
          {subMessage && (
            <p className="text-sm font-medium text-slate-500 italic leading-snug">
              {subMessage}
            </p>
          )}
        </div>

        <button 
          onClick={() => { setIsExiting(true); setTimeout(onClose, 700); }}
          className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-300 transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <style>{`
        @keyframes progress { from { width: 100%; } to { width: 0%; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FeedbackOverlay;
