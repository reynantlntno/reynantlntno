<template>
  <!-- NuxtLink for internal navigation -->
  <NuxtLink
    v-if="to"
    :to="to"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :target="target"
    :rel="rel"
    @click="handleClick"
    tabindex="0"
  >
    <LoadingSpinner v-if="loading" :size="spinnerSize" class="mr-2" />
    <slot v-if="!loading" />
    <span v-if="loading">{{ loadingText }}</span>
  </NuxtLink>

  <!-- Anchor for external links -->
  <a
    v-else-if="href"
    :href="href"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :target="target"
    :rel="rel"
    @click="handleClick"
    tabindex="0"
  >
    <LoadingSpinner v-if="loading" :size="spinnerSize" class="mr-2" />
    <slot v-if="!loading" />
    <span v-if="loading">{{ loadingText }}</span>
  </a>

  <!-- Button for actions -->
  <button
    v-else
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <LoadingSpinner v-if="loading" :size="spinnerSize" class="mr-2" />
    <slot v-if="!loading" />
    <span v-if="loading">{{ loadingText }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
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
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  block: {
    type: Boolean,
    default: false
  },
  target: {
    type: String,
    default: null
  },
  rel: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['click'])

const spinnerSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'sm'
    case 'lg': return 'md'
    default: return 'sm'
  }
})

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-opacity-50',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'text-center',
    'no-underline',
    'cursor-pointer'
  ]

  if (props.block) {
    baseClasses.push('w-full')
  }

  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm'],
    md: ['px-4', 'py-2.5', 'text-sm'],
    lg: ['px-6', 'py-3', 'text-base']
  }

  const variantClasses = {
    primary: [
      'bg-custom-blue-800',
      'hover:bg-custom-blue-900',
      'text-white',
      'hover:shadow-lg',
      'hover:scale-105',
      'focus:ring-custom-blue-800',
      'active:bg-custom-blue-900'
    ],
    secondary: [
      'bg-transparent',
      'border-2',
      'border-custom-blue-800',
      'text-custom-blue-800',
      'dark:text-custom-blue-400',
      'hover:bg-custom-blue-800',
      'hover:text-white',
      'focus:ring-custom-blue-800',
      'active:bg-custom-blue-900',
      'active:text-white'
    ],
    ghost: [
      'text-gray-600',
      'dark:text-gray-300',
      'hover:text-custom-blue-800',
      'dark:hover:text-custom-blue-400',
      'hover:bg-gray-100',
      'dark:hover:bg-gray-800',
      'active:bg-gray-200',
      'dark:active:bg-gray-700',
      'focus:ring-gray-300',
      'dark:focus:ring-gray-600'
    ],
    danger: [
      'bg-red-600',
      'hover:bg-red-700',
      'text-white',
      'hover:shadow-lg',
      'hover:scale-105',
      'focus:ring-red-600',
      'active:bg-red-800'
    ]
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant]
  ]
})

const handleClick = (event) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>