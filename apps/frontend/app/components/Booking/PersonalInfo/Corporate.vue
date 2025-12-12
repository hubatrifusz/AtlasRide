<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue';
import { useBookingForm, formData } from '~/composables/useBookingForm';
import * as v from 'valibot';
import { CorporateBookingSchema } from '~/schemas/booking';

const { isFormValid, nextStep } = useBookingForm();

type CorporateBookingData = v.InferOutput<typeof CorporateBookingSchema>;

const corporateBookingForm = ref<CorporateBookingData>({
  companyName: '',
  name: '',
  email: '',
  phone: '',
  homeAddress: '',
});

onMounted(() => {
  corporateBookingForm.value.companyName = formData.value.companyName;
  corporateBookingForm.value.name = formData.value.name;
  corporateBookingForm.value.email = formData.value.email;
  corporateBookingForm.value.phone = formData.value.phone;
  corporateBookingForm.value.homeAddress = formData.value.homeAddress;
});

watchEffect(() => {
  const result = v.safeParse(CorporateBookingSchema, corporateBookingForm.value);
  isFormValid.value = result.success;
});

function saveForm() {
  formData.value.companyName = corporateBookingForm.value.companyName;
  formData.value.name = corporateBookingForm.value.name;
  formData.value.email = corporateBookingForm.value.email;
  formData.value.phone = corporateBookingForm.value.phone;
  formData.value.homeAddress = corporateBookingForm.value.homeAddress;

  nextStep();
}
</script>

<template>
  <UForm :schema="CorporateBookingSchema" :state="corporateBookingForm" class="flex flex-col gap-4 w-full justify-center items-center px-4">
    <UFormField class="md:w-1/2 w-full" name="companyName">
      <UInput v-model="corporateBookingForm.companyName" trailing-icon="i-lucide-building-2" label="Cégnév" placeholder="Cégnév" size="xl" class="w-full" />
    </UFormField>
    <UFormField class="md:w-1/2 w-full" name="name">
      <UInput v-model="corporateBookingForm.name" trailing-icon="i-lucide-user" label="Kapcsolattartó neve" placeholder="Kapcsolattartó neve" size="xl" class="w-full" />
    </UFormField>
    <UFormField class="md:w-1/2 w-full" name="email">
      <UInput v-model="corporateBookingForm.email" trailing-icon="i-lucide-at-sign" label="Email" placeholder="Email" size="xl" class="w-full" />
    </UFormField>
    <UFormField class="md:w-1/2 w-full" name="phone">
      <UInput v-model="corporateBookingForm.phone" trailing-icon="i-lucide-phone" label="Telefonszám" placeholder="Telefonszám" size="xl" class="w-full" />
    </UFormField>
    <UFormField class="md:w-1/2 w-full" name="homeAddress">
      <UInput v-model="corporateBookingForm.homeAddress" trailing-icon="i-lucide-map-pin-house" label="Telephely" placeholder="Telephely" size="xl" class="w-full" />
    </UFormField>
  </UForm>

  <BookingActionButtons @save-form="saveForm" />
</template>
