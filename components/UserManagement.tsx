
import React, { useState } from 'react';
import { User, Role } from '../types';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  departments: string[];
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers, departments }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    department: departments[0] || '',
    username: '',
    password: '',
    role: 'User',
    avatar: ''
  });

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        department: departments[0] || '',
        username: '',
        password: '',
        role: 'User',
        avatar: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.username) return;

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
    } else {
      const newId = `NV${(users.length + 1).toString().padStart(3, '0')}`;
      setUsers([...users, { ...formData, id: newId, role: formData.role || 'User' } as User]);
    }
    setShowModal(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 shadow-xl border-b-4 border-orange-200">
            <i className="fa-solid fa-scroll text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Danh mục bản thảo</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 italic">The Great Scriptorium of HMH</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-orange-500/30"
        >
          <i className="fa-solid fa-feather"></i>
          Ghi danh mới
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between">
          <div className="relative max-w-lg w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"></i>
            <input 
              type="text"
              placeholder="Truy tìm danh tính bằng tên hoặc mã..."
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:border-orange-500/50 transition-all text-sm font-bold placeholder:italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden lg:flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{users.length} Active Souls</span>
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Ấn dấu (ID)</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Danh tính</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-center">Bút danh</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-center">Sảnh ban</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-center">Vai trò</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-orange-50/30 transition-all group">
                  <td className="px-10 py-6 text-xs font-black text-slate-300">{u.id}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-all border-2 border-white/10">
                        {u.name.split(' ').map(n => n[0]).join('').slice(-3).toUpperCase()}
                      </div>
                      <span className="font-black text-slate-800 text-base tracking-tight">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center text-sm font-bold text-slate-500 italic">@{u.username}</td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-[10px] font-black px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 uppercase tracking-widest">
                      {u.department}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${u.role === 'Admin' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleOpenModal(u)} className="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 text-slate-400 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm">
                        <i className="fa-solid fa-quill text-xs"></i>
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-white border-2 border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm">
                        <i className="fa-solid fa-eraser text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 overflow-hidden border-2 border-white/20">
            <div className="p-10 border-b-2 border-slate-50 flex justify-between items-center bg-[#fdfbf7]">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{editingUser ? 'Hiệu chỉnh nhân sự' : 'Ghi danh nhân sự'}</h3>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mt-1 italic">HMH Manuscript Records</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full hover:bg-slate-100 text-slate-400 transition-all flex items-center justify-center">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            <div className="p-12 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Danh tính (Họ Tên)</label>
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm"
                    placeholder="Nhập tên thật..."
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phòng ban</label>
                    <select 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm appearance-none"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    >
                      {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò</label>
                    <select 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm appearance-none"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                    >
                      <option value="User">Nhân viên (User)</option>
                      <option value="Admin">Quản trị viên</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bút danh (Username)</label>
                    <input 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm"
                      placeholder="lucashoang..."
                      value={formData.username || ''}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật mã (Password)</label>
                    <input 
                      type="password"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm"
                      placeholder="••••••"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-8 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Thu hồi</button>
                <button onClick={handleSave} className="flex-1 px-8 py-5 bg-orange-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30">Niêm phong hồ sơ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
