
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { Car } from '../../types';

const Home: React.FC = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      const allCars = await apiService.getCars();
      setFeaturedCars(allCars.slice(0, 3));
    };
    fetchCars();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Hero Car" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Drive the <span className="text-indigo-400">Future</span> of Luxury
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Unlock extraordinary experiences with our curated fleet of the world's most prestigious vehicles. Instant booking, zero hidden fees, pure performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/cars" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-semibold text-center transition-all hover:scale-105"
              >
                Browse Our Fleet
              </Link>
              <Link 
                to="/register" 
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold text-center transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Luxury Cars', value: '50+' },
            { label: 'Happy Clients', value: '10k+' },
            { label: 'Destinations', value: '12' },
            { label: 'Support 24/7', value: 'Live' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Fleet</h2>
            <p className="text-gray-500 mt-2">Experience the best of our premium selection</p>
          </div>
          <Link to="/cars" className="text-indigo-600 font-semibold hover:underline flex items-center gap-2">
            View All Cars <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map(car => (
            <div key={car.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600">
                  {car.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{car.brand} {car.model}</h3>
                    <p className="text-gray-500 text-sm">{car.year} &bull; {car.fuelType}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-indigo-600">${car.pricePerDay}</span>
                    <span className="text-gray-400 text-sm">/day</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs text-gray-500">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <i className="fas fa-gas-pump mb-1 block text-indigo-500"></i>
                    {car.fuelType}
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <i className="fas fa-cog mb-1 block text-indigo-500"></i>
                    {car.transmission}
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <i className="fas fa-user-friends mb-1 block text-indigo-500"></i>
                    {car.seats} Seats
                  </div>
                </div>
                <Link 
                  to={`/cars/${car.id}`}
                  className="block w-full text-center bg-gray-900 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to hit the road?</h2>
            <p className="text-indigo-100 text-xl mb-10">
              Join thousands of satisfied drivers. Sign up today and get 15% off your first rental.
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
