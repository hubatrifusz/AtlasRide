import type { BookingForm } from '~/types/bookingForm'

export function useBooking() {
  const postNewBooking = async (form: any) => {
    try {
      const response = await $fetch(
        'https://atlas-ride-backend.vercel.app/api',
        {
          method: 'POST',
          body: form,
        },
      )

      return response
    } catch (error) {
      console.error('Error posting new booking:', error)
      throw error
    }
  }

  const getAllBooking = async () => {
    const response = await fetch(`https://atlas-ride-backend.vercel.app/api`)
    if (!response.ok) {
      throw new Error('Failed to fetch bookings')
    }
    return response.json()
  }

  const postHealthCheck = async (form: any) => {
    try {
      const response = await $fetch(
        'https://atlas-ride-backend.vercel.app/api/health-check',
        {
          method: 'POST',
          body: form,
        },
      )

      return response
    } catch (error) {
      console.error('Error posting health check booking:', error)
      throw error
    }
  }

  return {
    postNewBooking,
    getAllBooking,
    postHealthCheck,
  }
}
