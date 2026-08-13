import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  CalendarCheck,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Search,
  Globe,
} from 'lucide-react';
import { destinationService } from '../services/destinationService';
import { guideService } from '../services/guideService';
import { DestinationCard } from '../components/DestinationCard';
import { GuideCard } from '../components/GuideCard';
import { SearchBar } from '../components/SearchBar';
import { BookingModal } from '../components/BookingModal';
import { Loading, SkeletonCard } from '../components/Loading';

export const Home = () => {
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [featuredGuides, setFeaturedGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [destRes, guideRes] = await Promise.all([
          destinationService.getDestinations({ popular: 'true' }),
          guideService.getGuides({ available: 'true' }),
        ]);

        setPopularDestinations(
          destRes.destinations?.length > 0 ? destRes.destinations.slice(0, 6) : []
        );
        setFeaturedGuides(
          guideRes.guides?.length > 0 ? guideRes.guides.slice(0, 3) : []
        );
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = ({ search, category }) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    navigate(`/destinations?${params.toString()}`);
  };

  const handleBookGuide = (guide) => {
    setSelectedGuideForBooking(guide);
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image with Ambient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=85"
            alt="Scenic mountain journey"
            className="w-full h-full object-cover object-center scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 text-xs font-semibold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Discover Unforgettable Adventures</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-['Outfit'] tracking-tight leading-[1.15]">
            Explore the World with{' '}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
              Local Guides
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover amazing destinations, authentic local experiences and trusted travel guides.
          </p>

          {/* Large Destination Search Bar */}
          <div className="pt-2 flex justify-center">
            <SearchBar onSearch={handleHeroSearch} />
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/destinations"
              className="px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-teal-600/30 hover:shadow-teal-600/40 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Destinations</span>
            </Link>
            <Link
              to="/guides"
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm sm:text-base rounded-2xl border border-white/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-teal-300" />
              <span>Find a Guide</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-white">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-['Outfit']">50+</p>
              <p className="text-xs text-slate-300 font-medium">Top Destinations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-['Outfit']">200+</p>
              <p className="text-xs text-slate-300 font-medium">Verified Guides</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Outfit']">4.9/5</p>
              <p className="text-xs text-slate-300 font-medium">Traveler Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-['Outfit']">10k+</p>
              <p className="text-xs text-slate-300 font-medium">Happy Trips</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Handpicked Places</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              Popular Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated Indian destinations loved by travelers worldwide
            </p>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 group self-start md:self-auto"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Expert Locals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              Meet Top Travel Guides
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Licensed local experts ready to give you customized cultural experiences
            </p>
          </div>

          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:text-teal-700 group self-start md:self-auto"
          >
            <span>Browse All Guides</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredGuides.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">
                No guides registered yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Be the first to register as a local guide and share your expertise with travelers.
              </p>
            </div>
            <Link
              to="/register?role=guide"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Register as a Guide</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredGuides.map((guide) => (
              <GuideCard
                key={guide._id}
                guide={guide}
                onBookClick={handleBookGuide}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY TRAVELGUIDE */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
              Why TravelGuide
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              We connect curious travelers directly with verified local experts for safe, personalized, and authentic journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-2">
                Verified Local Guides
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect with trusted, background-checked local guides with verified reviews and genuine regional expertise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-colors shadow-sm">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-2">
                Authentic Experiences
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Experience destinations like a local. Discover hidden food stalls, folklore stories, and off-beat scenic spots.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-sm">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-2">
                Easy Booking
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Book guides quickly and securely with transparent transparent daily rates and flexible scheduling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            How It Works
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Three simple steps to unlock unforgettable travel memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-md">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-2">
              Explore
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Find your destination by browsing top-rated mountains, beaches, historical forts, and cultural cities.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-md">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-2">
              Choose a Guide
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Select a verified local guide matching your preferred language, travel style, and budget.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-md">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-2">
              Book Your Experience
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Book your trip, get connected with your guide, and enjoy an immersive, stress-free journey.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit']">
              Ready for your next adventure?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Join thousands of travelers who have discovered secret local spots, cultural treasures, and lifelong memories with our local guides.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/destinations"
                className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-500/20 hover:scale-105 transition-all"
              >
                Start Exploring
              </Link>
              <Link
                to="/register?role=guide"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base rounded-2xl border border-white/20 transition-all hover:scale-105"
              >
                Become a Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Booking Modal */}
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

export default Home;
