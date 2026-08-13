const express = require('express');
const router = express.Router();
const {
  createReview,
  getGuideReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/guide/:guideId', getGuideReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
