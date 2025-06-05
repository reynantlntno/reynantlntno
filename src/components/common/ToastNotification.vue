<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 pointer-events-none">
      <div class="flex flex-col items-end justify-start min-h-screen pt-4 px-4 pb-6 sm:p-6">
        <TransitionGroup
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          tag="div"
          class="space-y-2"
        >
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="toastClasses(toast)"
            class="pointer-events-auto"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircleIcon
                  v-if="toast.type === 'success'"
                  class="h-6 w-6 text-green-400"
                />
                <ExclamationTriangleIcon
                  v-else-if="toast.type === 'warning'"
                  class="h-6 w-6 text-yellow-400"
                />
                <XCircleIcon
                  v-else-if="toast.type === 'error'"
                  class="h-6 w-6 text-red-400"
                />
                <InformationCircleIcon
                  v-else
                  class="h-6 w-6 text-blue-400"
                />
              </div>
              
              <div class="ml-3 flex-1">
                <h3
                  v-if="toast.title"
                  class="text-sm font-medium text-gray-900 dark:text-white"
                >
                  {{ toast.title }}
                </h3>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ toast.message }}
                </p>
              </div>
              
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeToast(toast.id)"
                  class="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-blue-800"
                >
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <!-- Progress bar for auto-dismiss -->
            <div
              v-if="toast.duration && toast.duration > 0"
              class="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1"
            >
              <div
                class="h-1 rounded-full transition-all duration-100 ease-linear"
                :class="progressBarClass(toast.type)"
                :style="{ width: `${(toast.remaining / toast.duration) * 100}%` }"
              ></div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const toasts = ref([])
let toastIdCounter = 0
let intervalId = null

const toastClasses = (toast) => {
  const baseClasses = [
    'w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
  ]

  const typeClasses = {
    success: ['border-l-4', 'border-green-400'],
    warning: ['border-l-4', 'border-yellow-400'],
    error: ['border-l-4', 'border-red-400'],
    info: ['border-l-4', 'border-blue-400']
  }

  return [...baseClasses, ...typeClasses[toast.type], 'p-4']
}

const progressBarClass = (type) => {
  const classes = {
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
    info: 'bg-blue-400'
  }
  return classes[type]
}

const addToast = (options) => {
  const toast = {
    id: ++toastIdCounter,
    type: options.type || 'info',
    title: options.title,
    message: options.message,
    duration: options.duration !== undefined ? options.duration : 5000,
    remaining: options.duration !== undefined ? options.duration : 5000
  }

  toasts.value.push(toast)

  // Auto remove if duration is set
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(toast.id)
    }, toast.duration)
  }

  return toast.id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const clearAll = () => {
  toasts.value = []
}

// Update remaining time for progress bars
const updateProgress = () => {
  toasts.value.forEach(toast => {
    if (toast.duration > 0) {
      toast.remaining -= 100
      if (toast.remaining <= 0) {
        removeToast(toast.id)
      }
    }
  })
}

onMounted(() => {
  intervalId = setInterval(updateProgress, 100)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Provide global toast methods
const $toast = {
  success: (message, options = {}) => addToast({ ...options, type: 'success', message }),
  error: (message, options = {}) => addToast({ ...options, type: 'error', message }),
  warning: (message, options = {}) => addToast({ ...options, type: 'warning', message }),
  info: (message, options = {}) => addToast({ ...options, type: 'info', message }),
  add: addToast,
  remove: removeToast,
  clear: clearAll
}

// Make toast methods available globally
const nuxtApp = useNuxtApp()
if (nuxtApp) {
  nuxtApp.provide('toast', $toast)
}

defineExpose({
  addToast,
  removeToast,
  clearAll
})
</script>