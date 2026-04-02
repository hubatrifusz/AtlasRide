<script setup lang="ts">
const bookingStore = useBookingStore()

const formRef = ref()

const handleSubmitForm = () => {
  if (formRef.value) {
    formRef.value.submitForm()
  }
}
</script>

<template>
  <div
    class="w-screen min-h-screen gap-6 flex flex-col items-center justify-between bg-main-900 pt-32 pb-18 px-6 sm:px-0">
    <BookingFormStepper />

    <BookingStepTravelDetails
      v-if="bookingStore.currentStep == 0"
      ref="formRef" />
    <BookingStepFlightInformation
      v-if="bookingStore.isAirportTransfer && bookingStore.currentStep == 1"
      ref="formRef" />
    <BookingStepContactDetails
      v-if="
        (bookingStore.currentStep === 1 && !bookingStore.isAirportTransfer) ||
        (bookingStore.isAirportTransfer && bookingStore.currentStep === 2)
      "
      ref="formRef" />

    <BookingStepConfirmation
      v-if="
        (bookingStore.currentStep === 2 && !bookingStore.isAirportTransfer) ||
        (bookingStore.isAirportTransfer && bookingStore.currentStep === 3)
      " />
    <BookingActionButtons @submit-form="handleSubmitForm()" />
  </div>
</template>
