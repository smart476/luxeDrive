
import { Car, User, UserRole, Booking, BookingStatus } from './types';

export const INITIAL_CARS: Car[] = [
  {
    id: '1',
    name: 'Model S Plaid',
    brand: 'Tesla',
    model: 'Model S',
    year: 2023,
    pricePerDay: 250,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seats: 5,
    description: 'The quickest accelerating car in production today. Model S Plaid has the highest power and quickest acceleration of any electric vehicle in production.',
    image: 'https://picsum.photos/seed/tesla1/800/600',
    isAvailable: true,
    category: 'Luxury',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: '911 Carrera',
    brand: 'Porsche',
    model: '911',
    year: 2022,
    pricePerDay: 350,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 2,
    description: 'The silhouette of the 911 is timeless. Its design has been modernised, yet its character remains as classic as ever.',
    image: 'https://picsum.photos/seed/porsche1/800/600',
    isAvailable: true,
    category: 'Sports',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'G-Wagon G63',
    brand: 'Mercedes',
    model: 'G-Class',
    year: 2023,
    pricePerDay: 450,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: 5,
    description: 'Unmatched performance and design. The G-Class has been a symbol of luxury and power for decades.',
    image: 'https://picsum.photos/seed/mercedes1/800/600',
    isAvailable: true,
    category: 'SUV',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'A8 L',
    brand: 'Audi',
    model: 'A8',
    year: 2023,
    pricePerDay: 200,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    seats: 5,
    description: 'The pinnacle of Audi luxury and engineering. Experience a new dimension of comfort.',
    image: 'https://picsum.photos/seed/audi1/800/600',
    isAvailable: true,
    category: 'Sedan',
    createdAt: new Date().toISOString()
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@luxedrive.com',
    role: UserRole.ADMIN,
    phone: '1234567890',
    isBlocked: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'u2',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.USER,
    phone: '0987654321',
    isBlocked: false,
    createdAt: new Date().toISOString()
  }
];

export const BRANDS = ['Tesla', 'Porsche', 'Mercedes', 'Audi', 'BMW', 'Range Rover', 'Lexus'];
export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
