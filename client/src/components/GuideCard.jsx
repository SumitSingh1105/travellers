import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Languages, Award, Calendar, CheckCircle, Clock } from 'lucide-react';

export const GuideCard = ({ guide, onBookClick }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div className="p-6">
        {/* Top Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={guide.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={guide.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm group-hover:scale-105 transition-transform"
            />
            {guide.isAvailable ? (
              <span
                title="Available for bookings"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
              />
            ) : (
              <span
                title="Currently booked"
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-400 border-2 border-white rounded-full"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] truncate group-hover:text-teal-600 transition-colors">
                {guide.name}
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-800">
                  {guide.rating ? guide.rating.toFixed(1) : '5.0'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{guide.location}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{guide.experience || 'Local Guide'}</span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {guide.bio || 'Local storyteller and verified tour guide.'}
        </p>

        {/* Languages tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {guide.languages?.slice(0, 3).map((lang, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg"
            >
              {lang}
            </span>
          ))}
          {guide.languages?.length > 3 && (
            <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">
              +{guide.languages.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer Pricing & Actions */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-600 block uppercase tracking-wider">
            Daily Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-slate-900">
              ₹{guide.price || 1500}
            </span>
            <span className="text-[11px] text-slate-600 font-medium">/ day</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/guides/${guide._id}`}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Profile
          </Link>
          <button
            onClick={() => onBookClick && onBookClick(guide)}
            disabled={!guide.isAvailable}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition-all shadow-sm ${
              guide.isAvailable
                ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20 hover:scale-105'
                : 'bg-slate-300 cursor-not-allowed text-slate-500'
            }`}
          >
            {guide.isAvailable ? 'Book Guide' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
