<script lang="ts" setup>
const bookingStore = useBookingStore();

const formatDate = (date: any) => {
  if (!date) return '';
  return date.toString().replaceAll('-', '. ');
};

const formatTime = (time: any) => {
  if (!time) return '';
  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');
  return `${hour}:${minute}`;
};

const hasCompanyLocation = computed(() => {
  const loc = bookingStore.form?.customer.companyLocation;
  return loc && (loc.city || loc.street || loc.zipCode);
});

const hasFlightInfo = computed(() => {
  const flightInfo = bookingStore.form?.flightInfo;
  return flightInfo && flightInfo.outboundFlightNumber;
});
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold text-text-primary mb-2">Foglalás áttekintése</h2>
      <p class="text-text-secondary">Kérjük, ellenőrizze a megadott adatokat a foglalás véglegesítése előtt</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Travel Details Section -->
      <div class="space-y-6">
        <!-- Departure -->
        <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2">
            <UIcon name="i-lucide-plane-takeoff" class="text-xl" />
            Indulás
          </legend>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-map-pin" class="text-accent-400 mt-1 shrink-0" />
              <div>
                <p class="text-text-primary font-medium">
                  {{ bookingStore.form?.departureLocation.city }}
                  <span v-if="bookingStore.form?.departureLocation.zipCode" class="text-text-secondary text-sm"> ({{ bookingStore.form?.departureLocation.zipCode }}) </span>
                </p>
                <p v-if="bookingStore.form?.departureLocation.street" class="text-text-secondary text-sm">
                  {{ bookingStore.form?.departureLocation.street }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-calendar-clock" class="text-accent-400 shrink-0" />
              <p class="text-text-primary">
                {{ formatDate(bookingStore.form?.departureDateTime.date) }}
                <span class="text-accent-400 font-semibold ml-2">{{ formatTime(bookingStore.form?.departureDateTime.time) }}</span>
              </p>
            </div>
          </div>
        </fieldset>

        <!-- Destination -->
        <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2">
            <UIcon name="i-lucide-plane-landing" class="text-xl" />
            Érkezés
          </legend>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-map-pin" class="text-accent-400 mt-1 shrink-0" />
            <div>
              <p class="text-text-primary font-medium">
                {{ bookingStore.form?.destinationLocation.city }}
                <span v-if="bookingStore.form?.destinationLocation.zipCode" class="text-text-secondary text-sm"> ({{ bookingStore.form?.destinationLocation.zipCode }}) </span>
              </p>
              <p v-if="bookingStore.form?.destinationLocation.street" class="text-text-secondary text-sm">
                {{ bookingStore.form?.destinationLocation.street }}
              </p>
            </div>
          </div>
        </fieldset>

        <!-- Return Info -->
        <fieldset
          v-if="bookingStore.form?.returnInfo.isReturn"
          class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300"
        >
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2">
            <UIcon name="i-lucide-repeat" class="text-xl" />
            Visszaút
          </legend>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-calendar-clock" class="text-accent-400 shrink-0" />
            <p class="text-text-primary">
              {{ formatDate(bookingStore.form?.returnInfo.returnDateTime?.date) }}
              <span class="text-accent-400 font-semibold ml-2">{{ formatTime(bookingStore.form?.returnInfo.returnDateTime?.time) }}</span>
            </p>
          </div>
        </fieldset>
        <div v-else class="border-2 border-main-700 bg-main-800/30 rounded-xl p-6">
          <div class="flex items-center gap-3 text-text-secondary">
            <UIcon name="i-lucide-circle-x" class="shrink-0" />
            <p>Csak egyirányú utazás</p>
          </div>
        </div>

        <!-- Passenger Count -->
        <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2">
            <UIcon name="i-lucide-users" class="text-xl" />
            Utasok száma
          </legend>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-user-round" class="text-accent-400 shrink-0" />
            <p class="text-text-primary font-medium text-xl">{{ bookingStore.form?.passengerCount }} fő</p>
          </div>
        </fieldset>

        <!-- Flight Information -->
        <fieldset v-if="hasFlightInfo" class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2">
            <UIcon name="i-lucide-plane" class="text-xl" />
            Járat információk
          </legend>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-ticket" class="text-accent-400 shrink-0" />
              <div>
                <p class="text-text-secondary text-sm">{{ bookingStore.form?.departureLocation.isAirport ? 'Induló járat' : 'Érkezési járat' }}</p>
                <p class="text-text-primary font-medium text-lg">{{ bookingStore.form?.flightInfo?.outboundFlightNumber }}</p>
              </div>
            </div>
            <div v-if="bookingStore.form?.returnInfo.isReturn && bookingStore.form?.flightInfo?.returnFlightNumber" class="flex items-center gap-3 pt-2 border-t border-main-600">
              <UIcon name="i-lucide-ticket" class="text-accent-400 shrink-0" />
              <div>
                <p class="text-text-secondary text-sm">{{ bookingStore.form?.departureLocation.isAirport ? 'Visszaút járat' : 'Visszaút érkezési járat' }}</p>
                <p class="text-text-primary font-medium text-lg">{{ bookingStore.form?.flightInfo?.returnFlightNumber }}</p>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <!-- Contact Details Section -->
      <div class="space-y-6">
        <!-- Customer Information -->
        <fieldset class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2">
            <UIcon name="i-lucide-contact" class="text-xl" />
            Kapcsolattartó
          </legend>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-user" class="text-accent-400 shrink-0" />
              <p class="text-text-primary font-medium">{{ bookingStore.form?.customer.fullName }}</p>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-mail" class="text-accent-400 shrink-0" />
              <p class="text-text-primary">{{ bookingStore.form?.customer.email }}</p>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-phone" class="text-accent-400 shrink-0" />
              <p class="text-text-primary">{{ bookingStore.form?.customer.phone }}</p>
            </div>
          </div>
        </fieldset>

        <!-- Company Location -->
        <fieldset v-if="hasCompanyLocation" class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2">
            <UIcon name="i-lucide-building-2" class="text-xl" />
            Telephely címe
          </legend>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-map-pin" class="text-accent-400 mt-1 shrink-0" />
            <div>
              <p class="text-text-primary font-medium">
                {{ bookingStore.form?.customer.companyLocation?.city }}
                <span v-if="bookingStore.form?.customer.companyLocation?.zipCode" class="text-text-secondary text-sm">
                  ({{ bookingStore.form?.customer.companyLocation?.zipCode }})
                </span>
              </p>
              <p v-if="bookingStore.form?.customer.companyLocation?.street" class="text-text-secondary text-sm">
                {{ bookingStore.form?.customer.companyLocation?.street }}
              </p>
            </div>
          </div>
        </fieldset>

        <!-- Comments -->
        <fieldset v-if="bookingStore.form?.comment" class="border-2 border-main-600 bg-main-800/50 rounded-xl p-6 hover:border-accent-500 transition-colors duration-300">
          <legend class="font-semibold text-lg text-accent-500 px-3 flex items-center gap-2">
            <UIcon name="i-lucide-message-square" class="text-xl" />
            Megjegyzés
          </legend>
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-file-text" class="text-accent-400 mt-1 shrink-0" />
            <p class="text-text-primary whitespace-pre-wrap">{{ bookingStore.form?.comment }}</p>
          </div>
        </fieldset>
      </div>
    </div>

    <!-- Summary Banner -->
    <div class="mt-8 bg-linear-to-r from-accent-700 to-accent-600 rounded-xl p-6 shadow-lg">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-circle-check" class="text-3xl text-white" />
          <div>
            <p class="text-white font-semibold text-lg">Minden adat rendben?</p>
            <p class="text-accent-100 text-sm">Ellenőrizze a fenti információkat, majd kattintson a "Megerősítés" gombra</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
