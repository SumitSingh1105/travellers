import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  Menu,
  X,
  User,
  Heart,
  Calendar,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isGuide, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (isGuide) return '/dashboard/guide';
    return '/dashboard/traveler';
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-teal-600 ${
      isActive ? 'text-teal-600 font-semibold' : 'text-slate-700'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav bg-white/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-['Outfit']">
                Travel<span className="text-teal-600">Guide</span>
              </span>
              <span className="block text-[10px] tracking-wider uppercase text-slate-600 font-medium -mt-1">
                Explore • Discover • Experience
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/destinations" className={navLinkClass}>
              Destinations
            </NavLink>
            <NavLink to="/guides" className={navLinkClass}>
              Guides
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <img
                    src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-teal-500"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-medium text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        {isGuide ? (
                          <Sparkles className="w-4 h-4 text-teal-600" />
                        ) : (
                          <Calendar className="w-4 h-4 text-teal-600" />
                        )}
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-teal-600" />
                        Profile Settings
                      </Link>

                      {!isGuide && (
                        <Link
                          to="/dashboard/saved"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                          Saved Places
                        </Link>
                      )}

                      <Link
                        to="/dashboard/bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-teal-600" />
                        All Bookings
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-xl shadow-md shadow-teal-500/20 hover:shadow-teal-500/30 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 rounded-lg hover:bg-teal-50 hover:text-teal-600"
            >
              Home
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 rounded-lg hover:bg-teal-50 hover:text-teal-600"
            >
              Destinations
            </Link>
            <Link
              to="/guides"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 rounded-lg hover:bg-teal-50 hover:text-teal-600"
            >
              Guides
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 rounded-lg hover:bg-teal-50 hover:text-teal-600"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 rounded-lg hover:bg-teal-50 hover:text-teal-600"
            >
              Contact
            </Link>
          </nav>

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl mb-3">
                  <img
                    src={user?.profileImage}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover border border-teal-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-medium text-slate-700 hover:text-teal-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-medium text-slate-700 hover:text-teal-600"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 font-medium text-slate-700 hover:text-teal-600"
                >
                  Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow-md shadow-teal-600/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
