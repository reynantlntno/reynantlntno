<template>
  <div class="space-y-6">
    <!-- Gallery Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
        Project Gallery
        <span v-if="images.length > 0" class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
          ({{ images.length }} {{ images.length === 1 ? 'image' : 'images' }})
        </span>
      </h3>
      
      <div v-if="images.length > 1" class="flex items-center space-x-2">
        <button
          @click="previousImage"
          :disabled="currentIndex === 0"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Previous image"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        
        <span class="text-sm text-gray-500 dark:text-gray-400 min-w-[80px] text-center">
          {{ currentIndex + 1 }} of {{ images.length }}
        </span>
        
        <button
          @click="nextImage"
          :disabled="currentIndex === images.length - 1"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          title="Next image"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-xl">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-xl">
      <ExclamationTriangleIcon class="w-12 h-12 text-red-500 mb-4" />
      <p class="text-red-600 dark:text-red-400 text-center">{{ error }}</p>
      <BaseButton @click="loadImages" variant="secondary" size="sm" class="mt-4">
        Try Again
      </BaseButton>
    </div>

    <!-- Empty State -->
    <div v-else-if="images.length === 0" class="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-xl">
      <PhotoIcon class="w-16 w-16 text-gray-400 mb-4" />
      <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No images available</h4>
      <p class="text-gray-600 dark:text-gray-400 text-center">
        Images for this project haven't been uploaded yet.
      </p>
    </div>

    <!-- Main Image Display -->
    <div v-else class="space-y-4">
      <!-- Primary Image -->
      <div class="relative group">
        <div 
          class="relative h-96 w-full bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden cursor-zoom-in"
          @click="openLightbox(currentIndex)"
        >
          <img
            :src="currentImage.image_url"
            :alt="currentImage.alt_text || `${projectTitle} - Image ${currentIndex + 1}`"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            @error="handleImageError"
          />
          
          <!-- Zoom indicator -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <div class="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <MagnifyingGlassIcon class="w-6 h-6 text-gray-700" />
            </div>
          </div>

          <!-- Image navigation arrows (for touch devices) -->
          <template v-if="images.length > 1">
            <button
              @click.stop="previousImage"
              :disabled="currentIndex === 0"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 md:opacity-0 group-hover:opacity-100"
            >
              <ChevronLeftIcon class="w-6 h-6" />
            </button>
            
            <button
              @click.stop="nextImage"
              :disabled="currentIndex === images.length - 1"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 md:opacity-0 group-hover:opacity-100"
            >
              <ChevronRightIcon class="w-6 h-6" />
            </button>
          </template>
        </div>

        <!-- Image Caption -->
        <div v-if="currentImage.alt_text" class="mt-3 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ currentImage.alt_text }}
          </p>
        </div>
      </div>

      <!-- Thumbnail Navigation -->
      <div v-if="images.length > 1" class="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
        <button
          v-for="(image, index) in images"
          :key="image.id"
          @click="setCurrentImage(index)"
          :class="[
            'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
            currentIndex === index
              ? 'border-custom-blue-800 ring-2 ring-custom-blue-800/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-custom-blue-400'
          ]"
        >
          <img
            :src="image.image_url"
            :alt="image.alt_text || `Thumbnail ${index + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        @click="closeLightbox"
        @keydown.esc="closeLightbox"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        tabindex="0"
      >
        <!-- Close button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors duration-200"
          title="Close lightbox"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>

        <!-- Navigation buttons -->
        <template v-if="images.length > 1">
          <button
            @click.stop="previousImage"
            :disabled="currentIndex === 0"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeftIcon class="w-8 h-8" />
          </button>
          
          <button
            @click.stop="nextImage"
            :disabled="currentIndex === images.length - 1"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRightIcon class="w-8 h-8" />
          </button>
        </template>

        <!-- Lightbox image -->
        <div 
          @click.stop
          class="relative max-w-4xl max-h-[90vh] mx-4"
        >
          <img
            :src="currentImage.image_url"
            :alt="currentImage.alt_text || `${projectTitle} - Image ${currentIndex + 1}`"
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          
          <!-- Image counter -->
          <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  },
  projectSlug: {
    type: String,
    required: true
  },
  projectTitle: {
    type: String,
    default: 'Project'
  },
  autoLoad: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['images-loaded', 'image-changed', 'lightbox-opened', 'lightbox-closed'])

// State
const images = ref([])
const currentIndex = ref(0)
const loading = ref(false)
const error = ref(null)
const lightboxOpen = ref(false)

// Computed
const currentImage = computed(() => {
  return images.value[currentIndex.value] || {}
})

// Methods
const loadImages = async () => {
  loading.value = true
  error.value = null

  try {
    const { $projectsApi } = useNuxtApp()
    const response = await $projectsApi.getProjectImages(props.projectSlug)

    if (response.success) {
      images.value = response.data || []
      currentIndex.value = 0
      emit('images-loaded', images.value)
    } else {
      error.value = response.error || 'Failed to load project images'
    }
  } catch (err) {
    console.error('Error loading project images:', err)
    error.value = 'Unable to load images. Please try again.'
  } finally {
    loading.value = false
  }
}

const setCurrentImage = (index) => {
  if (index >= 0 && index < images.value.length) {
    currentIndex.value = index
    emit('image-changed', currentImage.value, index)
  }
}

const nextImage = () => {
  if (currentIndex.value < images.value.length - 1) {
    setCurrentImage(currentIndex.value + 1)
  }
}

const previousImage = () => {
  if (currentIndex.value > 0) {
    setCurrentImage(currentIndex.value - 1)
  }
}

const openLightbox = (index = null) => {
  if (index !== null) {
    setCurrentImage(index)
  }
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
  emit('lightbox-opened', currentImage.value)
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
  emit('lightbox-closed')
}

const handleImageError = (event) => {
  console.warn('Failed to load image:', event.target.src)
  // Could implement fallback image here
}

const handleKeydown = (event) => {
  if (!lightboxOpen.value) return

  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      event.preventDefault()
      previousImage()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextImage()
      break
  }
}

// Lifecycle
onMounted(() => {
  if (props.autoLoad) {
    loadImages()
  }
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

// Expose methods for parent components
defineExpose({
  loadImages,
  setCurrentImage,
  nextImage,
  previousImage,
  openLightbox,
  closeLightbox,
  images: computed(() => images.value),
  currentImage,
  currentIndex: computed(() => currentIndex.value)
})
</script>

<style scoped>
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgb(156 163 175) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(156 163 175);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgb(107 114 128);
}
</style>