import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxt/fonts', 'nuxt-gtag', '@nuxt/content'],
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

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: 'Atlas Ride - Prémium Reptértranszfer Szolgáltatás',
      htmlAttrs: {
        lang: 'hu',
      },
    },
  },
});
