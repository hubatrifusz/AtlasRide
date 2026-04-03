import { BookingForm } from '~~/shared/types/bookingForm'
import { bookingModel } from '../schemas/booking'

export default defineEventHandler(async (event) => {
  const body = await readBody<BookingForm>(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload is missing',
    })
  }

  try {
    const newBooking = await bookingModel.create(body)
    setResponseStatus(event, 201)

    return newBooking
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Failed',
        data: error.errors,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }
})
