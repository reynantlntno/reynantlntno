<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-dark bg-opacity-75 dark:bg-black dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeOnBackdrop && $emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom glass-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div v-if="$slots.header" class="px-6 pt-5 pb-4 sm:px-6">
          <slot name="header"></slot>
        </div>
        
        <div class="px-6 py-4">
          <slot></slot>
        </div>
        
        <div v-if="$slots.footer" class="px-6 py-4 bg-light-muted dark:bg-dark-muted flex items-center justify-end">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

// Close modal when escape key is pressed
const handleKeydown = (event) => {
  if (props.closeOnEsc && event.key === 'Escape' && props.show) {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  // Prevent body scrolling when modal is open
  if (props.show) {
    document.body.style.overflow = 'hidden';
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
  // Restore body scrolling
  document.body.style.overflow = '';
});

watch(() => props.show, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : '';
});
</script>