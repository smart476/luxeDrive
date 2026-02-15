
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { Car, Booking, User } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cars = await apiService.getCars();
      const bookings = await apiService.getAllBookings();
      const users = await apiService.getUsers();
      
      const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
      
      setStats({
        totalCars: cars.length,
        totalBookings: bookings.length,
        totalUsers: users.length,
        totalRevenue: revenue
      });
      
      setRecentBookings(bookings.slice(0, 5));
      setLoading(false);
    };
    fetchData();
  }, []);

  const chartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: stats.totalRevenue / 10 },
  ];

  if (loading) return <div className="p-10 font-bold">Loading insights...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Command</h1>
          <p className="text-gray-500 font-medium">Real-time performance analytics for LuxeDrive</p>
        </div>
        <div className="flex gap-3">
            <Link to="/admin/cars" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
                <i className="fas fa-plus"></i> Add New Car
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Fleet Size', value: stats.totalCars, icon: 'fa-car', color: 'bg-blue-500' },
          { label: 'Reservations', value: stats.totalBookings, icon: 'fa-calendar-check', color: 'bg-indigo-500' },
          { label: 'Total Clients', value: stats.totalUsers, icon: 'fa-users', color: 'bg-emerald-500' },
          { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: 'fa-dollar-sign', color: 'bg-violet-500' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <i className={`fas ${item.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Revenue Flow</h3>
                    <select className="bg-gray-50 border-none text-xs font-bold rounded-lg px-3 py-1">
                        <option>Last 7 Months</option>
                    </select>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                            />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}} 
                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                            />
                            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#4f46e5' : '#e2e8f0'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
                    <Link to="/admin/bookings" className="text-indigo-600 text-sm font-bold hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400">Client</th>
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400">Vehicle</th>
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400">Amount</th>
                                <th className="pb-4 text-[10px] uppercase font-bold text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentBookings.map(booking => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4">
                                        <p className="text-sm font-bold text-gray-900">{booking.userDetails?.name}</p>
                                        <p className="text-[10px] text-gray-400">{booking.userDetails?.email}</p>
                                    </td>
                                    <td className="py-4 text-sm font-medium text-gray-700">
                                        {booking.carDetails?.brand} {booking.carDetails?.model}
                                    </td>
                                    <td className="py-4 text-sm font-black text-indigo-600">${booking.totalPrice}</td>
                                    <td className="py-4">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md bg-opacity-10 
                                            ${booking.status === 'approved' ? 'bg-green-500 text-green-600' : 'bg-yellow-500 text-yellow-600'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="space-y-8">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
                <h3 className="text-xl font-bold mb-6">Quick Management</h3>
                <div className="grid grid-cols-1 gap-4">
                    <Link to="/admin/cars" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all">
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                            <i className="fas fa-car"></i>
                        </div>
                        <span className="font-bold">Inventory Control</span>
                    </Link>
                    <Link to="/admin/bookings" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <span className="font-bold">Order Verification</span>
                    </Link>
                    <Link to="/admin/users" className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center gap-4 transition-all">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                            <i className="fas fa-users-cog"></i>
                        </div>
                        <span className="font-bold">User Access Policy</span>
                    </Link>
                </div>
            </div>

            <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">LuxeDrive AI <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest ml-2 px-2 py-1 bg-white rounded-full">Pro</span></h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    "Based on current trends, your SUV segment is seeing 25% higher demand this weekend. Consider adjusting G-Wagon pricing by +$50 for max revenue."
                </p>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                    Apply Optimization
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
