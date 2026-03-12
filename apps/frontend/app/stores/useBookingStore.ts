import { defineStore } from 'pinia';
import type { BookingForm } from '~/types/bookingForm';

export const useBookingStore = defineStore('booking', () => {
  const form = ref<BookingForm>({
    customer: { fullName: '', email: '', phone: '', companyLocation: { city: '', street: '', zipCode: '' } },
    homeAddress: { city: '', street: '', zipCode: '', isAirport: false },
    passengerCount: 1,
    departureLocation: { city: '', street: '', zipCode: '', isAirport: false },
    departureDateTime: { date: undefined, time: undefined },
    destinationLocation: { city: '', street: '', zipCode: '', isAirport: false },
    returnInfo: { isReturn: false },
    flightInfo: { outboundFlightNumber: '', returnFlightNumber: '' },
    comment: '',
  });

  const currentStep = ref<number>(0);
  const stepCount = ref<number>(0);

  const isCurrentFormSectionValid = ref<boolean>(false);

  const airportInputCount = ref<number>(0);

  const isAirportTransfer = computed(() => {
    if (airportInputCount.value == 0) {
      return false;
    }
    return true;
  });

  function nextStep() {
    if (currentStep.value >= stepCount.value) return;
    currentStep.value++;
  }

  function prevStep() {
    if (currentStep.value <= 0) return;
    currentStep.value--;
  }

  return { currentStep, stepCount, nextStep, prevStep, form, airportInputCount, isAirportTransfer, isCurrentFormSectionValid };
});
