
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { Car } from '../../types';
import { BRANDS, FUEL_TYPES } from '../../constants';

const CarListing: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState({
    brand: '',
    fuelType: '',
    search: '',
    maxPrice: 1000,
    sort: 'newest'
  });

  useEffect(() => {
    const fetchCars = async () => {
      const data = await apiService.getCars();
      setCars(data);
      setFilteredCars(data);
    };
    fetchCars();
  }, []);

  useEffect(() => {
    let result = cars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                          car.brand.toLowerCase().includes(filters.search.toLowerCase());
      const matchesBrand = filters.brand === '' || car.brand === filters.brand;
      const matchesFuel = filters.fuelType === '' || car.fuelType === filters.fuelType;
      const matchesPrice = car.pricePerDay <= filters.maxPrice;
      return matchesSearch && matchesBrand && matchesFuel && matchesPrice;
    });

    if (filters.sort === 'priceLow') {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filters.sort === 'priceHigh') {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    setFilteredCars(result);
  }, [filters, cars]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <i className="fas fa-sliders-h text-indigo-600"></i> Filters
            </h3>
            
            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Car</label>
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input 
                    type="text" 
                    placeholder="E.g. Tesla"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
                  value={filters.brand}
                  onChange={(e) => setFilters({...filters, brand: e.target.value})}
                >
                  <option value="">All Brands</option>
                  {BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type</label>
                <select 
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
                  value={filters.fuelType}
                  onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
                >
                  <option value="">Any Fuel</option>
                  {FUEL_TYPES.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Max Price/Day</label>
                  <span className="text-indigo-600 font-bold">${filters.maxPrice}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="50"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                />
              </div>

              <button 
                onClick={() => setFilters({brand: '', fuelType: '', search: '', maxPrice: 1000, sort: 'newest'})}
                className="w-full py-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:w-3/4">
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-500 font-medium">Showing <span className="text-gray-900">{filteredCars.length}</span> luxury cars</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Sort by:</span>
              <select 
                className="bg-transparent text-sm font-bold text-gray-900 border-none focus:ring-0 cursor-pointer"
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
              >
                <option value="newest">Newest First</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCars.map(car => (
              <div key={car.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div className="relative h-56">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {car.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{car.brand} {car.model}</h3>
                      <p className="text-sm text-gray-500">{car.year} &bull; {car.fuelType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-indigo-600">${car.pricePerDay}</p>
                      <p className="text-xs text-gray-400">per day</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 py-4 border-y border-gray-50 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                      <i className="fas fa-users text-indigo-400"></i> {car.seats} Seats
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                      <i className="fas fa-briefcase text-indigo-400"></i> 2 Bags
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                      <i className="fas fa-snowflake text-indigo-400"></i> AC
                    </div>
                  </div>

                  <Link 
                    to={`/cars/${car.id}`}
                    className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition-all group"
                  >
                    View Details
                    <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                  </Link>
                </div>
              </div>
            ))}

            {filteredCars.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <i className="fas fa-search text-4xl text-gray-200 mb-4"></i>
                <h3 className="text-xl font-bold text-gray-900">No cars found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarListing;
