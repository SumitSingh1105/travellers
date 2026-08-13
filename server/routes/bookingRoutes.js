const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getGuideBookings,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All booking routes require authentication

router.route('/')
  .post(createBooking)
  .get(getBookings);

router.get('/my', getMyBookings);
router.get('/guide', getGuideBookings);

router.route('/:id')
  .get(getBookingById)
  .put(updateBookingStatus);

module.exports = router;
