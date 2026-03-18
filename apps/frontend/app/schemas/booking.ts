import * as v from 'valibot';

export const AddressSchema = v.object({
  city: v.pipe(v.string(), v.nonEmpty('Kötelező')),
  street: v.optional(v.string()),
  zipCode: v.optional(v.string()),
  isAirport: v.pipe(v.boolean()),
});

export const CompanyLocationSchema = v.object({
  city: v.pipe(v.string(), v.nonEmpty('Kötelező kitölteni')),
  street: v.pipe(v.string(), v.nonEmpty('Kötelező kitölteni')),
  zipCode: v.pipe(v.string(), v.nonEmpty('Kötelező kitölteni')),
});

export const ContactDataSchema = v.object({
  fullName: v.pipe(v.string(), v.nonEmpty('Kötelező kitölteni')),
  email: v.pipe(v.string(), v.nonEmpty('Kötelező kitölteni'), v.email('Valódi email címet adjon meg')),
  phone: v.pipe(v.string(), v.nonEmpty('Kötelező kitölteni')),
});

export const FlightInformationSchema = v.object({
  outboundFlightNumber: v.pipe(v.string(), v.nonEmpty('Járatszám kötelező')),
  returnFlightNumber: v.optional(v.string()),
});
