import * as v from 'valibot';
import { BookingFormSchema } from '../schemas/Booking';

export function validateBooking(data) {
  return v.safeParse(BookingFormSchema, data);
}
