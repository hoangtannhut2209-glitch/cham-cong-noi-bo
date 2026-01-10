
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

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, collapsed, onToggle, t, settings, onUpdateLogo }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = user.role === 'Admin';

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: 'fa-calendar-check' },
    { id: 'batch', label: t('batch'), icon: 'fa-users-rectangle' },
    { id: 'timeline', label: t('timeline'), icon: 'fa-calendar-days' },
    { id: 'statistics', label: t('statistics'), icon: 'fa-chart-simple' },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'employees', label: t('employees'), icon: 'fa-user-group' });
    menuItems.push({ id: 'settings', label: t('settings'), icon: 'fa-sliders' });
  }

  return (
    <aside className={`fixed lg:relative bg-white border-r-2 border-slate-100 flex flex-col h-full shadow-[20px_0_60px_rgba(0,0,0,0.02)] transition-all duration-500 ease-in-out z-40 ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-28' : 'translate-x-0 w-80'}`}>
      <button 
        onClick={onToggle} 
        className="absolute -right-4 top-10 w-8 h-8 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-orange-500 shadow-xl z-50 transition-all hidden lg:flex"
      >
        <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-[10px]`}></i>
      </button>

      <div className={`p-8 flex flex-col items-center gap-4 transition-all ${collapsed ? 'px-4' : ''}`}>
        <div className={`w-full aspect-[2/1] bg-slate-50 rounded-[2rem] border-2 border-slate-100 flex items-center justify-center p-4 relative group cursor-pointer ${collapsed ? 'scale-75' : 'hover:shadow-lg'}`}>
          {settings.customLogo ? (
            <img src={settings.customLogo} className="max-w-full max-h-full object-contain" alt="" />
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-slate-900 tracking-tighter">HMH</span>
              {!collapsed && <span className="text-[7px] font-black text-orange-500 uppercase tracking-[0.4em]">Manuscript</span>}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-6 mt-4 space-y-2 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-4 rounded-[1.5rem] transition-all duration-300 ${activeTab === item.id ? 'bg-slate-900 text-white shadow-[0_15px_30px_rgba(0,0,0,0.2)]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'} ${collapsed ? 'justify-center px-0' : ''}`}
          >
            <i className={`fa-solid ${item.icon} text-lg w-6 shrink-0`}></i>
            {!collapsed && <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>}
          </button>
        ))}
      </nav>
      
      {!collapsed && (
        <div className="p-8">
           <div className="p-6 bg-[#fdfbf7] rounded-[2rem] border-2 border-slate-100 text-center space-y-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-orange-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <p className="text-[9px] font-black text-slate-800 uppercase tracking-[0.3em]">HMH Assistant</p>
              <div className="flex items-center justify-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <p className="text-[8px] font-bold text-slate-400 italic">Curated by Lucas</p>
              </div>
           </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
