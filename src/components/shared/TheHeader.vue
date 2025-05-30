<template>
  <header class="sticky top-0 z-30 glass">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo & Site Title -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <span class="text-xl font-bold text-primary dark:text-primary-light">reynantlntno</span>
            <span class="text-lg text-dark-muted dark:text-light-muted">.dev</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link 
            v-for="item in navigation" 
            :key="item.name"
            :to="item.href"
            class="text-dark-muted hover:text-primary dark:text-light-muted dark:hover:text-primary-light px-2 py-1 rounded-md text-sm font-medium"
            :class="{ 'text-primary dark:text-primary-light': activeRoute === item.href }"
          >
            {{ item.name }}
          </router-link>
          <ThemeToggle />
        </nav>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <ThemeToggle class="mr-4" />
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-md text-dark-muted dark:text-light-muted hover:bg-light-muted dark:hover:bg-dark-muted"
            aria-label="Toggle mobile menu"
          >
            <svg 
              v-if="!mobileMenuOpen"
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              class="h-6 w-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              v-else 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              class="h-6 w-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden glass-card absolute top-full left-0 right-0 pb-3 px-2 space-y-1 sm:px-3"
    >
      <router-link 
        v-for="item in navigation" 
        :key="item.name"
        :to="item.href"
        class="block px-3 py-2 rounded-md text-base font-medium text-dark-muted hover:text-primary dark:text-light-muted dark:hover:text-primary-light"
        :class="{ 'text-primary dark:text-primary-light': activeRoute === item.href }"
        @click="mobileMenuOpen = false"
      >
        {{ item.name }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ThemeToggle from './ThemeToggle.vue';

const route = useRoute();
const mobileMenuOpen = ref(false);

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Appointment', href: '/appointment' },
  { name: 'Contact', href: '/contact' },
];

const activeRoute = computed(() => {
  return route.path;
});
</script>