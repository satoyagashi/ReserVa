import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ParkingProvider } from './components/ParkingContext';

// Layouts
import Layout from './components/Layout';
import StudentLayout from './components/StudentLayout';

// Public & Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Landing from './pages/Landing';

// Student Pages
import FindParking from './pages/FindParking';
import MyVehicles from './pages/MyVehicles';
import Profile from './pages/Profile';
import MyReservations from './pages/MyReservations';

// Admin Pages
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import Zones from './pages/Zones';
import Slots from './pages/Slots';

// Vehicle Management Pages (Ikarii03 components)
import AdminVehicleVerification from './pages/vehicles/AdminVehicleVerification';
import ParkwiseMyVehicles from './pages/vehicles/ParkwiseMyVehicles';
import AddVehicle from './pages/vehicles/AddVehicle';

export default function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          {/* Root defaults to Login / Sign In per requirements */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/landing" element={<Landing />} />

          {/* Student Portal Routes */}
          <Route element={<StudentLayout />}>
            <Route path="/find-parking" element={<FindParking />} />
            <Route path="/slots" element={<FindParking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reservations" element={<MyReservations />} />
            <Route path="/my-reservations" element={<MyReservations />} />
          </Route>

          {/* Dedicated ParkWise Vehicle Management Routes (Ikarii03 teammate design) */}
          <Route path="/vehicles" element={<ParkwiseMyVehicles />} />
          <Route path="/my-vehicles" element={<ParkwiseMyVehicles />} />
          <Route path="/vehicles/add" element={<AddVehicle />} />
          <Route path="/add-vehicle" element={<AddVehicle />} />
          <Route path="/admin/vehicles" element={<AdminVehicleVerification />} />
          <Route path="/admin/vehicle-verification" element={<AdminVehicleVerification />} />

          {/* Admin Backoffice Routes */}
          <Route element={<Layout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/reservations" element={<Reservations />} />
            <Route path="/admin/zones" element={<Zones />} />
            <Route path="/admin/slots" element={<Slots />} />

            {/* Direct fallback routes */}
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/zones" element={<Navigate to="/admin/zones" replace />} />
          </Route>

          {/* 404 Not Found Page */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: 'sans-serif' }}>
                <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>404</h1>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>Page not found.</p>
                <a
                  href="/"
                  style={{
                    background: '#0284c7',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  Return to Home
                </a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  );
}
