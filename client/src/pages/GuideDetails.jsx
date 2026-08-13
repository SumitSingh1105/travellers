import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Star,
  Languages,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { guideService } from '../services/guideService';
import { reviewService } from '../services/reviewService';
import { ReviewCard } from '../components/ReviewCard';
import { BookingModal } from '../components/BookingModal';
import { Loading } from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const GuideDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [guide, setGuide] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const fetchGuideDetails = async () => {
    try {
      setLoading(true);
      const data = await guideService.getGuideById(id);
      if (data.success) {
        setGuide(data.guide);
        setReviews(data.reviews || []);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuideDetails();
  }, [id]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewService.deleteReview(reviewId);
      showToast('Review removed successfully', 'info');
      fetchGuideDetails();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading guide profile & reviews..." />;
  }

  if (!guide) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Guide Not Found</h2>
        <Link to="/guides" className="inline-block px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl">
          Back to Guides
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      {/* Top Nav Back Link */}
      <div>
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all guides</span>
        </Link>
      </div>

      {/* Guide Profile Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={
                  guide.profileImage ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                }
                alt={guide.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-teal-500 shadow-md"
              />
              <div className="absolute -bottom-2 -right-2 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
                {guide.isAvailable ? (
                  <>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold text-emerald-700">Available</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
                    <span className="text-[11px] font-bold text-slate-600">Busy</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
                  {guide.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Verified Guide
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>{guide.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>{guide.experience || 'Experienced Local Guide'}</span>
                </div>
              </div>

              {/* Languages */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Languages className="w-3.5 h-3.5 text-slate-400 mr-1" />
                {guide.languages?.map((lang, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pricing & Book Action */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center w-full md:w-auto min-w-[220px] space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Standard Daily Rate
              </span>
              <p className="text-3xl font-extrabold text-slate-900 mt-0.5">
                ₹{guide.price || 1500}
                <span className="text-xs font-normal text-slate-600"> / day</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-900">
                {guide.rating ? guide.rating.toFixed(1) : '5.0'}
              </span>
              <span className="text-xs text-amber-700 font-medium">
                ({reviews.length} reviews)
              </span>
            </div>

            <button
              onClick={() => setBookingModalOpen(true)}
              disabled={!guide.isAvailable}
              className={`w-full py-3.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${
                guide.isAvailable
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20 hover:scale-105 active:scale-95'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500'
              }`}
            >
              {guide.isAvailable ? 'Book This Guide' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {/* Guide Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Bio and Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Bio */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
              About {guide.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {guide.bio || 'Local resident passionate about sharing culture, architecture, and secret local flavors.'}
            </p>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                  Traveler Reviews ({reviews.length})
                </h2>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center space-y-2">
                <p className="text-sm text-slate-500">No traveler reviews written yet for this guide.</p>
                <p className="text-xs text-slate-400">Complete a trip with {guide.name} to leave a verified rating!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <ReviewCard
                    key={rev._id}
                    review={rev}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Highlights */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-['Outfit']">
              Why Book with {guide.name}?
            </h3>

            <ul className="space-y-4 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>100% personalized itineraries tailored to your schedule and interests.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Expert navigation through crowds, ticket queues, and local transit.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Deep cultural stories and historical contexts that regular guidebooks miss.</span>
              </li>
            </ul>

            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md"
            >
              Start Trip Request
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialGuide={guide}
      />
    </div>
  );
};

export default GuideDetails;
