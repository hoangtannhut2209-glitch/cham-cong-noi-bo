
import React, { useState } from 'react';
import { User, AttendanceRecord, AppSettings } from '../types';
import { format, endOfMonth, eachDayOfInterval, getDate, getDay } from 'date-fns';
import * as XLSX from 'xlsx';

interface TimelineProps {
  user: User;
  records: AttendanceRecord[];
  allUsers: User[];
  settings: AppSettings;
}

const Timeline: React.FC<TimelineProps> = ({ user, records, allUsers, settings }) => {
  const [deptFilter, setDeptFilter] = useState('All');
  const [deptSearch, setDeptSearch] = useState('');
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const currentMonth = new Date();
  
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayShortLabel = (date: Date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[getDay(date)];
  };

  const getRecordForUserDay = (userId: string, date: string) => {
    return records.find(r => r.userId === userId && r.date === date);
  };

  const filteredUsers = deptFilter === 'All' ? allUsers : allUsers.filter(u => u.department === deptFilter);
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const filteredDepartments = settings.departments.filter(d => 
    d.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const exportTimelineExcel = () => {
    const headerRow1 = ["DANH SÁCH CHI TIẾT CHẤM CÔNG - HMH"];
    const headerRow2 = [`Tháng: ${format(currentMonth, 'MM/yyyy')}`, `Phòng ban: ${deptFilter}`];
    const dateLabels = ["Nhân sự", ...days.map(d => getDate(d).toString())];
    
    const rows = filteredUsers.map(u => {
      const rowData = [u.name];
      days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const record = getRecordForUserDay(u.id, dateStr);
        rowData.push(record ? (record.clockIn + (record.otHours > 0 ? ` (+${record.otHours}h)` : '')) : '-');
      });
      return rowData;
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, [], dateLabels, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timeline Grid");
    XLSX.writeFile(workbook, `Timeline_HMH_${format(currentMonth, 'MM_yyyy')}.xlsx`);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 shadow-xl border-b-4 border-orange-200">
            <i className="fa-solid fa-calendar-days text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Timeline</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Lịch sử chấm công chi tiết</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm relative z-50">
          {/* Enhanced Searchable Department Filter */}
          <div className="relative group">
            <div 
              onClick={() => setIsDeptOpen(!isDeptOpen)}
              className={`flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 cursor-pointer hover:border-orange-500 transition-all min-w-[200px] ${isDeptOpen ? 'border-orange-500 shadow-lg shadow-orange-500/5' : ''}`}
            >
              <i className="fa-solid fa-building-user text-slate-300"></i>
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest flex-1 truncate">
                {deptFilter === 'All' ? 'Tất cả phòng ban' : deptFilter}
              </span>
              <i className={`fa-solid fa-chevron-down text-[10px] text-slate-300 transition-transform ${isDeptOpen ? 'rotate-180' : ''}`}></i>
            </div>

            {isDeptOpen && (
              <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-3xl border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.1)] p-4 animate-in slide-in-from-top-2 duration-300 overflow-hidden">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 mb-4 group focus-within:border-orange-500 transition-all">
                  <i className="fa-solid fa-magnifying-glass text-[10px] text-slate-300 group-focus-within:text-orange-500"></i>
                  <input 
                    type="text" 
                    placeholder="Tìm phòng ban..."
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none w-full"
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
                  <button 
                    onClick={() => { setDeptFilter('All'); setIsDeptOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${deptFilter === 'All' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    Tất cả phòng ban
                  </button>
                  {filteredDepartments.map(d => (
                    <button 
                      key={d}
                      onClick={() => { setDeptFilter(d); setIsDeptOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${deptFilter === d ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {d}
                    </button>
                  ))}
                  {filteredDepartments.length === 0 && (
                    <p className="text-[10px] text-slate-400 text-center py-4 font-bold italic">Không tìm thấy phòng ban</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-inner">
            <button className="px-4 py-3 hover:bg-orange-50 text-slate-400 hover:text-orange-500 transition-colors border-r border-slate-200">
              <i className="fa-solid fa-chevron-left text-[10px]"></i>
            </button>
            <span className="px-6 py-3 font-black text-xs text-slate-700 uppercase tracking-widest">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button className="px-4 py-3 hover:bg-orange-50 text-slate-400 hover:text-orange-500 transition-colors border-l border-slate-200">
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>

          <button 
            onClick={exportTimelineExcel}
            className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg active:scale-95 group"
          >
            <i className="fa-solid fa-download group-hover:animate-bounce"></i>
            Tải Excel Grid
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] overflow-hidden relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 sticky left-0 bg-white z-20 w-72 border-b border-slate-100 shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhân sự</span>
                </th>
                {days.map(day => {
                  const isToday = format(day, 'yyyy-MM-dd') === todayStr;
                  const isWeekend = getDay(day) === 0 || getDay(day) === 6;
                  return (
                    <th key={day.toString()} className={`px-2 py-6 text-center border-b border-slate-100 min-w-[45px] ${isToday ? 'bg-orange-500/10' : ''}`}>
                      <div className={`text-xs font-black ${isToday ? 'text-orange-600' : isWeekend ? 'text-rose-400' : 'text-slate-400'}`}>{getDate(day)}</div>
                      <div className={`text-[8px] font-black mt-1 uppercase tracking-tighter ${isToday ? 'text-orange-400' : isWeekend ? 'text-rose-300' : 'text-slate-300'}`}>
                        {getDayShortLabel(day)}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 sticky left-0 bg-white group-hover:bg-slate-50/50 z-20 transition-colors shadow-[4px_0_10px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                        {u.name.split(' ').map(n => n[0]).join('').slice(-3).toUpperCase()}
                      </div>
                      <div className="text-xs truncate max-w-[180px]">
                        <span className="font-bold text-slate-800 block mb-0.5">{u.name}</span>
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{u.department}</span>
                      </div>
                    </div>
                  </td>
                  {days.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const record = getRecordForUserDay(u.id, dateStr);
                    const isWeekend = getDay(day) === 0 || getDay(day) === 6;
                    const isToday = dateStr === todayStr;

                    return (
                      <td key={dateStr} className={`px-1 py-5 text-center border-r border-slate-50/50 relative ${isToday ? 'bg-orange-50/20' : ''}`}>
                        {record ? (
                          <div className="relative inline-block">
                             {record.otHours > 0 && (
                               <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[7px] font-black text-white bg-orange-500 px-1.5 py-0.5 rounded-full border border-white shadow-sm whitespace-nowrap z-10">
                                 +{record.otHours}h
                               </span>
                             )}
                             <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20 scale-90 hover:scale-110 transition-transform cursor-pointer">
                               <i className="fa-solid fa-check text-[10px]"></i>
                             </div>
                          </div>
                        ) : isWeekend ? (
                          <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center mx-auto scale-75 opacity-40">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                          </div>
                        ) : isToday ? (
                          <div className="w-7 h-7 rounded-xl border-2 border-orange-200 mx-auto scale-90 animate-pulse"></div>
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-100 mx-auto"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
