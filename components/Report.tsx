
import { format, isSameMonth } from 'date-fns';
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { AttendanceRecord, User } from '../types';

interface ReportProps {
  user: User;
  records: AttendanceRecord[];
  users: User[];
  t: (key: any) => string;
}

type ColumnKey = 'id' | 'name' | 'department' | 'present' | 'late' | 'otTotal' | 'rate';

const Report: React.FC<ReportProps> = ({ user, records, users, t }) => {
  const isAdmin = user.role === 'Admin';
  const currentMonth = new Date();
  const currentMonthStr = format(currentMonth, 'MM/yyyy');
  
  const [isExporting, setIsExporting] = useState<'idle' | 'preparing' | 'generating' | 'done'>('idle');
  const [showConfig, setShowConfig] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    id: true,
    name: true,
    department: true,
    present: true,
    late: true,
    otTotal: true,
    rate: true
  });

  const stats = useMemo(() => {
    const monthRecords = records.filter(r => {
      // Use manual parsing to avoid timezone issues
      const [year, month, day] = r.date.split('-').map(Number);
      const recordDate = new Date(year, month - 1, day);
      return isSameMonth(recordDate, currentMonth);
    });
    
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

  const handleExport = () => {
    setIsExporting('preparing');
    
    setTimeout(() => {
      setIsExporting('generating');
      
      setTimeout(() => {
        const excelData = stats.map(s => {
          const row: any = {};
          if (visibleColumns.id) row['Mã NV'] = s.id;
          if (visibleColumns.name) row['Họ Tên'] = s.name;
          if (visibleColumns.department) row['Phòng ban'] = s.department;
          if (visibleColumns.present) row['Có mặt'] = s.present;
          if (visibleColumns.late) row['Đi muộn'] = s.late;
          if (visibleColumns.otTotal) row['Tổng OT (H)'] = s.otTotal;
          if (visibleColumns.rate) row['Tỷ lệ chuyên cần (%)'] = s.rate;
          return row;
        });

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
        XLSX.writeFile(wb, `HMH_Report_${format(currentMonth, 'MM_yyyy')}.xlsx`);
        
        setIsExporting('done');
        setTimeout(() => setIsExporting('idle'), 3000);
      }, 1500);
    }, 800);
  };

  const toggleColumn = (key: ColumnKey) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const summaryStats = [
    { label: t('employees'), value: users.length, icon: 'fa-users', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('present'), value: totalPresent, icon: 'fa-calendar-check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: t('late'), value: totalLate, icon: 'fa-clock', color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Tổng OT (H)', value: totalOT.toFixed(1), icon: 'fa-bolt', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const columnLabels: Record<ColumnKey, string> = {
    id: 'Mã NV',
    name: 'Họ Tên',
    department: 'Phòng ban',
    present: 'Số buổi có mặt',
    late: 'Số buổi đi muộn',
    otTotal: 'Tổng giờ OT',
    rate: 'Tỷ lệ (%)'
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center py-12 md:py-32 px-4">
        <div className="max-w-xl w-full relative animate-in zoom-in-95 fade-in duration-1000">
          {/* Decorative Elements */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-slate-900/10 rounded-full blur-3xl animate-pulse delay-700"></div>

          <div className="relative bg-white/80 backdrop-blur-3xl rounded-[3rem] border-2 border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.08)] p-10 md:p-16 text-center overflow-hidden">
            {/* Alert Header Strip */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-rose-500 to-orange-400"></div>
            
            <div className="space-y-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500 shadow-inner group transition-transform duration-700 hover:rotate-12">
                  <i className="fa-solid fa-shield-halved text-4xl animate-pulse"></i>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xs shadow-xl border-4 border-white animate-bounce">
                  <i className="fa-solid fa-lock"></i>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">
                  Quyền Truy Cập <br /><span className="text-rose-500">Bị Hạn Chế</span>
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-0.5 w-8 bg-slate-200 rounded-full"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Security Protocol v5.0</span>
                  <div className="h-0.5 w-8 bg-slate-200 rounded-full"></div>
                </div>
              </div>

              <p className="text-slate-500 font-medium text-base leading-relaxed max-w-sm mx-auto">
                Xin lỗi <span className="font-bold text-slate-900">{user.name}</span>, phân hệ báo cáo tổng hợp chỉ dành riêng cho tài khoản Quản trị viên (Admin).
              </p>

              <div className="pt-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 inline-flex flex-col items-center gap-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nếu bạn tin rằng đây là một sai sót</p>
                   <p className="text-xs font-bold text-slate-600">Vui lòng liên hệ bộ phận IT hoặc Trưởng phòng.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Header & Controls */}
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
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${showConfig ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            <i className={`fa-solid ${showConfig ? 'fa-xmark' : 'fa-list-check'} text-lg`}></i>
          </button>
          
          <div className="relative group">
            <button 
              onClick={handleExport}
              disabled={isExporting !== 'idle'}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-100 active:scale-95 min-w-[220px] justify-center overflow-hidden relative ${isExporting === 'done' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400'}`}
            >
              <div className="relative z-10 flex items-center gap-3">
                {isExporting === 'idle' && (
                  <>
                    <i className="fa-solid fa-file-excel text-sm"></i>
                    {t('exportExcel')}
                  </>
                )}
                {isExporting === 'preparing' && (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    Đang chuẩn bị...
                  </>
                )}
                {isExporting === 'generating' && (
                  <>
                    <i className="fa-solid fa-gear fa-spin"></i>
                    Đang kết xuất...
                  </>
                )}
                {isExporting === 'done' && (
                  <>
                    <i className="fa-solid fa-check animate-bounce"></i>
                    Đã lưu tệp
                  </>
                )}
              </div>
              
              {/* Progress Background */}
              {(isExporting === 'preparing' || isExporting === 'generating') && (
                <div className="absolute inset-0 bg-white/10 z-0">
                  <div 
                    className={`h-full bg-white/20 transition-all duration-1000 ${isExporting === 'generating' ? 'w-full' : 'w-1/3'}`}
                  ></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Column Customization Panel */}
      {showConfig && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 animate-in slide-in-from-top-4 fade-in duration-500 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center text-xs">
              <i className="fa-solid fa-filter"></i>
            </div>
            <div>
              <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Cấu hình báo cáo</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Chọn các trường dữ liệu muốn hiển thị trong tệp Excel</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {(Object.keys(visibleColumns) as ColumnKey[]).map(key => (
              <label key={key} className={`group relative flex items-center justify-between gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${visibleColumns[key] ? 'bg-orange-500/5 border-orange-500/20 text-orange-900' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{columnLabels[key]}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{key}</span>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={visibleColumns[key]} 
                  onChange={() => toggleColumn(key)}
                />
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${visibleColumns[key] ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-slate-200'}`}>
                  {visibleColumns[key] ? <i className="fa-solid fa-check text-[10px]"></i> : <i className="fa-solid fa-plus text-[10px]"></i>}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
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

      {/* Interactive Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Bảng tổng hợp chi tiết - {currentMonthStr}</h3>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cập nhật lúc {format(new Date(), 'HH:mm')}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Họ Tên & Danh tính</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">Mã Số</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">{t('present')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">{t('late')}</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">OT Tích lũy</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">Chuyên cần</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.map(s => (
                <tr key={s.id} className="group transition-all duration-300 relative cursor-default hover:bg-slate-50/80">
                  <td className="px-8 py-5 relative">
                    {/* Interaction Indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                    
                    <div className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-300">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-black shadow-inner border border-white">
                        {s.name.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">{s.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.department}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-[11px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-500 transition-colors">{s.id}</td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-emerald-600 bg-emerald-50/50 px-3 py-1 rounded-lg">{s.present}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-sm font-black px-3 py-1 rounded-lg ${s.late > 0 ? 'text-orange-600 bg-orange-50' : 'text-slate-300 bg-slate-50'}`}>
                      {s.late}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-indigo-600">{s.otTotal.toFixed(1)}h</span>
                      <div className="w-8 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, s.otTotal * 5)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 group-hover:scale-105 transition-transform">
                      <span className="text-[10px] font-black tracking-widest">{s.rate}%</span>
                      <i className="fa-solid fa-arrow-up text-[8px] animate-bounce"></i>
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
