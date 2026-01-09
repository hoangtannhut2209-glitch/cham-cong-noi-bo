
import React from 'react';

const DynamicsAnimation = () => (
  <div className="relative w-64 h-64 flex items-center justify-center">
    {/* Dynamic Background Lines */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-orange-500/20 h-px w-full origin-left animate-in slide-in-from-left duration-[2000ms] ease-out"
          style={{
            top: `${15 + i * 15}%`,
            left: '-10%',
            transform: `rotate(${Math.sin(i) * 10}deg)`,
            animationDelay: `${i * 200}ms`
          }}
        />
      ))}
    </div>

    {/* Stylized Logo Element */}
    <div className="relative z-10 animate-in zoom-in-50 duration-1000">
      <svg viewBox="0 0 100 100" className="w-40 h-40">
        <rect
          x="20" y="20" width="60" height="60"
          className="fill-none stroke-orange-500 stroke-[2] animate-pulse"
          rx="8"
        />
        <path
          d="M20 50 L80 50 M50 20 L50 80"
          className="stroke-orange-500/30 stroke-[1]"
        />
        <g className="animate-in fade-in zoom-in duration-1000 delay-500 fill-mode-forwards opacity-0">
          <text x="50" y="55" textAnchor="middle" className="fill-white font-black text-2xl tracking-tighter">HMH</text>
        </g>
      </svg>
    </div>
    
    {/* Floating Elements (representing time/tasks) */}
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-orange-500 rounded-full blur-[1px]"
        style={{
          animation: `itemFlow ${3 + i}s infinite linear`,
          top: `${20 + i * 20}%`,
          left: '-20px'
        }}
      />
    ))}
    
    <style>{`
      @keyframes itemFlow {
        0% { transform: translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateX(300px); opacity: 0; }
      }
    `}</style>
  </div>
);

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center animate-out fade-out duration-1000 delay-[2500ms] fill-mode-forwards">
      <DynamicsAnimation />
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="overflow-hidden">
          <h1 className="text-white font-black text-4xl tracking-tight uppercase opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-forwards flex items-center gap-4">
            <span>CHẤM CÔNG</span>
            <span className="text-orange-500 font-light translate-y-[-2px]">-</span>
            <span className="text-orange-500">HMH</span>
          </h1>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full opacity-0 animate-in fade-in duration-1000 delay-1000 fill-mode-forwards"></div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] opacity-0 animate-in fade-in duration-1000 delay-1200 fill-mode-forwards mt-2">
          TIME ASSISTANT SYSTEM
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
