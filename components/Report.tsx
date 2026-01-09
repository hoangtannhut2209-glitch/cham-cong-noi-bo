
import React, { useMemo } from 'react';
import { User, AttendanceRecord } from '../types';
import { format, isSameMonth, parseISO } from 'date-fns';

interface ReportProps {
  user: User;
  records: AttendanceRecord[];
  users: User[];
  onExport: () => void;
  t: (key: any) => string;
}

const Report: React.FC<ReportProps> = ({ user, records, users, onExport, t }) => {
  const isAdmin = user.role === 'Admin';
  const currentMonth = new Date();
  const currentMonthStr = format(currentMonth, 'MM/yyyy');

  const stats = useMemo(() => {
    const monthRecords = records.filter(r => isSameMonth(parseISO(r.date), currentMonth));
    
    return users.map(u => {
      const userMonthRecords = monthRecords.filter(r => r.userId === u.id);
      const present = userMonthRecords.filter(r => r.clockIn).length;
      const otTotal = userMonthRecords.reduce((sum, r) => sum + r.otHours, 0);
      const late = userMonthRecords.filter(r => r.clockIn && r.clockIn > '08:00').length;
      
      return {
        ...u,
        present,
        otTotal,
        late,
        absent: 0,
        leave: 0,
        halfDay: 0,
        rate: present > 0 ? 100 : 0
      };
    });
  }, [records, users, currentMonth]);

  const totalPresent = stats.reduce((sum, s) => sum + s.present, 0);
  const totalLate = stats.reduce((sum, s) => sum + s.late, 0);
  const totalOT = stats.reduce((sum, s) => sum + s.otTotal, 0);

  const summaryStats = [
    { label: t('employees'), value: users.length, icon: 'fa-users', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('present'), value: totalPresent, icon: 'fa-calendar-check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('late'), value: totalLate, icon: 'fa-clock', color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Tổng OT (H)', value: totalOT.toFixed(1), icon: 'fa-bolt', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-lg w-full bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-inner">
            <i className="fa-solid fa-shield-halved text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Quyền Truy Cập Bị Hạn Chế</h2>
          <p className="text-slate-500 font-medium">Bạn cần quyền quản trị viên để xem báo cáo tổng hợp này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
            <i className="fa-solid fa-chart-simple text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t('statistics')}</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">HMH Analytics Hub • {currentMonthStr}</p>
          </div>
        </div>
        
        <button 
          onClick={onExport}
          className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 active:scale-95"
        >
          <i className="fa-solid fa-file-excel text-sm"></i>
          {t('exportExcel')}
        </button>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
              <i className={`fa-solid ${s.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color} tracking-tight`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{t('statistics')} - {currentMonthStr}</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dữ liệu thời gian thực</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Họ Tên</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">Mã NV</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">{t('present')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">{t('late')}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">Tổng OT</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-[9px] font-black">
                        {s.name.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase()}
                      </div>
                      <span className="text-sm font-black text-slate-700 tracking-tight">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-xs font-bold text-slate-400">{s.id}</td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-emerald-600">{s.present}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-sm font-black ${s.late > 0 ? 'text-orange-500' : 'text-slate-300'}`}>{s.late}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-indigo-600">{s.otTotal.toFixed(1)}h</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                      <span className="text-[10px] font-black tracking-widest">{s.rate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
