import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DestinationCard } from '../components/DestinationCard';
import { Loading } from '../components/Loading';
import { Heart, Compass, SearchX } from 'lucide-react';

export const SavedPlaces = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const data = await userService.getSavedDestinations();
      if (data.success) {
        setSavedDestinations(data.savedDestinations || []);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemoveSaved = (removedId) => {
    setSavedDestinations((prev) => prev.filter((d) => d._id !== removedId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>Wishlist & Bookmarks</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Saved Places ({savedDestinations.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Destinations you've bookmarked for your next dream getaway
          </p>
        </div>

        <Link
          to="/destinations"
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all self-start sm:self-auto flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Places</span>
        </Link>
      </div>

      {loading ? (
        <Loading text="Loading your saved places..." />
      ) : savedDestinations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
            No Saved Places Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Click the heart icon on any destination card to save it to your personalized wishlist!
          </p>
          <Link
            to="/destinations"
            className="inline-block px-5 py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-md"
          >
            Browse Destinations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedDestinations.map((destination) => (
            <DestinationCard
              key={destination._id}
              destination={destination}
              isSavedInitially={true}
              onRemoveSaved={handleRemoveSaved}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPlaces;
