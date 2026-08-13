const express = require('express');
const router = express.Router();
const {
  getGuides,
  getGuideById,
  updateGuide,
} = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getGuides);

router.route('/:id')
  .get(getGuideById)
  .put(protect, updateGuide);

module.exports = router;
