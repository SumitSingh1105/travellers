const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get all guides with optional location and availability filters
// @route   GET /api/guides
// @access  Public
const getGuides = async (req, res, next) => {
  try {
    const { location, language, available, search } = req.query;
    let query = {
      role: 'guide',
      isProfileComplete: { $ne: false },
    };

    if (available === 'true') {
      query.isAvailable = true;
    }

    if (location && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (language && language.trim() !== '') {
      query.languages = { $in: [new RegExp(language.trim(), 'i')] };
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { bio: searchRegex },
        { languages: { $in: [searchRegex] } },
      ];
    }

    const guides = await User.find(query).select('-password').sort({ rating: -1, numReviews: -1 });

    res.json({
      success: true,
      count: guides.length,
      guides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single guide by ID with populated reviews
// @route   GET /api/guides/:id
// @access  Public
const getGuideById = async (req, res, next) => {
  try {
    const guide = await User.findOne({ _id: req.params.id, role: 'guide' }).select('-password');

    if (!guide) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    const reviews = await Review.find({ guide: req.params.id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      guide,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update guide profile (Self)
// @route   PUT /api/guides/:id
// @access  Private
const updateGuide = async (req, res, next) => {
  try {
    let guide = await User.findById(req.params.id);

    if (!guide || guide.role !== 'guide') {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    // Check authorization: User must be the guide
    if (guide._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this guide profile' });
    }

    const {
      name,
      location,
      bio,
      languages,
      experience,
      price,
      isAvailable,
      profileImage,
    } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (location !== undefined) updateFields.location = location;
    if (bio !== undefined) updateFields.bio = bio;
    if (languages) {
      updateFields.languages = Array.isArray(languages)
        ? languages
        : languages.split(',').map((s) => s.trim());
    }
    if (experience !== undefined) updateFields.experience = experience;
    if (price !== undefined) updateFields.price = Number(price);
    if (isAvailable !== undefined) updateFields.isAvailable = Boolean(isAvailable);
    if (profileImage) updateFields.profileImage = profileImage;

    // If guide provided basic location & bio or rate, mark profile complete
    updateFields.isProfileComplete = true;

    guide = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({
      success: true,
      message: 'Guide profile updated successfully',
      guide,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGuides,
  getGuideById,
  updateGuide,
};
