import * as v from 'valibot';

export const AddressSchema = v.object({
  city: v.pipe(v.string(), v.nonEmpty()),
  street: v.pipe(v.string(), v.nonEmpty()),
  zipCode: v.pipe(v.string(), v.nonEmpty()),
});

const AirportSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  city: v.pipe(v.string(), v.nonEmpty()),
  IATACode: v.pipe(v.string(), v.nonEmpty(), v.length(3)),
});

export const LocationSchema = v.union([AddressSchema, AirportSchema]);
