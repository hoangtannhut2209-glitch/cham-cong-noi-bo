
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
        <i className="fa-solid fa-lock text-4xl text-slate-200 mb-4"></i>
        <h2 className="text-xl font-bold text-slate-800">Quyền Truy Cập Bị Hạn Chế</h2>
        <p className="text-slate-500">Chỉ quản trị viên mới có thể thực hiện chấm công hàng loạt.</p>
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chọn ngày</label>
            <input 
              type="date" 
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trạng thái áp dụng</label>
            <select 
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AttendanceStatus)}
            >
              <option value="Present">Có mặt (Đủ công)</option>
              <option value="Half-day">Nửa công</option>
              <option value="Absent">Vắng mặt</option>
              <option value="Leave">Nghỉ phép</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lọc theo phòng ban</label>
            <select 
              className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">Tất cả</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button 
            onClick={handleApply}
            className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all"
          >
            Áp dụng hàng loạt ({selectedUserIds.length})
          </button>
        </div>

        <div className="border-t border-slate-50 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Danh sách áp dụng</h3>
            <button onClick={toggleAll} className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline">
              {selectedUserIds.length === filteredUsers.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredUsers.map(u => (
              <div 
                key={u.id} 
                onClick={() => toggleUser(u.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${selectedUserIds.includes(u.id) ? 'bg-orange-50 border-orange-200 shadow-inner' : 'bg-white border-slate-100'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-[10px] font-black ${selectedUserIds.includes(u.id) ? 'bg-orange-500' : 'bg-slate-200'}`}>
                  {u.name.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${selectedUserIds.includes(u.id) ? 'text-orange-900' : 'text-slate-700'}`}>{u.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{u.id} • {u.department}</p>
                </div>
                {selectedUserIds.includes(u.id) && <i className="fa-solid fa-circle-check text-orange-500"></i>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchAttendance;
