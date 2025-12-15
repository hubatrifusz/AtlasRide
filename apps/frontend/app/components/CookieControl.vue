<script lang="ts" setup>
import { onMounted } from 'vue';

import { useCookieConsent } from '~/composables/useCookieConsent';

const { acceptCookies, denyAllCookies, getCookieConsentValue } = useCookieConsent();

const isVisible = ref(true);

onMounted(() => {
  const cookieConsent = getCookieConsentValue();

  if (cookieConsent === 'undefined') {
    setTimeout(() => {
      animateCookieControl();
    }, 500);
  }
});

function acceptCookiesClick() {
  acceptCookies();
  animateCookieControl();
}

function denyCookiesClick() {
  denyAllCookies();
  animateCookieControl();
}

function animateCookieControl() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div class="fixed bottom-0 z-100 w-full px-2 transition-transform duration-1000 ease-in-out" :class="{ 'is-hidden': !isVisible }">
    <div class="bg-accent-300 w-full rounded-t-lg flex md:flex-row flex-col gap-6 md:items-end items-center justify-between p-6">
      <div class="flex flex-row gap-4">
        <div class="bg-accent-400 h-fit flex justify-center items-center p-2 rounded-full">
          <UIcon name="i-lucide-cookie" class="size-8 text-text-inverse-secondary" />
        </div>
        <div>
          <p class="text-text-inverse text-xl font-semibold">Biztonság és Sütik</p>
          <p class="text-text-inverse-secondary">
            Az oldal funkcióinak optimalizálása érdekében használunk sütiket. <br />
            <span class="md:block hidden">Kérjük, erősítse meg, hogy hozzájárul a használatukhoz. Döntését bármikor megváltoztathatja.</span>
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-6 h-full">
        <UButton size="xl" variant="soft" @click="denyCookiesClick()" class="text-text-inverse"> Elutasítom </UButton>
        <UButton size="xl" variant="solid" @click="acceptCookiesClick()"> Elfogadom </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.is-hidden {
  transform: translateY(100%);
}
</style>
