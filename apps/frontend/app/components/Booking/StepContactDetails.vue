<script lang="ts" setup>
import { CompanyLocationSchema, ContactDataSchema } from '~/schemas/booking';
import type { ContactInfo } from '~/types/bookingForm';
import * as v from 'valibot';

const bookingStore = useBookingStore();

const tabItems = [
  {
    label: 'Magánszemély',
    icon: 'i-lucide-user',
  },
  {
    label: 'Cég',
    icon: 'i-lucide-building-2',
  },
];

const dynamicSchema = computed(() => {
  if (active.value === '1') {
    return v.object({
      ...ContactDataSchema.entries,
      companyLocation: CompanyLocationSchema,
    });
  }

  return v.object({
    ...ContactDataSchema.entries,
    companyLocation: v.optional(v.any()),
  });
});

const contactData = ref<ContactInfo>({
  fullName: '',
  email: '',
  phone: '',
  companyLocation: { city: '', zipCode: '', street: '' },
});

const comment = ref<string>('');

const _activeState = ref('0');

const active = computed({
  get() {
    const hasLocationData = !!(contactData.value.companyLocation?.city || contactData.value.companyLocation?.zipCode || contactData.value.companyLocation?.street);

    return hasLocationData ? '1' : _activeState.value;
  },
  set(newValue) {
    _activeState.value = newValue;

    if (newValue === '0') {
      contactData.value.companyLocation = { city: '', zipCode: '', street: '' };
    }
  },
});

function saveFormData() {
  if (bookingStore.form) {
    bookingStore.form.customer = contactData.value;
    bookingStore.form.comment = comment.value;
  }
}

function initializeInputData() {
  if (bookingStore.form) {
    contactData.value = bookingStore.form.customer;
    comment.value = bookingStore.form.comment;
  }
}

const form = ref();

const submitForm = async () => {
  try {
    window.scrollTo(0, 0);
    await form.value.validate();
    saveFormData();
    bookingStore.nextStep();
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
      <h2 class="text-3xl font-bold text-text-primary mb-2">Kapcsolattartó adatok</h2>
      <p class="text-text-secondary">Adja meg az elérhetőségeit a foglalás véglegesítéséhez</p>
    </div>

    <!-- User Type Selector -->
    <div class="mb-8">
      <UTabs v-model="active" color="primary" :items="tabItems" class="w-full" />
    </div>

    <UForm ref="form" class="flex flex-col gap-6" :schema="dynamicSchema" :state="contactData">
      <!-- Contact Information -->
      <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
        <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
          <UIcon name="i-lucide-contact" class="text-xl" />
          Elérhetőségek
        </legend>
        <div class="space-y-4 mt-4">
          <UFormField name="fullName">
            <template #label>
              <div class="flex items-center gap-2 text-text-primary mb-2">
                <UIcon name="i-lucide-user" class="text-accent-400" />
                <span>Teljes név</span>
              </div>
            </template>
            <UInput v-model="contactData.fullName" size="lg" placeholder="Teljes név" class="w-full" />
          </UFormField>

          <UFormField name="phone">
            <template #label>
              <div class="flex items-center gap-2 text-text-primary mb-2">
                <UIcon name="i-lucide-phone" class="text-accent-400" />
                <span>Telefonszám</span>
              </div>
            </template>
            <UInput v-model="contactData.phone" size="lg" placeholder="+36 (XX) XXX-XXXX" class="w-full" />
          </UFormField>

          <UFormField name="email">
            <template #label>
              <div class="flex items-center gap-2 text-text-primary mb-2">
                <UIcon name="i-lucide-mail" class="text-accent-400" />
                <span>Email cím</span>
              </div>
            </template>
            <UInput v-model="contactData.email" size="lg" placeholder="pelda@email.com" class="w-full" />
          </UFormField>
        </div>
      </fieldset>

      <!-- Company Location (only for companies) -->
      <fieldset v-if="active === '1'" class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
        <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
          <UIcon name="i-lucide-building-2" class="text-xl" />
          Telephely címe
        </legend>
        <div class="space-y-4 mt-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormField name="companyLocation.zipCode" class="sm:col-span-1">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-hash" class="text-accent-400" />
                  <span>Irányítószám</span>
                </div>
              </template>
              <UInput v-model="contactData.companyLocation!.zipCode" size="lg" placeholder="1234" class="w-full" />
            </UFormField>

            <UFormField name="companyLocation.city" class="sm:col-span-2">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-map-pin" class="text-accent-400" />
                  <span>Település</span>
                </div>
              </template>
              <UInput v-model="contactData.companyLocation!.city" size="lg" placeholder="Település neve" class="w-full" />
            </UFormField>
          </div>

          <UFormField name="companyLocation.street">
            <template #label>
              <div class="flex items-center gap-2 text-text-primary mb-2">
                <UIcon name="i-lucide-route" class="text-accent-400" />
                <span>Utca, házszám</span>
              </div>
            </template>
            <UInput v-model="contactData.companyLocation!.street" size="lg" placeholder="Példa utca 12." class="w-full" />
          </UFormField>
        </div>
      </fieldset>

      <!-- Additional Comments -->
      <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
        <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
          <UIcon name="i-lucide-message-square" class="text-xl" />
          Megjegyzés
        </legend>
        <div class="mt-4">
          <UFormField name="comment">
            <template #label>
              <div class="flex items-center gap-2 text-text-secondary mb-2">
                <UIcon name="i-lucide-file-text" class="text-accent-400" />
                <span class="text-sm">Bármilyen egyéb kérés vagy fontos információ (opcionális)</span>
              </div>
            </template>
            <UTextarea v-model="comment" placeholder="Pl. érkezési idő pontosítása, különleges igények..." :rows="5" size="lg" autoresize class="w-full" />
          </UFormField>
        </div>
      </fieldset>
    </UForm>

    <!-- Info Banner -->
    <div class="mt-8 bg-main-700/50 border border-accent-600/30 rounded-xl p-4">
      <div class="flex items-start gap-3">
        <UIcon name="i-lucide-info" class="text-accent-400 mt-0.5 shrink-0" />
        <p class="text-text-secondary text-sm">
          A megadott adatokat kizárólag a foglalás lebonyolításához és a kapcsolattartáshoz használjuk fel. Az adatkezelési tájékoztatót az oldal alján találja.
        </p>
      </div>
    </div>
  </div>
</template>
