
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum BookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Automatic' | 'Manual';
  seats: number;
  description: string;
  image: string;
  isAvailable: boolean;
  category: 'Luxury' | 'SUV' | 'Sedan' | 'Sports';
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: 'paid' | 'pending';
  createdAt: string;
  carDetails?: Car;
  userDetails?: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
