export default defineNuxtConfig({
  srcDir: 'src/',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  
  // Add this components configuration
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    }
  ],
  
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  nitro: {
    preset: 'netlify'
  },
  routeRules: {
    '/': { isr: 3600 }, // ISR for 1 hour
    '/blog/**': { isr: 1800 }, // ISR for 30 minutes
    '/projects/**': { isr: 3600 }, // ISR for 1 hour
    '/about': { isr: 7200 }, // ISR for 2 hours
    '/api/**': { cors: true }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production' 
        ? 'https://reynantlntno.netlify.app/.netlify/functions'
        : 'http://localhost:8888/.netlify/functions'
    }
  },
  app: {
    head: {
      title: 'Reynan Tolentino - Software Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Software developer portfolio showcasing projects, blog posts, and professional experience.' },
        { name: 'author', content: 'Reynan Tolentino' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Reynan Tolentino Portfolio' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' }
      ]
    }
  }
})