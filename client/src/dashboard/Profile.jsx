import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/reviewService';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  MapPin,
  FileText,
  Languages,
  Award,
  DollarSign,
  Camera,
  CheckCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUserState, isGuide } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    languages: Array.isArray(user?.languages) ? user.languages.join(', ') : 'English, Hindi',
    experience: user?.experience || '',
    price: user?.price || 1500,
    isAvailable: user?.isAvailable ?? true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        bio: formData.bio.trim(),
        profileImage: formData.profileImage.trim(),
      };

      if (isGuide) {
        payload.languages = formData.languages.split(',').map((s) => s.trim());
        payload.experience = formData.experience.trim();
        payload.price = Number(formData.price);
        payload.isAvailable = formData.isAvailable;
      }

      const res = await userService.updateProfile(user._id, payload);
      if (res.success && res.user) {
        updateUserState(res.user);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal details, profile image, and {isGuide ? 'guide pricing' : 'preferences'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Banner with Profile Image Preview */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 px-8 pt-8 pb-14 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Account Profile</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 -mt-10 space-y-6">
          {/* Avatar and Quick Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 pb-6 border-b border-slate-100">
            <div className="relative">
              <img
                src={
                  formData.profileImage ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                }
                alt={formData.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-lg"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">{formData.name || 'User'}</h2>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 capitalize border border-teal-200">
                  {user?.role}
                </span>
                <span className="text-xs text-slate-500">{formData.email}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Base Location / City
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Delhi, Jaipur, Goa"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              About Bio
            </label>
            <textarea
              rows="3"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell travelers or guides about your background, interests, travel style..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Guide Specific Attributes */}
          {isGuide && (
            <div className="p-6 bg-teal-50/60 rounded-2xl border border-teal-100 space-y-4">
              <h3 className="text-sm font-bold text-teal-900 uppercase tracking-wider">
                Guide Professional Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Spoken Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    placeholder="English, Hindi, French, Spanish"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Experience / Credentials
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 6 years certified heritage guide"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Daily Rate (₹ INR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 select-none">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span>Accepting New Booking Requests</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
