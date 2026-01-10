
import React, { useState } from 'react';
import { User, AttendanceStatus } from '../types';
import { formatDate } from '../utils';

interface BatchAttendanceProps {
  user: User;
  users: User[];
  onBatchMark: (date: string, status: AttendanceStatus, userIds: string[]) => void;
  departments: string[];
}

const BatchAttendance: React.FC<BatchAttendanceProps> = ({ user, users, onBatchMark, departments }) => {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('Present');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  if (user.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6">
             <i className="fa-solid fa-shield-halved text-4xl"></i>
         </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Quyền Truy Cập Bị Hạn Chế</h2>
        <p className="text-slate-500 font-bold mt-2 text-sm uppercase tracking-widest">Chỉ quản trị viên mới có thể thực hiện thao tác này.</p>
      </div>
    );
  }

  const filteredUsers = selectedDept === 'All' ? users : users.filter(u => u.department === selectedDept);

  const toggleUser = (uid: string) => {
    setSelectedUserIds(prev => prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]);
  };

  const toggleAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const handleApply = () => {
    if (selectedUserIds.length === 0) return alert('Vui lòng chọn ít nhất một nhân viên');
    onBatchMark(selectedDate, selectedStatus, selectedUserIds);
    alert('Đã chấm công hàng loạt thành công!');
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 shadow-xl border-b-4 border-orange-200">
            <i className="fa-solid fa-users-rectangle text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Chấm công hàng loạt</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">Batch Operations Console</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] space-y-10 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <i className="fa-regular fa-calendar"></i> Chọn ngày
            </label>
            <div className="relative group">
                <input 
                  type="date" 
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-700 outline-none focus:border-orange-500 transition-all cursor-pointer"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <i className="fa-solid fa-tag"></i> Trạng thái
            </label>
            <div className="relative">
                <select 
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-700 outline-none appearance-none focus:border-orange-500 transition-all cursor-pointer"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as AttendanceStatus)}
                >
                  <option value="Present">Có mặt (Đủ công)</option>
                  <option value="Half-day">Nửa công</option>
                  <option value="Absent">Vắng mặt</option>
                  <option value="Leave">Nghỉ phép</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <i className="fa-solid fa-filter"></i> Lọc phòng ban
            </label>
            <div className="relative">
                <select 
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-slate-700 outline-none appearance-none focus:border-orange-500 transition-all cursor-pointer"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="All">Tất cả phòng ban</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                 <i className="fa-solid fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-slate-50 pt-8 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs">
                    <i className="fa-solid fa-list-check"></i>
                </span>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Danh sách áp dụng ({selectedUserIds.length})</h3>
            </div>
            <button onClick={toggleAll} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest transition-all">
              {selectedUserIds.length === filteredUsers.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {filteredUsers.map(u => (
              <div 
                key={u.id} 
                onClick={() => toggleUser(u.id)}
                className={`p-5 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-4 group relative overflow-hidden ${selectedUserIds.includes(u.id) ? 'bg-orange-50 border-orange-200' : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-100 hover:shadow-lg'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-[10px] font-black shadow-lg transition-transform group-hover:scale-110 ${selectedUserIds.includes(u.id) ? 'bg-orange-500 shadow-orange-500/30' : 'bg-slate-200'}`}>
                  {u.name.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black truncate ${selectedUserIds.includes(u.id) ? 'text-orange-900' : 'text-slate-700'}`}>{u.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">{u.id} • {u.department}</p>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedUserIds.includes(u.id) ? 'bg-orange-500 border-orange-500' : 'border-slate-200 bg-white'}`}>
                    {selectedUserIds.includes(u.id) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end relative z-10">
             <button 
            onClick={handleApply}
            className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all hover:bg-orange-500 hover:shadow-orange-500/30 group"
          >
            <span className="group-hover:hidden">Xác nhận chấm công</span>
            <span className="hidden group-hover:inline">Thực thi ngay</span>
            <i className="fa-solid fa-bolt ml-3 text-orange-500 group-hover:text-white"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchAttendance;
