
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { User, AttendanceRecord, AppSettings, ThemeType } from './types';
import { calculateOT, formatDate } from './utils';
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
import FeedbackOverlay from './components/FeedbackOverlay';

const INITIAL_USERS: User[] = [
  { id: 'ADM001', name: 'Lucas Hoàng', role: 'Admin', department: 'Executive', username: 'lucashoang', password: '123456' },
  { id: 'NV001', name: 'Nhân Viên Mẫu', role: 'User', department: 'C/O', username: 'user01', password: '1' },
];

const DEFAULT_SETTINGS: AppSettings = {
  defaultClockIn: '08:00',
  defaultClockOut: '17:00',
  lunchStart: '11:45',
  lunchEnd: '13:15',
  departments: ['C/O', 'HR', 'IT', 'Accountant', 'Logistics', 'Delivery', 'Warehouse', 'Marketing', 'Customer Support'],
  theme: 'Default',
  language: 'vi',
  primaryColor: '#1e293b',
  accentColor: '#f97316'
};

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-[#fdfbf7] p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-orange-500/20 flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        <i className="fa-solid fa-raccoon absolute inset-0 flex items-center justify-center text-orange-500 text-xl animate-bounce"></i>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] mb-1">Đang sao chép bản thảo...</p>
        <p className="text-[8px] font-bold text-slate-400 italic">Raccoon Intern is processing your request</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; subMessage?: string; type: 'in' | 'out' } | null>(null);
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hmh_users_v5');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('hmh_settings_v5');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'batch' | 'timeline' | 'statistics' | 'employees' | 'settings'>('dashboard');
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('hmh_records_v5');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);

  const t = (key: keyof typeof translations['vi']) => translations[settings.language][key] || key;

  useEffect(() => {
    const splashTimer = setTimeout(() => setIsSplashVisible(false), 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    localStorage.setItem('hmh_users_v5', JSON.stringify(users));
    localStorage.setItem('hmh_settings_v5', JSON.stringify(settings));
    localStorage.setItem('hmh_records_v5', JSON.stringify(records));
  }, [users, settings, records]);

  const handleLogin = (username: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setGlobalLoading(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setGlobalLoading(false);
    }, 800);
  };

  const handleClockIn = (time?: string, note?: string) => {
    const now = new Date();
    const timeStr = time || format(now, 'HH:mm');
    const dateStr = formatDate(now);
    if (records.find(r => r.date === dateStr && r.userId === currentUser.id)) return;

    const newRecord: AttendanceRecord = {
      id: `REC-${Date.now()}`,
      userId: currentUser.id,
      date: dateStr,
      clockIn: timeStr,
      clockOut: null,
      otHours: 0,
      status: 'Present',
      note: note
    };
    setRecords(prev => [...prev, newRecord]);
    
    setFeedback({
      message: `Chấm công thành công lúc ${timeStr}!`,
      subMessage: "Cảm ơn bạn. Chúc bạn một ngày làm việc tuyệt vời!",
      type: 'in'
    });
  };

  const handleClockOut = (time?: string, note?: string) => {
    const now = new Date();
    const timeStr = time || format(now, 'HH:mm');
    const dateStr = formatDate(now);
    
    let otValue = 0;
    setRecords(prev => prev.map(r => {
      if (r.userId === currentUser.id && r.date === dateStr && !r.clockOut) {
        otValue = calculateOT(timeStr);
        return { ...r, clockOut: timeStr, otHours: otValue, note: note || r.note };
      }
      return r;
    }));

    setFeedback({
      message: `Chấm công thành công lúc ${timeStr}!`,
      subMessage: otValue > 0 
        ? `Bạn đã làm thêm ${otValue} giờ hôm nay. Tuyệt vời!` 
        : "Đã ghi nhận. Cảm ơn bạn và hẹn gặp lại ngày mai!",
      type: 'out'
    });
  };

  const getThemeVars = (theme: ThemeType) => {
    switch (theme) {
      case 'NationalDay': return 'theme-national bg-red-50/20';
      case 'Tet': return 'theme-tet bg-yellow-50/20';
      case 'Noel': return 'theme-noel bg-emerald-50/20';
      case 'Liberation': return 'theme-liberation bg-blue-50/20';
      default: return 'theme-default bg-[#fdfbf7]';
    }
  };

  if (isSplashVisible) return <SplashScreen />;
  if (!isAuthenticated) return <Login onLogin={handleLogin} t={t} />;

  return (
    <div className={`flex h-screen overflow-hidden font-sans ${getThemeVars(settings.theme)}`}>
      {globalLoading && <LoadingOverlay />}
      {feedback && (
        <FeedbackOverlay 
          message={feedback.message} 
          subMessage={feedback.subMessage} 
          type={feedback.type} 
          onClose={() => setFeedback(null)} 
        />
      )}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        t={t}
        settings={settings}
        onUpdateLogo={(logo) => setSettings({...settings, customLogo: logo})}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-xl border-b-2 border-slate-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-20 shadow-sm transition-all duration-500">
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-2 text-slate-500" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <i className="fa-solid fa-bars-staggered text-xl"></i>
            </button>
            <div className="hidden md:flex flex-col">
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                CHẤM CÔNG <span className="text-orange-500">-</span> HMH
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.4em]">Manuscript v5.0</span>
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                <span className="text-[8px] text-emerald-600 font-black uppercase tracking-[0.2em]">Secure Link</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-900 text-white rounded-2xl flex items-center gap-4 shadow-xl border border-white/10 group cursor-default">
              <div className="text-right">
                <p className="text-xs font-black leading-none">{currentUser.name}</p>
                <p className="text-[8px] text-orange-400 font-black uppercase tracking-widest mt-1">{currentUser.role}</p>
              </div>
              <div onClick={handleLogout} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-all cursor-pointer">
                <i className="fa-solid fa-feather-pointed"></i>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scrollbar-thin relative scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-forwards">
                {activeTab === 'dashboard' && <Dashboard user={currentUser} records={records} onClockIn={handleClockIn} onClockOut={handleClockOut} t={t} />}
                {activeTab === 'batch' && <BatchAttendance user={currentUser} users={users} onBatchMark={() => {}} departments={settings.departments} />}
                {activeTab === 'timeline' && <Timeline user={currentUser} records={records} allUsers={users} settings={settings} />}
                {activeTab === 'statistics' && <Report user={currentUser} records={records} users={users} t={t} />}
                {activeTab === 'employees' && currentUser.role === 'Admin' && <UserManagement users={users} setUsers={setUsers} departments={settings.departments} />}
                {activeTab === 'settings' && currentUser.role === 'Admin' && <Settings settings={settings} setSettings={setSettings} t={t} />}
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        body { background: #fdfbf7; }
        .theme-default { --brand-primary: #1e293b; --brand-secondary: #f97316; }
        .bg-slate-900 { background: var(--brand-primary) !important; }
        .text-orange-500 { color: var(--brand-secondary) !important; }
        .bg-orange-500 { background: var(--brand-secondary) !important; }
      `}</style>
    </div>
  );
};

export default App;
