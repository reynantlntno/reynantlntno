<!-- filepath: /Users/reynantolentino/reynantlntno.dev/src/components/ui/Button.vue -->
<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center space-x-2">
      <div class="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
      <span class="font-mono text-xs">loading...</span>
    </div>
    
    <!-- Normal State -->
    <template v-else>
      <slot name="icon-left" />
      <span v-if="$slots.default" :class="textClasses">
        <slot />
      </span>
      <slot name="icon-right" />
    </template>
    
    <!-- Terminal Cursor -->
    <span 
      v-if="!loading && variant === 'terminal'" 
      class="ml-1 text-current animate-pulse"
    >
      ▊
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'danger', 'warning', 'info', 
      'ghost', 'outline', 'terminal', 'code', 'accent'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  to: {
    type: [String, Object],
    default: null
  },
  href: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  rounded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Determine the component tag
const tag = computed(() => {
  if (props.to) return 'RouterLink'
  if (props.href) return 'a'
  return 'button'
})

// Base classes
const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-2 py-1 text-2xs font-mono',
    sm: 'px-3 py-1.5 text-xs font-mono',
    md: 'px-4 py-2 text-sm font-mono',
    lg: 'px-5 py-2.5 text-sm font-mono',
    xl: 'px-6 py-3 text-base font-mono'
  }
  return sizes[props.size]
})

// Variant classes
const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-accent-600 hover:bg-accent-700 active:bg-accent-800 text-white border border-accent-500/50 focus:ring-accent-500/50 shadow-ide hover:shadow-ide-lg hover:shadow-glow-accent',
    
    secondary: 'bg-carbon-700 hover:bg-carbon-600 active:bg-carbon-800 text-carbon-100 border border-carbon-600/50 focus:ring-carbon-500/50 shadow-ide hover:shadow-ide-lg',
    
    success: 'bg-syntax-success hover:bg-emerald-600 active:bg-emerald-700 text-white border border-syntax-success/50 focus:ring-syntax-success/50 shadow-ide hover:shadow-glow-success',
    
    danger: 'bg-syntax-error hover:bg-red-600 active:bg-red-700 text-white border border-syntax-error/50 focus:ring-syntax-error/50 shadow-ide hover:shadow-glow-error',
    
    warning: 'bg-syntax-warning hover:bg-amber-500 active:bg-amber-600 text-carbon-900 border border-syntax-warning/50 focus:ring-syntax-warning/50 shadow-ide',
    
    info: 'bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white border border-accent-400/50 focus:ring-accent-500/50 shadow-ide',
    
    ghost: 'bg-transparent hover:bg-carbon-800/50 dark:hover:bg-carbon-700/50 text-carbon-300 hover:text-carbon-100 border border-transparent focus:ring-carbon-500/50',
    
    outline: 'bg-transparent hover:bg-carbon-800/20 dark:hover:bg-carbon-700/20 text-carbon-300 hover:text-carbon-100 border border-carbon-600/50 hover:border-carbon-500/50 focus:ring-carbon-500/50',
    
    terminal: 'bg-carbon-900 hover:bg-carbon-800 active:bg-carbon-950 text-syntax-success border border-carbon-700/50 hover:border-syntax-success/30 focus:ring-syntax-success/50 shadow-inner-ide font-code',
    
    code: 'bg-carbon-800/80 hover:bg-carbon-700/80 active:bg-carbon-900/80 text-syntax-function border border-carbon-600/30 hover:border-syntax-keyword/30 focus:ring-syntax-keyword/50 shadow-inner font-code',
    
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 active:from-accent-700 active:to-accent-800 text-white border border-accent-400/50 focus:ring-accent-500/50 shadow-ide hover:shadow-glow-accent'
  }
  return variants[props.variant]
})

// Border radius classes
const borderClasses = computed(() => {
  return props.rounded ? 'rounded-full' : 'rounded-ide'
})

// Width classes
const widthClasses = computed(() => {
  return props.block ? 'w-full' : ''
})

// Combined button classes
const buttonClasses = computed(() => {
  return [
    baseClasses,
    sizeClasses.value,
    variantClasses.value,
    borderClasses.value,
    widthClasses.value
  ].join(' ')
})

// Text classes
const textClasses = computed(() => {
  return 'font-mono'
})

// Handle click events
const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>