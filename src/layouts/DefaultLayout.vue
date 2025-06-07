<!-- filepath: /Users/reynantolentino/reynantlntno.dev/src/layouts/DefaultLayout.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- SEO Head Component -->
    <SeoHead />
    
    <!-- Navigation -->
    <Navbar />
    
    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
    
    <!-- Footer -->
    <Footer />
    
    <!-- Loading Overlay -->
    <Loader 
      v-if="globalLoading" 
      overlay 
      text="Loading..." 
      color="blue" 
      size="lg" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import SeoHead from '@/components/common/SeoHead.vue'
import Loader from '@/components/ui/Loader.vue'

// Global loading state
const globalLoading = ref(false)
const router = useRouter()

// Show loading during route transitions
router.beforeEach(() => {
  globalLoading.value = true
})

router.afterEach(() => {
  globalLoading.value = false
})
</script>