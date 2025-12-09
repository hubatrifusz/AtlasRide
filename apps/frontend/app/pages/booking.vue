<script setup lang="ts">
import { useBookingForm } from '~/composables/useBookingForm';

const { nextStep, currentStep } = useBookingForm();

const stepperItems = ref([
  {
    title: 'Utazás típusa',
    icon: 'i-lucide-luggage',
  },
  {
    title: 'Személyes adatok',
    icon: 'i-lucide-user',
  },
  {
    title: 'Utazás részletei',
    icon: 'i-lucide-map',
  },
  {
    title: 'Megerősítés',
    icon: 'i-lucide-badge-check',
  },
]);

const rideType = ref('');

function selectRideType(type: string) {
  rideType.value = type;
  nextStep();
}

// const submitBooking = async () => {
//   loading.value = true;
//   try {
//     const response = await postNewBooking(form.value);
//     console.log('Booking created:', response);
//     router.push({ path: '/' });
//   } catch (error) {
//     console.error('Error creating booking:', error);
//   } finally {
//     loading.value = false;
//   }
// };
</script>

<template>
  <div class="w-screen min-h-screen gap-6 flex flex-col items-center justify-between bg-radial-[at_50%_0%] from-main-700 to-main-900 pt-32 pb-18">
    <!-- Stepper -->
    <UStepper :items="stepperItems" v-model="currentStep" class="w-full" :disabled="currentStep === 0" />

    <!-- Form steps -->
    <BookingStepChooseType v-if="currentStep == 0" @select-type="selectRideType" />

    <BookingPersonalInfoIndividual v-if="currentStep == 1 && (rideType === 'reptéri' || rideType == 'egyéb')" />
    <BookingPersonalInfoCorporate v-if="currentStep == 1 && rideType === 'céges'" />

    <BookingTravelInfo v-if="currentStep == 2" />
    <!-- <BookingStepConfirmation v-if="currentStep == 3" /> -->

    <!-- Action buttons -->
    <BookingActionButtons/>
  </div>
</template>
