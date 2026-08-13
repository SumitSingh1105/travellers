import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Calendar,
  Wallet,
  Compass,
  Utensils,
  Lightbulb,
  Heart,
  Users,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { guideService } from '../services/guideService';
import { userService } from '../services/reviewService';
import { GuideCard } from '../components/GuideCard';
import { BookingModal } from '../components/BookingModal';
import { Loading } from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const DestinationDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, updateUserState } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [destData, guidesData] = await Promise.all([
          destinationService.getDestinationById(id),
          guideService.getGuides({ available: 'true' }),
        ]);

        if (destData.success && destData.destination) {
          setDestination(destData.destination);

          // Filter guides who match destination name or location, fallback to all guides
          const matched = guidesData.guides?.filter((g) =>
            g.location?.toLowerCase().includes(destData.destination.name?.toLowerCase()) ||
            destData.destination.location?.toLowerCase().includes(g.location?.toLowerCase())
          );
          setGuides(matched?.length > 0 ? matched : guidesData.guides?.slice(0, 3));
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, showToast]);

  useEffect(() => {
    if (user && destination) {
      const isSavedInUser = user.savedDestinations?.some(
        (item) => (typeof item === 'string' ? item : item?._id) === destination._id
      );
      setSaved(!!isSavedInUser);
    }
  }, [user, destination]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to save destinations.', 'info');
      navigate('/login');
      return;
    }

    try {
      const res = await userService.toggleSaveDestination(destination._id);
      setSaved(res.isSaved);
      showToast(res.message, res.isSaved ? 'success' : 'info');

      if (user) {
        updateUserState({
          ...user,
          savedDestinations: res.savedDestinations,
        });
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${destination.name} - TravelGuide`,
        text: destination.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading destination experience..." />;
  }

  if (!destination) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Destination Not Found</h2>
        <p className="text-sm text-slate-500">The destination you are looking for might have been moved or removed.</p>
        <Link to="/destinations" className="inline-block px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl">
          Back to Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      {/* Top Nav Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all destinations</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={handleToggleSave}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{saved ? 'Saved' : 'Save Destination'}</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase with Large Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] sm:h-[500px] lg:h-[550px] bg-slate-950">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Hero Bottom Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6 text-white">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-teal-500 text-white font-bold text-xs rounded-full shadow-md">
                {destination.category}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-semibold text-xs rounded-full">
                {destination.country || 'India'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-['Outfit'] tracking-tight">
              {destination.name}
            </h1>

            <div className="flex items-center gap-2 text-sm sm:text-base text-slate-200">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{destination.location}</span>
            </div>
          </div>

          {/* Quick Rating & Book Action */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold">{destination.rating?.toFixed(1) || '4.8'}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-medium">Overall Rating</span>
            </div>

            <button
              onClick={() => {
                setSelectedGuideForBooking(guides[0] || null);
                setBookingModalOpen(true);
              }}
              className="px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-teal-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              <span>Book a Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Details, Highlights, Tips */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
              About {destination.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Popular Attractions */}
          {destination.attractions?.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-teal-700">
                <Compass className="w-6 h-6" />
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
                  Popular Attractions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.attractions.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Food & Local Delicacies */}
          {destination.food?.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-amber-600">
                <Utensils className="w-6 h-6" />
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
                  Must-Try Local Food
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {destination.food.map((dish, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold rounded-xl"
                  >
                    🍲 {dish}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Travel Tips */}
          {destination.travelTips?.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-sky-600">
                <Lightbulb className="w-6 h-6" />
                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900">
                  Travel Tips from Local Guides
                </h2>
              </div>
              <ul className="space-y-3">
                {destination.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Info Card & Available Guides */}
        <div className="space-y-8">
          {/* Quick Info Box */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-['Outfit'] pb-3 border-b border-white/10">
              Trip Overview
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-xs">Best Time to Visit</p>
                  <p className="font-bold text-white">{destination.bestTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wallet className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-xs">Estimated Budget</p>
                  <p className="font-bold text-white">{destination.budget}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-xs">Region / Country</p>
                  <p className="font-bold text-white">
                    {destination.location}, {destination.country}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedGuideForBooking(guides[0] || null);
                setBookingModalOpen(true);
              }}
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition-all hover:scale-105"
            >
              Book a Verified Guide Now
            </button>
          </div>

          {/* Available Local Guides in this destination */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Available Guides ({guides.length})
            </h3>
            {guides.length === 0 ? (
              <p className="text-xs text-slate-500">No guides currently listed for this specific region.</p>
            ) : (
              <div className="space-y-4">
                {guides.map((guide) => (
                  <GuideCard
                    key={guide._id}
                    guide={guide}
                    onBookClick={(g) => {
                      setSelectedGuideForBooking(g);
                      setBookingModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedGuideForBooking(null);
        }}
        initialDestination={destination}
        initialGuide={selectedGuideForBooking}
      />
    </div>
  );
};

export default DestinationDetails;
