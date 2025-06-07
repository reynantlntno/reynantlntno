<template>
  <Teleport to="body">
    <div 
      class="fixed inset-0 z-50 bg-carbon-950/95 backdrop-blur-sm flex flex-col"
      @click="handleBackdropClick"
      @keydown.esc="$emit('close')"
      tabindex="0"
    >
      <!-- Modal Header -->
      <div class="bg-carbon-900/90 backdrop-blur-md border-b border-carbon-700/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between py-4">
            <!-- File Info -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
                <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
                <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
              </div>
              <div class="font-mono text-sm text-carbon-300">
                ~/gallery/{{ projectTitle.toLowerCase().replace(/\s+/g, '-') }}/image_{{ currentIndex + 1 }}.jpg
              </div>
            </div>
            
            <!-- Image Counter -->
            <div class="hidden sm:flex items-center space-x-4">
              <div class="font-mono text-sm text-carbon-400">
                <span class="text-accent-400">{{ currentIndex + 1 }}</span>
                <span class="text-carbon-500"> / </span>
                <span>{{ images.length }}</span>
              </div>
              
              <!-- Navigation Dots -->
              <div v-if="images.length > 1" class="flex space-x-2">
                <button
                  v-for="(image, index) in images"
                  :key="image.id"
                  @click="$emit('goto', index)"
                  :class="[
                    'w-2 h-2 rounded-full transition-all duration-200',
                    index === currentIndex 
                      ? 'bg-accent-500 shadow-glow-accent' 
                      : 'bg-carbon-600 hover:bg-carbon-500'
                  ]"
                  :aria-label="`Go to image ${index + 1}`"
                />
              </div>
            </div>
            
            <!-- Close Button -->
            <button
              @click="$emit('close')"
              class="p-2 hover:bg-carbon-800/50 rounded-ide transition-colors font-mono text-sm text-carbon-300 hover:text-carbon-100 flex items-center space-x-2"
              aria-label="Close gallery"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="hidden sm:inline">close()</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Image Container -->
      <div class="flex-1 flex items-center justify-center relative min-h-0 p-4" @click.stop>
        <!-- Navigation Buttons -->
        <button
          v-if="images.length > 1"
          @click="$emit('prev')"
          class="nav-button nav-button-left p-3 bg-carbon-800/80 hover:bg-carbon-700/80 rounded-ide text-carbon-200 hover:text-carbon-100 transition-all duration-200 backdrop-blur-sm border border-carbon-600/50 hover:border-carbon-500/50 font-mono text-sm"
          aria-label="Previous image"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="hidden lg:inline">prev()</span>
          </div>
        </button>

        <!-- Image Display -->
        <div class="max-w-full max-h-full flex items-center justify-center">
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden shadow-2xl">
            <!-- Image Header -->
            <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
              <div class="flex items-center space-x-2">
                <span class="text-syntax-comment font-mono text-xs">{{ currentIndex + 1 }}</span>
                <span class="text-syntax-comment font-mono text-xs">/* {{ currentImage.alt_text || 'Screenshot' }} */</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
                <span class="text-xs font-mono text-carbon-400">viewing</span>
              </div>
            </div>
            
            <!-- Image -->
            <div class="relative">
              <img
                :src="currentImage.image_url"
                :alt="currentImage.alt_text || `${projectTitle} screenshot ${currentIndex + 1}`"
                class="max-w-full max-h-[calc(100vh-12rem)] object-contain"
                @error="handleImageError"
                @load="handleImageLoad"
              />
              
              <!-- Loading Overlay -->
              <div 
                v-if="imageLoading"
                class="absolute inset-0 bg-carbon-900/50 flex items-center justify-center"
              >
                <div class="flex items-center space-x-2 text-carbon-300 font-mono text-sm">
                  <div class="w-4 h-4 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>loading.image()</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          v-if="images.length > 1"
          @click="$emit('next')"
          class="nav-button nav-button-right p-3 bg-carbon-800/80 hover:bg-carbon-700/80 rounded-ide text-carbon-200 hover:text-carbon-100 transition-all duration-200 backdrop-blur-sm border border-carbon-600/50 hover:border-carbon-500/50 font-mono text-sm"
          aria-label="Next image"
        >
          <div class="flex items-center space-x-2">
            <span class="hidden lg:inline">next()</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      <!-- Image Info Footer -->
      <div class="bg-carbon-900/90 backdrop-blur-md border-t border-carbon-700/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-4">
            <!-- Image Caption -->
            <div v-if="currentImage.alt_text" class="mb-3">
              <p class="text-carbon-300 font-mono text-sm">
                <span class="text-syntax-comment">// </span>{{ currentImage.alt_text }}
              </p>
            </div>
            
            <!-- Controls Info -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <!-- Keyboard Instructions -->
              <div class="flex flex-wrap items-center gap-4 text-xs font-mono text-carbon-500">
                <div class="flex items-center space-x-1">
                  <kbd class="px-2 py-1 bg-carbon-800 border border-carbon-700 rounded text-carbon-300">←</kbd>
                  <kbd class="px-2 py-1 bg-carbon-800 border border-carbon-700 rounded text-carbon-300">→</kbd>
                  <span>navigate</span>
                </div>
                <div class="flex items-center space-x-1">
                  <kbd class="px-2 py-1 bg-carbon-800 border border-carbon-700 rounded text-carbon-300">ESC</kbd>
                  <span>close</span>
                </div>
              </div>
              
              <!-- Image Metadata -->
              <div class="flex items-center space-x-4 text-xs font-mono text-carbon-500">
                <span>resolution: auto</span>
                <span>format: image</span>
                <span>index: {{ currentIndex }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'next', 'prev', 'goto'])

// Local state
const imageLoading = ref(true)

// Computed
const currentImage = computed(() => {
  return props.images[props.currentIndex] || props.images[0]
})

// Methods
const handleKeydown = (event) => {
  switch (event.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowLeft':
      emit('prev')
      break
    case 'ArrowRight':
      emit('next')
      break
    case ' ':
      event.preventDefault()
      emit('next')
      break
  }
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

const handleImageError = (event) => {
  console.warn('Failed to load modal image:', event.target.src)
  imageLoading.value = false
}

const handleImageLoad = () => {
  imageLoading.value = false
}

// Watch for image changes to show loading state
watch(() => props.currentIndex, () => {
  imageLoading.value = true
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
  
  // Auto-focus for keyboard navigation
  const modalElement = document.querySelector('[tabindex="0"]')
  if (modalElement) {
    modalElement.focus()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
/* Navigation button positioning */
.nav-button {
  position: absolute;
  z-index: 10;
}

.nav-button-left {
  left: 1rem;
}

.nav-button-right {
  right: 1rem;
}

/* Custom scrollbar for modal */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: rgb(30 41 59); /* carbon-800 */
}

::-webkit-scrollbar-thumb {
  background-color: rgb(71 85 105); /* carbon-600 */
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgb(100 116 139); /* carbon-500 */
}

/* Keyboard styles */
kbd {
  font-family: inherit;
  font-size: inherit;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid rgba(0, 122, 204, 0.5);
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .nav-button-left,
  .nav-button-right {
    bottom: 1rem;
    top: auto;
  }
  
  .nav-button-left {
    left: 1rem;
  }
  
  .nav-button-right {
    right: 1rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .transition-all {
    transition: none;
  }
  
  .animate-spin,
  .animate-pulse {
    animation: none;
  }
}
</style>