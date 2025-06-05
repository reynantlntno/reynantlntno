<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      :class="triggerClasses"
      type="button"
      :disabled="disabled"
    >
      <slot name="trigger" :isOpen="isOpen">
        <span>{{ selectedLabel || placeholder }}</span>
        <ChevronDownIcon 
          :class="[
            'h-5 w-5 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          ]" 
        />
      </slot>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        :class="dropdownClasses"
      >
        <div class="py-1">
          <template v-if="options.length > 0">
            <button
              v-for="option in options"
              :key="option.value"
              @click="selectOption(option)"
              :class="[
                'w-full text-left px-4 py-2 text-sm transition-colors duration-150',
                option.value === modelValue
                  ? 'bg-custom-blue-800 text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-custom-slate-600',
                option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
              :disabled="option.disabled"
            >
              <slot name="option" :option="option">
                {{ option.label }}
              </slot>
            </button>
          </template>
          
          <template v-else>
            <div class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              {{ emptyText }}
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      return options.every(option => 
        typeof option === 'object' && 
        'value' in option && 
        'label' in option
      )
    }
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  position: {
    type: String,
    default: 'bottom-left',
    validator: (value) => [
      'bottom-left', 'bottom-right', 'top-left', 'top-right'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  emptyText: {
    type: String,
    default: 'No options available'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const selectedLabel = computed(() => {
  const selectedOption = props.options.find(option => option.value === props.modelValue)
  return selectedOption?.label || ''
})

const triggerClasses = computed(() => {
  const baseClasses = [
    'relative w-full cursor-default rounded-lg border border-gray-300 dark:border-custom-slate-600',
    'bg-white dark:bg-custom-slate-700 text-left shadow-sm',
    'focus:outline-none focus:ring-2 focus:ring-custom-blue-800 focus:border-transparent',
    'transition-all duration-200',
    'flex items-center justify-between'
  ]

  if (props.disabled) {
    baseClasses.push('opacity-50', 'cursor-not-allowed')
  }

  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm'],
    md: ['px-4', 'py-2.5', 'text-sm'],
    lg: ['px-4', 'py-3', 'text-base']
  }

  return [...baseClasses, ...sizeClasses[props.size]]
})

const dropdownClasses = computed(() => {
  const baseClasses = [
    'absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg',
    'bg-white dark:bg-custom-slate-700 shadow-lg ring-1 ring-black ring-opacity-5',
    'border border-gray-200 dark:border-custom-slate-600'
  ]

  const positionClasses = {
    'bottom-left': ['origin-top-left'],
    'bottom-right': ['origin-top-right', 'right-0'],
    'top-left': ['origin-bottom-left', 'bottom-full', 'mb-1'],
    'top-right': ['origin-bottom-right', 'bottom-full', 'mb-1', 'right-0']
  }

  return [...baseClasses, ...positionClasses[props.position]]
})

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option) => {
  if (!option.disabled) {
    emit('update:modelValue', option.value)
    emit('change', option)
    isOpen.value = false
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>