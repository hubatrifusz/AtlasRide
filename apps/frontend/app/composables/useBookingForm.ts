import { ref } from 'vue';

const getInitialFormData = () => ({
  rideType: '',
  name: '',
  companyName: '',
  email: '',
  phone: '',
  homeAddress: '',
  passengers: '',
  departureLocation: '',
  departureDate: '',
  departureTime: '',
  destinationLocation: '',
  takeoffTime: '' as string | undefined,
  flightNumber: '' as string | undefined,
  return: false as boolean,
  returnDate: '' as string | undefined,
  returnTime: '' as string | undefined,
  comment: '',
});

export const formData = ref(getInitialFormData());

const currentStep = ref<number>(0);
export const rideType = ref<string>('');
const isFormValid = ref<boolean>(false);

watch(rideType, (newVal) => {
  formData.value.rideType = newVal;
});

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

  function clearForm() {
    formData.value = getInitialFormData();
  }

  function reset() {
    clearForm();
    currentStep.value = 0;
  }

  return {
    previousStep,
    nextStep,
    clearForm,
    reset,
    currentStep,
    isFormValid,
  };
}
