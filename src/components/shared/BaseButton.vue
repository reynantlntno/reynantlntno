<template>
  <button 
    :type="type" 
    class="inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[
      sizeClasses, 
      variantClasses,
      roundedClasses,
      { 
        'opacity-70 cursor-not-allowed': loading,
        'w-full': block
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <LoadingSpinner v-if="loading" size="sm" class="mr-2" />
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  rounded: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
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
  }
});

defineEmits(['click']);

const variantClasses = computed(() => {
  switch(props.variant) {
    case 'primary':
      return 'bg-primary hover:bg-primary-dark text-white border border-transparent';
    case 'secondary':
      return 'bg-dark-muted hover:bg-dark text-white border border-transparent dark:bg-light dark:text-dark dark:hover:bg-light-muted';
    case 'outline':
      return 'bg-transparent hover:bg-light-muted dark:hover:bg-dark-muted text-primary dark:text-primary-light border border-primary dark:border-primary-light';
    case 'ghost':
      return 'bg-transparent hover:bg-light-muted dark:hover:bg-dark-muted text-dark-muted dark:text-light-muted border border-transparent';
    case 'danger':
      return 'bg-red-500 hover:bg-red-600 text-white border border-transparent';
    default:
      return 'bg-primary hover:bg-primary-dark text-white border border-transparent';
  }
});

const sizeClasses = computed(() => {
  switch(props.size) {
    case 'sm': return 'py-1 px-3 text-sm';
    case 'md': return 'py-2 px-4 text-base';
    case 'lg': return 'py-3 px-6 text-lg';
    default: return 'py-2 px-4 text-base';
  }
});

const roundedClasses = computed(() => {
  switch(props.rounded) {
    case 'none': return 'rounded-none';
    case 'sm': return 'rounded-sm';
    case 'md': return 'rounded-md';
    case 'lg': return 'rounded-lg';
    case 'full': return 'rounded-full';
    default: return 'rounded-md';
  }
});
</script>