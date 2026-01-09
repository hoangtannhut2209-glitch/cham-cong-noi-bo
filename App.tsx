
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, parseISO } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { User, AttendanceRecord, AppSettings, ThemeType, AttendanceStatus, Language } from './types';
import { calculateOT, calculateWorkHours, formatTime, formatDate } from './utils';
import { translations } from './translations';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import Report from './components/Report';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';
import BatchAttendance from './components/BatchAttendance';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';

const INITIAL_USERS: User[] = [
  { id: 'NV001', email: 'htnhut@company.com', name: 'Hoàng Tấn Nhựt', role: 'Admin', department: 'C/O', username: 'htnhut' },
  { id: 'NV002', email: 'vmquan@company.com', name: 'Võ Minh Quân', role: 'Admin', department: 'C/O', username: 'vmquan' },
];

const DEFAULT_SETTINGS: AppSettings = {
  defaultClockIn: '08:00',
  defaultClockOut: '17:00',
  lunchStart: '11:45',
  lunchEnd: '13:15',
  departments: ['C/O', 'HR', 'IT', 'Accountant'],
  theme: 'Default',
  language: 'vi',
  primaryColor: '#1e293b',
  accentColor: '#f97316'
};

const HeaderLogo = ({ customLogo }: { customLogo?: string }) => (
  <div className="w-12 md:w-20 transition-transform hover:scale-110 duration-500 shrink-0">
    {customLogo ? (
      <img src={customLogo} alt="Logo" className="max-w-full max-h-10 object-contain" />
    ) : (
      <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(40, 30)">
          <path d="M15 5 C15 5 18 10 18 15 L18 65 C18 70 12 75 5 75" stroke="#B91C1C" strokeWidth="12" strokeLinecap="round" />
          <path d="M18 42 L48 42" stroke="#B91C1C" strokeWidth="8" />
          <path d="M48 10 L48 70" stroke="#7F1D1D" strokeWidth="10" strokeLinecap="round" />
        </g>
        <g transform="translate(100, 20)">
          <path d="M-20 45 C20 10 70 10 100 45 C130 10 180 10 220 45 C180 35 130 35 100 65 C70 35 20 35 -20 45Z" fill="#2D2E45" />
        </g>
        <g transform="translate(200, 30)">
          <path d="M10 10 L10 75" stroke="#1E3A8A" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
          <path d="M10 42 L45 42" stroke="#3B82F6" stroke6="6" />
          <path d="M45 10 L45 75" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" />
        </g>
      </svg>
    )}
  </div>
);

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce delay-200"></div>
      </div>
      <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Đang cập nhật...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('attendance_users_v3');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('hmh_app_settings_v4');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'batch' | 'timeline' | 'statistics' | 'employees' | 'settings'>('dashboard');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);

  const t = (key: keyof typeof translations['vi']) => translations[settings.language][key] || key;

  useEffect(() => {
    const splashTimer = setTimeout(() => setIsSplashVisible(false), 3500);
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(splashTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('attendance_users_v3', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('hmh_app_settings_v4', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const stored = localStorage.getItem('attendance_records_v3');
    if (stored) setRecords(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('attendance_records_v3', JSON.stringify(records));
  }, [records]);

  const toggleLanguage = () => {
    setGlobalLoading(true);
    setTimeout(() => {
      setSettings(prev => ({ ...prev, language: prev.language === 'vi' ? 'en' : 'vi' }));
      setGlobalLoading(false);
    }, 800);
  };

  const handleLogin = (username: string) => {
    setGlobalLoading(true);
    setTimeout(() => {
      const user = users.find(u => u.username === username) || users[0];
      setCurrentUser(user);
      setIsAuthenticated(true);
      setGlobalLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setGlobalLoading(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setGlobalLoading(false);
    }, 800);
  };

  const updateLogo = (base64: string) => {
    setSettings(prev => ({ ...prev, customLogo: base64 }));
  };

  const handleClockIn = (time?: string) => {
    const now = new Date();
    const timeStr = time || format(now, 'HH:mm');
    const dateStr = formatDate(now);
    
    // Skip if already clocked in today
    if (records.find(r => r.date === dateStr && r.userId === currentUser.id)) return;

    const newRecord: AttendanceRecord = {
      id: `REC-${Date.now()}`,
      userId: currentUser.id,
      date: dateStr,
      clockIn: timeStr,
      clockOut: null,
      otHours: 0,
      status: 'Present'
    };
    
    setRecords(prev => [...prev, newRecord]);
  };

  const handleClockOut = (time?: string) => {
    const now = new Date();
    const timeStr = time || format(now, 'HH:mm');
    const dateStr = formatDate(now);
    
    setRecords(prev => prev.map(r => {
      if (r.userId === currentUser.id && r.date === dateStr && !r.clockOut) {
        const ot = calculateOT(timeStr);
        return { ...r, clockOut: timeStr, otHours: ot };
      }
      return r;
    }));
  };

  const getThemeVars = (theme: ThemeType) => {
    switch (theme) {
      case 'NationalDay': return 'theme-national bg-red-50/30';
      case 'Tet': return 'theme-tet bg-yellow-50/30';
      case 'Noel': return 'theme-noel bg-emerald-50/30';
      case 'Liberation': return 'theme-liberation bg-blue-50/30';
      case 'Custom': return 'theme-custom bg-slate-50';
      default: return 'theme-default bg-slate-50';
    }
  };

  if (isSplashVisible) return <SplashScreen />;

  if (!isAuthenticated) return <Login onLogin={handleLogin} t={t} />;

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-all duration-700 ${getThemeVars(settings.theme)}`}>
      {globalLoading && <LoadingOverlay />}
      
      {/* Mobile Sidebar Overlay */}
      {window.innerWidth < 1024 && !isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        ></div>
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (window.innerWidth < 1024) setIsSidebarCollapsed(true);
        }} 
        user={currentUser} 
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        t={t}
        settings={settings}
        onUpdateLogo={updateLogo}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 lg:h-24 bg-white/95 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 md:px-8 lg:px-12 sticky top-0 z-20 shadow-sm transition-all duration-500">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:text-orange-500 transition-colors"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <i className="fa-solid fa-bars-staggered text-xl"></i>
            </button>
            <HeaderLogo customLogo={settings.customLogo} />
            <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
            <div className="hidden md:flex flex-col">
              <h1 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight leading-none uppercase flex items-center gap-2">
                CHẤM CÔNG <span className="text-orange-500 font-light translate-y-[-1px]">-</span> <span className="text-orange-500">HMH</span>
              </h1>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] mt-1.5">{t(activeTab)} PORTAL</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm"
            >
              <i className="fa-solid fa-earth-americas"></i>
              <span className="hidden sm:inline">{settings.language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
              <span className="sm:hidden">{settings.language.toUpperCase()}</span>
            </button>

            <div className="flex items-center gap-2 md:gap-4">
              <div className={`px-2 lg:px-5 py-2 lg:py-2.5 bg-slate-100/50 rounded-2xl border border-slate-200/50 flex items-center gap-2 lg:gap-4 hover:shadow-md transition-all`}>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs lg:text-sm font-black text-slate-800 leading-none">{currentUser.name}</span>
                  <span className="text-[8px] lg:text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{currentUser.role}</span>
                </div>
                <div 
                  onClick={handleLogout}
                  title={t('logoutBtn')}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer bg-slate-900`}
                >
                  <i className="fa-solid fa-power-off"></i>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 scrollbar-thin relative scroll-smooth bg-slate-50/50">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
              {activeTab === 'dashboard' && (
                <Dashboard user={currentUser} records={records} onClockIn={handleClockIn} onClockOut={handleClockOut} t={t} />
              )}
              {activeTab === 'batch' && (
                <BatchAttendance user={currentUser} users={users} onBatchMark={() => {}} departments={settings.departments} t={t} />
              )}
              {activeTab === 'timeline' && (
                <Timeline user={currentUser} records={records} allUsers={users} settings={settings} />
              )}
              {activeTab === 'statistics' && (
                <Report user={currentUser} records={records} users={users} onExport={() => {}} t={t} />
              )}
              {activeTab === 'settings' && currentUser.role === 'Admin' && (
                <Settings settings={settings} setSettings={setSettings} t={t} />
              )}
              {activeTab === 'employees' && currentUser.role === 'Admin' && (
                <UserManagement users={users} setUsers={setUsers} departments={settings.departments} />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        :root {
          --brand-primary: ${settings.primaryColor || '#1e293b'};
          --brand-secondary: ${settings.accentColor || '#f97316'};
        }
        .theme-national { --brand-primary: #da251d; --brand-secondary: #fcd116; }
        .theme-tet { --brand-primary: #ef4444; --brand-secondary: #f59e0b; }
        .theme-noel { --brand-primary: #059669; --brand-secondary: #dc2626; }
        .theme-liberation { --brand-primary: #2563eb; --brand-secondary: #ef4444; }
        .theme-custom { --brand-primary: ${settings.primaryColor || '#1e293b'}; --brand-secondary: ${settings.accentColor || '#f97316'}; }

        .bg-orange-500 { background-color: var(--brand-secondary) !important; }
        .text-orange-500 { color: var(--brand-secondary) !important; }
        .border-orange-500 { border-color: var(--brand-secondary) !important; }
        .shadow-orange-100 { --tw-shadow-color: var(--brand-secondary); }
        .bg-slate-900 { background-color: var(--brand-primary) !important; }
        
        @keyframes clock-pulse {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(249, 115, 22, 0); }
          100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
        .clock-heartbeat {
          animation: clock-pulse 2s infinite;
        }

        .page-transition {
          animation: logisticsSlide 0.8s cubic-bezier(0.85, 0, 0.15, 1);
        }

        @keyframes logisticsSlide {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
