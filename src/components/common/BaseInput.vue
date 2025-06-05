<template>
  <div class="space-y-1">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Prefix Icon -->
      <div
        v-if="$slots.prefix || prefixIcon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <slot name="prefix">
          <component v-if="prefixIcon" :is="prefixIcon" class="h-5 w-5 text-gray-400" />
        </slot>
      </div>

      <!-- Input Field -->
      <input
        :id="inputId"
        ref="inputRef"
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />

      <!-- Suffix Content -->
      <div
        v-if="$slots.suffix || suffixIcon || showPasswordToggle || loading"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <!-- Loading Spinner -->
        <LoadingSpinner v-if="loading" size="sm" class="mr-2" />
        
        <!-- Password Toggle -->
        <button
          v-if="showPasswordToggle"
          type="button"
          @click="togglePassword"
          class="text-gray-400 hover:text-gray-600 focus:outline-none mr-2"
        >
          <EyeIcon v-if="showPassword" class="h-5 w-5" />
          <EyeSlashIcon v-else class="h-5 w-5" />
        </button>

        <!-- Suffix Slot/Icon -->
        <slot name="suffix">
          <component v-if="suffixIcon" :is="suffixIcon" class="h-5 w-5 text-gray-400" />
        </slot>
      </div>
    </div>

    <!-- Help Text -->
    <p
      v-if="helpText && !error"
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      {{ helpText }}
    </p>

    <!-- Error Message -->
    <p
      v-if="error"
      class="text-sm text-red-600 dark:text-red-400 flex items-center"
    >
      <ExclamationCircleIcon class="h-4 w-4 mr-1 flex-shrink-0" />
      {{ error }}
    </p>

    <!-- Character Count -->
    <p
      v-if="showCharCount && maxLength"
      class="text-sm text-gray-500 dark:text-gray-400 text-right"
    >
      {{ characterCount }}/{{ maxLength }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, useId, useSlots } from 'vue'
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'
    ].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'filled', 'outlined'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: [String, Object],
    default: null
  },
  suffixIcon: {
    type: [String, Object],
    default: null
  },
  min: {
    type: [String, Number],
    default: null
  },
  max: {
    type: [String, Number],
    default: null
  },
  step: {
    type: [String, Number],
    default: null
  },
  pattern: {
    type: String,
    default: null
  },
  autocomplete: {
    type: String,
    default: null
  },
  maxLength: {
    type: Number,
    default: null
  },
  showCharCount: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'enter', 'escape'])

const slots = useSlots()
const inputRef = ref(null)
const showPassword = ref(false)
const inputId = useId()

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

const showPasswordToggle = computed(() => {
  return props.type === 'password' && !props.disabled && !props.readonly
})

const characterCount = computed(() => {
  return String(props.modelValue || '').length
})

const inputClasses = computed(() => {
  const baseClasses = [
    'w-full',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-opacity-50'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm'],
    md: ['px-4', 'py-2.5', 'text-sm'],
    lg: ['px-4', 'py-3', 'text-base']
  }

  // Variant classes
  const variantClasses = {
    default: [
      'border',
      'border-gray-300',
      'dark:border-custom-slate-600',
      'rounded-lg',
      'bg-white',
      'dark:bg-custom-slate-700'
    ],
    filled: [
      'border-0',
      'rounded-lg',
      'bg-gray-100',
      'dark:bg-custom-slate-700'
    ],
    outlined: [
      'border-2',
      'border-gray-300',
      'dark:border-custom-slate-600',
      'rounded-lg',
      'bg-transparent'
    ]
  }

  // State classes
  const stateClasses = []
  
  if (props.error) {
    stateClasses.push(
      'border-red-300',
      'dark:border-red-600',
      'focus:ring-red-500',
      'focus:border-red-500'
    )
  } else {
    stateClasses.push(
      'focus:ring-custom-blue-800',
      'focus:border-custom-blue-800'
    )
  }

  if (props.disabled) {
    stateClasses.push(
      'opacity-50',
      'cursor-not-allowed',
      'bg-gray-50',
      'dark:bg-custom-slate-800'
    )
  }

  if (props.readonly) {
    stateClasses.push(
      'bg-gray-50',
      'dark:bg-custom-slate-800',
      'cursor-default'
    )
  }

  // Padding adjustments for icons
  const paddingClasses = []
  if (props.prefixIcon || slots.prefix) {
    paddingClasses.push('pl-10')
  }
  if (props.suffixIcon || slots.suffix || showPasswordToggle.value || props.loading) {
    paddingClasses.push('pr-10')
  }

  // Text color
  const textClasses = [
    'text-gray-900',
    'dark:text-white',
    'placeholder-gray-500',
    'dark:placeholder-gray-400'
  ]

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...stateClasses,
    ...paddingClasses,
    ...textClasses
  ]
})

const handleInput = (event) => {
  let value = event.target.value
  
  // Handle number type
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value)
  }
  
  emit('update:modelValue', value)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    emit('enter', event)
  } else if (event.key === 'Escape') {
    emit('escape', event)
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>