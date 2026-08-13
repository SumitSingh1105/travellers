import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Heart, ArrowRight, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/reviewService';
import { useToast } from '../context/ToastContext';

export const DestinationCard = ({ destination, isSavedInitially = false, onRemoveSaved }) => {
  const { user, isAuthenticated, updateUserState } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Check if destination is in user's saved array
  const isSavedInUser = user?.savedDestinations?.some(
    (item) => (typeof item === 'string' ? item : item?._id) === destination._id
  );

  const [saved, setSaved] = useState(isSavedInitially || isSavedInUser || false);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please log in to save your favorite destinations.', 'info');
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      const res = await userService.toggleSaveDestination(destination._id);
      setSaved(res.isSaved);
      showToast(res.message, res.isSaved ? 'success' : 'info');

      // Update auth user saved list in context
      if (user) {
        updateUserState({
          ...user,
          savedDestinations: res.savedDestinations,
        });
      }

      if (onRemoveSaved && !res.isSaved) {
        onRemoveSaved(destination._id);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Beach':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Mountain':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Historical':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Religious':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Adventure':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <span
          className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${getCategoryColor(
            destination.category
          )}`}
        >
          {destination.category}
        </span>

        {/* Save/Heart Button */}
        <button
          onClick={handleToggleSave}
          disabled={saving}
          aria-label="Save destination"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-600 hover:bg-white transition-all shadow-md active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Location tag on image bottom */}
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white text-xs font-medium">
          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="drop-shadow-sm">{destination.location}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] group-hover:text-teal-600 transition-colors">
              {destination.name}
            </h3>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-800">
                {destination.rating?.toFixed(1) || '4.8'}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        {/* Bottom Details & Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-medium text-slate-600 block">Est. Budget</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {destination.budget?.split('/')[0] || '₹3,000'}
            </span>
          </div>

          <Link
            to={`/destinations/${destination._id}`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-teal-600 rounded-xl transition-all shadow-sm hover:shadow-teal-600/20 group-hover:bg-teal-600"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
