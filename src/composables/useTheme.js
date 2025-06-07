import { ref, watch, onMounted } from 'vue'

const THEME_STORAGE_KEY = 'portfolio-theme'
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// Global theme state
const currentTheme = ref(THEMES.SYSTEM)
const isDark = ref(false)

// Get system theme preference
const getSystemTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
}

// Update DOM classes
const updateThemeClasses = (theme) => {
  const root = document.documentElement
  const body = document.body
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark')
  body.classList.remove('light', 'dark')
  
  // Determine actual theme to apply
  let actualTheme = theme
  if (theme === THEMES.SYSTEM) {
    actualTheme = getSystemTheme()
  }
  
  // Apply theme classes
  root.classList.add(actualTheme)
  body.classList.add(actualTheme)
  
  // Update color-scheme CSS property
  root.style.colorScheme = actualTheme
  
  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', actualTheme === THEMES.DARK ? '#0f172a' : '#1e40af')
  }
  
  isDark.value = actualTheme === THEMES.DARK
}

// Save theme to localStorage
const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (error) {
    console.warn('Failed to save theme preference:', error)
  }
}

// Load theme from localStorage
const loadTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return Object.values(THEMES).includes(saved) ? saved : THEMES.SYSTEM
  } catch (error) {
    console.warn('Failed to load theme preference:', error)
    return THEMES.SYSTEM
  }
}

export const useTheme = () => {
  // Set theme
  const setTheme = (theme) => {
    if (!Object.values(THEMES).includes(theme)) {
      console.warn('Invalid theme:', theme)
      return
    }
    
    currentTheme.value = theme
    updateThemeClasses(theme)
    saveTheme(theme)
  }

  // Toggle between light and dark (ignoring system)
  const toggleTheme = () => {
    const newTheme = currentTheme.value === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    setTheme(newTheme)
  }

  // Cycle through all themes
  const cycleTheme = () => {
    const themes = Object.values(THEMES)
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // Initialize theme system
  const initTheme = () => {
    const savedTheme = loadTheme()
    setTheme(savedTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (currentTheme.value === THEMES.SYSTEM) {
        updateThemeClasses(THEMES.SYSTEM)
      }
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange)
    }

    // Cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      } else {
        mediaQuery.removeListener(handleSystemThemeChange)
      }
    }
  }

  // Get theme display name
  const getThemeDisplayName = (theme = currentTheme.value) => {
    const names = {
      [THEMES.LIGHT]: 'Light',
      [THEMES.DARK]: 'Dark',
      [THEMES.SYSTEM]: 'System'
    }
    return names[theme] || 'System'
  }

  // Get theme icon
  const getThemeIcon = (theme = currentTheme.value) => {
    const icons = {
      [THEMES.LIGHT]: '☀️',
      [THEMES.DARK]: '🌙',
      [THEMES.SYSTEM]: '💻'
    }
    return icons[theme] || '💻'
  }

  // Auto-initialize on mount
  onMounted(() => {
    initTheme()
  })

  return {
    // State
    currentTheme: readonly(currentTheme),
    isDark: readonly(isDark),
    
    // Constants
    THEMES,
    
    // Methods
    setTheme,
    toggleTheme,
    cycleTheme,
    initTheme,
    getThemeDisplayName,
    getThemeIcon,
    
    // Computed
    isLight: computed(() => !isDark.value),
    isSystem: computed(() => currentTheme.value === THEMES.SYSTEM),
    actualTheme: computed(() => {
      if (currentTheme.value === THEMES.SYSTEM) {
        return getSystemTheme()
      }
      return currentTheme.value
    })
  }
}

// Initialize theme immediately for SSR/hydration
if (typeof window !== 'undefined') {
  const savedTheme = loadTheme()
  updateThemeClasses(savedTheme)
}