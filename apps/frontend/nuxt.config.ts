import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    'nuxt-gtag',
    '@nuxt/content',
    '@solar-icons/nuxt',
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/main.css'],

  gtag: {
    id: 'GT-WF3BNSGC',
    initCommands: [
      [
        'consent',
        'default',
        {
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          ad_storage: 'denied',
          analytics_storage: 'denied',
          wait_for_update: 500,
        },
      ],
    ],
  },

  solarIcons: {
    namePrefix: 'Solar',
    autoImport: true,
    provider: true,
    color: 'currentColor',
    size: 24,
    weight: 'Linear',
    mirrored: false,
  },

  vite: {
    plugins: [tailwindcss() as any],
  },

  app: {
    head: {
      title: 'Atlas Ride - Prémium reptértranszfer szolgáltatás',
      htmlAttrs: {
        lang: 'hu',
      },
    },
  },
});