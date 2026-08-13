const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a destination name'],
      trim: true,
      unique: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location/state'],
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: ['Beach', 'Mountain', 'Historical', 'Religious', 'Adventure', 'City', 'Nature'],
      default: 'City',
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    bestTime: {
      type: String,
      default: 'October to March',
    },
    budget: {
      type: String,
      default: '₹3,000 - ₹8,000 / day',
    },
    attractions: {
      type: [String],
      default: [],
    },
    food: {
      type: [String],
      default: [],
    },
    travelTips: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for full text and regex search
destinationSchema.index({ name: 'text', location: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Destination', destinationSchema);
