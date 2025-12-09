<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useBookingForm } from '~/composables/useBookingForm';
import * as v from 'valibot';

const { isFormValid } = useBookingForm();

const CorporateBookingSchema = v.object({
  companyName: v.pipe(v.string(), v.nonEmpty('Cégnév kötelező')),
  name: v.pipe(v.string(), v.nonEmpty('Kapcsolattartó neve kötelező')),
  email: v.pipe(v.string(), v.nonEmpty('Email kötelező'), v.email('Érvénytelen email')),
  phone: v.pipe(v.string(), v.nonEmpty('Telefonszám kötelező')),
  homeAddress: v.pipe(v.string(), v.nonEmpty('Telephely kötelező')),
});

type CorporateBookingData = v.InferOutput<typeof CorporateBookingSchema>;

const CorporateBookingForm = ref<CorporateBookingData>({
  companyName: '',
  name: '',
  email: '',
  phone: '',
  homeAddress: '',
});

watchEffect(() => {
  const result = v.safeParse(CorporateBookingSchema, CorporateBookingForm.value); 
  isFormValid.value = result.success;
});
</script>

<template>
  <UForm :schema="CorporateBookingSchema" :state="CorporateBookingForm" class="flex flex-col gap-4 w-full justify-center items-center px-4">
    <UFormField class="md:w-1/2 w-full" name="companyName">
      <UInput v-model="CorporateBookingForm.companyName" trailing-icon="i-lucide-building-2" label="Cégnév" placeholder="Cégnév" size="xl" class="w-full" />
    </UFormField>
    <UFormField class="md:w-1/2 w-full" name="name">
      <UInput v-model="CorporateBookingForm.name" trailing-icon="i-lucide-user" label="Kapcsolattartó neve" placeholder="Kapcsolattartó neve" size="xl" class="w-full" />
    </UFormField>
    <UFormField class="md:w-1/2 w-full" name="email">
      <UInput v-model="CorporateBookingForm.email" trailing-icon="i-lucide-at-sign" label="Email" placeholder="Email" size="xl" class="w-full" />
    </UFormField>
    <UFormField class="md:w-1/2 w-full" name="phone">
      <UInput v-model="CorporateBookingForm.phone" trailing-icon="i-lucide-phone" label="Telefonszám" placeholder="Telefonszám" size="xl" class="w-full" />
    </UFormField>
    <UFormField class="md:w-1/2 w-full" name="homeAddress">
      <UInput v-model="CorporateBookingForm.homeAddress" trailing-icon="i-lucide-map-pin-house" label="Telephely" placeholder="Telephely" size="xl" class="w-full" />
    </UFormField>
  </UForm>
</template>
