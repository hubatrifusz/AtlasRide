import type { CalendarDate } from '@internationalized/date';
import { ref } from 'vue';


const formData = ref({
  name: '',
  companyName: '',
  email: '',
  phone: '',
  passengers: '',
  departureTime: '',
  takeoffTime: '',
  flightNumber: '',
  return: false as boolean,
  returnLocation: '',
  returnDate: null as CalendarDate | null,
  returnTime: '',
  comment: '',
});

const currentStep = ref<number>(0);

const isFormValid = ref<boolean>(false);

export function useBookingForm() {
  function previousStep() {
    if (currentStep.value > 0) {
      currentStep.value -= 1;
    }
  }

  function nextStep() {
    if (currentStep.value < 5) {
      currentStep.value += 1;
    }
    isFormValid.value = false;
  }

  return {
    formData,
    previousStep,
    nextStep,
    currentStep,
    isFormValid,
  };
}
