import * as v from 'valibot';

export const IndividualBookingSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty('Név kötelező')),
  email: v.pipe(v.string(), v.nonEmpty('Email kötelező'), v.email('Érvénytelen email')),
  phone: v.pipe(v.string(), v.nonEmpty('Telefonszám kötelező')),
});

export const TravelInfoSchema = v.object({
  departureLocation: v.pipe(v.string(), v.nonEmpty('Indulás hely kötelező')),
  destinationLocation: v.pipe(v.string(), v.nonEmpty('Úti cél kötelező')),
  departureDate: v.string(),
  departureTime: v.pipe(v.string(), v.nonEmpty('Indulás ideje kötelező')),
  passengers: v.pipe(v.string('Nem string'), v.nonEmpty('Utasok száma kötelező')),
  comment: v.pipe(v.string()),
  return: v.boolean(),
  returnDate: v.string(),
  returnTime: v.pipe(v.string(), v.nonEmpty('Visszaút indulási ideje kötelező')),
  flightNumber: v.pipe(v.string()),
  takeoffTime: v.pipe(v.string()),
});
