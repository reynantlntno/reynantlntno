<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-2 scale-95"
      enter-to-class="opacity-100 transform translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0 scale-100"
      leave-to-class="opacity-0 transform translate-y-2 scale-95"
    >
      <div
        v-if="visible"
        :class="containerClasses"
        @click="handleClick"
      >
        <!-- Terminal Toast -->
        <div v-if="variant === 'terminal'" class="terminal-window max-w-sm">
          <div class="terminal-header">
            <div class="terminal-controls">
              <div class="terminal-control close" @click.stop="close"></div>
              <div class="terminal-control minimize"></div>
              <div class="terminal-control maximize"></div>
            </div>
            <span class="text-xs font-mono text-carbon-300 ml-2">{{ getTerminalTitle() }}</span>
          </div>
          <div class="terminal-content">
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <span class="text-syntax-comment">$</span>
                <span class="text-xs font-mono text-carbon-400">{{ getTerminalCommand() }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <component :is="iconComponent" :class="iconClasses" class="w-4 h-4 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p v-if="title" class="text-sm font-mono text-carbon-100 font-medium">{{ title }}</p>
                  <p class="text-sm font-mono text-carbon-300">{{ message }}</p>
                </div>
              </div>
              <div class="text-xs font-mono text-carbon-500">
                Press <kbd class="px-1 py-0.5 bg-carbon-800 rounded text-carbon-300">ESC</kbd> to close
              </div>
            </div>
          </div>
        </div>

        <!-- Code Toast -->
        <div v-else-if="variant === 'code'" class="code-block max-w-md">
          <div class="code-header">
            <div class="flex items-center justify-between">
              <span class="text-xs font-mono">{{ getCodeFilename() }}</span>
              <button
                v-if="closable"
                @click.stop="close"
                class="text-carbon-400 hover:text-carbon-200 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="code-content">
            <div class="space-y-1">
              <div class="code-line">
                <span class="code-line-number">1</span>
                <span class="text-syntax-comment">// {{ getTypeComment() }}</span>
              </div>
              <div class="code-line">
                <span class="code-line-number">2</span>
                <span class="text-syntax-keyword">const</span>
                <span class="text-syntax-variable"> notification</span>
                <span class="text-carbon-300"> = {</span>
              </div>
              <div class="code-line">
                <span class="code-line-number">3</span>
                <span class="text-syntax-string">  title: </span>
                <span class="text-syntax-string">'{{ title || 'Notification' }}'</span><span class="text-carbon-300">,</span>
              </div>
              <div class="code-line">
                <span class="code-line-number">4</span>
                <span class="text-syntax-string">  message: </span>
                <span class="text-syntax-string">'{{ message }}'</span><span class="text-carbon-300">,</span>
              </div>
              <div class="code-line">
                <span class="code-line-number">5</span>
                <span class="text-syntax-string">  type: </span>
                <span class="text-syntax-string">'{{ type }}'</span>
              </div>
              <div class="code-line">
                <span class="code-line-number">6</span>
                <span class="text-carbon-300">}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Standard Toast -->
        <div v-else :class="toastClasses">
          <div :class="iconClasses">
            <component :is="iconComponent" class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <p v-if="title" :class="titleClasses">{{ title }}</p>
            <p :class="messageClasses">{{ message }}</p>
          </div>
          <button
            v-if="closable"
            @click.stop="close"
            class="ml-4 text-carbon-400 hover:text-carbon-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  variant: {
    type: String,
    default: 'standard',
    validator: (value) => ['standard', 'terminal', 'code'].includes(value)
  },
  title: {
    type: String,
    default: null
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 5000
  },
  persistent: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'].includes(value)
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)
let timeoutId = null

// Position classes
const positionClasses = computed(() => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }
  return positions[props.position]
})

// Container classes
const containerClasses = computed(() => {
  return `fixed z-50 ${positionClasses.value} cursor-pointer`
})

// Toast classes (for standard variant)
const toastClasses = computed(() => {
  const baseClasses = 'max-w-sm w-full bg-carbon-800 dark:bg-carbon-900 rounded-ide shadow-ide-lg border p-4 flex items-start space-x-3 transition-all duration-300 transform hover:scale-105'
  const typeClasses = {
    success: 'border-syntax-success/50 shadow-glow-success',
    error: 'border-syntax-error/50 shadow-glow-error',
    warning: 'border-syntax-warning/50',
    info: 'border-accent-500/50 shadow-glow-accent'
  }
  
  return `${baseClasses} ${typeClasses[props.type]}`
})

// Icon classes
const iconClasses = computed(() => {
  const typeClasses = {
    success: 'text-syntax-success',
    error: 'text-syntax-error',
    warning: 'text-syntax-warning',
    info: 'text-accent-500'
  }
  return `flex-shrink-0 ${typeClasses[props.type]}`
})

// Title classes
const titleClasses = computed(() => {
  return 'text-sm font-mono font-medium text-carbon-100'
})

// Message classes
const messageClasses = computed(() => {
  const baseClasses = 'text-sm font-mono text-carbon-300'
  return props.title ? `${baseClasses} mt-1` : baseClasses
})

// Icon component
const iconComponent = computed(() => {
  const icons = {
    success: 'CheckCircleIcon',
    error: 'XCircleIcon',
    warning: 'ExclamationTriangleIcon',
    info: 'InformationCircleIcon'
  }
  return icons[props.type]
})

// Terminal helpers
const getTerminalTitle = () => {
  const titles = {
    success: 'success.log',
    error: 'error.log',
    warning: 'warning.log',
    info: 'info.log'
  }
  return titles[props.type]
}

const getTerminalCommand = () => {
  const commands = {
    success: 'echo "Operation completed successfully"',
    error: 'echo "Error encountered"',
    warning: 'echo "Warning: Check output"',
    info: 'echo "Information available"'
  }
  return commands[props.type]
}

const getCodeFilename = () => {
  const filenames = {
    success: 'success.js',
    error: 'error.js',
    warning: 'warning.js',
    info: 'info.js'
  }
  return filenames[props.type]
}

const getTypeComment = () => {
  const comments = {
    success: 'SUCCESS: Operation completed',
    error: 'ERROR: Something went wrong',
    warning: 'WARNING: Please review',
    info: 'INFO: Notification'
  }
  return comments[props.type]
}

// Methods
const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close', props.id)
  }, 200)
}

const handleClick = () => {
  if (props.closable && props.variant === 'standard') {
    close()
  }
}

// Auto-close logic
onMounted(() => {
  if (!props.persistent && props.duration > 0) {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})

// Expose close method
defineExpose({ close })
</script>

<style scoped>
kbd {
  font-family: inherit;
  font-size: 0.75rem;
}
</style>