const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateUser,
  toggleSaveDestination,
  getSavedDestinations,
  getGuideStats,
  getTravelerStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All user management routes require auth

router.get('/stats/guide', getGuideStats);
router.get('/stats/traveler', getTravelerStats);
router.get('/saved-destinations', getSavedDestinations);
router.post('/saved-destinations/:destinationId', toggleSaveDestination);

router.route('/:id')
  .get(getUserById)
  .put(updateUser);

module.exports = router;
