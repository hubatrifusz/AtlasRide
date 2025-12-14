<script lang="ts" setup>
import type { FooterColumn } from '@nuxt/ui';

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
        label: 'Süti beállítások',
        icon: 'i-lucide-cookie',
      },
      {
        label: 'Adatvédelmi tájékoztató',
        icon: 'i-lucide-shield-half',
        to: '/privacy_policy',
      },
    ],
  },
];
</script>

<template>
  <UFooter class="pt-8 px-6">
    <template #bottom>
      <div class="w-full flex flex-row justify-between">
        <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }} Atlas Ride</p>
        <p class="text-muted text-sm">v.2.0.7.</p>
      </div>
    </template>
    <template #default>
      <UFooterColumns :columns="columns" />
    </template>
  </UFooter>
</template>
