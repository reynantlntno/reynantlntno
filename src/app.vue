<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
// Global app configuration
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    }
  ]
})

// Initialize global error handling
const handleGlobalError = (error, instance, info) => {
  console.error('Global error caught:', error, info)
  
  // You could send to error tracking service here
  // Example: $sentry.captureException(error)
}

// Register global error handler
if (process.client) {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
}
</script>