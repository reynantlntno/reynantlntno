<template>
  <div class="toast-container">
    <!-- Group toasts by position -->
    <div
      v-for="position in positions"
      :key="position"
      :class="getPositionClasses(position)"
      class="fixed z-50 space-y-3"
    >
      <Toast
        v-for="toast in getToastsByPosition(position)"
        :key="toast.id"
        v-bind="toast"
        @close="handleToastClose"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/ui/toast.store'
import Toast from './Toast.vue'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

// Get unique positions from active toasts
const positions = computed(() => {
  const positionSet = new Set(toasts.value.map(toast => toast.position))
  return Array.from(positionSet)
})

// Get toasts for a specific position
const getToastsByPosition = (position) => {
  return toasts.value.filter(toast => toast.position === position)
}

// Get CSS classes for positioning
const getPositionClasses = (position) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }
  
  return positionClasses[position] || positionClasses['top-right']
}

// Handle toast close
const handleToastClose = (toastId) => {
  toastStore.remove(toastId)
}
</script>

<style scoped>
.toast-container {
  pointer-events: none;
}

.toast-container > div {
  pointer-events: auto;
}
</style>