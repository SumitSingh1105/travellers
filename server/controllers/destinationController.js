const Destination = require('../models/Destination');

// @desc    Get all destinations with optional search and category filter
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res, next) => {
  try {
    const { search, category, popular } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
      ];
    }

    const destinations = await Destination.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: destinations.length,
      destinations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({
      success: true,
      destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res, next) => {
  try {
    const {
      name,
      location,
      country,
      category,
      image,
      gallery,
      description,
      bestTime,
      budget,
      attractions,
      food,
      travelTips,
      rating,
      isPopular,
    } = req.body;

    const existing = await Destination.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A destination with this name already exists' });
    }

    const destination = await Destination.create({
      name: name.trim(),
      location: location.trim(),
      country: country || 'India',
      category: category || 'City',
      image,
      gallery: gallery || [],
      description,
      bestTime: bestTime || 'October to March',
      budget: budget || '₹3,000 - ₹8,000 / day',
      attractions: Array.isArray(attractions) ? attractions : (attractions ? attractions.split(',').map(s => s.trim()) : []),
      food: Array.isArray(food) ? food : (food ? food.split(',').map(s => s.trim()) : []),
      travelTips: Array.isArray(travelTips) ? travelTips : (travelTips ? travelTips.split(',').map(s => s.trim()) : []),
      rating: rating ? Number(rating) : 4.8,
      isPopular: isPopular === true || isPopular === 'true',
    });

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const data = { ...req.body };
    if (typeof data.attractions === 'string') {
      data.attractions = data.attractions.split(',').map((s) => s.trim());
    }
    if (typeof data.food === 'string') {
      data.food = data.food.split(',').map((s) => s.trim());
    }
    if (typeof data.travelTips === 'string') {
      data.travelTips = data.travelTips.split(',').map((s) => s.trim());
    }

    destination = await Destination.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Destination updated successfully',
      destination,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    await Destination.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Destination removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
