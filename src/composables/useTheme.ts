export const useTheme = () => {
  const colorMode = useColorMode()
  
  const isDark = computed(() => colorMode.value === 'dark')
  
  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
  
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    colorMode.preference = theme
  }
  
  return {
    isDark: readonly(isDark),
    currentTheme: readonly(computed(() => colorMode.value)),
    toggleTheme,
    setTheme
  }
}