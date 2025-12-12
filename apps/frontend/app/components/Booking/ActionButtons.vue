<script setup lang="ts">
import { useBookingForm, formData } from '~/composables/useBookingForm';
import { useBooking } from '~/utils/useBooking';

const { postNewBooking } = useBooking();
const { currentStep, previousStep, isFormValid, reset } = useBookingForm();
const toast = useToast();
const emit = defineEmits(['save-form']);

function next() {
  emit('save-form');
}

const loading = ref<boolean>(false);

async function bookRide() {
  loading.value = true;
  try {
    await postNewBooking(formData.value);
    toast.add({
      title: 'Sikeres ajánlatkérés!',
      description: 'Hamarosan felvesszük Önnel a kapcsolatot email-en keresztül.',
      icon: 'i-lucide-badge-check',
      color: 'primary',
    });

    await navigateTo('/');
  } catch {
    toast.add({
      title: 'Hiba történt!',
      description: 'Próbálkozzon később, vagy keressen minket email-en keresztül.',
      icon: 'i-lucide-badge-alert',
      color: 'error',
    });

    reset();
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div v-if="currentStep == 1 || currentStep == 2" class="w-full flex justify-between md:px-46 px-4">
    <UButton size="xl" class="text-text-inverse" icon="i-lucide-move-left" @click="previousStep()">Előző</UButton>
    <UButton :disabled="!isFormValid" size="xl" class="text-text-inverse" trailing-icon="i-lucide-move-right" @click="next()">Következő</UButton>
  </div>

  <div v-if="currentStep == 3" class="relative w-full flex flex-row justify-center">
    <UButton color="primary" variant="soft" class="text-text-primary absolute bottom-0 md:left-16 left-0" icon="i-lucide-arrow-left" size="xl" @click="previousStep()"></UButton>
    <UButton
      @click="bookRide()"
      color="primary"
      size="xl"
      trailing-icon="i-lucide-calendar-check"
      class="px-12 py-4 text-xl text-text-inverse z-100 shadow-xl shadow-black/30 mt-12"
      :loading="loading"
    >
      Megerősítés
    </UButton>
  </div>

  <div v-if="currentStep == 0"></div>
</template>
