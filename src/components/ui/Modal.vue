<template>
  <Teleport to="body">
    <Transition
      name="modal"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-carbon-950/80 backdrop-blur-sm transition-opacity duration-300"></div>
        
        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            :class="modalClasses"
            class="relative w-full transform transition-all duration-300"
            @click.stop
          >
            <!-- Terminal Window Header -->
            <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700 rounded-t-ide">
              <div class="flex items-center space-x-2">
                <!-- Terminal Controls -->
                <div class="flex space-x-2">
                  <div class="w-3 h-3 rounded-full bg-syntax-error hover:bg-red-500 transition-colors cursor-pointer" @click="closeModal"></div>
                  <div class="w-3 h-3 rounded-full bg-syntax-warning hover:bg-yellow-500 transition-colors cursor-pointer"></div>
                  <div class="w-3 h-3 rounded-full bg-syntax-success hover:bg-green-500 transition-colors cursor-pointer"></div>
                </div>
                
                <!-- Title -->
                <span class="text-xs font-mono text-carbon-300 ml-2">
                  {{ terminalTitle || 'modal.component' }}
                </span>
              </div>
              
              <!-- Status Indicator -->
              <div class="flex items-center space-x-2">
                <div :class="statusIndicatorClass"></div>
                <span class="text-xs font-mono text-carbon-400">{{ status || getDefaultStatus }}</span>
              </div>
            </div>

            <!-- Modal Header (if not using terminal style) -->
            <div v-if="!terminalStyle" class="flex items-center justify-between px-6 py-4 border-b border-carbon-700">
              <div>
                <h2 v-if="title" class="text-lg font-semibold text-carbon-100 font-mono">
                  {{ title }}
                </h2>
                <p v-if="subtitle" class="text-sm text-carbon-400 font-mono mt-1">
                  <span class="text-syntax-comment">// {{ subtitle }}</span>
                </p>
              </div>
              <button
                @click="closeModal"
                class="p-2 text-carbon-400 hover:text-carbon-200 hover:bg-carbon-700/50 rounded transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div :class="contentClasses">
              <slot>
                <!-- Default Success Content for Appointment Booking -->
                <div v-if="type === 'success'" class="text-center">
                  <div class="w-16 h-16 mx-auto mb-6 bg-syntax-success/20 rounded-ide flex items-center justify-center">
                    <svg class="w-8 h-8 text-syntax-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h3 class="text-lg font-semibold text-syntax-success mb-4 font-mono">
                    <span class="text-syntax-function">{{ successTitle || 'operationCompleted' }}</span>
                    <span class="text-carbon-300">()</span>
                  </h3>
                  
                  <p class="text-syntax-success mb-6 font-mono text-sm">
                    <span class="text-syntax-comment">// {{ successMessage || 'Operation completed successfully' }}</span>
                  </p>
                  
                  <!-- Reference Code Display -->
                  <div v-if="referenceCode" class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 p-4 mb-6">
                    <div class="flex items-center justify-between px-3 py-2 bg-carbon-900 border-b border-carbon-700/50 mb-4 -mx-4 -mt-4">
                      <span class="text-syntax-variable font-mono text-sm text-carbon-200">referenceCode</span>
                      <button
                        @click="copyReferenceCode"
                        class="text-xs text-carbon-400 hover:text-carbon-200 transition-colors font-mono"
                        title="Copy reference code"
                      >
                        {{ copied ? 'copied!' : 'copy()' }}
                      </button>
                    </div>
                    <div class="text-center">
                      <div class="font-mono text-lg font-bold text-accent-400 bg-carbon-700/50 rounded px-4 py-2 inline-block mb-2 select-all">
                        {{ referenceCode }}
                      </div>
                      <p class="text-xs text-carbon-400 font-mono">
                        <span class="text-syntax-comment">// Save this code to track your appointment status</span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Default Error Content -->
                <div v-else-if="type === 'error'" class="text-center">
                  <div class="w-16 h-16 mx-auto mb-6 bg-syntax-error/20 rounded-ide flex items-center justify-center">
                    <svg class="w-8 h-8 text-syntax-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  <h3 class="text-lg font-semibold text-syntax-error mb-4 font-mono">
                    <span class="text-syntax-function">{{ errorTitle || 'errorOccurred' }}</span>
                    <span class="text-carbon-300">()</span>
                  </h3>
                  
                  <div class="bg-carbon-900/50 rounded-ide border border-syntax-error/20 p-4 mb-6">
                    <div class="flex items-center justify-between px-3 py-2 bg-syntax-error/10 border-b border-syntax-error/20 mb-4 -mx-4 -mt-4">
                      <span class="text-syntax-function font-mono text-sm text-syntax-error">error.message</span>
                      <div class="w-2 h-2 bg-syntax-error rounded-full animate-pulse"></div>
                    </div>
                    <p class="text-syntax-error font-mono text-sm text-left">
                      <span class="text-syntax-comment">// {{ errorMessage || 'An unexpected error occurred' }}</span>
                    </p>
                  </div>

                  <!-- Error Details for Development -->
                  <div v-if="errorDetails && isDevelopment" class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 p-4 mb-6">
                    <div class="flex items-center justify-between px-3 py-2 bg-carbon-900 border-b border-carbon-700/50 mb-4 -mx-4 -mt-4">
                      <span class="text-syntax-variable font-mono text-sm text-carbon-200">debug.info</span>
                    </div>
                    <pre class="text-xs font-mono text-carbon-400 text-left overflow-x-auto">{{ errorDetails }}</pre>
                  </div>

                  <!-- Common Solutions -->
                  <div class="text-left">
                    <h4 class="text-sm font-semibold text-carbon-200 mb-3 font-mono">
                      <span class="text-syntax-function">troubleshoot</span>
                      <span class="text-carbon-300">()</span>
                    </h4>
                    <ul class="space-y-2 text-xs font-mono text-carbon-400">
                      <li class="flex items-start">
                        <span class="text-syntax-comment mr-2">•</span>
                        <span class="text-syntax-comment">// Check your internet connection</span>
                      </li>
                      <li class="flex items-start">
                        <span class="text-syntax-comment mr-2">•</span>
                        <span class="text-syntax-comment">// Verify all required fields are filled</span>
                      </li>
                      <li class="flex items-start">
                        <span class="text-syntax-comment mr-2">•</span>
                        <span class="text-syntax-comment">// Try selecting a different time slot</span>
                      </li>
                      <li class="flex items-start">
                        <span class="text-syntax-comment mr-2">•</span>
                        <span class="text-syntax-comment">// Contact support if the issue persists</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Default Confirmation Content -->
                <div v-else-if="type === 'confirm'" class="text-center">
                  <div class="w-12 h-12 mx-auto mb-4 bg-syntax-warning/20 rounded-ide flex items-center justify-center">
                    <svg class="w-6 h-6 text-syntax-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-syntax-warning mb-4 font-mono">
                    <span class="text-syntax-function">{{ confirmTitle || 'confirmAction' }}</span>
                    <span class="text-carbon-300">()</span>
                  </h3>
                  <p class="text-carbon-300 font-mono text-sm mb-6">
                    <span class="text-syntax-comment">// {{ confirmMessage || 'Are you sure you want to proceed?' }}</span>
                  </p>
                </div>
              </slot>
            </div>

            <!-- Modal Footer -->
            <div v-if="showFooter" class="flex items-center justify-end space-x-3 px-6 py-4 bg-carbon-800/50 border-t border-carbon-700 rounded-b-ide">
              <slot name="footer">
                <!-- Default Footer Buttons -->
                <template v-if="type === 'confirm'">
                  <Button
                    @click="closeModal"
                    variant="ghost"
                    size="sm"
                    class="font-mono"
                  >
                    cancel()
                  </Button>
                  <Button
                    @click="handleConfirm"
                    variant="accent"
                    size="sm"
                    class="font-mono"
                    :loading="loading"
                  >
                    confirm()
                  </Button>
                </template>
                
                <template v-else>
                  <Button
                    @click="closeModal"
                    :variant="getButtonVariant"
                    size="sm"
                    :class="getButtonClasses"
                  >
                    <template v-if="type === 'success'" #icon-left>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </template>
                    <template v-else-if="type === 'error'" #icon-left>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4l16 16m0-16L4 20" />
                      </svg>
                    </template>
                    {{ getButtonText }}
                  </Button>
                </template>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, nextTick, ref } from 'vue'
import Button from './Button.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'error', 'confirm', 'info'].includes(value)
  },
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  terminalTitle: {
    type: String,
    default: null
  },
  terminalStyle: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: null
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  // Success modal props
  successTitle: String,
  successMessage: String,
  referenceCode: String,
  // Error modal props
  errorTitle: String,
  errorMessage: String,
  errorDetails: String,
  // Confirm modal props
  confirmTitle: String,
  confirmMessage: String,
  // Button text
  closeButtonText: String
})

const emit = defineEmits(['close', 'confirm', 'after-enter', 'after-leave'])

// Local state
const copied = ref(false)

// Computed properties
const modalClasses = computed(() => {
  const sizeClasses = {
    xs: 'max-w-sm',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }
  
  return [
    'bg-carbon-900 border border-carbon-700 rounded-ide shadow-ide-xl overflow-hidden',
    sizeClasses[props.size]
  ].join(' ')
})

const contentClasses = computed(() => {
  return [
    'px-6 py-6',
    props.terminalStyle ? 'bg-carbon-900' : 'bg-carbon-800/50'
  ].join(' ')
})

const getDefaultStatus = computed(() => {
  const statusMap = {
    success: 'completed',
    error: 'failed',
    confirm: 'pending',
    info: 'active',
    default: 'active'
  }
  return statusMap[props.type] || statusMap.default
})

const statusIndicatorClass = computed(() => {
  const status = props.status || getDefaultStatus.value
  const statusClasses = {
    active: 'w-2 h-2 bg-syntax-success rounded-full animate-pulse',
    completed: 'w-2 h-2 bg-syntax-success rounded-full',
    loading: 'w-2 h-2 bg-syntax-warning rounded-full animate-pulse',
    pending: 'w-2 h-2 bg-syntax-warning rounded-full animate-pulse',
    failed: 'w-2 h-2 bg-syntax-error rounded-full animate-pulse',
    error: 'w-2 h-2 bg-syntax-error rounded-full animate-pulse',
    idle: 'w-2 h-2 bg-carbon-600 rounded-full'
  }
  
  return statusClasses[status] || statusClasses.active
})

const getButtonVariant = computed(() => {
  if (props.type === 'success') return 'outline'
  if (props.type === 'error') return 'outline'
  return 'accent'
})

const getButtonClasses = computed(() => {
  const baseClasses = 'font-mono'
  if (props.type === 'success') {
    return `${baseClasses} border-syntax-success text-syntax-success hover:bg-syntax-success/10`
  }
  if (props.type === 'error') {
    return `${baseClasses} border-syntax-error text-syntax-error hover:bg-syntax-error/10`
  }
  return baseClasses
})

const getButtonText = computed(() => {
  if (props.closeButtonText) return props.closeButtonText
  
  const defaultTexts = {
    success: 'continue()',
    error: 'try.again()',
    confirm: 'ok()',
    info: 'close()',
    default: 'close()'
  }
  
  return defaultTexts[props.type] || defaultTexts.default
})

const isDevelopment = computed(() => {
  return process.env.NODE_ENV === 'development'
})

// Methods
const closeModal = () => {
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    closeModal()
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const copyReferenceCode = async () => {
  if (!props.referenceCode) return
  
  try {
    await navigator.clipboard.writeText(props.referenceCode)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy reference code:', err)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = props.referenceCode
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr)
    }
    document.body.removeChild(textArea)
  }
}

// Transition handlers
const onEnter = (el) => {
  el.style.opacity = '0'
  el.style.transform = 'scale(0.9)'
}

const onAfterEnter = (el) => {
  el.style.opacity = '1'
  el.style.transform = 'scale(1)'
  emit('after-enter')
}

const onLeave = (el) => {
  el.style.opacity = '0'
  el.style.transform = 'scale(0.9)'
}

const onAfterLeave = () => {
  emit('after-leave')
}

// Watch for ESC key
watch(() => props.show, (show) => {
  if (show) {
    nextTick(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeModal()
        }
      }
      document.addEventListener('keydown', handleEscape)
      
      // Cleanup on close
      const cleanup = () => {
        document.removeEventListener('keydown', handleEscape)
      }
      
      // Store cleanup function
      document._modalCleanup = cleanup
    })
  } else {
    // Clean up event listener
    if (document._modalCleanup) {
      document._modalCleanup()
      delete document._modalCleanup
    }
  }
})

// Prevent body scroll when modal is open
watch(() => props.show, (show) => {
  if (show) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Reset copied state when modal closes
watch(() => props.show, (show) => {
  if (!show) {
    copied.value = false
  }
})
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

/* Backdrop blur effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Terminal controls hover effects */
.terminal-control:hover {
  transform: scale(1.1);
  transition: transform 0.1s ease;
}

/* Custom scrollbar for modal content */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  @apply bg-carbon-800 rounded;
}

.modal-content::-webkit-scrollbar-thumb {
  @apply bg-carbon-600 rounded hover:bg-carbon-500;
}

/* Focus trap for accessibility */
.modal-container:focus {
  outline: none;
}

/* Animation for reference code */
.reference-code {
  animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success animation */
.success-animation {
  animation: successPulse 2s ease-in-out infinite;
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Error pulse animation */
.error-pulse {
  animation: errorPulse 1.5s ease-in-out infinite;
}

@keyframes errorPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-container {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}
</style>