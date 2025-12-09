<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useBookingForm } from '~/composables/useBookingForm';
import { IndividualBookingSchema } from '~/schemas/booking'
import * as v from 'valibot';

const { isFormValid } = useBookingForm();

type IndividualBookingData = v.InferOutput<typeof IndividualBookingSchema>;

const individualBookingForm = ref<IndividualBookingData>({
  name: '',
  email: '',
  phone: '',
});

watchEffect(() => {
  const result = v.safeParse(IndividualBookingSchema, individualBookingForm.value); 
  isFormValid.value = result.success;
});
</script>

<template>
  <UForm :schema="IndividualBookingSchema" :state="individualBookingForm" class="flex flex-col gap-4 w-full justify-center items-center px-4">
    <UFormField name="name" class="md:w-1/2 w-full">
      <UInput v-model="individualBookingForm.name" trailing-icon="i-lucide-user" label="Teljes név" placeholder="Teljes név" size="xl" class="w-full" />
    </UFormField>
    <UFormField name="email" class="md:w-1/2 w-full">
      <UInput v-model="individualBookingForm.email" trailing-icon="i-lucide-at-sign" label="Email" placeholder="Email" size="xl" class="w-full" />
    </UFormField>
    <UFormField name="phone" class="md:w-1/2 w-full">
      <UInput v-model="individualBookingForm.phone" trailing-icon="i-lucide-phone" label="Telefonszám" placeholder="Telefonszám" size="xl" class="w-full" />
    </UFormField>
  </UForm>
</template>

<style></style>
