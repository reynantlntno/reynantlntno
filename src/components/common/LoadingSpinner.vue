<template>
  <div :class="spinnerClasses">
    <svg
      class="animate-spin"
      :class="sizeClasses"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span v-if="text" :class="textClasses">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'current',
    validator: (value) => ['current', 'primary', 'white', 'gray'].includes(value)
  },
  centered: {
    type: Boolean,
    default: false
  }
})

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    current: 'text-current',
    primary: 'text-custom-blue-800',
    white: 'text-white',
    gray: 'text-gray-500'
  }
  return colors[props.color]
})

const textClasses = computed(() => {
  const baseClasses = ['ml-2', 'text-sm', 'font-medium']
  return [...baseClasses, colorClasses.value]
})

const spinnerClasses = computed(() => {
  const baseClasses = ['inline-flex', 'items-center']
  
  if (props.centered) {
    baseClasses.push('justify-center', 'w-full')
  }
  
  return [...baseClasses, colorClasses.value]
})
</script>