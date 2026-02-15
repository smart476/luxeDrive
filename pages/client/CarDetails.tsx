
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { getSmartCarDescription } from '../../services/geminiService';
import { Car, User, BookingStatus } from '../../types';

interface CarDetailsProps {
  user?: User | null;
}

const CarDetails: React.FC<CarDetailsProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [smartDescription, setSmartDescription] = useState<string>('');
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        const data = await apiService.getCarById(id);
        if (data) {
          setCar(data);
          const aiDesc = await getSmartCarDescription(data);
          setSmartDescription(aiDesc);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!car) return;

    setSubmitting(true);
    try {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (days <= 0) throw new Error("Check-out date must be after Check-in date");

      await apiService.createBooking({
        userId: user.id,
        carId: car.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice: days * car.pricePerDay,
        paymentStatus: 'pending'
      });

      setSuccess(true);
      
      // Simulated Real-time Notification
      setTimeout(() => {
        const event = new CustomEvent('simulate-sms', { 
          detail: { 
            phone: user.phone, 
            message: `Booking Confirmed! Your ${car.brand} ${car.model} is reserved for ${new Date(bookingData.startDate).toLocaleDateString()}. Ref: #LX-${Math.random().toString(36).substr(2, 5).toUpperCase()}` 
          } 
        });
        window.dispatchEvent(event);
      }, 1000);

      setTimeout(() => navigate('/my-bookings'), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to book");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 text-center font-bold">Loading car details...</div>;
  if (!car) return <div className="py-20 text-center font-bold">Car not found.</div>;

  const calculateTotal = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * car.pricePerDay : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/cars" className="inline-flex items-center gap-2 text-indigo-600 font-medium mb-8 hover:underline">
        <i className="fas fa-chevron-left text-xs"></i> Back to Fleet
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img src={car.image} alt={car.name} className="w-full h-[500px] object-cover" />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                {car.brand}
              </span>
              <span className="text-gray-400">&bull;</span>
              <span className="text-gray-500 font-medium">{car.category} Elite</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">{car.brand} {car.model} {car.year}</h1>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-robot text-indigo-500"></i> AI Insights
              </h3>
              <p className="text-gray-600 leading-relaxed italic text-lg">
                "{smartDescription}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Transmission', value: car.transmission, icon: 'fa-cog' },
              { label: 'Fuel Type', value: car.fuelType, icon: 'fa-gas-pump' },
              { label: 'Seats', value: car.seats, icon: 'fa-users' },
              { label: 'Max Power', value: '450 HP', icon: 'fa-bolt' }
            ].map((spec, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
                <i className={`fas ${spec.icon} text-indigo-600 text-xl mb-3`}></i>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{spec.label}</div>
                <div className="text-gray-900 font-bold mt-1">{spec.value}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Vehicle Description</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{car.description}</p>
          </div>
        </div>

        {/* Sidebar Booking */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl sticky top-24">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
              <div>
                <span className="text-3xl font-black text-indigo-600">${car.pricePerDay}</span>
                <span className="text-gray-400 font-medium">/day</span>
              </div>
              <div className="flex items-center text-yellow-500 font-bold">
                <i className="fas fa-star mr-1"></i> 4.9 <span className="text-gray-400 font-medium ml-1">(120)</span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Check-in Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Check-out Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({...bookingData, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-indigo-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">${car.pricePerDay} x Days</span>
                  <span className="font-bold text-gray-900">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-bold text-gray-900">$25</span>
                </div>
                <div className="pt-3 border-t border-indigo-100 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-indigo-600">${calculateTotal() ? calculateTotal() + 25 : 0}</span>
                </div>
              </div>

              {success ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center font-bold">
                  <i className="fas fa-check-circle mr-2"></i> Booking Successful!
                </div>
              ) : (
                <button 
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-4 rounded-2xl text-lg font-bold transition-all shadow-lg hover:shadow-indigo-200"
                >
                  {submitting ? 'Processing...' : user ? 'Book Now' : 'Sign in to Book'}
                </button>
              )}
              
              <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest">
                No payment required now
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
