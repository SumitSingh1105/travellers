import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, reviewService } from '../services/reviewService';
import { bookingService } from '../services/bookingService';
import { useToast } from '../context/ToastContext';
import { Loading } from '../components/Loading';
import {
  Compass,
  Calendar,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  MapPin,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const TravelerDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState({ totalBookings: 0, upcomingTrips: 0, savedPlaces: 0 });
  const [bookings, setBookings] = useState([]);
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, bookingsData, savedData] = await Promise.all([
        userService.getTravelerStats(),
        bookingService.getMyBookings(),
        userService.getSavedDestinations(),
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (bookingsData.success) setBookings(bookingsData.bookings || []);
      if (savedData.success) setSavedDestinations(savedData.savedDestinations || []);
    } catch (err) {
      console.error('Error loading traveler dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.updateBookingStatus(bookingId, 'cancelled');
      showToast('Booking cancelled successfully', 'info');
      fetchDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please provide a comment for your review', 'warning');
      return;
    }

    try {
      setSubmittingReview(true);
      await reviewService.createReview({
        guideId: selectedBookingForReview.guide?._id || selectedBookingForReview.guide,
        bookingId: selectedBookingForReview._id,
        rating,
        comment,
      });

      showToast('Review submitted successfully! Thank you.', 'success');
      setReviewModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
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
    return <Loading fullScreen text="Loading traveler dashboard..." />;
  }

  const pendingBookings = bookings.filter((b) => (b.status || '').toLowerCase() === 'pending');
  const confirmedBookings = bookings.filter((b) => (b.status || '').toLowerCase() === 'confirmed');
  const completedBookings = bookings.filter((b) => (b.status || '').toLowerCase() === 'completed');
  const cancelledBookings = bookings.filter((b) => (b.status || '').toLowerCase() === 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Traveler Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Outfit']">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your trips, guide booking requests, and manage your saved destinations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/destinations"
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
          >
            Explore Places
          </Link>
          <Link
            to="/guides"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all"
          >
            Find a Guide
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {bookings.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Confirmed Trips</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {confirmedBookings.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Heart className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Saved Places</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
              {savedDestinations.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Categorized Bookings */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Pending Requests */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Pending Requests ({pendingBookings.length})</span>
            </h2>

            {pendingBookings.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-xs text-slate-500">
                No pending booking requests waiting for guide approval.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={b.destination?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=200&q=80'}
                        alt={b.destination?.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{b.destination?.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            Waiting Guide Confirmation
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Guide: <span className="font-semibold text-slate-800">{b.guide?.name}</span> ({b.guide?.location})
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-teal-600" />
                          <span>
                            {new Date(b.travelDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span>• {b.days} day(s) • {b.travelers} traveler(s)</span>
                        </p>
                        {b.message && (
                          <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg mt-1">
                            "{b.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <p className="text-sm font-extrabold text-slate-900">₹{b.totalAmount}</p>
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        Cancel Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Confirmed Trips */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Confirmed Trips ({confirmedBookings.length})</span>
            </h2>

            {confirmedBookings.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-xs text-slate-500">
                No active confirmed trips. Book a guide to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {confirmedBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={b.destination?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=200&q=80'}
                        alt={b.destination?.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{b.destination?.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            Booking Confirmed
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Guide: <span className="font-semibold text-slate-800">{b.guide?.name}</span> ({b.guide?.location})
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-teal-600" />
                          <span>
                            {new Date(b.travelDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span>• {b.days} day(s) • {b.travelers} traveler(s)</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <p className="text-sm font-extrabold text-slate-900">₹{b.totalAmount}</p>
                      <span className="text-[11px] font-bold text-emerald-600">Accepted by Guide</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Completed Trips & Reviews */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Star className="w-5 h-5 text-teal-600" />
              <span>Completed Trips ({completedBookings.length})</span>
            </h2>

            {completedBookings.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 text-center text-xs text-slate-500">
                No completed trips yet.
              </div>
            ) : (
              <div className="space-y-4">
                {completedBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={b.destination?.image}
                        alt={b.destination?.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{b.destination?.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-teal-800">
                            Completed
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Guide: {b.guide?.name} • Date: {new Date(b.travelDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-extrabold text-slate-900">₹{b.totalAmount}</p>
                      <button
                        onClick={() => handleOpenReviewModal(b)}
                        className="px-3.5 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Write Review</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Cancelled Bookings */}
          {cancelledBookings.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span>Cancelled / Rejected Requests ({cancelledBookings.length})</span>
              </h2>

              <div className="space-y-3">
                {cancelledBookings.map((b) => (
                  <div
                    key={b._id}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between opacity-80"
                  >
                    <div>
                      <p className="font-bold text-sm text-slate-800">{b.destination?.name} with {b.guide?.name}</p>
                      <p className="text-xs text-slate-500">Date: {new Date(b.travelDate).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-700">
                      Cancelled / Rejected
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Saved Places & Profile */}
        <div className="space-y-8">
          {/* Saved Places */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 font-['Outfit'] text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Saved Destinations ({savedDestinations.length})</span>
              </h3>
              <Link to="/dashboard/saved" className="text-xs font-bold text-teal-600 hover:underline">
                View All
              </Link>
            </div>

            {savedDestinations.length === 0 ? (
              <p className="text-xs text-slate-500">No saved destinations yet. Click the heart on any destination to save it!</p>
            ) : (
              <div className="space-y-3">
                {savedDestinations.slice(0, 4).map((dest) => (
                  <Link
                    key={dest._id}
                    to={`/destinations/${dest._id}`}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate group-hover:text-teal-600 transition-colors">
                        {dest.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{dest.location}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Profile Quick Link */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 rounded-3xl shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-teal-400"
              />
              <div>
                <p className="font-bold text-sm">{user?.name}</p>
                <p className="text-xs text-slate-300">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/dashboard/profile"
              className="block text-center w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors"
            >
              Edit Profile Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {reviewModalOpen && selectedBookingForReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-fade-in">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <Star className="w-6 h-6 fill-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Rate Your Trip
              </h3>
              <p className="text-xs text-slate-500">
                Guide: <strong>{selectedBookingForReview.guide?.name}</strong> • Destination: <strong>{selectedBookingForReview.destination?.name}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 text-center mb-2">
                  Rating
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          s <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Review
                </label>
                <textarea
                  rows="4"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about your experience, punctuality, knowledge, and local insights..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelerDashboard;
