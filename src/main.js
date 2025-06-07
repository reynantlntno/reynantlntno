import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import router from './router'

// Import global styles
import './assets/styles/main.css'

// Create Vue app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Create head manager for SEO
const head = createHead()

// Install plugins
app.use(pinia)
app.use(router)
app.use(head)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
}

// Mount app
app.mount('#app')