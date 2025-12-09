<script setup lang="ts">
import { useBookingForm } from '~/composables/useBookingForm';

const { currentStep, previousStep, nextStep, isFormValid } = useBookingForm();
</script>

<template>
  <div v-if="currentStep == 1 || currentStep == 2" class="w-full flex justify-between md:px-46 px-4">
    <UButton size="xl" class="text-text-inverse" icon="i-lucide-move-left" @click="previousStep()">Előző</UButton>
    <UButton :disabled="!isFormValid" size="xl" class="text-text-inverse" trailing-icon="i-lucide-move-right" @click="nextStep()">Következő</UButton>
  </div>

  <div v-if="currentStep == 3">
    <UButton color="primary" size="xl" trailing-icon="i-lucide-calendar-check" class="px-12 py-4 text-xl text-text-inverse z-100 shadow-xl shadow-black/30 mt-12">
      Megerősítés
    </UButton>
  </div>

  <div v-if="currentStep == 0"></div>
</template>