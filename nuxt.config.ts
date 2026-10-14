// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Открой все уровни',
      // viewport-fit=cover — чтобы во webview работали env(safe-area-inset-*)
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      meta: [
        { name: 'theme-color', content: '#F5F3FF' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },

  fonts: {
    families: [
      { name: 'Nunito', provider: 'google', weights: [500, 600, 700, 800], subsets: ['cyrillic', 'latin'] },
    ],
  },
})
