
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User, UserRole, AuthState } from './types';
import { apiService } from './services/apiService';

// Pages
import Home from './pages/client/Home';
import CarListing from './pages/client/CarListing';
import CarDetails from './pages/client/CarDetails';
import MyBookings from './pages/client/MyBookings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageBookings from './pages/admin/ManageBookings';
import ManageUsers from './pages/admin/ManageUsers';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SMSNotification from './components/SMSNotification';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; phone: string; message: string }>({
    show: false,
    phone: '',
    message: ''
  });

  useEffect(() => {
    const loggedUser = apiService.getLoggedUser();
    if (loggedUser) {
      setAuth(loggedUser);
    }

    // Add global listener for simulated SMS notifications
    const handleNotify = (e: any) => {
      setNotification({
        show: true,
        phone: e.detail.phone,
        message: e.detail.message
      });
    };
    window.addEventListener('simulate-sms', handleNotify);
    return () => window.removeEventListener('simulate-sms', handleNotify);
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setAuth(null);
  };

  const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: UserRole }) => {
    if (!auth) return <Navigate to="/login" />;
    if (role && auth.user?.role !== role) return <Navigate to="/" />;
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={auth?.user} onLogout={handleLogout} />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarListing />} />
            <Route path="/cars/:id" element={<CarDetails user={auth?.user} />} />
            <Route path="/login" element={auth ? <Navigate to="/" /> : <Login onLoginSuccess={setAuth} />} />
            <Route path="/register" element={auth ? <Navigate to="/" /> : <Register />} />

            {/* User Routes */}
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MyBookings user={auth?.user} />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role={UserRole.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/cars" element={
              <ProtectedRoute role={UserRole.ADMIN}>
                <ManageCars />
              </ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute role={UserRole.ADMIN}>
                <ManageBookings />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute role={UserRole.ADMIN}>
                <ManageUsers />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
        
        <SMSNotification 
          show={notification.show} 
          phone={notification.phone} 
          message={notification.message}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      </div>
    </Router>
  );
};

export default App;
