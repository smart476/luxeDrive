
import { Car, User, Booking, UserRole, BookingStatus, AuthState } from '../types';
import { INITIAL_CARS, MOCK_USERS } from '../constants';

// Simulated database in localStorage
const DB_KEYS = {
  CARS: 'luxedrive_cars',
  USERS: 'luxedrive_users',
  BOOKINGS: 'luxedrive_bookings',
  AUTH: 'luxedrive_auth'
};

const getFromDB = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToDB = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize DB if empty
if (!localStorage.getItem(DB_KEYS.CARS)) saveToDB(DB_KEYS.CARS, INITIAL_CARS);
if (!localStorage.getItem(DB_KEYS.USERS)) saveToDB(DB_KEYS.USERS, MOCK_USERS);
if (!localStorage.getItem(DB_KEYS.BOOKINGS)) saveToDB(DB_KEYS.BOOKINGS, []);

export const apiService = {
  // --- Auth ---
  login: async (email: string, password: string): Promise<AuthState> => {
    const users = getFromDB<User[]>(DB_KEYS.USERS, []);
    const user = users.find(u => u.email === email);
    // Simple mock check
    if (user && !user.isBlocked) {
      const auth = { user, token: `mock_jwt_${user.id}_${Date.now()}` };
      saveToDB(DB_KEYS.AUTH, auth);
      return auth;
    }
    throw new Error('Invalid credentials or user is blocked');
  },

  register: async (userData: Partial<User>): Promise<User> => {
    const users = getFromDB<User[]>(DB_KEYS.USERS, []);
    if (users.some(u => u.email === userData.email)) throw new Error('Email already exists');
    
    const newUser: User = {
      id: `u${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      role: UserRole.USER,
      phone: userData.phone || '',
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveToDB(DB_KEYS.USERS, users);
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(DB_KEYS.AUTH);
  },

  getLoggedUser: (): AuthState | null => {
    return getFromDB<AuthState | null>(DB_KEYS.AUTH, null);
  },

  // --- Cars ---
  getCars: async (): Promise<Car[]> => {
    return getFromDB<Car[]>(DB_KEYS.CARS, []);
  },

  getCarById: async (id: string): Promise<Car | undefined> => {
    const cars = await apiService.getCars();
    return cars.find(c => c.id === id);
  },

  addCar: async (car: Omit<Car, 'id' | 'createdAt'>): Promise<Car> => {
    const cars = await apiService.getCars();
    const newCar = { ...car, id: `c${Date.now()}`, createdAt: new Date().toISOString() };
    cars.push(newCar);
    saveToDB(DB_KEYS.CARS, cars);
    return newCar;
  },

  updateCar: async (id: string, updates: Partial<Car>): Promise<Car> => {
    const cars = await apiService.getCars();
    const idx = cars.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Car not found');
    cars[idx] = { ...cars[idx], ...updates };
    saveToDB(DB_KEYS.CARS, cars);
    return cars[idx];
  },

  deleteCar: async (id: string): Promise<void> => {
    let cars = await apiService.getCars();
    cars = cars.filter(c => c.id !== id);
    saveToDB(DB_KEYS.CARS, cars);
  },

  // --- Bookings ---
  createBooking: async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    const bookings = getFromDB<Booking[]>(DB_KEYS.BOOKINGS, []);
    const newBooking: Booking = {
      ...booking,
      id: `b${Date.now()}`,
      status: BookingStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    saveToDB(DB_KEYS.BOOKINGS, bookings);
    return newBooking;
  },

  getMyBookings: async (userId: string): Promise<Booking[]> => {
    const bookings = getFromDB<Booking[]>(DB_KEYS.BOOKINGS, []);
    const cars = await apiService.getCars();
    return bookings
      .filter(b => b.userId === userId)
      .map(b => ({ ...b, carDetails: cars.find(c => c.id === b.carId) }));
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const bookings = getFromDB<Booking[]>(DB_KEYS.BOOKINGS, []);
    const cars = await apiService.getCars();
    const users = getFromDB<User[]>(DB_KEYS.USERS, []);
    return bookings.map(b => ({
      ...b,
      carDetails: cars.find(c => c.id === b.carId),
      userDetails: users.find(u => u.id === b.userId)
    }));
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
    const bookings = getFromDB<Booking[]>(DB_KEYS.BOOKINGS, []);
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    bookings[idx].status = status;
    saveToDB(DB_KEYS.BOOKINGS, bookings);
    return bookings[idx];
  },

  // --- Admin User Management ---
  getUsers: async (): Promise<User[]> => {
    return getFromDB<User[]>(DB_KEYS.USERS, []);
  },

  toggleBlockUser: async (id: string): Promise<User> => {
    const users = getFromDB<User[]>(DB_KEYS.USERS, []);
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    users[idx].isBlocked = !users[idx].isBlocked;
    saveToDB(DB_KEYS.USERS, users);
    return users[idx];
  }
};
