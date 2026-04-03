import { bookingModel } from '../../../../server/schemas/booking'
import { BOOKING_SCENARIOS } from '../../../bookingForms.data'
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

describe('Booking Mongoose Schema', () => {
  it('should pass on full, valid, address to address form data', () => {
    const doc = new bookingModel(BOOKING_SCENARIOS.validFullAddressToAddress)
    const syncError = doc.validateSync()

    expect(syncError).toBeUndefined()
  })

  it('should pass on minimal, valid, address to address form data', () => {
    const doc = new bookingModel(BOOKING_SCENARIOS.validMinimalAddressToAddress)
    const syncError = doc.validateSync()

    expect(syncError).toBeUndefined()
  })

  it('should pass on full, valid, address to airport form data', () => {
    const doc = new bookingModel(
      BOOKING_SCENARIOS.validFullAddressToAirportWithReturn,
    )
    const syncError = doc.validateSync()

    expect(syncError).toBeUndefined()
  })

  it('should pass on minimal, valid, address to airport form data', () => {
    const doc = new bookingModel(BOOKING_SCENARIOS.validMinimalAddressToAirport)
    const syncError = doc.validateSync()

    expect(syncError).toBeUndefined()
  })

  it('should fail on missing form data', () => {
    const doc = new bookingModel(BOOKING_SCENARIOS.invalidMissingCustomerPhone)
    const syncError = doc.validateSync()

    expect(syncError?.errors['customer.phone']).toBeDefined()
    expect(syncError?.errors['customer.phone'].kind).toBe('required')
  })

  it('should return an error for an invalid email', () => {
    const doc = new bookingModel(BOOKING_SCENARIOS.invalidEmailFormat)
    const err = doc.validateSync()

    expect(err.errors['customer.email']).toBeDefined()
    expect(err.errors['customer.email'].message).toBe('Invalid email format')
  })

  it('should fail, if Airport is missing IATACode', () => {
    const data = new bookingModel(BOOKING_SCENARIOS.invalidMissingIATACode)
    const err = data.validateSync()

    expect(err.errors['departure.location.IATACode']).toBeDefined()
  })

  it('should fail, if flightNumber is filled in a address to address form', () => {
    const data = new bookingModel(
      BOOKING_SCENARIOS.invalidFlightInfoWithoutAirport,
    )
    const err = data.validateSync()

    expect(err.errors['flightInfo.outboundFlightNumber']).toBeDefined()
  })

  it('should fail, if return flight number is not filled', () => {
    const data = new bookingModel(
      BOOKING_SCENARIOS.invalidReturnTripMissingInboundFlight,
    )

    const err = data.validateSync()

    expect(err.errors['flightInfo.inboundFlightNumber']).toBeDefined()
  })

  it('should fail, if return flight number is filled, without returnInfo', () => {
    const data = new bookingModel(
      BOOKING_SCENARIOS.invalidInboundFlightWithoutReturn,
    )

    const err = data.validateSync()

    expect(err.errors['flightInfo.inboundFlightNumber']).toBeDefined()
  })
})
