const User = require('../models/User');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('savedDestinations');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (Self only)
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    const isSelf = req.user._id.toString() === req.params.id;

    if (!isSelf) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const {
      name,
      location,
      bio,
      profileImage,
      languages,
      experience,
      price,
      isAvailable,
    } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name.trim();
    if (location) fieldsToUpdate.location = location.trim();
    if (bio) fieldsToUpdate.bio = bio.trim();
    if (profileImage) fieldsToUpdate.profileImage = profileImage;
    if (languages) {
      fieldsToUpdate.languages = Array.isArray(languages)
        ? languages
        : languages.split(',').map((s) => s.trim());
    }
    if (experience) fieldsToUpdate.experience = experience;
    if (price !== undefined) fieldsToUpdate.price = Number(price);
    if (isAvailable !== undefined) fieldsToUpdate.isAvailable = Boolean(isAvailable);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select('-password').populate('savedDestinations');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle save/bookmark destination
// @route   POST /api/users/saved-destinations/:destinationId
// @access  Private (Traveler)
const toggleSaveDestination = async (req, res, next) => {
  try {
    const { destinationId } = req.params;
    const destination = await Destination.findById(destinationId);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const user = await User.findById(req.user._id);
    const isSaved = user.savedDestinations.includes(destinationId);

    if (isSaved) {
      user.savedDestinations = user.savedDestinations.filter(
        (id) => id.toString() !== destinationId.toString()
      );
      await user.save();
      return res.json({
        success: true,
        isSaved: false,
        message: 'Destination removed from saved list',
        savedDestinations: user.savedDestinations,
      });
    } else {
      user.savedDestinations.push(destinationId);
      await user.save();
      return res.json({
        success: true,
        isSaved: true,
        message: 'Destination saved to your favorites!',
        savedDestinations: user.savedDestinations,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user saved destinations
// @route   GET /api/users/saved-destinations
// @access  Private
const getSavedDestinations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDestinations');
    res.json({
      success: true,
      savedDestinations: user.savedDestinations || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for Guide
// @route   GET /api/users/stats/guide
// @access  Private (Guide)
const getGuideStats = async (req, res, next) => {
  try {
    const guideId = req.user._id;
    const allBookings = await Booking.find({ guide: guideId });

    const totalRequests = allBookings.length;
    const upcomingTrips = allBookings.filter(
      (b) => (b.status === 'confirmed' || b.status === 'pending') && new Date(b.travelDate) >= new Date()
    ).length;
    const completedTrips = allBookings.filter((b) => b.status === 'completed').length;
    const totalEarnings = allBookings
      .filter((b) => b.status === 'completed' || b.status === 'confirmed')
      .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

    res.json({
      success: true,
      stats: {
        totalRequests,
        upcomingTrips,
        completedTrips,
        totalEarnings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for Traveler
// @route   GET /api/users/stats/traveler
// @access  Private (Traveler)
const getTravelerStats = async (req, res, next) => {
  try {
    const travelerId = req.user._id;
    const allBookings = await Booking.find({ traveler: travelerId });
    const user = await User.findById(travelerId);

    const totalBookings = allBookings.length;
    const upcomingTrips = allBookings.filter(
      (b) => (b.status === 'confirmed' || b.status === 'pending') && new Date(b.travelDate) >= new Date()
    ).length;
    const savedPlaces = user.savedDestinations ? user.savedDestinations.length : 0;

    res.json({
      success: true,
      stats: {
        totalBookings,
        upcomingTrips,
        savedPlaces,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  updateUser,
  toggleSaveDestination,
  getSavedDestinations,
  getGuideStats,
  getTravelerStats,
};
