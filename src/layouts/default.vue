<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800 transition-colors duration-300">
    <AppHeader />
    
    <main class="flex-1">
      <slot />
    </main>
    
    <AppFooter />
    
    <!-- Toast notifications -->
    <ToastNotification />
  </div>
</template>

<script setup>
// Components are auto-imported in Nuxt 3
</script>