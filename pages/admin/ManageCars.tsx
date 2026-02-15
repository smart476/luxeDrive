
import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';
import { Car } from '../../types';
import { BRANDS, FUEL_TYPES } from '../../constants';

const ManageCars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState<Partial<Car>>({});

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const data = await apiService.getCars();
    setCars(data);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this vehicle from inventory?")) {
      await apiService.deleteCar(id);
      fetchCars();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentCar.id) {
        await apiService.updateCar(currentCar.id, currentCar);
      } else {
        await apiService.addCar(currentCar as any);
      }
      setIsModalOpen(false);
      setCurrentCar({});
      fetchCars();
    } catch (err) {
      alert("Error saving car");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Fleet Inventory</h1>
          <p className="text-gray-500 font-medium">Manage and update your premium vehicle catalog</p>
        </div>
        <button 
          onClick={() => { setCurrentCar({}); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Add New Vehicle
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Vehicle Image</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Details</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Pricing</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400">Status</th>
              <th className="px-8 py-6 text-[10px] uppercase font-bold text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <img src={car.image} alt={car.name} className="w-24 h-16 object-cover rounded-xl" />
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-gray-900">{car.brand} {car.model}</p>
                  <p className="text-xs text-gray-500">{car.year} &bull; {car.fuelType} &bull; {car.transmission}</p>
                </td>
                <td className="px-8 py-6 font-black text-indigo-600">
                  ${car.pricePerDay}<span className="text-[10px] text-gray-400 font-medium ml-1">/day</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${car.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {car.isAvailable ? 'Available' : 'Booked'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-3">
                  <button 
                    onClick={() => { setCurrentCar(car); setIsModalOpen(true); }}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDelete(car.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl">
            <h2 className="text-2xl font-black text-gray-900 mb-8">{currentCar.id ? 'Update Vehicle' : 'New Fleet Addition'}</h2>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Car Name (Display)</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={currentCar.name || ''}
                  onChange={e => setCurrentCar({...currentCar, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Brand</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={currentCar.brand || ''}
                  onChange={e => setCurrentCar({...currentCar, brand: e.target.value})}
                >
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price Per Day ($)</label>
                <input 
                  type="number" required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={currentCar.pricePerDay || 0}
                  onChange={e => setCurrentCar({...currentCar, pricePerDay: parseInt(e.target.value)})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                <input 
                  type="text" required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={currentCar.image || ''}
                  onChange={e => setCurrentCar({...currentCar, image: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Internal Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  value={currentCar.description || ''}
                  onChange={e => setCurrentCar({...currentCar, description: e.target.value})}
                />
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all">Cancel</button>
                <button type="submit" className="flex-[2] px-6 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg">Save Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCars;
