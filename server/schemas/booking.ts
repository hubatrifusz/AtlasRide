import mongoose, { Schema } from 'mongoose'
import { BookingForm } from '../../shared/types/bookingForm'

const LocationSchema = new Schema(
  {
    kind: { type: String, required: true },
    city: { type: String, required: true },
  },
  { _id: false, discriminatorKey: 'kind' },
)

const AddressSchema = new Schema(
  {
    street: { type: String },
    zipCode: { type: String },
  },
  { _id: false },
)

const AirportSchema = new Schema(
  {
    name: { type: String, required: true },
    IATACode: { type: String, required: true, maxLength: 3 },
  },
  { _id: false },
)

const BookingSchema = new Schema<BookingForm>(
  {
    customer: {
      fullName: { type: String, required: true },
      email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      },
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
    passengerCount: {
      type: Number,
      required: true,
      min: [1, "Passenger count can't be lower than 1"],
    },
    returnInfo: {
      dateTime: { type: Date },
    },
    flightInfo: {
      outboundFlightNumber: {
        type: String,
        validate: {
          validator: function (v) {
            const isDestinationAirport =
              this.destination.location.kind == 'Airport'
            const hasOutboundFlightNumber =
              v != undefined && v != null && v != ''

            return isDestinationAirport == hasOutboundFlightNumber
          },
          message: (props) => `${props.value}`,
        },
      },
      inboundFlightNumber: {
        type: String,
        required: function () {
          return (
            this.destination.location.kind == 'Airport' &&
            !!this.returnInfo.dateTime
          )
        },
        validate: {
          validator: function (v) {
            const isReturn = !!this.returnInfo.dateTime
            const hasInboundFlightNumber =
              v != undefined && v != null && v != ''
            const isDestinationAirport =
              this.destination.location.kind == 'Airport'

            return (isDestinationAirport && isReturn) == hasInboundFlightNumber
          },
          message: (props) => `${props.value}`,
        },
      },
    },
    comment: { type: String },
  },
  {
    timestamps: true,
  },
)

const departurePath = BookingSchema.path('departure.location') as any
departurePath.discriminator('Address', AddressSchema)
departurePath.discriminator('Airport', AirportSchema)

const destinationPath = BookingSchema.path('destination.location') as any
destinationPath.discriminator('Address', AddressSchema)
destinationPath.discriminator('Airport', AirportSchema)

export const bookingModel =
  mongoose.models.Booking || mongoose.model('Booking', BookingSchema)
