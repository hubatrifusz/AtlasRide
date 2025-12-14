<script lang="ts" setup>
import type { FooterColumn } from '@nuxt/ui';

const columns: FooterColumn[] = [
  {
    label: 'Elérhetőség',
    children: [
      {
        label: 'Email',
        to: 'mailto:info@atlasride.hu',
        icon: 'i-lucide-mail',
      },
      {
        label: 'Telefon',
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
      },
    ],
  },
];
</script>

<template>
  <UFooter class="pt-8 px-4">
    <template #bottom>
      <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }} Atlas Ride</p>
    </template>
    <template #default>
        <UFooterColumns :columns="columns" />
    </template>
  </UFooter>
</template>
