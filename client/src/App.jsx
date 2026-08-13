import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Destinations } from './pages/Destinations';
import { DestinationDetails } from './pages/DestinationDetails';
import { Guides } from './pages/Guides';
import { GuideDetails } from './pages/GuideDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

// Dashboards
import { TravelerDashboard } from './dashboard/TravelerDashboard';
import { GuideDashboard } from './dashboard/GuideDashboard';
import { Bookings } from './dashboard/Bookings';
import { SavedPlaces } from './dashboard/SavedPlaces';
import { Profile } from './dashboard/Profile';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#fafcff] text-slate-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/:id" element={<DestinationDetails />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/guides/:id" element={<GuideDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard/traveler"
                  element={
                    <ProtectedRoute allowedRoles={['traveler']}>
                      <TravelerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/guide"
                  element={
                    <ProtectedRoute allowedRoles={['guide']}>
                      <GuideDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/bookings"
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/saved"
                  element={
                    <ProtectedRoute allowedRoles={['traveler']}>
                      <SavedPlaces />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
