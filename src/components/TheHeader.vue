<template>
  <header class="sticky top-0 z-50 glass-panel px-4 py-3 mx-auto mb-8 backdrop-blur-md">
    <nav class="container mx-auto flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-bold gradient-text">
        reynantlntno<span class="text-dark dark:text-light">.dev</span>
      </router-link>
      
      <!-- Mobile menu button -->
      <button 
        @click="isMenuOpen = !isMenuOpen" 
        class="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <router-link v-for="item in navItems" :key="item.path" 
          :to="item.path"
          class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors py-1 px-2"
          :class="{ 'text-primary font-medium': $route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
        
        <!-- Dark mode toggle -->
        <button @click="toggleDarkMode" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-show="isMenuOpen" class="md:hidden absolute top-full left-0 right-0 glass-panel py-3 px-4 shadow-lg border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-col space-y-3">
          <router-link v-for="item in navItems" :key="item.path" 
            :to="item.path"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary py-2 transition-colors"
            :class="{ 'text-primary font-medium': $route.path === item.path }"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
          
          <!-- Dark mode toggle for mobile -->
          <button @click="toggleDarkMode" class="flex items-center justify-between py-2 text-gray-700 dark:text-gray-300">
            <span>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
            <span class="inline-block">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useDarkMode } from '@composables/useDarkMode';

const { isDark, toggleDarkMode } = useDarkMode();
const isMenuOpen = ref(false);

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Appointments', path: '/appointments' },
  { name: 'Contact', path: '/contact' },
];
</script>