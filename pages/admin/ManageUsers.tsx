
import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import { User } from '../../types';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await apiService.getUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleToggleBlock = async (id: string) => {
    try {
      await apiService.toggleBlockUser(id);
      fetchUsers();
    } catch (e) {
      alert("Error toggling user status");
    }
  };

  if (loading) return <div className="p-10">Loading registry...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Access Policy</h1>
        <p className="text-gray-500 font-medium">Moderate platform participants and access credentials</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Participant</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Role</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Contact</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Join Date</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400 text-right">Account Policy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider
                    ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                    <p className="text-xs font-bold text-gray-700">{user.email}</p>
                    <p className="text-[10px] text-gray-400">{user.phone}</p>
                </td>
                <td className="px-8 py-6 text-xs text-gray-500 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                    <button 
                        onClick={() => handleToggleBlock(user.id)}
                        disabled={user.role === 'admin'}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
                            ${user.isBlocked ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-50 text-red-600 hover:bg-red-100'}
                            ${user.role === 'admin' ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {user.isBlocked ? 'Unblock' : 'Block Access'}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
