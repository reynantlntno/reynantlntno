<!-- filepath: /Users/reynantolentino/reynantlntno.dev/src/components/common/Navbar.vue -->
<template>
  <nav class="sticky top-0 z-50 bg-carbon-900/95 dark:bg-carbon-950/95 backdrop-blur-md border-b border-carbon-700/50 dark:border-carbon-800/50 shadow-ide">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-14">
        <!-- Terminal-style Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link 
            to="/" 
            class="flex items-center space-x-2 group"
          >
            <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
            <div class="ml-3 font-mono text-sm font-medium">
              <span class="text-carbon-100 group-hover:text-accent-400 transition-colors">
                ~/reynantlntno
              </span>
              <span class="text-accent-500">.dev</span>
              <span class="text-syntax-success animate-pulse">▊</span>
            </div>
          </router-link>
        </div>
        
        <!-- Terminal Tabs (Desktop Navigation) -->
        <div class="hidden md:flex items-center">
          <div class="flex bg-carbon-800/50 dark:bg-carbon-900/50 rounded-ide p-1 space-x-1">
            <router-link
              v-for="(item, index) in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                'relative px-3 py-1.5 text-xs font-mono font-medium rounded-sm transition-all duration-200',
                'flex items-center space-x-2',
                isActiveRoute(item) 
                  ? 'bg-carbon-700 dark:bg-carbon-800 text-accent-400 shadow-inner-ide' 
                  : 'text-carbon-300 hover:text-carbon-100 hover:bg-carbon-700/50'
              ]"
            >
              <span class="w-2 h-2 rounded-full" :class="getTabIndicator(item)"></span>
              <span>{{ item.label.toLowerCase() }}</span>
              <button 
                v-if="isActiveRoute(item)"
                class="w-3 h-3 rounded-full hover:bg-carbon-600 flex items-center justify-center text-carbon-400 hover:text-carbon-200"
                @click.prevent.stop
              >
                <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </router-link>
          </div>
        </div>
        
        <!-- Terminal Controls -->
        <div class="flex items-center space-x-2">
          <ThemeToggle />
          
          <!-- Terminal Menu Button (Mobile) -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-ide bg-carbon-800/50 hover:bg-carbon-700/50 text-carbon-300 hover:text-carbon-100 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/50"
          >
            <span class="sr-only">Toggle terminal menu</span>
            <svg
              :class="mobileMenuOpen ? 'hidden' : 'block'"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              :class="mobileMenuOpen ? 'block' : 'hidden'"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Terminal Dropdown (Mobile) -->
    <div 
      :class="mobileMenuOpen ? 'block' : 'hidden'" 
      class="md:hidden border-t border-carbon-700/50 dark:border-carbon-800/50"
    >
      <div class="bg-carbon-800/95 dark:bg-carbon-900/95 backdrop-blur-md">
        <div class="px-4 py-3 space-y-2">
          <div class="text-xs font-mono text-carbon-400 mb-3">// Navigation Menu</div>
          <router-link
            v-for="(item, index) in navigationItems"
            :key="item.name"
            :to="item.to"
            @click="mobileMenuOpen = false"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-ide text-sm font-mono transition-colors',
              isActiveRoute(item)
                ? 'bg-accent-500/10 text-accent-400 border-l-2 border-accent-500'
                : 'text-carbon-300 hover:text-carbon-100 hover:bg-carbon-700/50'
            ]"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="getTabIndicator(item)"></span>
            <span>{{ item.label.toLowerCase() }}</span>
            <span v-if="isActiveRoute(item)" class="text-accent-500 text-xs">●</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'home', label: 'Home', to: '/', icon: 'home' },
  { name: 'about', label: 'About', to: '/about', icon: 'user' },
  { name: 'projects', label: 'Projects', to: '/projects', activePath: '/projects', icon: 'folder' },
  { name: 'blog', label: 'Blog', to: '/blog', activePath: '/blog', icon: 'document' },
  { name: 'appointments', label: 'Schedule', to: '/appointments', activePath: '/appointments', icon: 'calendar' },
  { name: 'contact', label: 'Contact', to: '/contact', icon: 'mail' }
]

const isActiveRoute = (item) => {
  return route.name === item.name || route.path.startsWith(item.activePath || item.to)
}

const getTabIndicator = (item) => {
  if (isActiveRoute(item)) return 'bg-accent-500'
  return 'bg-carbon-600'
}
</script>