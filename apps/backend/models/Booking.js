const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  rideType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  passengers: {
    type: Number,
  },
  homeAddress: {
    type: String,
  },
  departureLocation: {
    type: String,
    required: true,
  },
  departureDate: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
  },
  destinationLocation: {
    type: String,
    required: true,
  },
  takeoffTime: {
    type: String,
  },
  flightNumber: {
    type: String,
  },
  return: {
    type: Boolean,
    default: false,
  },
  returnLocation: {
    type: String,
  },
  returnDate: {
    type: String,
  },
  returnTime: {
    type: String,
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model("booking", BookingSchema);
