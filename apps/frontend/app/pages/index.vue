<script setup lang="ts">
import { useBookingForm } from '~/composables/useBookingForm';
const { reset } = useBookingForm();
</script>

<template>
  <div class="bg-main-900">
    <UButton
      color="primary"
      size="xl"
      trailing-icon="i-lucide-clipboard-pen"
      class="px-12 py-4 text-xl fixed bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer text-text-inverse z-100 shadow-xl shadow-black/30"
      @click="reset()"
      to="/booking"
      >Árajánlatkérés</UButton
    >
    <HomeHeroSection />
    <HomeValuesSection />
    <HomePricesSection />
  </div>
</template>

<style scoped></style>
