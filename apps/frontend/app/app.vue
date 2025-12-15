<template>
  <UApp :locale="hu">
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
import { hu } from '@nuxt/ui/locale';
import { useCookieConsent } from '~/composables/useCookieConsent';

const { initCookies } = useCookieConsent();
initCookies();
</script>
