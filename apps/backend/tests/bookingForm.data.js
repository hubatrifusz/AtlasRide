const address = {
  kind: 'Address',
  city: 'Budapest',
  street: 'Test Street 12/A',
  zipCode: '1234',
};

const airport = {
  kind: 'Airport',
  name: 'Liszt Ferenc rt.',
  city: 'Budapest',
  IATACode: 'BUD',
};

const customer = {
  fullName: 'Test Name',
  email: 'email@test.com',
  phone: '+36201234567',
};

const company = {
  fullName: 'Test Name',
  email: 'email@test.com',
  phone: '+36201234567',
  companyLocation: address,
};

const departure = {
  location: address,
  dateTime: new Date().toISOString().slice(0, -8),
};

const destination = {
  location: address,
  dateTime: new Date().toISOString().slice(0, -8),
};

const departureAirport = {
  location: airport,
  dateTime: new Date().toISOString(),
};

const destinationAirport = {
  location: airport,
  dateTime: new Date().toISOString(),
};

const returnInfo = {
  dateTime: new Date().toISOString(),
};

const flightInfo = {
  outboundFlightNumber: 'FR1212',
  inboundFlightNumber: 'BD1111',
};

const comment = 'Lorem ipsum';

const fullValidAddressToAddressForm = {
  customer,
  departure,
  destination,
  comment,
};

const fullValidAddressToAirportForm = {
  customer,
  departure,
  destination: destinationAirport,
  returnInfo,
  flightInfo,
  comment,
};

const minimalValidAddressToAddressForm = {
  customer,
  departure: {
    location: { city: 'Budapest' },
    dateTime: new Date().toISOString(),
  },
  destination: {
    location: { city: 'London' },
    dateTime: new Date().toISOString(),
  },
};

const minimalValidAddressToAirportForm = {
  customer: company,
  departure: {
    location: { city: 'Budapest' },
    dateTime: new Date().toISOString(),
  },
  destination: destinationAirport,
  flightInfo: {
    inboundFlightNumber: 'FR3232',
  },
};

const missingCustomerInfoForm = {
  customer: {
    fullName: 'Teszt Elek',
    email: 'email@gmail.com',
  },
  departure,
  destination,
};

const invalidEmailForm = {
  customer: {
    fullName: 'Test Name',
    email: 'invalid.email.com',
    phone: '+36204564564',
  },
  departure,
  destination,
};

const missingIATACodeForm = {
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
};

export const BOOKING_SCENARIOS = {
  fullValidAddressToAddressForm,
  fullValidAddressToAirportForm,
  minimalValidAddressToAddressForm,
  minimalValidAddressToAirportForm,
  missingCustomerInfoForm,
  invalidEmailForm,
  missingIATACodeForm,
};
