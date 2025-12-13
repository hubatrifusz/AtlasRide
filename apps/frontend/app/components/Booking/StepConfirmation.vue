<script setup lang="ts">
import { formData, rideType } from '~/composables/useBookingForm';
</script>

<template>
  <div class="w-screen flex flex-col items-center gap-8 p-4">
    <fieldset class="border border-main-500 rounded-md p-8 md:w-1/2 w-full flex flex-col">
      <legend class="px-2 text-main-200">Személyes adatok</legend>
      <span v-if="formData.companyName"><UIcon name="i-lucide-building-2" class="bg-main-300" /> {{ formData.companyName }}</span>
      <span v-if="formData.name"><UIcon name="i-lucide-user" class="bg-main-300" /> {{ formData.name }}</span>
      <span v-if="formData.email"><UIcon name="i-lucide-mail" class="bg-main-300" /> {{ formData.email }}</span>
      <span v-if="formData.phone"><UIcon name="i-lucide-phone" class="bg-main-300" /> {{ formData.phone }}</span>
      <span v-if="formData.homeAddress"><UIcon name="i-lucide-house" class="bg-main-300" /> {{ formData.homeAddress }}</span>
    </fieldset>

    <fieldset class="border border-main-500 rounded-md p-8 md:w-1/2 w-full flex flex-col">
      <legend class="px-2 text-main-200">Utazás részletei</legend>
      <span v-if="formData.passengers"><UIcon name="i-lucide-users" class="bg-main-300" /> {{ formData.passengers }}</span>
      <span v-if="formData.departureLocation"
        ><i class="text-main-300">Indulás:</i> {{ formData.departureLocation }}, {{ formData.departureDate }}, {{ formData.departureTime }}</span
      >
      <span v-if="formData.destinationLocation"><i class="text-main-300">Érkezés:</i> {{ formData.destinationLocation }}</span>
      <span v-if="formData.return"><i class="text-main-300">Retúr:</i> {{ formData.returnDate }}, {{ formData.returnTime }}</span>
      <span v-if="formData.comment"><UIcon name="i-lucide-message-square" class="bg-main-300" /> {{ formData.comment }}</span>
    </fieldset>

    <fieldset v-if="rideType == 'reptéri' && (formData.flightNumber || formData.takeoffTime)" class="border border-main-500 rounded-md p-8 md:w-1/2 w-full flex flex-col">
      <legend class="px-2 text-main-200">Repülőút részletei</legend>
      <span v-if="formData.flightNumber"><UIcon name="i-lucide-plane" class="bg-main-300" /> {{ formData.flightNumber }}</span>
      <span v-if="formData.takeoffTime"><UIcon name="i-lucide-clock" class="bg-main-300" /> {{ formData.takeoffTime }}</span>
    </fieldset>

    <BookingActionButtons />
  </div>
</template>

<style scoped>
span {
  color: var(--color-text-primary);
}
</style>
