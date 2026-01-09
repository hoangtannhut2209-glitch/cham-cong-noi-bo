
import React, { useRef } from 'react';
import { User, AppSettings } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  user: User;
  collapsed: boolean;
  onToggle: () => void;
  t: (key: any) => string;
  settings: AppSettings;
  onUpdateLogo: (base64: string) => void;
}

const CompanyLogoDefault = () => (
  <svg viewBox="0 0 300 120" className="w-full h-full drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(40, 30)">
      <path d="M15 5 C15 5 18 10 18 15 L18 65 C18 70 12 75 5 75" stroke="#B91C1C" strokeWidth="12" strokeLinecap="round" />
      <path d="M18 42 L48 42" stroke="#B91C1C" strokeWidth="8" />
      <path d="M48 10 L48 70" stroke="#7F1D1D" strokeWidth="10" strokeLinecap="round" />
    </g>
    <g transform="translate(100, 20)">
      <path d="M-20 45 C20 10 70 10 100 45 C130 10 180 10 220 45 C180 35 130 35 100 65 C70 35 20 35 -20 45Z" fill="#2D2E45" filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))" />
    </g>
    <g transform="translate(200, 30)">
      <path d="M10 10 L10 75" stroke="#1E3A8A" strokeWidth="14" strokeLinecap="round" opacity="0.9" />
      <path d="M10 42 L45 42" stroke="#3B82F6" strokeWidth="6" />
      <path d="M45 10 L45 75" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" />
    </g>
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, collapsed, onToggle, t, settings, onUpdateLogo }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = user.role === 'Admin';

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: 'fa-calendar-check' },
    { id: 'batch', label: t('batch'), icon: 'fa-users-rectangle' },
    { id: 'timeline', label: t('timeline'), icon: 'fa-calendar-days' },
    { id: 'statistics', label: t('statistics'), icon: 'fa-chart-simple' },
  ];

  if (user.role === 'Admin') {
    menuItems.push({ id: 'employees', label: t('employees'), icon: 'fa-list-ul' });
    menuItems.push({ id: 'settings', label: t('settings'), icon: 'fa-sliders' });
  }

  const handleLogoClick = () => {
    if (isAdmin) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className={`fixed lg:relative bg-white border-r border-slate-100 flex flex-col h-full shadow-2xl transition-all duration-300 ease-in-out z-40 ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-24' : 'translate-x-0 w-72'}`}>
      <button 
        onClick={onToggle} 
        className={`absolute -right-4 top-10 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-orange-500 shadow-lg z-50 transition-transform hover:scale-110 hidden lg:flex`}
      >
        <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-[10px]`}></i>
      </button>

      <div className={`p-6 flex flex-col items-center gap-2 transition-all duration-300 ${collapsed ? 'px-2' : ''}`}>
        <div 
          onClick={handleLogoClick}
          className={`w-full aspect-[2.5/1] flex items-center justify-center transition-all relative group cursor-pointer ${collapsed ? 'scale-75' : 'hover:scale-105'}`}
        >
          {settings.customLogo ? (
            <img src={settings.customLogo} alt="Company Logo" className="max-w-full max-h-full object-contain" />
          ) : (
            <CompanyLogoDefault />
          )}
          
          {isAdmin && (
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
              <i className="fa-solid fa-camera text-slate-400 text-lg"></i>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>
        {!collapsed && (
          <div className="flex flex-col items-center">
            <span className="font-black text-sm tracking-tight text-slate-800 leading-none uppercase">CHẤM CÔNG - HMH</span>
            <span className="text-[9px] text-orange-500 font-black uppercase tracking-[0.3em] mt-1">Time Assistant</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 mt-6 overflow-y-auto scrollbar-none">
        <ul className="space-y-1.5">
          {menuItems.map((item) => (
            <li key={item.id} className="relative group">
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-slate-900 text-white shadow-xl translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-orange-600'} ${collapsed ? 'justify-center' : ''}`}
              >
                <i className={`fa-solid ${item.icon} text-lg w-6 text-center shrink-0`}></i>
                {!collapsed && <span className="font-bold text-sm tracking-wide whitespace-nowrap">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {!collapsed && (
        <div className="p-6 mt-auto">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center group cursor-default space-y-0.5">
            <p className="text-[10px] text-slate-800 font-black uppercase tracking-widest group-hover:text-orange-500 transition-colors">CHẤM CÔNG - HMH</p>
            <p className="text-[9px] font-bold text-slate-500 italic">by Lucas Hoang</p>
            <p className="text-[8px] font-black text-slate-400 tracking-tighter">@2026 1.0</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
