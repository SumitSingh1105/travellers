const Booking = require('../models/Booking');
const User = require('../models/User');
const Destination = require('../models/Destination');

// @desc    Create a new booking (Traveler only)
// @route   POST /api/bookings
// @access  Private (Traveler)
const createBooking = async (req, res, next) => {
  try {
    if (req.user.role === 'guide') {
      return res.status(403).json({
        success: false,
        message: 'Guide accounts cannot create travel bookings.',
      });
    }

    const { guideId, destinationId, travelDate, travelers, days, message } = req.body;

    if (!guideId || !destinationId || !travelDate || !days) {
      return res.status(400).json({
        success: false,
        message: 'Please provide guide, destination, travel date, and number of days',
      });
    }

    const guide = await User.findOne({ _id: guideId, role: 'guide' });
    if (!guide) {
      return res.status(404).json({ success: false, message: 'Selected guide not found' });
    }

    if (!guide.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This guide is currently unavailable for new bookings',
      });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Selected destination not found' });
    }

    const numDays = Math.max(1, parseInt(days, 10));
    const numTravelers = Math.max(1, parseInt(travelers, 10) || 1);
    const totalAmount = guide.price * numDays;

    const booking = await Booking.create({
      traveler: req.user._id,
      guide: guideId,
      destination: destinationId,
      travelDate: new Date(travelDate),
      travelers: numTravelers,
      days: numDays,
      message: message || '',
      totalAmount,
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('traveler', 'name email profileImage')
      .populate('guide', 'name email location price profileImage')
      .populate('destination', 'name location image');

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully to the guide!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in traveler's bookings
// @route   GET /api/bookings/my
// @access  Private (Traveler)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ traveler: req.user._id })
      .populate('traveler', 'name email profileImage location')
      .populate('guide', 'name email profileImage location price languages experience rating')
      .populate('destination', 'name location image category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in guide's booking requests
// @route   GET /api/bookings/guide
// @access  Private (Guide)
const getGuideBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guide: req.user._id })
      .populate('traveler', 'name email profileImage location')
      .populate('guide', 'name email profileImage location price')
      .populate('destination', 'name location image category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings (role-aware fallback)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'guide') {
      query.guide = req.user._id;
    } else {
      query.traveler = req.user._id;
    }

    const { status } = req.query;
    if (status && status.toLowerCase() !== 'all') {
      query.status = status.toLowerCase();
    }

    const bookings = await Booking.find(query)
      .populate('traveler', 'name email profileImage location')
      .populate('guide', 'name email profileImage location price languages experience rating')
      .populate('destination', 'name location image category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('traveler', 'name email profileImage location')
      .populate('guide', 'name email profileImage location price languages experience rating')
      .populate('destination', 'name location image description');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isTraveler = booking.traveler._id.toString() === req.user._id.toString();
    const isGuide = booking.guide._id.toString() === req.user._id.toString();

    if (!isTraveler && !isGuide) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Guide accepts/rejects/completes, Traveler cancels)
// @route   PUT /api/bookings/:id
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    let { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    status = status.toLowerCase();
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isTraveler = booking.traveler.toString() === req.user._id.toString();
    const isGuide = booking.guide.toString() === req.user._id.toString();

    if (!isTraveler && !isGuide) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    // Traveler rules: can only cancel
    if (isTraveler && !isGuide) {
      if (status !== 'cancelled') {
        return res.status(403).json({ success: false, message: 'Travelers can only cancel bookings' });
      }
      if (booking.status === 'completed') {
        return res.status(400).json({ success: false, message: 'Cannot cancel a completed booking' });
      }
    }

    // Guide rules: can confirm, complete, or reject (cancelled)
    if (isGuide) {
      if (status === 'cancelled' && booking.status === 'completed') {
        return res.status(400).json({ success: false, message: 'Cannot cancel a completed trip' });
      }
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('traveler', 'name email profileImage')
      .populate('guide', 'name email profileImage location price')
      .populate('destination', 'name location image');

    res.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getGuideBookings,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
