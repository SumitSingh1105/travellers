import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleAuthButton } from '../components/GoogleAuthButton';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) return;

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success && res.user) {
        if (from) {
          navigate(from, { replace: true });
        } else if (res.user.role === 'guide') {
          navigate('/dashboard/guide', { replace: true });
        } else {
          navigate('/dashboard/traveler', { replace: true });
        }
      } else {
        setErrorMessage(res.message || 'Login failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (res) => {
    if (from) {
      navigate(from, { replace: true });
    } else if (res.user?.role === 'guide') {
      navigate('/dashboard/guide', { replace: true });
    } else {
      navigate('/dashboard/traveler', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-['Outfit'] text-slate-900">
              Travel<span className="text-teal-600">Guide</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] pt-2">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Log in to manage your trips, bookings, and profile
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs sm:text-sm animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative text-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-bold tracking-wider">
              OR
            </span>
          </div>
        </div>

        {/* Google Authentication Button */}
        <GoogleAuthButton
          text="Continue with Google"
          onSuccess={handleGoogleSuccess}
        />

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
