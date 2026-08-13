const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    traveler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a traveler'],
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a guide'],
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Booking must specify a destination'],
    },
    travelDate: {
      type: Date,
      required: [true, 'Please provide travel date'],
    },
    travelers: {
      type: Number,
      required: [true, 'Please specify number of travelers'],
      min: [1, 'At least 1 traveler required'],
      default: 1,
    },
    days: {
      type: Number,
      required: [true, 'Please specify number of days'],
      min: [1, 'Trip must be at least 1 day'],
      default: 1,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
