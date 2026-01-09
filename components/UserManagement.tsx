
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
    email: '',
    department: departments[0] || '',
    username: '',
    password: '',
    role: 'Employee',
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
        email: '',
        department: departments[0] || '',
        username: '',
        password: '',
        role: 'Employee',
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
      setUsers([...users, { ...formData, id: newId } as User]);
    }
    setShowModal(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-list-ul text-2xl text-orange-500"></i>
          <h2 className="text-2xl font-bold text-slate-800">Nhân sự</h2>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg"
        >
          <i className="fa-solid fa-plus"></i>
          Thêm nhân sự
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="relative max-w-xl">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text"
              placeholder="Tìm kiếm nhân sự theo tên hoặc mã..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Mã NV</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Thông tin nhân sự</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-center">Tên đăng nhập</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-center">Phòng ban</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-center">Vai trò</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-bold text-slate-400">{u.id}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {u.avatar ? (
                        <img src={u.avatar} className="w-10 h-10 rounded-2xl object-cover border border-slate-100 shadow-sm" alt="" />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                          {u.name.split(' ').map(n => n[0]).join('').slice(-3).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-black text-slate-800 text-sm block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-slate-600">{u.username || 'N/A'}</td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-[10px] font-black px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 uppercase tracking-widest">
                      {u.department}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${u.role === 'Admin' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(u)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 shadow-sm transition-all active:scale-90">
                        <i className="fa-solid fa-pen-to-square text-xs"></i>
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-white border border-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 shadow-sm transition-all active:scale-90">
                        <i className="fa-solid fa-trash text-xs"></i>
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                  <i className={`fa-solid ${editingUser ? 'fa-user-pen' : 'fa-user-plus'} text-lg`}></i>
                </div>
                <h3 className="text-xl font-black text-slate-800">{editingUser ? 'Sửa Nhân sự' : 'Thêm Nhân sự'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full hover:bg-white hover:shadow-sm text-slate-400 transition-all">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã Nhân sự</label>
                  <input 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm"
                    value={formData.id || ''}
                    disabled={!!editingUser}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên Nhân sự</label>
                  <input 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm"
                    placeholder="Nhập tên đầy đủ"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phòng ban</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm appearance-none"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm"
                    placeholder="example@company.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên đăng nhập</label>
                  <input 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                  <input 
                    type="password"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quyền</label>
                  <select 
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-orange-500 font-bold transition-all text-sm appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                  >
                    <option value="Employee">Nhân viên</option>
                    <option value="Admin">Quản trị viên</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all">Hủy bỏ</button>
                <button onClick={handleSave} className="flex-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase hover:bg-orange-600 transition-all shadow-xl shadow-orange-100">Lưu thông tin</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
