<template>
  <div class="min-h-screen bg-carbon-950 flex items-center justify-center relative">
    <!-- Simple grid background -->
    <div class="absolute inset-0 opacity-3">
      <div class="grid-background"></div>
    </div>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <!-- Simple terminal window -->
      <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden mb-12">
        <!-- Minimal header -->
        <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
            <span class="font-mono text-sm text-carbon-400 ml-3">~/error/404</span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-12">
          <!-- Error code -->
          <div class="mb-8">
            <div class="font-mono text-7xl md:text-8xl font-bold text-syntax-error mb-4">
              404
            </div>
            <div class="text-carbon-400 font-mono text-lg">
              <span class="text-syntax-comment">// Page not found</span>
            </div>
          </div>

          <!-- Message -->
          <div class="space-y-6 mb-10">
            <h1 class="text-2xl md:text-3xl font-semibold text-carbon-100 font-mono">
              <span class="text-syntax-function">pageNotFound</span>
              <span class="text-carbon-300">()</span>
            </h1>
            
            <p class="text-lg text-carbon-300 max-w-xl mx-auto font-mono">
              <span class="text-syntax-comment">
                // The requested resource could not be found
              </span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              to="/"
              variant="accent"
              size="lg"
              class="px-6 py-3 font-mono"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </template>
              return.home()
            </Button>
            
            <Button
              @click="goBack"
              variant="outline"
              size="lg"
              class="px-6 py-3 font-mono border-carbon-600/50 text-carbon-200 hover:border-accent-500/50"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </template>
              history.back()
            </Button>
          </div>
        </div>
      </div>

      <!-- Simple navigation links -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <router-link
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="group bg-carbon-800/30 border border-carbon-700/30 rounded-ide p-4 hover:bg-carbon-700/40 hover:border-carbon-600/50 transition-all duration-200"
        >
          <div class="flex flex-col items-center space-y-2">
            <component :is="link.icon" class="w-6 h-6 text-carbon-400 group-hover:text-accent-400" />
            <span class="text-sm font-mono text-carbon-300 group-hover:text-carbon-100">
              {{ link.label }}
            </span>
          </div>
        </router-link>
      </div>

      <!-- Simple search -->
      <div class="bg-carbon-800/30 border border-carbon-700/30 rounded-ide p-6">
        <div class="max-w-md mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search content..."
              class="w-full px-4 py-3 pl-10 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 font-mono text-sm"
              @keydown.enter="handleSearch"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-carbon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <Button
            @click="handleSearch"
            :disabled="!searchQuery.trim()"
            variant="ghost"
            size="sm"
            class="mt-3 text-carbon-300 hover:text-accent-400 font-mono"
          >
            search()
          </Button>
        </div>
      </div>

      <!-- Simple help text -->
      <div class="mt-8 text-center">
        <p class="text-carbon-400 font-mono text-sm">
          <span class="text-syntax-comment">// If this page should exist, </span>
          <router-link to="/contact" class="text-accent-400 hover:text-accent-300 underline">
            report the issue
          </router-link>
        </p>
      </div>
    </div>

    <!-- SEO Head -->
    <SeoHead
      title="404 - Page Not Found | Reynan Tolentino"
      description="The page you are looking for could not be found. Navigate back to explore my projects and content."
      keywords="404, page not found, error"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import SeoHead from '@/components/common/SeoHead.vue'

const router = useRouter()
const searchQuery = ref('')

// Simple navigation links
const quickLinks = [
  {
    to: '/about',
    label: 'About',
    icon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      `
    }
  },
  {
    to: '/projects',
    label: 'Projects',
    icon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      `
    }
  },
  {
    to: '/blog',
    label: 'Blog',
    icon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      `
    }
  },
  {
    to: '/contact',
    label: 'Contact',
    icon: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      `
    }
  }
]

// Methods
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/blog',
      query: { search: searchQuery.value.trim() }
    })
  }
}
</script>

<style scoped>
/* Simple grid background */
.grid-background {
  background-image: 
    linear-gradient(rgba(0, 122, 204, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 122, 204, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  width: 100%;
  height: 100%;
}

/* Simple focus effect */
input:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>