import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Compass,
  Lock,
  Mail,
  User,
  MapPin,
  FileText,
  DollarSign,
  Briefcase,
  Image,
  ArrowRight,
} from 'lucide-react';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { GuideProfileSetupModal } from '../components/GuideProfileSetupModal';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'guide' ? 'guide' : 'traveler';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    location: '',
    bio: '',
    languages: 'Hindi, English',
    experience: '3 years experience',
    price: 1500,
    profileImage: '',
  });

  const [guideSetupModalOpen, setGuideSetupModalOpen] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'guide') {
      setFormData((prev) => ({ ...prev, role: 'guide' }));
    } else if (roleParam === 'traveler') {
      setFormData((prev) => ({ ...prev, role: 'traveler' }));
    }
  }, [searchParams]);

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        location: formData.location.trim() || 'India',
      };

      if (formData.role === 'guide') {
        payload.bio = formData.bio.trim() || 'Experienced local travel guide.';
        payload.languages = formData.languages.split(',').map((s) => s.trim());
        payload.experience = formData.experience.trim() || '2 years experience';
        payload.price = Number(formData.price) || 1500;
        if (formData.profileImage.trim()) {
          payload.profileImage = formData.profileImage.trim();
        }
      }

      const res = await register(payload);
      if (res.success && res.user) {
        if (res.user.role === 'guide') {
          navigate('/dashboard/guide', { replace: true });
        } else {
          navigate('/dashboard/traveler', { replace: true });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (res) => {
    if (res.user?.role === 'guide') {
      if (res.isNewGuide) {
        setGuideSetupModalOpen(true);
      } else {
        navigate('/dashboard/guide', { replace: true });
      }
    } else {
      navigate('/dashboard/traveler', { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-xl w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-['Outfit'] text-slate-900">
              Travel<span className="text-teal-600">Guide</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit'] pt-2">
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Join TravelGuide as a Traveler or a Local Tour Guide
          </p>
        </div>

        {/* Role Selector Radio/Pill */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Register as:</label>
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl gap-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'traveler' }))}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                formData.role === 'traveler'
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <input
                type="radio"
                name="roleOption"
                checked={formData.role === 'traveler'}
                onChange={() => {}}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span>Traveler</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: 'guide' }))}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                formData.role === 'guide'
                  ? 'bg-white text-teal-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <input
                type="radio"
                name="roleOption"
                checked={formData.role === 'guide'}
                onChange={() => {}}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span>Guide</span>
            </button>
          </div>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 chars"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Guide-Specific Registration Fields */}
          {formData.role === 'guide' && (
            <div className="p-4 sm:p-5 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-3.5 animate-fade-in">
              <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Guide Profile Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tour City / Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Delhi, Jaipur, Varanasi, Goa"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bio / Specialties
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows="2"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Share your tour experience and specialty..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Languages Spoken (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="English, Hindi, French"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price per day (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="1500"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Experience
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="5 years"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Profile Image URL (Optional)
                </label>
                <div className="relative">
                  <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Sign Up Free'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* OR Divider */}
        <div className="relative text-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-bold tracking-wider">
              OR
            </span>
          </div>
        </div>

        {/* Google Authentication Button */}
        <GoogleAuthButton
          role={formData.role}
          text={`Continue with Google as ${formData.role === 'guide' ? 'Guide' : 'Traveler'}`}
          onSuccess={handleGoogleSuccess}
        />

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">
            Log in
          </Link>
        </p>
      </div>

      {/* Guide Profile Setup Modal for new Google Guides */}
      <GuideProfileSetupModal
        isOpen={guideSetupModalOpen}
        onClose={() => {
          setGuideSetupModalOpen(false);
          navigate('/dashboard/guide', { replace: true });
        }}
        onComplete={() => {
          setGuideSetupModalOpen(false);
          navigate('/dashboard/guide', { replace: true });
        }}
      />
    </div>
  );
};

export default Register;
