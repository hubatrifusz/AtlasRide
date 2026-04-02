import { Schema } from 'mongoose'

const LocationSchema = new Schema(
  {
    kind: { type: String, required: true },
    city: { type: String, required: true }
  },
  { _id: false, discriminatorKey: 'kind' }
)

const AddressSchema = new Schema(
  {
    street: { type: String },
    zipCode: { type: String }
  },
  { _id: false }
)

const AirportSchema = new Schema(
  {
    name: { type: String, required: true },
    IATACode: { type: String, required: true, maxLength: 3 }
  },
  { _id: false }
)

const BookingSchema = new Schema(
  {
    customer: {
      fullName: { type: String, required: true },
      email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
      },
      phone: { type: String, required: true },
      companyLocation: { type: AddressSchema }
    },
    departure: {
      location: { type: LocationSchema },
      dateTime: { type: Date, required: true }
    },
    destination: {
      location: { type: LocationSchema },
      dateTime: { type: Date, required: true }
    },
    returnInfo: {
      dateTime: { type: Date }
    },
    flightInfo: {
      outboundFlightNumber: { type: String },
      inboundFlightNumber: { type: String }
    },
    comment: { type: String }
  },
  {
    timestamps: true
  }
)

const departurePath = BookingSchema.path('departure.location') as any
departurePath.discriminator('Address', AddressSchema)
departurePath.discriminator('Airport', AirportSchema)

const destinationPath = BookingSchema.path('destination.location') as any
destinationPath.discriminator('Address', AddressSchema)
destinationPath.discriminator('Airport', AirportSchema)
