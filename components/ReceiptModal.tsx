
import React from 'react';
import { Booking } from '../types';

interface ReceiptModalProps {
  booking: Booking | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
                <i className="fas fa-car-side text-sm"></i>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">LuxeDrive</span>
            </div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Official Rental Receipt</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="border-y border-gray-100 py-8 mb-8 grid grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Billed To</p>
            <p className="text-sm font-bold text-gray-900">{booking.userDetails?.name || 'Valued Client'}</p>
            <p className="text-xs text-gray-500">{booking.userDetails?.email}</p>
            <p className="text-xs text-gray-500">{booking.userDetails?.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Booking Details</p>
            <p className="text-sm font-bold text-gray-900">#LX-{booking.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-gray-500">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
            <p className={`text-[10px] font-black uppercase mt-2 inline-block px-2 py-1 rounded bg-indigo-50 text-indigo-600`}>
              Status: {booking.status}
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src={booking.carDetails?.image} className="w-16 h-12 object-cover rounded-lg" alt="Car" />
              <div>
                <p className="text-sm font-bold text-gray-900">{booking.carDetails?.brand} {booking.carDetails?.model}</p>
                <p className="text-xs text-gray-400">{booking.carDetails?.year} &bull; {booking.carDetails?.transmission}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">${booking.carDetails?.pricePerDay}/day</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Rental Duration</span>
              <span className="font-bold text-gray-900">
                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Base Fare</span>
              <span className="font-bold text-gray-900">${booking.totalPrice}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Service Fee</span>
              <span className="font-bold text-gray-900">$25.00</span>
            </div>
            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-900">Amount Paid</span>
              <span className="text-xl font-black text-indigo-600">${booking.totalPrice + 25}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="flex-grow bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-print"></i> Download PDF
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
        
        <p className="text-center text-[10px] text-gray-300 mt-8 uppercase tracking-widest font-bold">
          LuxeDrive Premium Rental Services &bull; Verified Transaction
        </p>
      </div>
    </div>
  );
};

export default ReceiptModal;
