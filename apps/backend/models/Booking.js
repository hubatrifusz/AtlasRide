const mongoose = require('mongoose');
const { Schema } = mongoose;

// --- Sub-Schemas ---

const CompanyLocationSchema = new Schema(
  {
    city: { type: String },
    street: { type: String },
    zipCode: { type: String },
  },
  { _id: false },
);

const LocationSchema = new Schema(
  {
    city: { type: String },
    street: { type: String },
    zipCode: { type: String },
    isAirport: { type: Boolean, default: false },
  },
  { _id: false },
);

// For @internationalized/date CalendarDate structure
const CalendarDateSchema = new Schema(
  {
    calendar: {
      identifier: { type: String },
    },
    era: { type: String },
    year: { type: Number },
    month: { type: Number },
    day: { type: Number },
  },
  { _id: false },
);

// For @internationalized/date Time structure
const TimeSchema = new Schema(
  {
    hour: { type: Number },
    minute: { type: Number },
    second: { type: Number, default: 0 },
    millisecond: { type: Number, default: 0 },
  },
  { _id: false },
);

// DateTime combining CalendarDate and Time
const DateTimeSchema = new Schema(
  {
    date: { type: CalendarDateSchema },
    time: { type: TimeSchema },
  },
  { _id: false },
);

const FlightInfoSchema = new Schema(
  {
    outboundFlightNumber: { type: String },
    returnFlightNumber: { type: String },
  },
  { _id: false },
);

const ContactInfoSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyLocation: { type: CompanyLocationSchema },
  },
  { _id: false },
);

// Return Info Schema (handles the union type)
const ReturnInfoSchema = new Schema(
  {
    isReturn: { type: Boolean, required: true, default: false },
    returnDateTime: { type: DateTimeSchema },
  },
  { _id: false },
);

// --- Main Schema ---

const BookingSchema = new Schema(
  {
    customer: { type: ContactInfoSchema, required: true },
    homeAddress: { type: LocationSchema }, // Optional - not used in current form
    passengerCount: { type: Number, required: true, min: 1 },
    departureLocation: { type: LocationSchema, required: true },
    departureDateTime: { type: DateTimeSchema },
    destinationLocation: { type: LocationSchema, required: true },
    returnInfo: { type: ReturnInfoSchema, required: true },
    flightInfo: { type: FlightInfoSchema },
    comment: { type: String, default: '' },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Pre-save hook to clean up empty nested objects
BookingSchema.pre('save', function (next) {
  // Remove companyLocation if all fields are empty
  if (this.customer?.companyLocation) {
    const loc = this.customer.companyLocation;
    if (!loc.city && !loc.street && !loc.zipCode) {
      this.customer.companyLocation = undefined;
    }
  }

  // Remove homeAddress if all fields are empty
  if (this.homeAddress) {
    const home = this.homeAddress;
    if (!home.city && !home.street && !home.zipCode) {
      this.homeAddress = undefined;
    }
  }

  // Remove flightInfo if outboundFlightNumber is empty
  if (this.flightInfo && !this.flightInfo.outboundFlightNumber) {
    this.flightInfo = undefined;
  }

  // Handle empty returnDateTime
  if (this.returnInfo && !this.returnInfo.isReturn) {
    this.returnInfo.returnDateTime = undefined;
  }

  next();
});

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
