import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Users,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { destinationService } from '../services/destinationService';
import { guideService } from '../services/guideService';
import { useToast } from '../context/ToastContext';

export const BookingModal = ({
  isOpen,
  onClose,
  initialGuide = null,
  initialDestination = null,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState('');
  const [selectedDestinationId, setSelectedDestinationId] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [days, setDays] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  // Fetch list of guides & destinations for dropdown selection
  useEffect(() => {
    if (!isOpen) {
      setSuccessBooking(null);
      return;
    }

    const fetchData = async () => {
      try {
        const [dRes, gRes] = await Promise.all([
          destinationService.getDestinations(),
          guideService.getGuides({ available: 'true' }),
        ]);
        setDestinations(dRes.destinations || []);
        setGuides(gRes.guides || []);

        if (initialDestination?._id) {
          setSelectedDestinationId(initialDestination._id);
        } else if (dRes.destinations?.length > 0) {
          setSelectedDestinationId(dRes.destinations[0]._id);
        }

        if (initialGuide?._id) {
          setSelectedGuideId(initialGuide._id);
        } else if (gRes.guides?.length > 0) {
          setSelectedGuideId(gRes.guides[0]._id);
        }
      } catch (err) {
        console.error('Error loading booking dropdowns:', err);
      }
    };

    fetchData();
  }, [isOpen, initialGuide, initialDestination]);

  if (!isOpen) return null;

  // Selected guide object
  const selectedGuide =
    guides.find((g) => g._id === selectedGuideId) || initialGuide;
  const selectedDestination =
    destinations.find((d) => d._id === selectedDestinationId) || initialDestination;

  // Calculate estimated total
  const guidePrice = selectedGuide?.price || 1500;
  const estimatedTotal = guidePrice * Math.max(1, days);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please login or register as a traveler to book a guide.', 'info');
      onClose();
      navigate('/login');
      return;
    }

    if (user?.role === 'guide') {
      showToast('Guide accounts cannot create travel bookings.', 'warning');
      return;
    }

    if (!selectedGuideId || !selectedDestinationId || !travelDate) {
      showToast('Please fill in all required fields (Destination, Guide, Date)', 'warning');
      return;
    }

    try {
      setLoading(true);
      const res = await bookingService.createBooking({
        guideId: selectedGuideId,
        destinationId: selectedDestinationId,
        travelDate,
        travelers: Math.max(1, parseInt(travelers, 10) || 1),
        days: Math.max(1, parseInt(days, 10) || 1),
        message,
      });

      if (res.success) {
        setSuccessBooking(res.booking);
        showToast('Booking request sent successfully to the guide!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Outfit']">
                {successBooking ? 'Booking Requested!' : 'Book Your Local Guide'}
              </h2>
              <p className="text-xs text-teal-200">Send an authentic trip request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {successBooking ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto border-2 border-teal-200 shadow-sm animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Booking Request Sent!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your request has been forwarded directly to <strong>{successBooking.guide?.name}</strong>. You will see their response in your Traveler Dashboard.
              </p>
            </div>

            {/* Booking Summary Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-800">
                  {successBooking.destination?.name} ({successBooking.destination?.location})
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Guide:</span>
                <span className="font-bold text-slate-800">{successBooking.guide?.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Travel Date:</span>
                <span className="font-bold text-slate-800">
                  {new Date(successBooking.travelDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Travelers / Duration:</span>
                <span className="font-bold text-slate-800">
                  {successBooking.travelers} traveler(s) • {successBooking.days} day(s)
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                  {successBooking.status}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-teal-600 text-base">₹{successBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate('/dashboard/traveler');
                }}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-600/20"
              >
                Go to Traveler Dashboard
              </button>
              <button
                onClick={onClose}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {/* Guide Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Local Guide *
              </label>
              <select
                value={selectedGuideId}
                onChange={(e) => setSelectedGuideId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {guides.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name} ({g.location}) - ₹{g.price}/day - ⭐{g.rating ? g.rating.toFixed(1) : '5.0'}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Destination *
              </label>
              <select
                value={selectedDestinationId}
                onChange={(e) => setSelectedDestinationId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Travel Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Number of Travelers & Number of Days */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Travelers
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={travelers}
                    onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Message / Requirements */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Requests or Notes (Optional)
              </label>
              <textarea
                rows="2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the guide about your preferences, food restrictions, or language needs..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Price Estimation Bar */}
            <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-teal-800">
                  Rate: ₹{guidePrice} × {days} day(s)
                </p>
                <p className="text-xs text-teal-600 font-normal">No hidden booking fees</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                  Total Amount
                </span>
                <span className="text-lg font-extrabold text-teal-900">₹{estimatedTotal}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50"
              >
                {loading ? 'Sending Request...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
