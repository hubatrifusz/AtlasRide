<script setup lang="ts">
const bookingStore = useBookingStore();

const formRef = ref();

const handleSubmitForm = () => {
  if (formRef.value) {
    formRef.value.submitForm();
  }
};
</script>

<template>
  <div class="w-screen min-h-screen gap-6 flex flex-col items-center justify-between bg-main-900 pt-32 pb-18 px-6 sm:px-0">
    <BookingFormStepper />

    <BookingStepTravelDetails ref="formRef" v-if="bookingStore.currentStep == 0" />
    <BookingStepFlightInformation ref="formRef" v-if="bookingStore.isAirportTransfer && bookingStore.currentStep == 1" />
    <BookingStepContactDetails
      ref="formRef"
      v-if="(bookingStore.currentStep === 1 && !bookingStore.isAirportTransfer) || (bookingStore.isAirportTransfer && bookingStore.currentStep === 2)"
    />

    <BookingStepConfirmation v-if="(bookingStore.currentStep === 2 && !bookingStore.isAirportTransfer) || (bookingStore.isAirportTransfer && bookingStore.currentStep === 3)" />
    <BookingActionButtons @submit-form="handleSubmitForm()" />
  </div>
</template>
