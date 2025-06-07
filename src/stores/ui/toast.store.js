import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useToastStore = defineStore('toast', () => {
  // State
  const toasts = ref([])
  const maxToasts = ref(5) // Maximum number of toasts to show at once
  
  // Counter for generating unique IDs
  let toastCounter = 0

  // Getters
  const activeToasts = computed(() => toasts.value)
  const hasToasts = computed(() => toasts.value.length > 0)
  const toastCount = computed(() => toasts.value.length)

  // Default toast options
  const defaultOptions = {
    type: 'info',
    variant: 'standard',
    title: null,
    duration: 5000,
    persistent: false,
    closable: true,
    position: 'top-right'
  }

  // Actions
  const show = (options) => {
    // Merge with defaults
    const toastOptions = {
      ...defaultOptions,
      ...options,
      id: `toast-${++toastCounter}`,
      timestamp: Date.now()
    }

    // Validate required fields
    if (!toastOptions.message) {
      console.warn('Toast message is required')
      return null
    }

    // Validate type
    if (!['success', 'error', 'warning', 'info'].includes(toastOptions.type)) {
      console.warn('Invalid toast type:', toastOptions.type)
      toastOptions.type = 'info'
    }

    // Validate variant
    if (!['standard', 'terminal', 'code'].includes(toastOptions.variant)) {
      console.warn('Invalid toast variant:', toastOptions.variant)
      toastOptions.variant = 'standard'
    }

    // Validate position
    const validPositions = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center']
    if (!validPositions.includes(toastOptions.position)) {
      console.warn('Invalid toast position:', toastOptions.position)
      toastOptions.position = 'top-right'
    }

    // Remove oldest toast if we're at the limit
    if (toasts.value.length >= maxToasts.value) {
      const oldestToast = toasts.value[0]
      remove(oldestToast.id)
    }

    // Add new toast
    toasts.value.push(toastOptions)

    return toastOptions.id
  }

  const remove = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clear = () => {
    toasts.value = []
  }

  const removeByType = (type) => {
    toasts.value = toasts.value.filter(toast => toast.type !== type)
  }

  const removeByPosition = (position) => {
    toasts.value = toasts.value.filter(toast => toast.position !== position)
  }

  // Convenience methods for different toast types
  const success = (message, options = {}) => {
    return show({
      ...options,
      type: 'success',
      message
    })
  }

  const error = (message, options = {}) => {
    return show({
      ...options,
      type: 'error',
      message,
      duration: options.duration || 8000 // Longer duration for errors
    })
  }

  const warning = (message, options = {}) => {
    return show({
      ...options,
      type: 'warning',
      message,
      duration: options.duration || 6000 // Slightly longer for warnings
    })
  }

  const info = (message, options = {}) => {
    return show({
      ...options,
      type: 'info',
      message
    })
  }

  // Convenience methods for different variants
  const terminal = (message, options = {}) => {
    return show({
      ...options,
      variant: 'terminal',
      message
    })
  }

  const code = (message, options = {}) => {
    return show({
      ...options,
      variant: 'code',
      message
    })
  }

  // Utility methods
  const updateMaxToasts = (max) => {
    maxToasts.value = Math.max(1, Math.min(10, max)) // Limit between 1-10
    
    // Remove excess toasts if needed
    while (toasts.value.length > maxToasts.value) {
      const oldestToast = toasts.value[0]
      remove(oldestToast.id)
    }
  }

  const getToastById = (id) => {
    return toasts.value.find(toast => toast.id === id)
  }

  const getToastsByType = (type) => {
    return toasts.value.filter(toast => toast.type === type)
  }

  const getToastsByPosition = (position) => {
    return toasts.value.filter(toast => toast.position === position)
  }

  // Auto-cleanup old toasts (fallback in case they don't auto-close)
  const cleanupOldToasts = () => {
    const now = Date.now()
    const maxAge = 30000 // 30 seconds max age
    
    toasts.value = toasts.value.filter(toast => {
      if (toast.persistent) return true
      return (now - toast.timestamp) < maxAge
    })
  }

  // Run cleanup every 30 seconds
  const cleanupInterval = setInterval(cleanupOldToasts, 30000)

  // Cleanup interval when store is destroyed
  const stopCleanup = () => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval)
    }
  }

  return {
    // State
    toasts: activeToasts,
    maxToasts,

    // Getters
    hasToasts,
    toastCount,

    // Core actions
    show,
    remove,
    clear,
    removeByType,
    removeByPosition,

    // Convenience methods by type
    success,
    error,
    warning,
    info,

    // Convenience methods by variant
    terminal,
    code,

    // Utility methods
    updateMaxToasts,
    getToastById,
    getToastsByType,
    getToastsByPosition,
    cleanupOldToasts,
    stopCleanup
  }
})