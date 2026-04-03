const address = {
  kind: 'Address',
  city: 'Budapest',
  street: 'Test Street 12/A',
  zipCode: '1234',
}

const airport = {
  kind: 'Airport',
  name: 'Liszt Ferenc rt.',
  city: 'Budapest',
  IATACode: 'BUD',
}

const customer = {
  fullName: 'Test Name',
  email: 'email@test.com',
  phone: '+36201234567',
}

const company = {
  fullName: 'Test Name',
  email: 'email@test.com',
  phone: '+36201234567',
  companyLocation: address,
}

const departure = {
  location: address,
  dateTime: new Date().toISOString().slice(0, -8),
}

const destination = {
  location: address,
  dateTime: new Date().toISOString().slice(0, -8),
}

const departureAirport = {
  location: airport,
  dateTime: new Date().toISOString(),
}

const destinationAirport = {
  location: airport,
  dateTime: new Date().toISOString(),
}

const returnInfo = {
  dateTime: new Date().toISOString(),
}

const flightInfo = {
  outboundFlightNumber: 'FR1212',
  inboundFlightNumber: 'BD1111',
}

const comment = 'Lorem ipsum'

const validFullAddressToAddress = {
  customer,
  departure,
  destination,
  comment,
  passengerCount: 1,
}

const validFullAddressToAirportWithReturn = {
  customer,
  departure,
  destination: destinationAirport,
  returnInfo,
  flightInfo,
  comment,
  passengerCount: 1,
}

const validMinimalAddressToAddress = {
  customer,
  departure: {
    location: { kind: 'Address', city: 'Budapest' },
    dateTime: new Date().toISOString(),
  },
  destination: {
    location: { kind: 'Address', city: 'London' },
    dateTime: new Date().toISOString(),
  },
  passengerCount: 1,
}

const validMinimalAddressToAirport = {
  customer: company,
  departure: {
    location: { kind: 'Address', city: 'Budapest' },
    dateTime: new Date().toISOString(),
  },
  destination: destinationAirport,
  flightInfo: {
    outboundFlightNumber: 'FR3232',
  },
  passengerCount: 1,
}

const invalidMissingCustomerPhone = {
  customer: {
    fullName: 'Teszt Elek',
    email: 'email@gmail.com',
  },
  departure,
  destination,
  passengerCount: 1,
}

const invalidEmailFormat = {
  customer: {
    fullName: 'Test Name',
    email: 'invalid.email.com',
    phone: '+36204564564',
  },
  departure,
  destination,
  passengerCount: 1,
}

const invalidMissingIATACode = {
  customer: company,
  departure: {
    location: {
      kind: 'Airport',
      name: 'Liszt Ferenc rt.',
      city: 'Budapest',
    },
    dateTime: new Date().toISOString(),
  },
  destination,
  flightInfo: {
    inboundFlightNumber: 'FR3232',
  },
  passengerCount: 1,
}

const invalidFlightInfoWithoutAirport = {
  customer,
  departure,
  destination,
  passengerCount: 1,
  flightInfo: {
    outboundFlightNumber: 'FR1212',
  },
}

const invalidReturnTripMissingInboundFlight = {
  customer,
  departure,
  destination: destinationAirport,
  passengerCount: 1,
  returnInfo,
  flightInfo: {
    outboundFlightNumber: 'FR1212',
  },
}

const invalidInboundFlightWithoutReturn = {
  customer,
  departure,
  destination: destinationAirport,
  passengerCount: 1,
  flightInfo: {
    outboundFlightNumber: 'FR1212',
    inboundFlightNumber: 'HG1221',
  },
}

export const BOOKING_SCENARIOS = {
  validFullAddressToAddress,
  validFullAddressToAirportWithReturn,
  validMinimalAddressToAddress,
  validMinimalAddressToAirport,
  invalidMissingCustomerPhone,
  invalidEmailFormat,
  invalidMissingIATACode,
  invalidFlightInfoWithoutAirport,
  invalidReturnTripMissingInboundFlight,
  invalidInboundFlightWithoutReturn,
}
