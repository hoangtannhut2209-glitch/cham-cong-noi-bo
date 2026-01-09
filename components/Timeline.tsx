
import React, { useState } from 'react';
import { User, AttendanceRecord, AppSettings } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDate, getDay, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

interface TimelineProps {
  user: User;
  records: AttendanceRecord[];
  allUsers: User[];
  settings: AppSettings;
}

const Timeline: React.FC<TimelineProps> = ({ user, records, allUsers, settings }) => {
  const [deptFilter, setDeptFilter] = useState('All');
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
            <i className="fa-solid fa-calendar-days text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Timeline</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Lịch sử chấm công chi tiết</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <select 
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-600 outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
          >
            <option value="All">Tất cả phòng ban</option>
            {settings.departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shadow-inner">
            <button className="px-4 py-2.5 hover:bg-orange-50 text-slate-400 hover:text-orange-500 transition-colors border-r border-slate-200">
              <i className="fa-solid fa-chevron-left text-[10px]"></i>
            </button>
            <span className="px-6 py-2.5 font-black text-xs text-slate-700 uppercase tracking-widest">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button className="px-4 py-2.5 hover:bg-orange-50 text-slate-400 hover:text-orange-500 transition-colors border-l border-slate-200">
              <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </button>
          </div>
          <button 
            onClick={exportTimelineExcel}
            className="flex items-center gap-3 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95"
          >
            <i className="fa-solid fa-download"></i>
            Tải Excel Grid
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 sticky left-0 bg-white z-20 w-72 border-b border-slate-100">
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
                  <td className="px-8 py-5 sticky left-0 bg-white group-hover:bg-slate-50/50 z-20 transition-colors">
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
