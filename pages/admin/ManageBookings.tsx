
import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import { Booking, BookingStatus } from '../../types';

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const data = await apiService.getAllBookings();
    setBookings(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      await apiService.updateBookingStatus(id, status);
      fetchBookings();
    } catch (e) {
      alert("Error updating status");
    }
  };

  if (loading) return <div className="p-10">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Verification</h1>
        <p className="text-gray-500 font-medium">Review and process rental requests from clients</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Order Ref</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Client / Asset</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Schedule</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Total Bill</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400 text-right">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">#LX-{booking.id.slice(-5).toUpperCase()}</span>
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-gray-900">{booking.userDetails?.name}</p>
                  <p className="text-xs text-indigo-500 font-medium">{booking.carDetails?.brand} {booking.carDetails?.model}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs text-gray-700 font-bold">{new Date(booking.startDate).toLocaleDateString()} &rarr; {new Date(booking.endDate).toLocaleDateString()}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tighter mt-1">Confirmed Window</p>
                </td>
                <td className="px-8 py-6 font-black text-gray-900">
                  ${booking.totalPrice}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {booking.status === BookingStatus.PENDING ? (
                      <>
                        <button 
                          onClick={() => updateStatus(booking.id, BookingStatus.APPROVED)}
                          className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-200 transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(booking.id, BookingStatus.REJECTED)}
                          className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-red-200 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest
                        ${booking.status === BookingStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {booking.status}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;
