<!-- filepath: /Users/reynantolentino/reynantlntno.dev/src/components/ui/ThemeToggle.vue -->
<template>
  <div class="relative">
    <button
      @click="cycleTheme"
      :title="`Current theme: ${getThemeDisplayName()}`"
      class="group relative flex items-center space-x-2 px-3 py-1.5 rounded-ide bg-carbon-800/50 hover:bg-carbon-700/50 dark:bg-carbon-900/50 dark:hover:bg-carbon-800/50 border border-carbon-700/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50"
    >
      <!-- Theme Icon -->
      <div class="relative w-4 h-4 flex items-center justify-center">
        <div 
          class="absolute inset-0 rounded-full transition-all duration-300"
          :class="getCurrentThemeStyle().bg"
        ></div>
        <span 
          class="relative text-xs font-mono transition-colors duration-300"
          :class="getCurrentThemeStyle().text"
        >
          {{ getThemeIcon() }}
        </span>
      </div>
      
      <!-- Theme Label -->
      <span class="text-xs font-mono text-carbon-300 group-hover:text-carbon-100 transition-colors">
        {{ getThemeDisplayName().toLowerCase() }}
      </span>
      
      <!-- Indicator Dot -->
      <div 
        class="w-1.5 h-1.5 rounded-full transition-colors duration-300"
        :class="getCurrentThemeStyle().dot"
      ></div>
    </button>

    <!-- Terminal-style tooltip -->
    <div 
      class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-carbon-950 text-carbon-100 text-xs font-mono rounded-ide border border-carbon-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
    >
      <div class="flex items-center space-x-2">
        <span class="text-syntax-comment">//</span>
        <span>theme: {{ getThemeDisplayName().toLowerCase() }}</span>
      </div>
      <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-carbon-950 border-l border-t border-carbon-700/50 rotate-45"></div>
    </div>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const { cycleTheme, getThemeDisplayName, getThemeIcon, currentTheme } = useTheme()

const getCurrentThemeStyle = () => {
  const theme = getThemeDisplayName().toLowerCase()
  
  switch (theme) {
    case 'light':
      return {
        bg: 'bg-gradient-to-br from-slate-100 to-slate-200',
        text: 'text-slate-700',
        dot: 'bg-syntax-warning'
      }
    case 'dark':
      return {
        bg: 'bg-gradient-to-br from-carbon-800 to-carbon-900',
        text: 'text-carbon-200',
        dot: 'bg-accent-500'
      }
    default:
      return {
        bg: 'bg-gradient-to-br from-accent-500 to-accent-600',
        text: 'text-white',
        dot: 'bg-syntax-success'
      }
  }
}
</script>