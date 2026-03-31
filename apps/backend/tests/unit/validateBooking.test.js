import { it, expect, describe } from 'vitest';
import { validateBooking } from '../../utils/validateBooking';

const customer = {
  fullName: 'Test Name',
  email: 'example@email.com',
  phone: '+36204175012',
};

const location = {
  city: 'New York',
  street: '123 Oak Street',
  zipCode: '1233',
};

const airport = {
  name: 'Liszt Ferenc Airport',
  city: 'Budapest',
  IATACode: 'BUD',
};

const dateTime = '2026-01-01T12:00';

const trip = {
  location: location,
  dateTime: dateTime,
};

const returnInfo = {
  dateTime: dateTime,
};

const flightInfo = {
  inboundFlightNumber: 'FR1212',
  outboundFlightNumber: 'LU1313',
};

const comment = 'Test comment';

const fullBookingForm = {
  customer,
  departure: trip,
  destination: trip,
  returnInfo,
  flightInfo,
  comment,
};

const { flightInfo: removedFlightInfo, ...validBookingForm } = fullBookingForm;

it('should be valid on a valid form', () => {
  expect(validateBooking(validBookingForm).success).toBe(true);
});

it('should be invalid if no location is airport, but flightInfo is filled', () => {
  expect(validateBooking(fullBookingForm).success).toBe(false);
});

it('should be invalid without a customer', () => {
  const { customer: removedCustomer, ...bookingWithoutCustomer } = validBookingForm;

  expect(validateBooking(bookingWithoutCustomer).success).toBe(false);
});

it('should be invalid without a departure', () => {
  const { departure: removedDeparture, ...bookingWithoutDeparture } = validBookingForm;

  expect(validateBooking(bookingWithoutDeparture).success).toBe(false);
});

it('should be invalid without a destination', () => {
  const { destination: removedDestination, ...bookingWithoutDestination } = validBookingForm;

  expect(validateBooking(bookingWithoutDestination).success).toBe(false);
});

it('should be valid without returnInfo', () => {
  const { returnInfo: removedReturnInfo, ...bookingWithoutReturnInfo } = validBookingForm;

  expect(validateBooking(bookingWithoutReturnInfo).success).toBe(true);
});

it('should be valid without flightInfo', () => {
  const { flightInfo: removedFlightInfo, ...bookingWithoutFlightInfo } = validBookingForm;

  expect(validateBooking(bookingWithoutFlightInfo).success).toBe(true);
});

it('should be valid without a comment', () => {
  const { comment: removedComment, ...bookingWithoutComment } = validBookingForm;

  expect(validateBooking(bookingWithoutComment).success).toBe(true);
});

it('should be invalid if departure is airport, but outboundFLightNumber is not filled', () => {
  const airportFormNoFlightNumber = {
    ...validBookingForm,
    departure: {
      location: airport,
      dateTime,
    },
  };

  expect(validateBooking(airportFormNoFlightNumber).success).toBe(false);
});

it('should be valid if departure is airport with outboundFLightNumber', () => {
  const airportFormNoFlightNumber = {
    ...validBookingForm,
    departure: {
      location: airport,
      dateTime,
    },
    flightInfo: {
      outboundFlightNumber: 'FR1212',
    },
  };

  expect(validateBooking(airportFormNoFlightNumber).success).toBe(true);
});

it('should be invalid if departure is airport, but with inboundFLightNumber', () => {
  const bookingForm = {
    ...validBookingForm,
    departure: {
      location: airport,
      dateTime,
    },
    flightInfo: {
      inboundFlightNumber: 'FR1212',
    },
  };

  expect(validateBooking(bookingForm).success).toBe(false);
});

it('should be invalid if inboundFlightNumber is filled, without returnInfo', () => {
  const bookingForm = {
    ...validBookingForm,
    departure: {
      location: airport,
      dateTime,
    },
    destination: {
      location: airport,
      dateTime,
    },
    flightInfo,
  };

  const { returnInfo: removedReturnInfo, ...bookingFormWithoutReturnInfo } = bookingForm;

  console.log(validateBooking(bookingFormWithoutReturnInfo));
  expect(validateBooking(bookingFormWithoutReturnInfo).success).toBe(false);
});

it('should be invalid if destination is an airport, and returnInfo is filled, but inboundFlight is not filled', () => {
  const bookingForm = {
    ...validBookingForm,
    destination: {
      location: airport,
      dateTime,
    },
    flightInfo: {
      outboundFlightNumber: 'FR1212',
    },
  };

  console.log(validateBooking(bookingForm));

  expect(validateBooking(bookingForm).success).toBe(false);
});
