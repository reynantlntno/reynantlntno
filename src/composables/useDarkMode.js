import { ref, watch } from 'vue';

export function useDarkMode() {
  const isDark = ref(false);

  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('darkMode', isDark.value ? 'dark' : 'light');
    updateDocumentClass();
  };

  const updateDocumentClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const initializeDarkMode = () => {
    // Check for saved preference
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark.value = prefersDark;
    }
    
    updateDocumentClass();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('darkMode')) {
        isDark.value = e.matches;
        updateDocumentClass();
      }
    });
  };

  watch(isDark, updateDocumentClass);

  return {
    isDark,
    toggleDarkMode,
    initializeDarkMode
  };
}