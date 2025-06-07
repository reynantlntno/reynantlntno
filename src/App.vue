<!-- filepath: /Users/reynantolentino/reynantlntno.dev/src/App.vue -->
<template>
  <div 
    id="app" 
    :class="[
      'min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white',
      { 'no-hover': !canHover }
    ]"
  >
    <router-view />
    
    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useTheme } from '@/composables/useTheme'
import ToastContainer from '@/components/ui/ToastContainer.vue'

// Initialize theme system
const { initTheme } = useTheme()

// Hover capability detection
const canHover = ref(true)

const detectHoverCapability = () => {
  // Check if device has hover capability using media query
  const hasHover = window.matchMedia('(hover: hover)').matches
  
  // Additional check for touch devices
  const isTouchDevice = 'ontouchstart' in window || 
                       navigator.maxTouchPoints > 0 || 
                       navigator.msMaxTouchPoints > 0
  
  // Check user agent for mobile devices (backup method)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // Device has hover capability if:
  // 1. Media query reports hover support AND
  // 2. It's not a touch device AND
  // 3. It's not detected as mobile
  canHover.value = hasHover && !isTouchDevice && !isMobile
}

onMounted(() => {
  initTheme()
  detectHoverCapability()
  
  // Listen for media query changes (useful for devices that can switch between modes)
  const hoverMediaQuery = window.matchMedia('(hover: hover)')
  hoverMediaQuery.addEventListener('change', detectHoverCapability)
})
</script>

<style>
/* Global styles will be imported in main.js */

/* Disable hover effects when no-hover class is present */
.no-hover *:hover {
  /* Reset hover styles by using initial values or base styles */
  transform: none !important;
  box-shadow: none !important;
  background-color: initial !important;
  color: initial !important;
  border-color: initial !important;
  opacity: initial !important;
}

/* More specific hover disabling for common interactive elements */
.no-hover button:hover,
.no-hover a:hover,
.no-hover .hover\:bg-accent-500:hover,
.no-hover .hover\:text-accent-400:hover,
.no-hover .hover\:scale-105:hover,
.no-hover .hover\:shadow-lg:hover {
  background-color: revert !important;
  color: revert !important;
  transform: none !important;
  box-shadow: revert !important;
}

/* Alternative approach using CSS custom properties */
:root {
  --hover-enabled: 1;
}

.no-hover {
  --hover-enabled: 0;
}

/* Use in components like this: */
.hover-effect {
  transition: transform 0.2s ease;
  transform: scale(calc(1 + 0.05 * var(--hover-enabled, 0)));
}

.hover-effect:hover {
  transform: scale(calc(1 + 0.05 * var(--hover-enabled, 0)));
}
</style>