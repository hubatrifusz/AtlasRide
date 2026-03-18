import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import {
  AddressSchema,
  CompanyLocationSchema,
  ContactDataSchema,
  FlightInformationSchema,
} from '../../../app/schemas/booking';

describe('Booking Schemas Validation', () => {
  describe('AddressSchema', () => {
    it('should validate a valid address', () => {
      const validAddress = {
        city: 'Budapest',
        street: 'Andrassy ut 1',
        zipCode: '1061',
        isAirport: false,
      };

      const result = v.parse(AddressSchema, validAddress);

      expect(result).toEqual(validAddress);
    });

    it('should validate address with only required fields', () => {
      const minimalAddress = {
        city: 'Vienna',
        isAirport: true,
      };

      const result = v.parse(AddressSchema, minimalAddress);

      expect(result.city).toBe('Vienna');
      expect(result.isAirport).toBe(true);
    });

    it('should fail validation when city is empty', () => {
      const invalidAddress = {
        city: '',
        street: 'Some street',
        zipCode: '1234',
        isAirport: false,
      };

      expect(() => v.parse(AddressSchema, invalidAddress)).toThrow();
    });

    it('should fail validation when city is missing', () => {
      const invalidAddress = {
        street: 'Some street',
        zipCode: '1234',
        isAirport: false,
      };

      expect(() => v.parse(AddressSchema, invalidAddress)).toThrow();
    });

    it('should fail validation when isAirport is missing', () => {
      const invalidAddress = {
        city: 'Budapest',
        street: 'Some street',
        zipCode: '1234',
      };

      expect(() => v.parse(AddressSchema, invalidAddress)).toThrow();
    });

    it('should validate when street is undefined', () => {
      const address = {
        city: 'Budapest',
        street: undefined,
        zipCode: '1234',
        isAirport: false,
      };

      const result = v.parse(AddressSchema, address);

      expect(result.city).toBe('Budapest');
    });

    it('should validate when zipCode is undefined', () => {
      const address = {
        city: 'Budapest',
        street: 'Main St',
        zipCode: undefined,
        isAirport: true,
      };

      const result = v.parse(AddressSchema, address);

      expect(result.city).toBe('Budapest');
      expect(result.isAirport).toBe(true);
    });

    it('should validate airport address', () => {
      const airportAddress = {
        city: 'Budapest',
        street: '',
        zipCode: '',
        isAirport: true,
      };

      const result = v.parse(AddressSchema, airportAddress);

      expect(result.isAirport).toBe(true);
    });
  });

  describe('CompanyLocationSchema', () => {
    it('should validate a valid company location', () => {
      const validCompany = {
        city: 'Budapest',
        street: 'Andrassy ut 1',
        zipCode: '1061',
      };

      const result = v.parse(CompanyLocationSchema, validCompany);

      expect(result).toEqual(validCompany);
    });

    it('should fail validation when city is empty', () => {
      const invalidCompany = {
        city: '',
        street: 'Some street',
        zipCode: '1234',
      };

      expect(() => v.parse(CompanyLocationSchema, invalidCompany)).toThrow();
    });

    it('should fail validation when street is empty', () => {
      const invalidCompany = {
        city: 'Budapest',
        street: '',
        zipCode: '1234',
      };

      expect(() => v.parse(CompanyLocationSchema, invalidCompany)).toThrow();
    });

    it('should fail validation when zipCode is empty', () => {
      const invalidCompany = {
        city: 'Budapest',
        street: 'Andrassy ut 1',
        zipCode: '',
      };

      expect(() => v.parse(CompanyLocationSchema, invalidCompany)).toThrow();
    });

    it('should fail validation when all fields are missing', () => {
      const invalidCompany = {};

      expect(() => v.parse(CompanyLocationSchema, invalidCompany)).toThrow();
    });

    it('should validate company with special characters in address', () => {
      const companyWithSpecialChars = {
        city: 'Győr',
        street: 'Fő út 123/A',
        zipCode: '9024',
      };

      const result = v.parse(CompanyLocationSchema, companyWithSpecialChars);

      expect(result).toEqual(companyWithSpecialChars);
    });
  });

  describe('ContactDataSchema', () => {
    it('should validate valid contact data', () => {
      const validContact = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+36301234567',
      };

      const result = v.parse(ContactDataSchema, validContact);

      expect(result).toEqual(validContact);
    });

    it('should fail validation when fullName is empty', () => {
      const invalidContact = {
        fullName: '',
        email: 'john@example.com',
        phone: '+36301234567',
      };

      expect(() => v.parse(ContactDataSchema, invalidContact)).toThrow();
    });

    it('should fail validation when email is empty', () => {
      const invalidContact = {
        fullName: 'John Doe',
        email: '',
        phone: '+36301234567',
      };

      expect(() => v.parse(ContactDataSchema, invalidContact)).toThrow();
    });

    it('should fail validation when email format is invalid', () => {
      const invalidContact = {
        fullName: 'John Doe',
        email: 'invalid-email',
        phone: '+36301234567',
      };

      expect(() => v.parse(ContactDataSchema, invalidContact)).toThrow();
    });

    it('should fail validation when email is missing @', () => {
      const invalidContact = {
        fullName: 'John Doe',
        email: 'johnexample.com',
        phone: '+36301234567',
      };

      expect(() => v.parse(ContactDataSchema, invalidContact)).toThrow();
    });

    it('should fail validation when phone is empty', () => {
      const invalidContact = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '',
      };

      expect(() => v.parse(ContactDataSchema, invalidContact)).toThrow();
    });

    it('should validate various email formats', () => {
      const emails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
        'user_123@test-domain.com',
      ];

      emails.forEach((email) => {
        const contact = {
          fullName: 'Test User',
          email,
          phone: '+36301234567',
        };

        const result = v.parse(ContactDataSchema, contact);
        expect(result.email).toBe(email);
      });
    });

    it('should validate contact with Hungarian name', () => {
      const hungarianContact = {
        fullName: 'Nagy János',
        email: 'nagy.janos@pelda.hu',
        phone: '+36301234567',
      };

      const result = v.parse(ContactDataSchema, hungarianContact);

      expect(result).toEqual(hungarianContact);
    });
  });

  describe('FlightInformationSchema', () => {
    it('should validate valid flight information', () => {
      const validFlight = {
        outboundFlightNumber: 'FR1234',
        returnFlightNumber: 'FR5678',
      };

      const result = v.parse(FlightInformationSchema, validFlight);

      expect(result).toEqual(validFlight);
    });

    it('should validate with only outbound flight number', () => {
      const onewayFlight = {
        outboundFlightNumber: 'LH4567',
      };

      const result = v.parse(FlightInformationSchema, onewayFlight);

      expect(result.outboundFlightNumber).toBe('LH4567');
    });

    it('should fail validation when outbound flight number is empty', () => {
      const invalidFlight = {
        outboundFlightNumber: '',
        returnFlightNumber: 'FR5678',
      };

      expect(() => v.parse(FlightInformationSchema, invalidFlight)).toThrow();
    });

    it('should fail validation when outbound flight number is missing', () => {
      const invalidFlight = {
        returnFlightNumber: 'FR5678',
      };

      expect(() => v.parse(FlightInformationSchema, invalidFlight)).toThrow();
    });

    it('should validate various flight number formats', () => {
      const flightNumbers = ['FR1234', 'LH5678', 'BA123', 'W6-1234', 'OS 456'];

      flightNumbers.forEach((flightNumber) => {
        const flight = {
          outboundFlightNumber: flightNumber,
        };

        const result = v.parse(FlightInformationSchema, flight);
        expect(result.outboundFlightNumber).toBe(flightNumber);
      });
    });

    it('should validate when returnFlightNumber is undefined', () => {
      const flight = {
        outboundFlightNumber: 'FR1234',
        returnFlightNumber: undefined,
      };

      const result = v.parse(FlightInformationSchema, flight);

      expect(result.outboundFlightNumber).toBe('FR1234');
    });

    it('should validate both flight numbers for return trip', () => {
      const returnTrip = {
        outboundFlightNumber: 'FR1234',
        returnFlightNumber: 'FR5678',
      };

      const result = v.parse(FlightInformationSchema, returnTrip);

      expect(result.outboundFlightNumber).toBe('FR1234');
      expect(result.returnFlightNumber).toBe('FR5678');
    });
  });

  describe('Schema Error Messages', () => {
    it('should provide custom error message for empty city', () => {
      const invalidAddress = {
        city: '',
        isAirport: false,
      };

      try {
        v.parse(AddressSchema, invalidAddress);
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Kötelező');
      }
    });

    it('should provide custom error message for invalid email', () => {
      const invalidContact = {
        fullName: 'Test',
        email: 'invalid-email',
        phone: '123',
      };

      try {
        v.parse(ContactDataSchema, invalidContact);
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Valódi email címet adjon meg');
      }
    });

    it('should provide custom error message for empty contact fields', () => {
      const invalidContact = {
        fullName: '',
        email: '',
        phone: '',
      };

      try {
        v.parse(ContactDataSchema, invalidContact);
      } catch (error: any) {
        expect(error.issues[0].message).toContain('Kötelező');
      }
    });

    it('should provide custom error message for empty company location', () => {
      const invalidCompany = {
        city: '',
        street: '',
        zipCode: '',
      };

      try {
        v.parse(CompanyLocationSchema, invalidCompany);
      } catch (error: any) {
        expect(error.issues[0].message).toBe('Kötelező kitölteni');
      }
    });
  });
});
