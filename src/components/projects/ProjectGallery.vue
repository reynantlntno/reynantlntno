<template>
  <section class="py-16 lg:py-24 bg-carbon-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Gallery Header -->
      <div class="text-center mb-12">
        <!-- File Header -->
        <div class="inline-flex items-center space-x-2 mb-6">
          <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
          <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
          <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
          <span class="font-mono text-sm text-carbon-400 ml-3">~/gallery/{{ projectTitle.toLowerCase().replace(/\s+/g, '-') }}.md</span>
        </div>
        
        <h2 class="text-3xl md:text-4xl font-bold text-carbon-100 mb-6 font-mono">
          <span class="text-syntax-keyword">const</span>
          <span class="text-syntax-variable"> gallery</span>
          <span class="text-carbon-300"> = [</span>
        </h2>
        <p class="text-lg text-carbon-300 font-mono mb-4">
          <span class="text-syntax-comment">// Visual showcase of {{ projectTitle }}</span>
        </p>
        <div class="flex items-center justify-center space-x-2 text-sm font-mono text-carbon-400">
          <span class="text-syntax-comment">//</span>
          <span>{{ totalImages }} {{ totalImages === 1 ? 'image' : 'images' }} available</span>
        </div>
      </div>

      <!-- Main Gallery -->
      <div class="space-y-8">
        <!-- Featured Image -->
        <div 
          v-if="featuredImage"
          class="relative group cursor-pointer"
          @click="openModal(0)"
        >
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden hover:border-accent-500/50 transition-all duration-300 hover:shadow-glow-accent">
            <!-- Image Header -->
            <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
              <div class="flex items-center space-x-2">
                <span class="text-syntax-comment font-mono text-xs">1</span>
                <span class="text-syntax-comment font-mono text-xs">/* Featured Screenshot */</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-syntax-success rounded-full"></div>
                <span class="text-xs font-mono text-carbon-400">primary</span>
              </div>
            </div>
            
            <!-- Image Container -->
            <div class="aspect-video relative overflow-hidden bg-carbon-900">
              <img
                :src="featuredImage.image_url"
                :alt="featuredImage.alt_text || `${projectTitle} screenshot`"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                @error="handleImageError"
                loading="lazy"
              />
              
              <!-- Overlay -->
              <div class="absolute inset-0 bg-carbon-950/0 group-hover:bg-carbon-950/80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div class="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-ide font-mono text-sm transition-all duration-200 flex items-center space-x-2 hover:scale-105">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span>expand.view()</span>
                </div>
              </div>
            </div>
            
            <!-- Image Caption -->
            <div v-if="featuredImage.alt_text" class="px-4 py-3 bg-carbon-800/30 border-t border-carbon-700/30">
              <p class="text-carbon-300 font-mono text-sm">
                <span class="text-syntax-comment">// </span>{{ featuredImage.alt_text }}
              </p>
            </div>
          </div>
        </div>

        <!-- Thumbnail Grid -->
        <div v-if="thumbnailImages.length > 0" class="space-y-6">
          <!-- Grid Header -->
          <div class="flex items-center space-x-2 text-sm font-mono text-carbon-400">
            <span class="text-syntax-comment">//</span>
            <span>Additional screenshots</span>
            <span class="text-accent-400">({{ thumbnailImages.length }})</span>
          </div>
          
          <!-- Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="(image, index) in thumbnailImages"
              :key="image.id"
              class="group relative cursor-pointer"
              @click="openModal(index + 1)"
            >
              <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden hover:border-accent-500/50 transition-all duration-300 hover:shadow-glow-accent hover:transform hover:-translate-y-1">
                <!-- Mini Header -->
                <div class="flex items-center justify-between px-3 py-1.5 bg-carbon-800 border-b border-carbon-700">
                  <div class="flex items-center space-x-1">
                    <span class="text-syntax-comment font-mono text-2xs">{{ index + 2 }}</span>
                  </div>
                  <div class="w-1.5 h-1.5 bg-accent-400 rounded-full"></div>
                </div>
                
                <!-- Image -->
                <div class="aspect-video relative overflow-hidden bg-carbon-900">
                  <img
                    :src="image.image_url"
                    :alt="image.alt_text || `${projectTitle} screenshot ${index + 2}`"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    @error="handleImageError"
                    loading="lazy"
                  />
                  
                  <!-- Overlay -->
                  <div class="absolute inset-0 bg-carbon-950/0 group-hover:bg-carbon-950/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div class="bg-accent-500/90 backdrop-blur-sm text-white p-2 rounded-ide">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gallery Footer -->
      <div class="text-center mt-12">
        <div class="bg-carbon-800/30 rounded-ide border border-carbon-700/30 p-6 max-w-md mx-auto">
          <div class="text-carbon-300 font-mono text-sm mb-4">
            <span class="text-carbon-300">]</span>
            <span class="text-syntax-comment"> // End gallery array</span>
          </div>
          <div class="flex items-center justify-center space-x-2 text-sm font-mono text-carbon-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Click any image to view full size</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <ImageModal
      v-if="showModal"
      :images="sortedImages"
      :current-index="currentImageIndex"
      :project-title="projectTitle"
      @close="closeModal"
      @next="nextImage"
      @prev="prevImage"
      @goto="goToImage"
    />
  </section>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import ImageModal from './ImageModal.vue'

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  }
})

// Local state
const showModal = ref(false)
const currentImageIndex = ref(0)

// Computed
const sortedImages = computed(() => {
  return [...props.images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
})

const totalImages = computed(() => sortedImages.value.length)

const featuredImage = computed(() => {
  return sortedImages.value[0] || null
})

const thumbnailImages = computed(() => {
  return sortedImages.value.slice(1)
})

// Methods
const openModal = (index) => {
  currentImageIndex.value = index
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  document.body.style.overflow = 'auto'
}

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % totalImages.value
}

const prevImage = () => {
  currentImageIndex.value = currentImageIndex.value === 0 
    ? totalImages.value - 1 
    : currentImageIndex.value - 1
}

const goToImage = (index) => {
  currentImageIndex.value = index
}

const handleImageError = (event) => {
  // Hide the broken image and show placeholder
  const imgElement = event.target
  const container = imgElement.closest('.aspect-video')
  
  if (container) {
    container.innerHTML = `
      <div class="w-full h-full flex items-center justify-center">
        <div class="w-16 h-16 bg-carbon-700/50 rounded-ide flex items-center justify-center">
          <svg class="w-8 h-8 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    `
  }
  
  console.warn('Failed to load gallery image:', event.target.src)
}

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
/* Custom animations for gallery items */
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > * {
  animation: fade-in-up 0.6s ease-out forwards;
}

.grid > *:nth-child(1) { animation-delay: 0.1s; }
.grid > *:nth-child(2) { animation-delay: 0.2s; }
.grid > *:nth-child(3) { animation-delay: 0.3s; }
.grid > *:nth-child(4) { animation-delay: 0.4s; }
.grid > *:nth-child(5) { animation-delay: 0.5s; }
.grid > *:nth-child(6) { animation-delay: 0.6s; }
.grid > *:nth-child(7) { animation-delay: 0.7s; }
.grid > *:nth-child(8) { animation-delay: 0.8s; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-transform {
    transition: none;
  }
  
  .group-hover\:scale-105:hover,
  .group-hover\:scale-110:hover {
    transform: none;
  }
  
  .grid > * {
    animation: none;
  }
}
</style>