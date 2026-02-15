
import React, { useEffect, useState } from 'react';

interface SMSNotificationProps {
  show: boolean;
  onClose: () => void;
  phone: string;
  message: string;
}

const SMSNotification: React.FC<SMSNotificationProps> = ({ show, onClose, phone, message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Wait for exit animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-[200] transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-4 w-80 flex gap-4 items-start">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
          <i className="fas fa-comment-dots"></i>
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Messages</span>
            <span className="text-[10px] text-gray-400">now</span>
          </div>
          <p className="text-xs font-bold text-gray-900 mb-1">LuxeDrive Concierge</p>
          <p className="text-xs text-gray-600 leading-tight">
            Sent to: <span className="font-semibold text-gray-800">{phone}</span><br/>
            "{message}"
          </p>
        </div>
        <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-gray-600">
          <i className="fas fa-times text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default SMSNotification;
