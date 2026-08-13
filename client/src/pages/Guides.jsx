import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { guideService } from '../services/guideService';
import { GuideCard } from '../components/GuideCard';
import { BookingModal } from '../components/BookingModal';
import { Loading } from '../components/Loading';
import { Search, MapPin, Sparkles, Users, CheckCircle, UserPlus, RotateCcw } from 'lucide-react';

export const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState(null);

  const locations = ['All', 'Delhi', 'Jaipur', 'Varanasi', 'Manali', 'Goa', 'Mumbai', 'Bengaluru', 'Agra', 'Kerala'];
  const languages = ['All', 'English', 'Hindi', 'French', 'Rajasthani', 'Konkani', 'Punjabi', 'Spanish', 'German'];

  const hasActiveFilters = search.trim() !== '' || selectedLocation !== 'All' || selectedLanguage !== 'All' || onlyAvailable;

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (selectedLocation !== 'All') params.location = selectedLocation;
        if (selectedLanguage !== 'All') params.language = selectedLanguage;
        if (onlyAvailable) params.available = 'true';

        const data = await guideService.getGuides(params);
        setGuides(data.guides || []);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setGuides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [search, selectedLocation, selectedLanguage, onlyAvailable]);

  const handleBookGuide = (guide) => {
    setSelectedGuideForBooking(guide);
    setBookingModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedLocation('All');
    setSelectedLanguage('All');
    setOnlyAvailable(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-teal-600" />
          <span>Local Storytellers & Experts</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">
          Find Your Perfect Local Guide
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Connect directly with certified local guides for private tours, heritage walks, culinary safaris, and mountain treks.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guide name, bio..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Locations</option>
              {locations.filter((l) => l !== 'All').map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="All">All Languages</option>
              {languages.filter((l) => l !== 'All').map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Available only toggle */}
          <div className="flex items-center gap-2 px-2 py-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
              />
              <span>Available Now Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Guide Listing Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : guides.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-5 animate-fade-in">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              No guides available yet
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Be the first to register as a local guide and share your experience with travelers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/register?role=guide"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as a Guide</span>
            </Link>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <GuideCard
              key={guide._id}
              guide={guide}
              onBookClick={handleBookGuide}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedGuideForBooking(null);
        }}
        initialGuide={selectedGuideForBooking}
      />
    </div>
  );
};

export default Guides;
