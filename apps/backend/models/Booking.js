const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    city: { type: String, required: true },
    street: { type: String },
    zipCode: { type: String },
  },
  { _id: false },
);

const LocationSchema = new Schema(
  {
    city: { type: String, required: true },
  },
  { _id: false, discriminatorKey: 'kind' },
);

const BookingSchema = new Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] },
      phone: { type: String, required: true },
      companyLocation: { type: AddressSchema },
    },
    departure: {
      location: { type: LocationSchema },
      dateTime: { type: Date, required: true },
    },
    destination: {
      location: { type: LocationSchema },
      dateTime: { type: Date, required: true },
    },
    returnInfo: {
      dateTime: { type: Date },
    },
    flightInfo: {
      outboundFlightNumber: { type: String },
      inboundFlightNumber: { type: String },
    },
    comment: { type: String },
  },
  {
    timestamps: true,
  },
);

const locationPath = BookingSchema.path('departure.location');

locationPath.discriminator(
  'Address',
  new Schema(
    {
      street: { type: String },
      zipCode: { type: String },
    },
    { _id: false },
  ),
);

locationPath.discriminator(
  'Airport',
  new Schema(
    {
      name: { type: String, required: true },
      IATACode: { type: String, required: true, length: 3 },
    },
    { _id: false },
  ),
);

module.exports = mongoose.model('Booking', BookingSchema);
