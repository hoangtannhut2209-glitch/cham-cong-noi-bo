
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale/vi';
import { enUS } from 'date-fns/locale/en-US';
import { User, AttendanceRecord } from '../types';
import { formatDate } from '../utils';

interface DashboardProps {
  user: User;
  records: AttendanceRecord[];
  onClockIn: (time?: string, note?: string) => void;
  onClockOut: (time?: string, note?: string) => void;
  t: (key: any) => string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, records, onClockIn, onClockOut, t }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [manualMode, setManualMode] = useState(false);
  const [attendanceNote, setAttendanceNote] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = formatDate(new Date());
  const todayRecord = records.find(r => r.date === todayStr && r.userId === user.id);

  const handleIn = () => {
    onClockIn(undefined, attendanceNote);
    setAttendanceNote('');
  };

  const handleOut = () => {
    onClockOut(undefined, attendanceNote);
    setAttendanceNote('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-12 pb-10">
      <div className="bg-white p-6 md:p-12 lg:p-20 rounded-[2.5rem] md:rounded-[5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.05)] text-center relative overflow-hidden group hover:shadow-orange-500/10 transition-all duration-700">
        <div className="absolute top-0 left-0 w-full h-2 md:h-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-400"></div>
        
        <div className="relative z-10 space-y-8 md:space-y-12">
          <div className="flex items-center justify-center">
             <div 
              onClick={() => setManualMode(!manualMode)}
              className="px-6 md:px-8 py-2 md:py-3 bg-slate-50 border border-slate-100 rounded-full cursor-pointer hover:bg-slate-100 transition-all flex items-center gap-3 md:gap-4 shadow-sm"
             >
              <div className={`w-2.5 h-2.5 rounded-full ${manualMode ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`}></div>
              <span className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">
                {manualMode ? t('manualMode') : t('autoMode')}
              </span>
            </div>
          </div>

          <div className="space-y-6 relative z-20 py-2">
            <div className="flex items-baseline justify-center gap-1 md:gap-4 font-black text-slate-900 tracking-tighter leading-none select-none transition-transform duration-700 group-hover:scale-105">
                <span className="text-[18vw] lg:text-[10rem] tabular-nums tracking-tighter">{format(currentTime, 'HH')}</span>
                <span className="text-[8vw] lg:text-[6rem] text-orange-500 animate-[pulse_2s_infinite] -translate-y-2 lg:-translate-y-6">:</span>
                <span className="text-[18vw] lg:text-[10rem] tabular-nums tracking-tighter">{format(currentTime, 'mm')}</span>
                <span className="hidden sm:inline-block text-[4vw] lg:text-[2.5rem] font-bold text-slate-400 self-start mt-4 lg:mt-8 tabular-nums opacity-60 w-[2ch] text-left">
                  {format(currentTime, 'ss')}
                </span>
            </div>
            
            <div className="flex justify-center">
               <div className="inline-flex items-center gap-4 px-6 py-4 bg-white border-2 border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:scale-105 transition-transform cursor-default">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100">
                    <i className="fa-solid fa-calendar-day text-lg"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Hôm nay</p>
                    <p className="text-sm md:text-lg font-black text-slate-800 uppercase tracking-tight">
                       {format(currentTime, 'eeee, dd MMMM yyyy', { locale: (t('appName').includes('HMH') ? vi : enUS) })}
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Note Input - Redesigned as a Journal Section */}
          {(!todayRecord || !todayRecord.clockOut) && (
            <div className="max-w-xl mx-auto space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between px-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <i className="fa-solid fa-pen-fancy text-orange-500"></i> NHẬT KÝ CHẤM CÔNG
                </label>
                <span className={`text-[8px] font-bold uppercase tracking-widest ${attendanceNote.length > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-300'}`}>
                  {attendanceNote.length > 0 ? 'Đang soạn ghi chú...' : 'Chưa có ghi chú'}
                </span>
              </div>
              <div className="relative group">
                <textarea 
                  value={attendanceNote}
                  onChange={(e) => setAttendanceNote(e.target.value)}
                  placeholder="Ghi chú nhanh về công việc hoặc lý do đi muộn/về sớm..."
                  className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] px-8 py-6 text-sm font-medium text-slate-700 outline-none focus:border-orange-500 focus:bg-white focus:shadow-2xl focus:shadow-orange-500/5 transition-all placeholder:italic placeholder:text-slate-300 resize-none shadow-inner"
                ></textarea>
                <div className="absolute right-6 bottom-6 text-slate-200 group-focus-within:text-orange-100 transition-colors">
                  <i className="fa-solid fa-quote-right text-3xl"></i>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl mx-auto pt-4 md:pt-8">
            <button
              onClick={handleIn}
              disabled={!!todayRecord}
              className={`px-8 md:px-12 py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-4 md:gap-6 transition-all shadow-xl md:shadow-2xl group/btn overflow-hidden relative ${todayRecord ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-orange-500 text-white hover:scale-105 hover:bg-orange-600 active:scale-95 hover:shadow-orange-500/30'}`}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
              <i className="fa-solid fa-fingerprint text-2xl md:text-3xl transition-transform group-hover/btn:rotate-12 relative z-10"></i>
              <span className="relative z-10">{t('clockInBtn')}</span>
            </button>
            <button
              onClick={handleOut}
              disabled={!todayRecord || !!todayRecord.clockOut}
              className={`px-8 md:px-12 py-6 md:py-8 rounded-[2rem] md:rounded-[3rem] font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-4 md:gap-6 transition-all shadow-xl md:shadow-2xl group/btn overflow-hidden relative ${!todayRecord || !!todayRecord.clockOut ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-slate-900 text-white hover:scale-105 hover:bg-black active:scale-95 hover:shadow-black/30'}`}
            >
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
              <i className="fa-solid fa-truck-fast text-2xl md:text-3xl transition-transform group-hover/btn:-translate-x-2 relative z-10"></i>
              <span className="relative z-10">{t('clockOutBtn')}</span>
            </button>
          </div>

          {todayRecord?.clockOut && (
            <div className="mt-8 md:mt-12 p-6 md:p-10 bg-emerald-50 border border-emerald-100 rounded-[3rem] animate-in zoom-in-95 fade-in duration-500 max-w-xl mx-auto shadow-sm relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-500 border border-emerald-100 transform rotate-12">
                <i className="fa-solid fa-circle-check text-2xl"></i>
              </div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <h4 className="text-sm md:text-base font-black text-emerald-800 uppercase tracking-widest">Hoàn thành chấm công ngày</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/40 rounded-2xl">
                  <p className="text-[8px] md:text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-1">Giờ vào</p>
                  <p className="text-base md:text-xl font-black text-slate-800 tracking-tight">{todayRecord.clockIn}</p>
                </div>
                <div className="text-center p-4 bg-white/40 rounded-2xl">
                  <p className="text-[8px] md:text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-1">Giờ ra</p>
                  <p className="text-base md:text-xl font-black text-slate-800 tracking-tight">{todayRecord.clockOut}</p>
                </div>
                <div className="text-center p-4 bg-white/40 rounded-2xl">
                  <p className="text-[8px] md:text-[9px] text-orange-600 font-black uppercase tracking-widest mb-1">OT (H)</p>
                  <p className="text-base md:text-xl font-black text-orange-600 tracking-tight">+{todayRecord.otHours}h</p>
                </div>
              </div>
              {todayRecord.note && (
                <div className="mt-6 pt-6 border-t border-emerald-100 flex gap-4 text-left">
                   <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <i className="fa-solid fa-message text-xs"></i>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Ghi chú đã lưu</p>
                      <p className="text-xs font-medium text-slate-600 italic leading-relaxed">"{todayRecord.note}"</p>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Policy Footer */}
      <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-orange-500/10 rounded-full blur-[80px] md:blur-[120px]"></div>
         <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-10 md:gap-16">
            <div className="space-y-6 md:space-y-8 text-center xl:text-left max-w-2xl">
               <div className="inline-flex items-center gap-3 px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/5 mb-2 md:mb-4">
                  <i className="fa-solid fa-circle-info text-orange-500 text-[10px]"></i>
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">{t('policyTitle')}</span>
               </div>
               <h3 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight md:leading-none uppercase px-2 md:px-0">
                 CHUYÊN NGHIỆP <br/><span className="text-orange-500">& CHÍNH XÁC</span>
               </h3>
               <p className="text-slate-400 font-medium text-base md:text-xl leading-relaxed px-4 md:px-0">{t('policyDesc')}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-3xl p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 min-w-full sm:min-w-[360px] shadow-2xl transform hover:scale-105 transition-all duration-500">
               <div className="space-y-6 md:space-y-8">
                  <div className="flex justify-between items-center group/item">
                    <span className="text-[9px] md:text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{t('checkIn')}</span>
                    <span className="text-xl md:text-2xl font-black text-orange-500 transition-transform group-hover/item:translate-x-1">08:00</span>
                  </div>
                  <div className="flex justify-between items-center group/item">
                    <span className="text-[9px] md:text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{t('checkOut')}</span>
                    <span className="text-xl md:text-2xl font-black text-orange-500 transition-transform group-hover/item:translate-x-1">17:00</span>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] md:text-[11px] text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">LUNCH BREAK</span>
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-xl md:text-2xl font-black text-white">1.5H</span>
                      <i className="fa-solid fa-mug-hot text-slate-600"></i>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
