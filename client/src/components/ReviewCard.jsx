import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ReviewCard = ({ review, onDelete }) => {
  const { user } = useAuth();

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recent';

  const canDelete =
    user && review.user && (review.user._id === user._id || review.user === user._id);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 relative group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={
              review.user?.profileImage ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
            }
            alt={review.user?.name || 'Traveler'}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div>
            <p className="text-sm font-bold text-slate-900">
              {review.user?.name || 'Verified Traveler'}
            </p>
            <p className="text-[11px] text-slate-600">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Star rating */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 fill-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Delete button for admin / author */}
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(review._id)}
              aria-label="Delete review"
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all ml-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
