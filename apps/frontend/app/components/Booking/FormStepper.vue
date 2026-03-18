<script lang="ts" setup>
const bookingStore = useBookingStore();

const airportStepperItems = ref([
  {
    icon: 'i-lucide-map',
  },
  {
    icon: 'i-lucide-tickets-plane',
  },
  {
    icon: 'i-lucide-user',
  },
  {
    icon: 'i-lucide-badge-check',
  },
]);

const personalStepperItems = ref([
  {
    icon: 'i-lucide-map',
  },
  {
    icon: 'i-lucide-user',
  },
  {
    icon: 'i-lucide-badge-check',
  },
]);

const stepperItems = computed(() => {
  return bookingStore.isAirportTransfer ? airportStepperItems.value : personalStepperItems.value;
});

watchEffect(() => {
  bookingStore.stepCount = stepperItems.value?.length ?? 0;
});
</script>

<template>
  <UStepper disabled :items="stepperItems" v-model="bookingStore.currentStep" class="w-full" />
</template>
