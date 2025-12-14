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
    initMode: 'manual',
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
