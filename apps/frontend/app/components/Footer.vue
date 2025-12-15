<script lang="ts" setup>
import type { FooterColumn } from '@nuxt/ui';
import { useCookieConsent } from '~/composables/useCookieConsent';
import { watch, onMounted } from 'vue';

const { getCookieConsentValue, acceptCookies, denyAllCookies } = useCookieConsent();

const columns: FooterColumn[] = [
  {
    label: 'Elérhetőség',
    children: [
      {
        label: 'info@atlasride.hu',
        to: 'mailto:info@atlasride.hu',
        icon: 'i-lucide-mail',
      },
      {
        label: '+36 70 600 5522',
        to: 'tel:+36706005522',
        icon: 'i-lucide-phone',
      },
      {
        label: 'Facebook',
        to: 'https://www.facebook.com/profile.php?id=61571633512337',
        target: '_blank',
        icon: 'i-lucide-facebook',
      },
    ],
  },
  {
    label: 'Adatkezelés és biztonság',
    children: [
      {
        label: 'Adatvédelmi tájékoztató',
        icon: 'i-lucide-shield-half',
        to: '/privacy_policy',
      },
    ],
  },
];

const analyticalCookiesValue = ref<boolean>(false);

function setConsentValue() {
  const consentValue = getCookieConsentValue();
  if (consentValue === 'denied') {
    analyticalCookiesValue.value = false;
  } else if (consentValue === 'granted') {
    analyticalCookiesValue.value = true;
  }
}

onMounted(() => {
  setConsentValue();
});

watch(analyticalCookiesValue, async (newValue) => {
  if (newValue === true) {
    acceptCookies();
  } else if (newValue === false) {
    denyAllCookies();
  }
});
</script>

<template>
  <UFooter class="pt-8 px-6 z-101 relative bg-main-800">
    <template #bottom>
      <div class="w-full flex flex-row justify-between">
        <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }} Atlas Ride</p>
        <p class="text-muted text-sm">v.2.0.7.</p>
      </div>
    </template>
    <template #default>
      <UFooterColumns :columns="columns">
        <template #right>
          <div class="flex flex-col gap-4 md:pl-8 w-fit">
            <span class="text-sm font-bold">Sütik (Cookies)</span>
            <UModal
              :dismissible="false"
              title="Süti (Cookie) beállítások"
              description="Weboldalunk a működéshez elengedhetetlen sütiket használ. A felhasználói élmény javítása érdekében szeretnénk statisztikai (Google Analytics) sütiket is használni, de ehhez a hozzájárulása szükséges."
            >
              <UButton icon="i-lucide-cookie" variant="outline" color="neutral" class="text-muted">Süti beállítások</UButton>

              <template #body>
                <USwitch label="Feltétlenül szükséges sütik" default-value disabled color="neutral" />
                <p class="text-sm text-muted pl-4 p-2">
                  Ezek a sütik elengedhetetlenek a weboldal megfelelő működéséhez és biztonságához. Ezek nem tárolnak személyes azonosításra alkalmas adatokat.
                </p>
                <br />
                <USwitch v-model="analyticalCookiesValue" label="Statisztikai sütik" />
                <p class="text-sm text-muted pl-4 p-2">Ezek a sütik segítenek nekünk megérteni, hogyan használják látogatóink a weboldalt.</p>
              </template>
            </UModal>
          </div>
        </template>
      </UFooterColumns>
    </template>
  </UFooter>
</template>
