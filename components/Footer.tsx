
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
                <i className="fas fa-car-side text-sm"></i>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">LuxeDrive</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium car rental service offering the world's most luxurious and capable vehicles. Experience the ultimate driving pleasure with LuxeDrive.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-indigo-600 text-sm">Home</Link></li>
              <li><Link to="/cars" className="text-gray-500 hover:text-indigo-600 text-sm">Rent a Car</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-indigo-600 text-sm">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-500 text-sm">Contact Us</span></li>
              <li><span className="text-gray-500 text-sm">FAQ</span></li>
              <li><span className="text-gray-500 text-sm">Privacy Policy</span></li>
              <li><span className="text-gray-500 text-sm">Terms of Service</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-indigo-600"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} LuxeDrive Rental Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
