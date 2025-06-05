<template>
  <div class="relative">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        ref="inputRef"
        v-model="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        type="text"
        class="input-field pl-10 pr-10"
        @keyup.enter="handleSearch"
        @focus="focused = true"
        @blur="handleBlur"
      />
      
      <div
        v-if="localValue || loading"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        <button
          v-else
          @click="clearSearch"
          type="button"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
    
    <!-- Search suggestions -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-10 w-full mt-1 bg-white dark:bg-custom-slate-700 border border-gray-200 dark:border-custom-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <button
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-custom-slate-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-custom-slate-600"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  suggestions: {
    type: Array,
    default: () => []
  },
  debounce: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const inputRef = ref(null)
const localValue = ref(props.modelValue)
const focused = ref(false)
const debounceTimer = ref(null)

const showSuggestions = computed(() => {
  return focused.value && localValue.value && props.suggestions.length > 0
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// Watch local value changes with debounce
watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
  
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    if (newValue !== props.modelValue) {
      emit('search', newValue)
    }
  }, props.debounce)
})

const handleSearch = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  emit('search', localValue.value)
  inputRef.value?.blur()
}

const clearSearch = () => {
  localValue.value = ''
  emit('clear')
  inputRef.value?.focus()
}

const selectSuggestion = (suggestion) => {
  localValue.value = suggestion
  focused.value = false
  emit('search', suggestion)
}

const handleBlur = () => {
  // Delay hiding suggestions to allow click events
  setTimeout(() => {
    focused.value = false
  }, 150)
}

const handleClickOutside = (event) => {
  if (inputRef.value && !inputRef.value.contains(event.target)) {
    focused.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})

// Expose focus method
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>