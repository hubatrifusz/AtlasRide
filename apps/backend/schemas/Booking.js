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
      const isDepartureAirport = 'IATACode' in input.departure.location;
      const outboundFlightNumberExists = !!input.flightInfo?.outboundFlightNumber?.trim();

      return isDepartureAirport == outboundFlightNumberExists;
    }, 'Outbound flight number is required, when departure is an airport'),
    ['flightInfo', 'outboundFlightNumber'],
  ),

  v.forward(
    v.check((input) => {
      const isDestinationAirport = 'IATACode' in input.destination.location;
      const isReturnInfoFilled = !!input.returnInfo;
      const isInboundFlightNumberFilled = !!input.flightInfo?.inboundFlightNumber;

      return (isDestinationAirport && isReturnInfoFilled) === isInboundFlightNumberFilled;
    }, "Inbound flight number can't exist, when returnInfo is not provide"),
    ['flightInfo', 'inboundFlightNumber'],
  ),
);
