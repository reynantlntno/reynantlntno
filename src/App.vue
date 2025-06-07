<!-- filepath: /Users/reynantolentino/reynantlntno.dev/src/App.vue -->
<template>
  <div 
    id="app" 
    class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white"
  >
    <router-view />
    
    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'
import ToastContainer from '@/components/ui/ToastContainer.vue'

// Initialize theme system
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
  
  // Clear fallback loading styles
  document.body.style.overflow = ''
  const fallbackContainer = document.querySelector('.fallback-container')
  if (fallbackContainer) {
    fallbackContainer.remove()
  }
})
</script>

<style>
/* Global styles will be imported in main.js */
</style>