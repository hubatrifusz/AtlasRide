<script lang="ts" setup>
import { FlightInformationSchema } from '~/schemas/booking';
import type { FlightInfo } from '~/types/bookingForm';
import * as v from 'valibot';

const bookingStore = useBookingStore();

const dynamicSchema = computed(() => {
  if (bookingStore.form?.returnInfo.isReturn) {
    return v.object({
      outboundFlightNumber: v.pipe(v.string(), v.nonEmpty('Járatszám kötelező')),
      returnFlightNumber: v.pipe(v.string(), v.nonEmpty('Vissza járat száma kötelező')),
    });
  }
  return FlightInformationSchema;
});

const flightData = ref<FlightInfo>({
  outboundFlightNumber: '',
  returnFlightNumber: '',
});

const isReturnTrip = computed(() => bookingStore.form?.returnInfo.isReturn || false);

function saveFormData() {
  if (bookingStore.form) {
    bookingStore.form.flightInfo = flightData.value;
  }
}

function initializeInputData() {
  if (bookingStore.form?.flightInfo) {
    flightData.value = bookingStore.form.flightInfo;
  }
}

const form = ref();

const submitForm = async () => {
  try {
    await form.value.validate();
    saveFormData();
    bookingStore.nextStep();
    window.scrollTo(0, 0);
  } catch {
    console.log(form.value.validate());
    window.scrollTo(0, 0);
  }
};

defineExpose({
  submitForm,
});

onMounted(() => {
  initializeInputData();
});
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-text-primary mb-2">Járat információk</h2>
      <p class="text-text-secondary">Adja meg a járatszámokat a pontos fogadáshoz</p>
    </div>

    <div class="bg-main-700/30 border border-accent-600/20 rounded-lg p-4 mb-6">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-info" class="text-accent-400 mt-0.5 shrink-0" />
        <div class="text-text-secondary text-sm space-y-1">
          <p class="font-medium text-text-primary">A járatszám megtalálása:</p>
          <ul class="list-disc list-inside space-y-1 ml-1">
            <li>Repülőjegye tetején (pl. FR1234)</li>
            <li>E-ticket visszaigazoló emailben</li>
            <li>Légitársaság weboldalán a foglalásban</li>
          </ul>
        </div>
      </div>
    </div>

    <UForm ref="form" class="flex flex-col gap-6" :schema="dynamicSchema" :state="flightData">
      <!-- Outbound Flight -->
      <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
        <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
          <UIcon name="i-lucide-plane-takeoff" class="text-xl" />
          {{ bookingStore.form?.departureLocation.isAirport ? 'Induló járat' : 'Érkezési járat' }}
        </legend>
        <div class="space-y-4">
          <UFormField name="outboundFlightNumber">
            <template #label>
              <div class="flex items-center gap-2 text-text-primary mb-2">
                <UIcon name="i-lucide-ticket" class="text-accent-400" />
                <span>Járatszám</span>  
              </div>
            </template>
            <UInput v-model="flightData.outboundFlightNumber" size="lg" placeholder="pl. FR1234, LH5678" class="w-full" />
          </UFormField>
        </div>
      </fieldset>

      <!-- Return Flight (only if return trip) -->
      <fieldset v-if="isReturnTrip" class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
        <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
          <UIcon name="i-lucide-plane-landing" class="text-xl" />
          {{ bookingStore.form?.departureLocation.isAirport ? 'Visszaút járat' : 'Visszaút érkezési járat' }}
        </legend>
        <div class="space-y-4">
          <UFormField name="returnFlightNumber">
            <template #label>
              <div class="flex items-center gap-2 text-text-primary mb-2">
                <UIcon name="i-lucide-ticket" class="text-accent-400" />
                <span>Járatszám</span>
              </div>
            </template>
            <UInput v-model="flightData.returnFlightNumber" size="lg" placeholder="pl. FR5678, LH1234" class="w-full" />
          </UFormField>
        </div>
      </fieldset>
    </UForm>

    <!-- Privacy Info Banner -->
    <div class="mt-8 bg-accent-700/20 border border-accent-500/30 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-shield-check" class="text-accent-400 mt-0.5 shrink-0" />
        <p class="text-text-secondary text-sm">
          A járatinformációkat csak a megfelelő időpontú fogadás és maximális kényelem érdekében használjuk fel. Járatkésés esetén figyeljük a járat aktuális státuszát.
        </p>
      </div>
    </div>
  </div>
</template>
