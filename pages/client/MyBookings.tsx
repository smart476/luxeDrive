
import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import { Booking, User, BookingStatus } from '../../types';
import ReceiptModal from '../../components/ReceiptModal';

interface MyBookingsProps {
  user?: User | null;
}

const MyBookings: React.FC<MyBookingsProps> = ({ user }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const data = await apiService.getMyBookings(user.id);
        // Include user details for receipt
        const bookingsWithUser = data.map(b => ({ ...b, userDetails: user }));
        setBookings(bookingsWithUser);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case BookingStatus.APPROVED: return 'bg-green-100 text-green-700';
      case BookingStatus.REJECTED: return 'bg-red-100 text-red-700';
      case BookingStatus.COMPLETED: return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="py-20 text-center font-bold">Loading your bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Rental Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage your current and upcoming luxury experiences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <i className="fas fa-user text-2xl"></i>
                    </div>
                    <div>
                        <p className="text-indigo-100 text-sm font-medium">Active Member</p>
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                    </div>
                </div>
                <div className="space-y-4 pt-6 border-t border-indigo-500">
                    <div className="flex justify-between text-sm">
                        <span className="text-indigo-200">Total Bookings</span>
                        <span className="font-bold">{bookings.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-indigo-200">Luxe Points</span>
                        <span className="font-bold">1,250 XP</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Support</h3>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors font-semibold text-gray-700">
                    <i className="fas fa-headset text-indigo-500"></i> Help Center
                </button>
                <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors font-semibold text-gray-700">
                    <i className="fas fa-shield-alt text-indigo-500"></i> Safety Docs
                </button>
            </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-calendar-times text-3xl text-gray-300"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-8">Ready to experience the ultimate drive?</p>
              <a href="#/cars" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                Browse Cars
              </a>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48">
                    <img 
                      src={booking.carDetails?.image} 
                      alt={booking.carDetails?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow p-8">
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">{booking.carDetails?.brand} {booking.carDetails?.model}</h3>
                        <p className="text-gray-500 font-medium">Booking ID: <span className="text-gray-900">#LX-{booking.id.slice(-5).toUpperCase()}</span></p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mt-4 md:mt-0 ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Pickup Date</p>
                            <p className="text-gray-900 font-bold">{new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Return Date</p>
                            <p className="text-gray-900 font-bold">{new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Paid</p>
                            <p className="text-indigo-600 font-black text-lg">${booking.totalPrice}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {booking.status === BookingStatus.PENDING && (
                            <button className="bg-gray-50 text-gray-500 px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                                Cancel Request
                            </button>
                        )}
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="border-2 border-indigo-600 text-indigo-600 px-6 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors ml-auto"
                        >
                            Get Receipt
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedBooking && (
        <ReceiptModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}
    </div>
  );
};

export default MyBookings;
