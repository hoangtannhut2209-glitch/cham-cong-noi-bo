
import React, { useState } from 'react';
import { AppSettings, ThemeType, Language } from '../types';

interface SettingsProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  t: (key: any) => string;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, t }) => {
  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const themes: { id: ThemeType; label: string; color: string }[] = [
    { id: 'Default', label: t('defaultTheme'), color: 'bg-slate-800' },
    { id: 'NationalDay', label: t('nationalDayTheme'), color: 'bg-red-600' },
    { id: 'Tet', label: t('tetTheme'), color: 'bg-orange-500' },
    { id: 'Noel', label: t('noelTheme'), color: 'bg-emerald-600' },
    { id: 'Liberation', label: t('liberationTheme'), color: 'bg-blue-600' },
    { id: 'Custom', label: 'Tùy chỉnh bảng màu', color: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-slate-600 shadow-xl border-b-4 border-slate-200">
          <i className="fa-solid fa-sliders text-2xl"></i>
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t('systemSettings')}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">HMH Admin Panel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] space-y-6">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-xs"><i className="fa-solid fa-clock"></i></span>
            {t('workHours')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t('checkIn')}</label>
              <input type="time" value={settings.defaultClockIn} onChange={(e) => updateSetting('defaultClockIn', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t('checkOut')}</label>
              <input type="time" value={settings.defaultClockOut} onChange={(e) => updateSetting('defaultClockOut', e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] space-y-6">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
             <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-xs"><i className="fa-solid fa-palette"></i></span>
            {t('themeSelection')}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {themes.map(th => (
              <button 
                key={th.id}
                onClick={() => updateSetting('theme', th.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${settings.theme === th.id ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30' : 'border-slate-50 hover:bg-slate-50'}`}
              >
                <div className={`w-6 h-6 rounded-full border border-white/20 shadow-sm ${th.color}`}></div>
                <span className="text-xs font-bold uppercase tracking-wide">{th.label}</span>
              </button>
            ))}
          </div>

          {settings.theme === 'Custom' && (
            <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Màu chính</label>
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <input 
                      type="color" 
                      value={settings.primaryColor || '#1e293b'} 
                      onChange={(e) => updateSetting('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-[10px] font-mono font-bold text-slate-500">{settings.primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Màu nhấn</label>
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <input 
                      type="color" 
                      value={settings.accentColor || '#f97316'} 
                      onChange={(e) => updateSetting('accentColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-none"
                    />
                    <span className="text-[10px] font-mono font-bold text-slate-500">{settings.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
         <h3 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-6">
             <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-xs"><i className="fa-solid fa-globe"></i></span>
            {t('langSelection')}
          </h3>
          <div className="flex gap-4">
             <button 
              onClick={() => updateSetting('language', 'vi')}
              className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${settings.language === 'vi' ? 'bg-slate-800 text-white shadow-xl' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
             >
               Tiếng Việt
             </button>
             <button 
              onClick={() => updateSetting('language', 'en')}
              className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${settings.language === 'en' ? 'bg-slate-800 text-white shadow-xl' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
             >
               English
             </button>
          </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]"></div>
         <div className="relative z-10">
            <h4 className="text-lg font-black uppercase tracking-widest mb-2">Bản Xem Trước Màu</h4>
            <div className="flex gap-4 mt-6">
              <div className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-orange-500 text-white shadow-lg">Nút Nhấn Mẫu</div>
              <div className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-white text-slate-900">Nút Phụ</div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
