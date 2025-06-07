<template>
  <div :class="containerClasses">
    <!-- Terminal Loader -->
    <div v-if="variant === 'terminal'" class="terminal-window">
      <div class="terminal-header">
        <div class="terminal-controls">
          <div class="terminal-control close"></div>
          <div class="terminal-control minimize"></div>
          <div class="terminal-control maximize"></div>
        </div>
        <span class="text-xs font-mono text-carbon-300 ml-2">loading.process</span>
      </div>
      <div class="terminal-content">
        <div class="flex items-center space-x-3">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
          </div>
          <span class="text-sm font-mono text-carbon-100">{{ text || 'processing...' }}</span>
        </div>
        <div class="mt-2 text-xs font-mono text-carbon-500">
          <span class="text-syntax-comment">//</span> {{ getRandomLoadingMessage() }}
        </div>
      </div>
    </div>

    <!-- Spinner Loader -->
    <div v-else-if="variant === 'spinner'" class="flex items-center space-x-3">
      <div :class="spinnerClasses" :style="sizeStyles">
        <div class="animate-spin rounded-full border-2 border-carbon-600 border-t-accent-500"></div>
      </div>
      <span v-if="text" :class="textClasses">{{ text }}</span>
    </div>

    <!-- Code Loader -->
    <div v-else-if="variant === 'code'" class="code-block">
      <div class="code-header">
        <div class="flex items-center space-x-2">
          <span class="text-xs font-mono">loading.js</span>
          <div class="flex space-x-1">
            <div class="w-1.5 h-1.5 bg-syntax-success rounded-full animate-pulse"></div>
            <div class="w-1.5 h-1.5 bg-syntax-warning rounded-full animate-pulse" style="animation-delay: 0.3s"></div>
            <div class="w-1.5 h-1.5 bg-syntax-error rounded-full animate-pulse" style="animation-delay: 0.6s"></div>
          </div>
        </div>
      </div>
      <div class="code-content">
        <div class="space-y-1">
          <div class="code-line">
            <span class="code-line-number">1</span>
            <span class="text-syntax-keyword">const</span>
            <span class="text-syntax-variable"> loading</span>
            <span class="text-carbon-300"> = </span>
            <span class="text-syntax-string">'{{ text || 'Loading...' }}'</span>
          </div>
          <div class="code-line">
            <span class="code-line-number">2</span>
            <span class="text-syntax-keyword">await</span>
            <span class="text-syntax-function"> processData</span>
            <span class="text-carbon-300">()</span>
          </div>
          <div class="code-line">
            <span class="code-line-number">3</span>
            <span class="text-syntax-comment">// {{ getProgressIndicator() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dots Loader -->
    <div v-else-if="variant === 'dots'" class="flex items-center space-x-3">
      <div class="flex space-x-1">
        <div 
          v-for="i in 3" 
          :key="i"
          class="w-2 h-2 bg-accent-500 rounded-full animate-bounce"
          :style="{ animationDelay: `${(i - 1) * 0.2}s` }"
        ></div>
      </div>
      <span v-if="text" :class="textClasses">{{ text }}</span>
    </div>

    <!-- Progress Bar -->
    <div v-else-if="variant === 'progress'" class="w-full space-y-2">
      <div class="flex justify-between items-center">
        <span :class="textClasses">{{ text || 'Loading...' }}</span>
        <span class="text-xs font-mono text-carbon-400">{{ progress }}%</span>
      </div>
      <div class="w-full bg-carbon-800 rounded-full h-2 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Default Circular -->
    <div v-else class="flex items-center space-x-3">
      <div :class="circularClasses" :style="sizeStyles">
        <svg class="animate-spin w-full h-full" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <span v-if="text" :class="textClasses">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'spinner',
    validator: (value) => ['spinner', 'terminal', 'code', 'dots', 'progress', 'circular'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  text: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: 'accent',
    validator: (value) => ['accent', 'success', 'warning', 'error', 'carbon'].includes(value)
  },
  center: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100
  }
})

const loadingMessages = [
  'compiling components...',
  'optimizing performance...',
  'loading dependencies...',
  'initializing modules...',
  'preparing interface...',
  'connecting to server...',
  'fetching resources...',
  'rendering UI...'
]

const progressIndicators = ['▱▱▱▱▱', '▰▱▱▱▱', '▰▰▱▱▱', '▰▰▰▱▱', '▰▰▰▰▱', '▰▰▰▰▰']

const currentMessage = ref('')
const currentProgress = ref(0)

// Size mappings
const sizeMap = {
  xs: '12px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
  '2xl': '64px'
}

// Container classes
const containerClasses = computed(() => {
  const base = 'flex items-center'
  const direction = props.text && !['terminal', 'code'].includes(props.variant) ? 'flex-col space-y-2' : ''
  const centering = props.center ? 'justify-center' : ''
  const overlay = props.overlay ? 'fixed inset-0 bg-carbon-900/80 backdrop-blur-sm z-50' : ''
  
  return [base, direction, centering, overlay].filter(Boolean).join(' ')
})

// Spinner classes
const spinnerClasses = computed(() => {
  const colorClasses = {
    accent: 'text-accent-500',
    success: 'text-syntax-success',
    warning: 'text-syntax-warning',
    error: 'text-syntax-error',
    carbon: 'text-carbon-400'
  }
  
  return `w-full h-full ${colorClasses[props.color]}`
})

// Circular classes
const circularClasses = computed(() => {
  const colorClasses = {
    accent: 'text-accent-500',
    success: 'text-syntax-success',
    warning: 'text-syntax-warning',
    error: 'text-syntax-error',
    carbon: 'text-carbon-400'
  }
  
  return `w-full h-full ${colorClasses[props.color]}`
})

// Size styles
const sizeStyles = computed(() => ({
  width: sizeMap[props.size],
  height: sizeMap[props.size]
}))

// Text classes
const textClasses = computed(() => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  }
  
  return `${sizeClasses[props.size]} text-carbon-300 font-mono`
})

// Methods
const getRandomLoadingMessage = () => {
  if (!currentMessage.value) {
    currentMessage.value = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  }
  return currentMessage.value
}

const getProgressIndicator = () => {
  return progressIndicators[currentProgress.value % progressIndicators.length]
}

// Lifecycle
let messageInterval
let progressInterval

onMounted(() => {
  if (props.variant === 'terminal') {
    messageInterval = setInterval(() => {
      currentMessage.value = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    }, 2000)
  }
  
  if (props.variant === 'code') {
    progressInterval = setInterval(() => {
      currentProgress.value = (currentProgress.value + 1) % progressIndicators.length
    }, 500)
  }
})

onUnmounted(() => {
  if (messageInterval) clearInterval(messageInterval)
  if (progressInterval) clearInterval(progressInterval)
})
</script>