import * as v from 'valibot';

export const IndividualBookingSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty('Név kötelező')),
  email: v.pipe(v.string(), v.nonEmpty('Email kötelező'), v.email('Érvénytelen email')),
  phone: v.pipe(v.string(), v.nonEmpty('Telefonszám kötelező')),
});

export const CorporateBookingSchema = v.object({
  companyName: v.pipe(v.string(), v.nonEmpty('Cégnév kötelező')),
  name: v.pipe(v.string(), v.nonEmpty('Kapcsolattartó neve kötelező')),
  email: v.pipe(v.string(), v.nonEmpty('Email kötelező'), v.email('Érvénytelen email')),
  phone: v.pipe(v.string(), v.nonEmpty('Telefonszám kötelező')),
  homeAddress: v.pipe(v.string(), v.nonEmpty('Telephely kötelező')),
});

export const TravelInfoSchema = v.object({
  departureLocation: v.pipe(v.string(), v.nonEmpty('Indulás hely kötelező')),
  destinationLocation: v.pipe(v.string(), v.nonEmpty('Úti cél kötelező')),
  departureDate: v.pipe(v.string(), v.nonEmpty()),
  departureTime: v.pipe(v.string(), v.nonEmpty('Indulás ideje kötelező')),
  passengers: v.pipe(v.string('Nem string'), v.nonEmpty('Utasok száma kötelező')),
  comment: v.pipe(v.string()),
  return: v.boolean(),
  returnDate: v.optional(v.string()),
  returnTime: v.optional(v.string()),
  flightNumber: v.optional(v.string()),
  takeoffTime: v.optional(v.string()),
});
