const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestinationById,
} = require('../controllers/destinationController');

router.route('/')
  .get(getDestinations);

router.route('/:id')
  .get(getDestinationById);

module.exports = router;
