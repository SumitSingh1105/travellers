import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { useToast } from '../context/ToastContext';
import { Loading } from '../components/Loading';
import {
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Filter,
} from 'lucide-react';

export const Bookings = () => {
  const { user, isGuide } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const statuses = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = isGuide
        ? await bookingService.getGuideBookings()
        : await bookingService.getMyBookings();

      let list = data.bookings || [];
      if (selectedStatus !== 'All') {
        list = list.filter((b) => (b.status || '').toLowerCase() === selectedStatus.toLowerCase());
      }
      setBookings(list);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedStatus, isGuide]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus.toLowerCase());
      showToast(`Booking marked as ${newStatus}`, 'success');
      fetchBookings();
    } catch (err) {
      showToast(err.message, 'error');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            {isGuide ? 'Tour Booking Requests' : 'My Travel Bookings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your itineraries, schedules, and confirmations
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap capitalize ${
                selectedStatus === st
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loading text="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Bookings Found</h3>
          <p className="text-xs text-slate-500 capitalize">
            No bookings found under "{selectedStatus}" status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={b.destination?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=200&q=80'}
                    alt={b.destination?.name}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{b.destination?.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span>{b.destination?.location}</span>
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getStatusBadge(b.status)}`}>
                  {b.status}
                </span>
              </div>

              {/* Traveler / Guide Contact Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {isGuide ? 'Traveler' : 'Local Guide'}
                  </span>
                  <p className="font-bold text-slate-800">
                    {isGuide ? b.traveler?.name : b.guide?.name}
                  </p>
                  <p className="text-slate-500 text-[11px] truncate">
                    {isGuide ? b.traveler?.email : b.guide?.email}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Travel Date
                  </span>
                  <p className="font-bold text-slate-800">
                    {new Date(b.travelDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    {b.days} day(s) • {b.travelers} traveler(s)
                  </p>
                </div>
              </div>

              {b.message && (
                <p className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <strong>Notes:</strong> {b.message}
                </p>
              )}

              {/* Total & Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Total Amount</span>
                  <span className="text-base font-extrabold text-slate-900">₹{b.totalAmount}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Guide Actions */}
                  {isGuide && (b.status || '').toLowerCase() === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                        className="px-3.5 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-xl text-xs font-bold transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                        className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {isGuide && (b.status || '').toLowerCase() === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'completed')}
                      className="px-3.5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}

                  {/* Traveler Cancel Action */}
                  {!isGuide && (b.status || '').toLowerCase() === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                      className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
