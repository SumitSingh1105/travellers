const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must target a guide'],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please write a review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for the same guide if needed, or index
reviewSchema.index({ guide: 1, user: 1, booking: 1 });

// Static method to calculate average rating of a guide
reviewSchema.statics.calculateAverageRating = async function (guideId) {
  const stats = await this.aggregate([
    { $match: { guide: guideId } },
    {
      $group: {
        _id: '$guide',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('User').findByIdAndUpdate(guideId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        numReviews: stats[0].numReviews,
      });
    } else {
      await mongoose.model('User').findByIdAndUpdate(guideId, {
        rating: 5.0,
        numReviews: 0,
      });
    }
  } catch (err) {
    console.error('Error recalculating average rating:', err);
  }
};

// Recalculate rating after save
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.guide);
});

// Recalculate rating after delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.guide);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
