<script setup lang="ts">
const bookingStore = useBookingStore();

const emit = defineEmits(['submitForm']);

const loading = ref<boolean>(false);

function handleSubmit() {
  loading.value = true;
  console.log('Submitting form data:', bookingStore.form);

  setTimeout(() => {
    loading.value = false;
    console.log('Form submitted successfully:', bookingStore.form);
  }, 2000);
}
</script>

<template>
  <!-- Final Confirmation Step -->
  <div v-if="bookingStore.currentStep === bookingStore.stepCount - 1" class="w-full max-w-4xl">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
      <!-- Back Button -->
      <UButton color="neutral" variant="soft" size="xl" icon="i-lucide-arrow-left" class="order-2 sm:order-1 w-full sm:w-auto" @click="bookingStore.prevStep()">
        <span class="hidden sm:inline">Vissza</span>
      </UButton>

      <!-- Confirm Button -->
      <UButton
        color="primary"
        size="xl"
        trailing-icon="i-lucide-circle-check"
        class="order-1 sm:order-2 px-8 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
        :loading="loading"
        @click="handleSubmit()"
      >
        Megerősítés
      </UButton>
    </div>
  </div>

  <!-- Navigation Steps -->
  <div v-else class="w-full max-w-4xl">
    <div class="flex items-center justify-between gap-4 pt-8 border-t-2 border-main-700">
      <!-- Previous Button -->
      <UButton v-if="bookingStore.currentStep != 0" color="neutral" variant="soft" size="xl" icon="i-lucide-arrow-left" class="px-6" @click="bookingStore.prevStep()">
        Vissza
      </UButton>
      <div v-else></div>

      <!-- Next Button -->
      <UButton color="primary" size="xl" trailing-icon="i-lucide-arrow-right" class="px-8 shadow-md hover:shadow-lg transition-all duration-300" @click="emit('submitForm')">
        Következő
      </UButton>
    </div>
  </div>
</template>
