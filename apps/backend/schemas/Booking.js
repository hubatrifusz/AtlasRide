import * as v from 'valibot';
import { LocationSchema, AddressSchema } from './Location';

export const BookingFormSchema = v.pipe(
  v.object({
    customer: v.object({
      fullName: v.pipe(v.string(), v.nonEmpty()),
      email: v.pipe(v.string(), v.nonEmpty(), v.email()),
      phone: v.pipe(v.string(), v.nonEmpty()),
      companyLocation: v.optional(AddressSchema),
    }),
    departure: v.object({
      location: LocationSchema,
      dateTime: v.pipe(v.string(), v.isoDateTime()),
    }),
    destination: v.object({
      location: LocationSchema,
      dateTime: v.pipe(v.string(), v.isoDateTime()),
    }),
    returnInfo: v.optional(
      v.object({
        dateTime: v.pipe(v.string(), v.isoDateTime()),
      }),
    ),
    flightInfo: v.optional(
      v.object({
        outboundFlightNumber: v.optional(v.string()),
        inboundFlightNumber: v.optional(v.string()),
      }),
    ),
    comment: v.optional(v.string()),
  }),

  v.forward(
    v.check((input) => {
      const isAirport = 'IATACode' in input.departure.location || 'IATACode' in input.destination.location;
      if (isAirport) {
        return !!input.flightInfo?.outboundFlightNumber?.trim();
      }
      return true;
    }, 'Outbound flight number is required for airport transfers'),
    ['flightInfo', 'outboundFlightNumber'],
  ),

  v.forward(
    v.check((input) => {
      if (!!input.returnInfo) {
        return !!input.flightInfo?.inboundFlightNumber?.trim();
      }
      return true;
    }, 'Inbound flight number is required for return trips'),
    ['flightInfo', 'inboundFlightNumber'],
  ),

  v.check((input) => {
    const isAirport = 'IATACode' in input.departure.location || 'IATACode' in input.destination.location;
    const hasReturn = !!input.returnInfo;

    if (!isAirport && !hasReturn) {
      return input.flightInfo === undefined;
    }
    return true;
  }, 'Flight information is only allowed for airport transfers or return trips'),
);
