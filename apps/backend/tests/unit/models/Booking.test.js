import { describe, it, expect } from 'vitest';
import Booking from '../../../models/Booking';
import { BOOKING_SCENARIOS } from '../../bookingForm.data';

describe('Booking Mongoose Schema', () => {
  it('should pass on full, valid, address to address form data', () => {
    const doc = new Booking(BOOKING_SCENARIOS.fullValidAddressToAddressForm);
    const syncError = doc.validateSync();

    expect(syncError).toBeUndefined();
  });

  it('should pass on minimal, valid, address to address form data', () => {
    const doc = new Booking(BOOKING_SCENARIOS.minimalValidAddressToAddressForm);
    const syncError = doc.validateSync();

    expect(syncError).toBeUndefined();
  });

  it('should pass on full, valid, address to airport form data', () => {
    const doc = new Booking(BOOKING_SCENARIOS.fullValidAddressToAirportForm);
    const syncError = doc.validateSync();

    expect(syncError).toBeUndefined();
  });

  it('should pass on minimal, valid, address to airport form data', () => {
    const doc = new Booking(BOOKING_SCENARIOS.minimalValidAddressToAirportForm);
    const syncError = doc.validateSync();

    expect(syncError).toBeUndefined();
  });

  it('should fail on missing form data', () => {
    const doc = new Booking(BOOKING_SCENARIOS.missingCustomerInfoForm);
    const syncError = doc.validateSync();

    expect(syncError?.errors['customer.phone']).toBeDefined();
    expect(syncError?.errors['customer.phone'].kind).toBe('required');
  });

  it('should return an error for an invalid email', () => {
    const doc = new Booking(BOOKING_SCENARIOS.invalidEmailForm);
    const err = doc.validateSync();

    expect(err.errors['customer.email']).toBeDefined();
    expect(err.errors['customer.email'].message).toBe('Invalid email format');
  });

  it('should fail if Airport is missing IATACode', () => {
    const data = new Booking(BOOKING_SCENARIOS.missingIATACodeForm);
    const err = data.validateSync();

    expect(err.errors['departure.location.IATACode']).toBeDefined();
  });
});
