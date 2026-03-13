<script lang="ts" setup>
import type { CalendarDate, Time } from '@internationalized/date';
import * as v from 'valibot';
import { AddressSchema } from '~/schemas/booking';
import type { Location } from '~/types/bookingForm';

const bookingStore = useBookingStore();

const TravelDetailsSchema = v.object({
  departureLocation: AddressSchema,
  destinationLocation: AddressSchema,
});

const airports = ref([
  { label: 'Budapest (BUD) - Liszt Ferenc Nemzetközi', value: 'BUD', city: 'Budapest' },
  { label: 'Bécs (VIE) - Schwechati Repülőtér', value: 'VIE', city: 'Bécs' },
  { label: 'Debrecen (DEB) - Nemzetközi Repülőtér', value: 'DEB', city: 'Debrecen' },
  { label: 'Pozsony (BTS) - M. R. Štefánik Repülőtér', value: 'BTS', city: 'Pozsony' },
  { label: 'Kassa (KSC) - Nemzetközi Repülőtér', value: 'KSC', city: 'Kassa' },
  { label: 'Temesvár (TSR) - Traian Vuia Repülőtér', value: 'TSR', city: 'Temesvár' },
  { label: 'Belgrád (BEG) - Nikola Tesla Repülőtér', value: 'BEG', city: 'Belgrád' },
]);

const departureDate = ref<CalendarDate>();
const departureTime = ref<Time>();

const departureDateTime = computed(() => {
  return {
    date: departureDate.value,
    time: departureTime.value,
  };
});

const passengerCount = ref<number>(1);

const isReturn = ref<boolean>(false);
const returnDate = ref<CalendarDate>();
const returnTime = ref<Time>();

const validatedReturnInfo = computed(() => {
  if (isReturn.value) {
    return {
      isReturn: isReturn.value,
      returnDateTime: {
        date: returnDate.value,
        time: returnTime.value,
      },
    };
  } else {
    return {
      isReturn: false,
      returnDateTime: {
        date: undefined,
        time: undefined,
      },
    };
  }
});

const isReturnCalendarOpen = ref<boolean>(false);

function saveFormData() {
  if (bookingStore.form) {
    bookingStore.form.departureLocation = state.departureLocation;
    bookingStore.form.destinationLocation = state.destinationLocation;
    bookingStore.form.departureDateTime = departureDateTime.value;
    bookingStore.form.passengerCount = passengerCount.value;
    bookingStore.form.returnInfo = validatedReturnInfo.value;
  }
}

function initializeInputData() {
  if (bookingStore.form) {
    state.departureLocation = bookingStore.form.departureLocation;
    state.destinationLocation = bookingStore.form.destinationLocation;
    departureDate.value = bookingStore.form?.departureDateTime.date as CalendarDate;
    departureTime.value = bookingStore.form?.departureDateTime.time as Time;
    passengerCount.value = bookingStore.form.passengerCount;
    isReturn.value = bookingStore.form.returnInfo.isReturn;
    if (bookingStore.form.returnInfo.isReturn) {
      returnDate.value = bookingStore.form?.returnInfo.returnDateTime.date as CalendarDate;
      returnTime.value = bookingStore.form?.returnInfo.returnDateTime.time as Time;
    }
  }
}

function changeLocationType(type: 'destination' | 'departure') {
  if (type === 'departure') {
    state.departureLocation.city = '';
    state.departureLocation.street = '';
    state.departureLocation.zipCode = '';
    state.departureLocation.isAirport = !state.departureLocation.isAirport;
    bookingStore.airportInputCount += state.departureLocation.isAirport ? 1 : -1;
  } else {
    state.destinationLocation.city = '';
    state.destinationLocation.street = '';
    state.destinationLocation.zipCode = '';
    state.destinationLocation.isAirport = !state.destinationLocation.isAirport;
    bookingStore.airportInputCount += state.destinationLocation.isAirport ? 1 : -1;
  }
}

const state = reactive<{ departureLocation: Location; destinationLocation: Location }>({
  departureLocation: {
    city: '',
    street: '',
    zipCode: '',
    isAirport: false,
  },
  destinationLocation: {
    city: '',
    street: '',
    zipCode: '',
    isAirport: false,
  },
});

const form = ref();

const submitForm = async () => {
  try {
    window.scrollTo(0, 0);
    await form.value.validate();
    saveFormData();
    bookingStore.nextStep();
  } catch {
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
  <div class="w-full max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-text-primary mb-2">Utazás részletei</h2>
      <p class="text-text-secondary">Adja meg az indulás és érkezés helyét, valamint az utazás időpontját</p>
    </div>

    <UForm ref="form" :schema="TravelDetailsSchema" :state="state" class="flex flex-col gap-6">
      <!-- Departure Location -->
      <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
        <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
          <UIcon name="i-lucide-map-pin-check" class="text-xl" />
          Indulási helyszín
        </legend>

        <!-- Address Input -->
        <div v-if="!state.departureLocation.isAirport" class="space-y-4 mt-4">
          <div class="flex items-center gap-2 text-text-secondary text-sm mb-3">
            <UIcon name="i-lucide-info" class="text-accent-400 shrink-0" />
            <span>Reptéri transzferhez válassza a repülőgép ikont</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormField name="departureLocation.zipCode" class="sm:col-span-1">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-hash" class="text-accent-400" />
                  <span>Irányítószám</span>
                </div>
              </template>
              <UInput v-model="state.departureLocation.zipCode" size="lg" placeholder="1234" class="w-full" />
            </UFormField>

            <UFormField name="departureLocation.city" class="sm:col-span-2">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-map-pin" class="text-accent-400" />
                  <span>Település</span>
                </div>
              </template>
              <UInput v-model="state.departureLocation.city" size="lg" placeholder="Település neve*" class="w-full" />
            </UFormField>
          </div>

          <div class="flex gap-4">
            <UFormField name="departureLocation.street" class="flex-1">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-route" class="text-accent-400" />
                  <span>Utca, házszám</span>
                </div>
              </template>
              <UInput v-model="state.departureLocation.street" size="lg" placeholder="Példa utca 12." class="w-full" />
            </UFormField>
            <UButton @click="changeLocationType('departure')" icon="i-lucide-plane" size="lg" color="primary" variant="soft" class="self-end" title="Váltás repülőtérre" />
          </div>
        </div>

        <!-- Airport Selection -->
        <div v-else class="mt-4">
          <div class="flex gap-4">
            <UFormField class="flex-1" name="departureLocation.city">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-plane" class="text-accent-400" />
                  <span>Repülőtér</span>
                </div>
              </template>
              <USelectMenu v-model="state.departureLocation.city" size="lg" :items="airports" value-key="city" placeholder="Válasszon repülőteret..." class="w-full" />
            </UFormField>
            <UButton @click="changeLocationType('departure')" icon="i-lucide-map-pin-house" size="lg" color="primary" variant="soft" class="self-end" title="Váltás címre" />
          </div>
        </div>
      </fieldset>

      <!-- Destination Location -->
      <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
        <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
          <UIcon name="i-lucide-map-pin" class="text-xl" />
          Érkezési helyszín
        </legend>

        <!-- Address Input -->
        <div v-if="!state.destinationLocation.isAirport" class="space-y-4 mt-4">
          <div class="flex items-center gap-2 text-text-secondary text-sm mb-3">
            <UIcon name="i-lucide-info" class="text-accent-400 shrink-0" />
            <span>Reptéri transzferhez válassza a repülőgép ikont</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <UFormField name="destinationLocation.zipCode" class="sm:col-span-1">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-hash" class="text-accent-400" />
                  <span>Irányítószám</span>
                </div>
              </template>
              <UInput v-model="state.destinationLocation.zipCode" size="lg" placeholder="1234" class="w-full" />
            </UFormField>

            <UFormField name="destinationLocation.city" class="sm:col-span-2">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-map-pin" class="text-accent-400" />
                  <span>Település</span>
                </div>
              </template>
              <UInput v-model="state.destinationLocation.city" size="lg" placeholder="Település neve*" class="w-full" />
            </UFormField>
          </div>

          <div class="flex gap-4">
            <UFormField name="destinationLocation.street" class="flex-1">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-route" class="text-accent-400" />
                  <span>Utca, házszám</span>
                </div>
              </template>
              <UInput v-model="state.destinationLocation.street" size="lg" placeholder="Példa utca 12." class="w-full" />
            </UFormField>
            <UButton @click="changeLocationType('destination')" icon="i-lucide-plane" size="lg" color="primary" variant="soft" class="self-end" title="Váltás repülőtérre" />
          </div>
        </div>

        <!-- Airport Selection -->
        <div v-else class="mt-4">
          <div class="flex gap-4">
            <UFormField class="flex-1" name="destinationLocation.city">
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-plane" class="text-accent-400" />
                  <span>Repülőtér</span>
                </div>
              </template>
              <USelectMenu v-model="state.destinationLocation.city" size="lg" :items="airports" value-key="city" placeholder="Válasszon repülőteret..." class="w-full" />
            </UFormField>
            <UButton @click="changeLocationType('destination')" icon="i-lucide-map-pin-house" size="lg" color="primary" variant="soft" class="self-end" title="Váltás címre" />
          </div>
        </div>
      </fieldset>

      <!-- Travel DateTime and Passenger Info -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Departure DateTime -->
        <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-calendar-clock" class="text-xl" />
            Indulás időpontja
          </legend>
          <div class="space-y-4 mt-4">
            <UFormField>
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-calendar" class="text-accent-400" />
                  <span>Dátum</span>
                </div>
              </template>
              <UPopover>
                <UButton color="neutral" size="lg" variant="soft" class="justify-center w-full">
                  {{ departureDateTime.date ? departureDateTime.date.toString().replaceAll('-', '. ') : 'Válasszon dátumot' }}
                </UButton>
                <template #content>
                  <UCalendar v-model="departureDate" />
                </template>
              </UPopover>
            </UFormField>

            <UFormField>
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-clock" class="text-accent-400" />
                  <span>Időpont</span>
                </div>
              </template>
              <UInputTime v-model="departureTime" size="lg" class="w-fit" />
            </UFormField>
          </div>
        </fieldset>

        <!-- Passenger Count -->
        <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
            <UIcon name="i-lucide-users" class="text-xl" />
            Utasok száma
          </legend>
          <div class="mt-4">
            <UFormField>
              <template #label>
                <div class="flex items-center gap-2 text-text-primary mb-2">
                  <UIcon name="i-lucide-user-round" class="text-accent-400" />
                  <span>Személyek száma</span>
                </div>
              </template>
              <UInputNumber size="lg" v-model="passengerCount" :min="1" class="w-full" />
            </UFormField>
          </div>
        </fieldset>
      </div>

      <!-- Return Trip -->
      <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
        <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2 mb-1">
          <UIcon name="i-lucide-repeat" class="text-xl" />
          Visszaút
        </legend>
        <div class="mt-4">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-arrow-left-right" class="text-accent-400" />
              <span class="text-text-primary">Retúr utazás igénylése</span>
            </div>
            <USwitch v-model="isReturn" size="lg" />
          </div>

          <div v-if="isReturn" class="space-y-4 pt-4 border-t border-main-600">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField>
                <template #label>
                  <div class="flex items-center gap-2 text-text-primary mb-2">
                    <UIcon name="i-lucide-calendar" class="text-accent-400" />
                    <span>Visszaút dátuma</span>
                  </div>
                </template>
                <UPopover v-model:open="isReturnCalendarOpen">
                  <UButton color="neutral" size="lg" variant="soft" class="justify-center w-full">
                    {{ returnDate ? returnDate.toString().replaceAll('-', '. ') : 'Válasszon dátumot' }}
                  </UButton>
                  <template #content>
                    <UCalendar v-model="returnDate" />
                  </template>
                </UPopover>
              </UFormField>

              <UFormField>
                <template #label>
                  <div class="flex items-center gap-2 text-text-primary mb-2">
                    <UIcon name="i-lucide-clock" class="text-accent-400" />
                    <span>Visszaút időpontja</span>
                  </div>
                </template>
                <UInputTime v-model="returnTime" size="lg" class="w-fit" />
              </UFormField>
            </div>
          </div>
        </div>
      </fieldset>
    </UForm>
  </div>
</template>
