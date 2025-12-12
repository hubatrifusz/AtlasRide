<script setup lang="ts">
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { vMaska } from 'maska/vue';
import * as v from 'valibot';
import { TravelInfoSchema } from '~/schemas/booking';
import { ref, watch, shallowRef, watchEffect, onMounted } from 'vue';
import { useBookingForm, formData, rideType } from '~/composables/useBookingForm';

const { isFormValid, nextStep } = useBookingForm();

type TravelInfoData = v.InferOutput<typeof TravelInfoSchema>;

const travelInfoForm = ref<TravelInfoData>({
  departureLocation: '',
  destinationLocation: '',
  departureDate: '',
  departureTime: '',
  passengers: '',
  comment: '',
  return: false,
  returnDate: '',
  returnTime: '',
  flightNumber: '',
  takeoffTime: '',
});

onMounted(() => {
  travelInfoForm.value.departureLocation = formData.value.departureLocation;
  travelInfoForm.value.destinationLocation = formData.value.destinationLocation;
  travelInfoForm.value.departureDate = formData.value.departureDate;
  travelInfoForm.value.departureTime = formData.value.departureTime;
  travelInfoForm.value.passengers = formData.value.passengers;
  travelInfoForm.value.comment = formData.value.comment;
  travelInfoForm.value.return = formData.value.return;
  if (formData.value.returnDate) {
    travelInfoForm.value.returnDate = formData.value.returnDate.toString();
  } else {
    travelInfoForm.value.returnDate = '';
  }
  travelInfoForm.value.returnTime = formData.value.returnTime;
  travelInfoForm.value.flightNumber = formData.value.flightNumber;
  travelInfoForm.value.takeoffTime = formData.value.takeoffTime;
});

const minDate: CalendarDate = today(getLocalTimeZone());
const departureDateCD = shallowRef<CalendarDate>(today(getLocalTimeZone()));
const returnDateDC = shallowRef<CalendarDate>(today(getLocalTimeZone()));

watch(departureDateCD, (newVal) => {
  if (newVal instanceof CalendarDate) {
    travelInfoForm.value.departureDate = newVal.toString();
  }
});

watch(returnDateDC, (newVal) => {
  if (newVal instanceof CalendarDate) {
    travelInfoForm.value.returnDate = newVal.toString();
  }
});

watchEffect(() => {
  const result = v.safeParse(TravelInfoSchema, travelInfoForm.value);
  isFormValid.value = result.success;
});

function saveForm() {
  formData.value.departureLocation = travelInfoForm.value.departureLocation;
  formData.value.destinationLocation = travelInfoForm.value.destinationLocation;
  formData.value.departureDate = travelInfoForm.value.departureDate;
  formData.value.departureTime = travelInfoForm.value.departureTime;
  formData.value.passengers = travelInfoForm.value.passengers;
  formData.value.comment = travelInfoForm.value.comment;
  formData.value.return = travelInfoForm.value.return;
  formData.value.returnDate = travelInfoForm.value.returnDate;
  formData.value.returnTime = travelInfoForm.value.returnTime;
  formData.value.flightNumber = travelInfoForm.value.flightNumber;
  formData.value.takeoffTime = travelInfoForm.value.takeoffTime;

  nextStep();
}

function beforeEnter(el: Element) {
  (el as HTMLElement).style.height = '0';
  (el as HTMLElement).style.opacity = '0';
}

function enter(el: Element) {
  (el as HTMLElement).style.transition = 'height 0.3s ease, opacity 0.3s ease';
  (el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px';
  (el as HTMLElement).style.opacity = '1';
}

function beforeLeave(el: Element) {
  (el as HTMLElement).style.height = (el as HTMLElement).scrollHeight + 'px';
  (el as HTMLElement).style.opacity = '1';
}

function leave(el: Element) {
  (el as HTMLElement).style.transition = 'height 0.2s ease, opacity 0.2s ease';
  (el as HTMLElement).style.height = '0';
  (el as HTMLElement).style.opacity = '0';
}
</script>

<template>
  <UForm :schema="TravelInfoSchema" :state="travelInfoForm" class="flex flex-col gap-4 w-full justify-center items-center px-4">
    <UFormField class="md:w-1/2 w-full" name="departureLocation">
      <UInput v-model="travelInfoForm.departureLocation" trailing-icon="i-lucide-map-pin-house" label="Indulási hely" placeholder="Indulás hely" size="xl" class="w-full" />
    </UFormField>

    <UFormField class="md:w-1/2 w-full" name="destinationLocation">
      <UInput v-model="travelInfoForm.destinationLocation" trailing-icon="i-lucide-map-pinned" label="Úti cél" placeholder="Úti cél" size="xl" class="w-full" />
    </UFormField>

    <UPopover
      :content="{
        align: 'center',
        side: 'bottom',
        sideOffset: 2,
      }"
    >
      <UButton size="xl" icon="i-lucide-calendar" class="text-text-primary md:w-1/2 w-full" color="secondary">{{
        travelInfoForm.departureDate ? travelInfoForm.departureDate : 'Válassza ki az indulás napját'
      }}</UButton>
      <template #content>
        <UCalendar v-model="departureDateCD" :year-controls="false" size="lg" :min-value="minDate" locale="hu" />
      </template>
    </UPopover>

    <UFormField class="md:w-1/2 w-full" name="departureTime">
      <UInput v-maska="'##:##'" v-model="travelInfoForm.departureTime" trailing-icon="i-lucide-timer" label="Inulás ideje" placeholder="Indulás ideje" size="xl" class="w-full" />
    </UFormField>

    <UFormField class="md:w-1/2 w-full" name="passengers">
      <UInput v-model="travelInfoForm.passengers" v-maska="'###'" trailing-icon="i-lucide-users" label="Utasok száma" placeholder="Utasok száma" size="xl" class="w-full" />
    </UFormField>

    <!-- Repteri esetén -->
    <div v-if="rideType == 'reptéri'" class="w-full flex flex-col items-center gap-2">
      <USeparator class="md:w-1/2 w-full my-8" />

      <UFormField class="md:w-1/2 w-full" name="flightNumber">
        <UInput v-model="travelInfoForm.flightNumber" trailing-icon="i-lucide-hash" label="Repülőgép járatszáma" placeholder="Repülőgép járatszáma" size="xl" class="w-full" />
      </UFormField>

      <UFormField class="md:w-1/2 w-full" name="takeoffTime">
        <UInput
          v-maska="'##:##'"
          v-model="travelInfoForm.takeoffTime"
          trailing-icon="i-lucide-plane-takeoff"
          label="Repülőgép száma"
          placeholder="Repülőgép felszállásának ideje"
          size="xl"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField class="md:w-1/2 w-full" name="return">
      <USwitch v-model="travelInfoForm.return" label="Retúr" size="xl" />
    </UFormField>

    <!-- Retúr esetén -->
    <Transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
      <div v-if="travelInfoForm.return" class="w-full flex flex-col items-center gap-4">
        <UPopover
          :content="{
            align: 'center',
            side: 'bottom',
            sideOffset: 2,
          }"
        >
          <UButton size="xl" icon="i-lucide-calendar" class="text-text-primary md:w-1/2 w-full" color="secondary">
            {{ travelInfoForm.returnDate ? travelInfoForm.returnDate : 'Válassza ki a visszaút dátumát' }}
          </UButton>
          <template #content>
            <UCalendar v-model="returnDateDC" :year-controls="false" size="lg" :min-value="minDate" locale="hu" />
          </template>
        </UPopover>

        <UInput
          v-maska="'##:##'"
          v-model="travelInfoForm.returnTime"
          trailing-icon="i-lucide-timer"
          label="Visszaút indulási ideje"
          placeholder="Visszaút indulási ideje"
          size="xl"
          class="md:w-1/2 w-full"
        />
      </div>
    </Transition>

    <div class="md:w-1/2 w-full">
      <UTextarea v-model="travelInfoForm.comment" size="xl" placeholder="Megjegyzés" class="w-full" />
    </div>
  </UForm>

  <BookingActionButtons @save-form="saveForm" />
</template>
