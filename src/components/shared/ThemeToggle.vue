
<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-md text-dark-muted dark:text-light-muted hover:bg-light-muted dark:hover:bg-dark-muted transition-colors"
    :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Sun icon for dark mode (show when dark mode is active) -->
    <svg
      v-if="isDarkMode"
      class="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    <!-- Moon icon for light mode (show when light mode is active) -->
    <svg
      v-else
      class="w-5 h-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore();
const isDarkMode = computed(() => themeStore.darkMode);

const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>