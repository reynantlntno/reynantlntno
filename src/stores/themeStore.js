import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref(false);

  // Initialize theme based on user preference or system preference
  const initTheme = () => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      darkMode.value = true;
    } else if (savedTheme === 'light') {
      darkMode.value = false;
    } else {
      // Use system preference as fallback
      darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    applyTheme();
  };

  const toggleTheme = () => {
    darkMode.value = !darkMode.value;
    applyTheme();
  };

  const applyTheme = () => {
    // Save preference to localStorage
    localStorage.setItem('theme', darkMode.value ? 'dark' : 'light');
    
    // Apply appropriate class to root HTML element
    if (darkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    darkMode,
    initTheme,
    toggleTheme
  };
});