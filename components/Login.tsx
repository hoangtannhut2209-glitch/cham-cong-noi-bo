
import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: (username: string) => void;
  t: (key: any) => string;
}

type AuthState = 'login' | 'register' | 'forgot';

const StaticTitle = () => {
  return (
    <div className="relative py-8 h-auto flex flex-col items-center justify-center overflow-hidden">
      {/* Main Title - Primary Focus */}
      <div className="relative z-10 text-center animate-in fade-in zoom-in duration-1000 w-full">
        <h1 className="text-[clamp(18px,3.8vw,40px)] font-black uppercase text-white drop-shadow-2xl whitespace-nowrap leading-none tracking-tight flex flex-nowrap items-center justify-center gap-[clamp(3px,0.8vw,8px)] mx-auto px-4">
          <span>CHẤM CÔNG</span>
          <span className="text-orange-500 font-light translate-y-[-2px]">-</span>
          <span className="text-orange-500">HMH</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mt-3 rounded-full opacity-50 animate-pulse"></div>
      </div>

      {/* Background Kinetic Text - Adjusted slogan, much smaller size, optimized for diacritics */}
      <div className="relative h-6 flex items-center justify-center overflow-hidden w-full mt-2">
        <div className="animate-marquee-slow whitespace-nowrap text-[9px] md:text-[10px] font-bold text-white/40 select-none uppercase tracking-[0.3em]">
          ĐOÀN KẾT &nbsp;&ndash;&nbsp; NHIỆT HUYẾT &nbsp;&ndash;&nbsp; THÀNH CÔNG &nbsp;&nbsp;&bull;&nbsp;&nbsp; ĐOÀN KẾT &nbsp;&ndash;&nbsp; NHIỆT HUYẾT &nbsp;&ndash;&nbsp; THÀNH CÔNG &nbsp;&nbsp;&bull;&nbsp;&nbsp; ĐOÀN KẾT &nbsp;&ndash;&nbsp; NHIỆT HUYẾT &nbsp;&ndash;&nbsp; THÀNH CÔNG &nbsp;&nbsp;&bull;&nbsp;&nbsp;
        </div>
      </div>

      <style>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 25s linear infinite;
          line-height: 2; /* Đảm bảo đủ không gian cho dấu tiếng Việt */
        }
      `}</style>
    </div>
  );
};

const InteractiveBackground = () => (
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    <div className="w-full h-full" style={{ 
      backgroundImage: 'radial-gradient(rgba(249, 115, 22, 0.15) 1px, transparent 1px)', 
      backgroundSize: '30px 30px' 
    }}></div>
    {/* Floating Data Nodes */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-orange-500/50 to-transparent animate-float-line"
          style={{
            left: `${15 + i * 20}%`,
            top: '-10%',
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${10 + i * 2}s`
          }}
        />
      ))}
    </div>
    <style>{`
      @keyframes float-line {
        0% { transform: translateY(-100%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(1000%); opacity: 0; }
      }
      .animate-float-line {
        animation: float-line linear infinite;
      }
    `}</style>
  </div>
);

const Login: React.FC<LoginProps> = ({ onLogin, t }) => {
  const [state, setState] = useState<AuthState>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (state === 'login') {
        onLogin(username);
      } else {
        setState('login');
      }
      setLoading(false);
    }, 1500);
  };

  const renderForm = () => {
    switch (state) {
      case 'register':
        return (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="space-y-3">
              <input 
                type="text" required placeholder={t('fullNameLabel')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-500 font-bold"
              />
              <input 
                type="text" required placeholder={t('usernameLabel')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-500 font-bold"
              />
              <input 
                type="password" required placeholder={t('passwordLabel')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-500 font-bold"
              />
              <input 
                type="password" required placeholder={t('confirmPasswordLabel')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-500 font-bold"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/30 transition-all active:scale-95 mt-6"
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : t('registerBtn')}
            </button>
            <div className="text-center pt-6">
              <button type="button" onClick={() => setState('login')} className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
                {t('backToLogin')}
              </button>
            </div>
          </form>
        );
      case 'forgot':
        return (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <p className="text-slate-400 text-xs text-center leading-relaxed font-bold px-4">
                {t('forgotSubtitle')}
              </p>
              <input 
                type="email" required placeholder={t('emailLabel')}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-500 font-bold"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 transition-all active:scale-95"
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : t('resetBtn')}
            </button>
            <div className="text-center pt-6">
              <button type="button" onClick={() => setState('login')} className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
                {t('backToLogin')}
              </button>
            </div>
          </form>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-700">
            <div className="space-y-4">
              <div className="relative group">
                <i className="fa-solid fa-user-ninja absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-orange-500"></i>
                <input 
                  type="text" required placeholder={t('usernameLabel')}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-500 font-bold"
                  value={username} onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="relative group">
                <i className="fa-solid fa-key absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-orange-500"></i>
                <input 
                  type="password" required placeholder={t('passwordLabel')}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-500 font-bold"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setState('forgot')} className="text-[9px] font-black text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-[0.3em]">
                  {t('forgotLink')}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-5 font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/40 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : t('loginBtn')}
            </button>

            <div className="text-center pt-4">
              <p className="text-[10px] font-bold text-slate-500 tracking-wider">
                {t('noAccount')}{' '}
                <button type="button" onClick={() => setState('register')} className="text-orange-500 hover:text-orange-400 transition-colors font-black uppercase">
                  {t('registerBtn')}
                </button>
              </p>
            </div>
          </form>
        );
    }
  };

  const getTitle = () => {
    if (state === 'register') return t('registerTitle');
    if (state === 'forgot') return t('forgotTitle');
    return t('loginTitle');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-orange-500/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
        <InteractiveBackground />
      </div>

      <div className="relative w-full max-w-[500px] animate-in slide-in-from-bottom-16 fade-in duration-1000 ease-out">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 md:p-14 rounded-[3rem] md:rounded-[4rem] shadow-[0_32px_100px_rgba(0,0,0,0.5)]">
          <StaticTitle />
          
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
              {getTitle()}
            </h2>
          </div>

          <div className="min-h-[300px] md:min-h-[320px]">
            {renderForm()}
          </div>

          <div className="text-center mt-8 md:mt-12">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">SECURE ACCESS v4.2 • HMH</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
