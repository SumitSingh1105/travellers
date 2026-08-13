import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { guideService } from '../services/guideService';
import { useToast } from '../context/ToastContext';
import {
  MapPin,
  FileText,
  DollarSign,
  Briefcase,
  Languages,
  Sparkles,
  CheckCircle,
  X,
} from 'lucide-react';

export const GuideProfileSetupModal = ({ isOpen, onClose, onComplete }) => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [languages, setLanguages] = useState(
    Array.isArray(user?.languages) ? user.languages.join(', ') : 'English, Hindi'
  );
  const [experience, setExperience] = useState(user?.experience || '2 years experience');
  const [price, setPrice] = useState(user?.price || 1500);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      showToast('Please provide your tour city / location.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        location: location.trim(),
        bio: bio.trim() || 'Certified local tour guide ready to share authentic local experiences.',
        languages: languages.split(',').map((s) => s.trim()),
        experience: experience.trim() || '2 years experience',
        price: Number(price) || 1500,
        isAvailable: true,
      };

      const res = await guideService.updateGuide(user._id, payload);
      if (res.success && res.guide) {
        updateUserState(res.guide);
        showToast('Guide profile completed! You are now live on the Guides directory.', 'success');
        if (onComplete) onComplete(res.guide);
        if (onClose) onClose();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update guide profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
            Complete Your Guide Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Welcome to TravelGuide! Add your tour details so travelers can discover and book you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* City / Base Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tour City / Base Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Delhi, Jaipur, Varanasi, Goa"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Languages & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Languages Spoken
              </label>
              <div className="relative">
                <Languages className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="English, Hindi, French"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Experience
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 4 years certified guide"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Daily Rate */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Daily Rate (₹ INR) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                required
                min="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* About / Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Bio & Tour Specialties
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <textarea
                rows="2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell travelers about your background, favorite landmarks, and unique tour style..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Saving Profile...' : 'Save & Publish Guide Profile'}</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuideProfileSetupModal;
