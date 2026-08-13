const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a review for a guide
// @route   POST /api/reviews
// @access  Private (Traveler)
const createReview = async (req, res, next) => {
  try {
    const { guideId, bookingId, rating, comment } = req.body;

    if (!guideId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide guide, rating (1-5), and review comment',
      });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const guide = await User.findOne({ _id: guideId, role: 'guide' });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    if (guide._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot review yourself' });
    }

    // Check if user has a completed booking with this guide
    let completedBooking = null;
    if (bookingId) {
      completedBooking = await Booking.findOne({
        _id: bookingId,
        traveler: req.user._id,
        guide: guideId,
        status: 'completed',
      });
    } else {
      completedBooking = await Booking.findOne({
        traveler: req.user._id,
        guide: guideId,
        status: 'completed',
      });
    }

    if (!completedBooking) {
      return res.status(403).json({
        success: false,
        message: 'You can only review a guide after completing a booked trip with them.',
      });
    }

    // Check if user already reviewed this specific booking
    if (completedBooking) {
      const existingReview = await Review.findOne({
        user: req.user._id,
        booking: completedBooking._id,
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this trip.',
        });
      }
    }

    const review = await Review.create({
      user: req.user._id,
      guide: guideId,
      booking: completedBooking ? completedBooking._id : undefined,
      rating: numRating,
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name profileImage')
      .populate('guide', 'name location');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully! Thank you for your feedback.',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific guide
// @route   GET /api/reviews/guide/:guideId
// @access  Public
const getGuideReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ guide: req.params.guideId })
      .populate('user', 'name profileImage location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Author only)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const isAuthor = review.user.toString() === req.user._id.toString();

    if (!isAuthor) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const guideId = review.guide;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate guide rating
    await Review.calculateAverageRating(guideId);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getGuideReviews,
  deleteReview,
};
