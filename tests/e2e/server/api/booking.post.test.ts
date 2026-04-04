import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { BOOKING_SCENARIOS } from '../../../bookingForms.data'
import { bookingModel } from '../../../../server/schemas/booking'
import mongoose from 'mongoose'

describe('Booking POST tests', async () => {
  let mongod: MongoMemoryServer

  mongod = await MongoMemoryServer.create({
    binary: {
      version: '7.0.11',
      arch: 'x64',
    },
  })
  const uri = mongod.getUri()
  process.env.NUXT_MONGODB_URI = uri

  await mongoose.connect(uri)

  await setup({
    server: true,
  })

  beforeEach(async () => {
    await bookingModel.deleteMany({})
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
  })

  it('creates a new booking in the memory database', async () => {
    const response = await $fetch('/api/booking', {
      method: 'POST',
      body: BOOKING_SCENARIOS.validMinimalAddressToAddress,
    })
    const count = await bookingModel.countDocuments()
    console.log(count)
    expect(count).toEqual(1)
    expect(response).toBeDefined()
  })

  it('returns 400 if payload is missing', async () => {
    try {
      await $fetch('/api/booking', {
        method: 'POST',
        body: null,
      })
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Payload is missing')
    }
  })

  it('returns 400 if payload is invalid', async () => {
    try {
      await $fetch('/api/booking', {
        method: 'POST',
        body: BOOKING_SCENARIOS.invalidEmailFormat,
      })
    } catch (error: any) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Validation Failed')
      expect(error.data).toBeDefined()
    }
  })
})
