import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { guideService } from '../services/guideService';
import { userService } from '../services/reviewService';
import { reviewService } from '../services/reviewService';
import { useToast } from '../context/ToastContext';
import { Loading } from '../components/Loading';
import {
  Sparkles,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  User,
  Star,
  Check,
  X,
  Languages,
  Award,
  AlertCircle,
  MapPin,
  Edit3,
} from 'lucide-react';
import { GuideProfileSetupModal } from '../components/GuideProfileSetupModal';

export const GuideDashboard = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({
    totalRequests: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    totalEarnings: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick settings state
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [price, setPrice] = useState(user?.price || 1500);
  const [languages, setLanguages] = useState(
    Array.isArray(user?.languages) ? user.languages.join(', ') : 'English, Hindi'
  );
  const [savingSettings, setSavingSettings] = useState(false);
  const [guideSetupModalOpen, setGuideSetupModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, bookingsData, reviewsData] = await Promise.all([
        userService.getGuideStats(),
        bookingService.getGuideBookings(),
        reviewService.getGuideReviews(user._id),
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (bookingsData.success) setBookings(bookingsData.bookings || []);
      if (reviewsData.success) setReviews(reviewsData.reviews || []);
    } catch (err) {
      console.error('Error loading guide dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user?._id]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus.toLowerCase());
      showToast(`Booking status updated to ${newStatus}`, 'success');
      fetchDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleSaveGuideSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await guideService.updateGuide(user._id, {
        price: Number(price),
        isAvailable,
        languages: languages.split(',').map((s) => s.trim()),
      });

      if (res.success) {
        showToast('Guide settings updated successfully!', 'success');
        updateUserState(res.guide);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'completed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading guide dashboard..." />;
  }

  const pendingRequests = bookings.filter((b) => (b.status || '').toLowerCase() === 'pending');
  const confirmedTrips = bookings.filter((b) => (b.status || '').toLowerCase() === 'confirmed');
  const completedTrips = bookings.filter((b) => (b.status || '').toLowerCase() === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Welcome Guide Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-teal-400 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
                {user?.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                ⭐ {user?.rating ? user.rating.toFixed(1) : '5.0'} ({reviews.length} reviews)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Local Tour Guide • {user?.location || 'India'} • ₹{user?.price || 1500}/day
            </p>
          </div>
        </div>

        {/* Quick Availability Badge */}
        <div className="flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/20">
          <span className="text-xs font-medium text-slate-300">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isAvailable
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-500 text-white'
            }`}
          >
            {isAvailable ? '🟢 Accepting Bookings' : '⚪ Unavailable'}
          </span>
        </div>
      </div>

      {/* Incomplete Profile Banner for Google-registered guides */}
      {(!user?.isProfileComplete || !user?.location) && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-amber-950">
                Complete Your Guide Profile to Go Live
              </h4>
              <p className="text-xs text-amber-800">
                Your profile is not yet published to travelers on the Guides page. Set your tour city, experience, and pricing.
              </p>
            </div>
          </div>

          <button
            onClick={() => setGuideSetupModalOpen(true)}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 shrink-0 flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Complete Profile</span>
          </button>
        </div>
      )}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Requests</p>
          <p className="text-3xl font-extrabold text-amber-500 font-['Outfit'] mt-1">
            {pendingRequests.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Trips</p>
          <p className="text-3xl font-extrabold text-teal-600 font-['Outfit'] mt-1">
            {confirmedTrips.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Trips</p>
          <p className="text-3xl font-extrabold text-cyan-600 font-['Outfit'] mt-1">
            {completedTrips.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
          <p className="text-3xl font-extrabold text-emerald-600 font-['Outfit'] mt-1">
            ₹{stats.totalEarnings}
          </p>
        </div>
      </div>

      {/* Main Grid: Bookings on Left, Settings on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Booking Requests */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. New Booking Requests */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>New Booking Requests ({pendingRequests.length})</span>
            </h2>

            {pendingRequests.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center space-y-2">
                <p className="text-sm text-slate-500">No new booking requests at the moment.</p>
                <p className="text-xs text-slate-400">When a traveler requests your services, it will appear here for your approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md shadow-amber-100/40 space-y-4 animate-fade-in"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            b.traveler?.profileImage ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={b.traveler?.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-teal-500"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-base">{b.traveler?.name}</p>
                          <p className="text-xs text-slate-500">{b.traveler?.email}</p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800">
                        Pending Your Approval
                      </span>
                    </div>

                    {/* Trip Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-2xl">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination</span>
                        <span className="font-bold text-slate-800 text-sm">{b.destination?.name}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Date</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {new Date(b.travelDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Travelers / Days</span>
                        <span className="font-bold text-slate-800 text-sm">{b.travelers} pers • {b.days} day(s)</span>
                      </div>
                      <div className="p-3 bg-teal-50 rounded-2xl">
                        <span className="text-teal-600 block text-[10px] uppercase font-bold">Total Payout</span>
                        <span className="font-extrabold text-teal-900 text-sm">₹{b.totalAmount}</span>
                      </div>
                    </div>

                    {b.message && (
                      <p className="text-xs text-slate-700 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100">
                        <strong className="text-slate-900">Traveler Note:</strong> "{b.message}"
                      </p>
                    )}

                    {/* Action Buttons: Accept / Reject */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                        className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5 hover:scale-105"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Request</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                        className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Upcoming & Confirmed Trips */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              <span>Confirmed Upcoming Trips ({confirmedTrips.length})</span>
            </h2>

            {confirmedTrips.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-xs text-slate-500">
                No upcoming confirmed trips.
              </div>
            ) : (
              <div className="space-y-4">
                {confirmedTrips.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={b.destination?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=200&q=80'}
                        alt={b.destination?.name}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{b.destination?.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            Confirmed
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Traveler: <span className="font-semibold">{b.traveler?.name}</span> ({b.traveler?.email})
                        </p>
                        <p className="text-xs text-slate-500">
                          Date: {new Date(b.travelDate).toLocaleDateString()} • {b.days} day(s) • ₹{b.totalAmount}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpdateStatus(b._id, 'completed')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Trip Completed</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Completed Trips History */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600" />
              <span>Completed Trips History ({completedTrips.length})</span>
            </h2>

            {completedTrips.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-xs text-slate-500">
                No completed tours yet.
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                {completedTrips.map((b) => (
                  <div key={b._id} className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{b.destination?.name} with {b.traveler?.name}</p>
                      <p className="text-xs text-slate-500">
                        Date: {new Date(b.travelDate).toLocaleDateString()} • {b.days} days • ₹{b.totalAmount}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-teal-800">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Profile Settings Form */}
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Quick Guide Settings
            </h3>

            <form onSubmit={handleSaveGuideSettings} className="space-y-4">
              {/* Availability Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Availability Status
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="radio"
                      name="avail"
                      checked={isAvailable === true}
                      onChange={() => setIsAvailable(true)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                    <input
                      type="radio"
                      name="avail"
                      checked={isAvailable === false}
                      onChange={() => setIsAvailable(false)}
                      className="text-slate-600 focus:ring-slate-500"
                    />
                    <span>Busy / On Leave</span>
                  </label>
                </div>
              </div>

              {/* Daily Rate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Rate (₹ INR)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Languages Spoken
                </label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="English, Hindi, French"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50"
              >
                {savingSettings ? 'Saving...' : 'Update Settings'}
              </button>
            </form>
          </div>

          {/* Traveler Reviews list preview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
              Latest Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400">No reviews received yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r._id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800">{r.user?.name}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span className="text-xs font-bold">{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guide Profile Setup Modal */}
      <GuideProfileSetupModal
        isOpen={guideSetupModalOpen}
        onClose={() => setGuideSetupModalOpen(false)}
        onComplete={() => {
          setGuideSetupModalOpen(false);
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default GuideDashboard;
