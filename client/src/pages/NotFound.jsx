import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 text-center animate-fade-in">
      <div className="max-w-md w-full space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border-4 border-teal-100 shadow-xl">
            <Compass className="w-12 h-12 animate-[spin_10s_linear_infinite]" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-6xl font-extrabold text-slate-900 font-['Outfit']">404</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Oops! Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Looks like you've wandered off the map! The destination or page you are looking for doesn't exist.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/destinations"
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-all hover:scale-105"
          >
            Explore Places
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
