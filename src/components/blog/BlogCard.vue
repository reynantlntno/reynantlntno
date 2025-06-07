<template>
  <article class="group relative bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden hover:border-accent-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-glow-accent">
    <!-- Article Thumbnail -->
    <div class="aspect-video relative overflow-hidden bg-carbon-900">
      <img
        v-if="post.image_url"
        :src="post.image_url"
        :alt="`${post.title} featured image`"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        @error="handleImageError"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="w-16 h-16 bg-carbon-700/50 rounded-ide flex items-center justify-center">
          <svg class="w-8 h-8 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
      
      <!-- Overlay with action button -->
      <div class="absolute inset-0 bg-carbon-950/0 group-hover:bg-carbon-950/80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <router-link
          :to="`/blog/${post.slug}`"
          class="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-ide font-mono text-sm transition-all duration-200 flex items-center space-x-2 hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>read()</span>
        </router-link>
      </div>
      
      <!-- Featured Badge -->
      <div v-if="featured" class="absolute top-3 left-3">
        <div class="bg-accent-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-ide text-xs font-mono flex items-center space-x-1 border border-accent-400/50">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>featured</span>
        </div>
      </div>

      <!-- Reading Time Badge -->
      <div v-if="post.read_time" class="absolute top-3 right-3">
        <div class="bg-carbon-800/80 backdrop-blur-sm text-carbon-200 px-2 py-1 rounded-ide text-xs font-mono border border-carbon-700/50">
          {{ formattedReadTime }}
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div class="p-6">
      <!-- File Header -->
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-carbon-700/30">
        <div class="flex items-center space-x-2">
          <span class="text-syntax-comment font-mono text-xs">{{ postIndex }}</span>
          <span class="text-syntax-comment font-mono text-xs">/* {{ post.title.slice(0, 30) }}{{ post.title.length > 30 ? '...' : '' }} */</span>
        </div>
        <time 
          :datetime="post.published_at"
          class="text-xs font-mono text-carbon-400"
        >
          {{ formattedDate }}
        </time>
      </div>

      <!-- Title and Summary -->
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-carbon-100 mb-2 group-hover:text-accent-400 transition-colors font-mono line-clamp-2">
          <router-link
            :to="`/blog/${post.slug}`"
            class="hover:underline decoration-2 decoration-accent-400 underline-offset-2"
          >
            {{ post.title }}
          </router-link>
        </h2>
        <p class="text-carbon-300 text-sm leading-relaxed line-clamp-3 font-mono">
          <span class="text-syntax-comment">// </span>{{ post.summary || generateExcerpt(post.content) }}
        </p>
      </div>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="mb-6">
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="tag in displayedTags"
            :key="tag"
            :to="`/blog?tag=${encodeURIComponent(tag)}`"
            class="bg-carbon-700/50 text-accent-400 px-2 py-1 rounded text-xs font-mono border border-carbon-600/50 hover:border-accent-500/50 transition-colors"
          >
            {{ tag.toLowerCase().replace(/\s+/g, '_') }}
          </router-link>
          <span
            v-if="post.tags.length > maxTags"
            class="bg-carbon-700/30 text-carbon-500 px-2 py-1 rounded text-xs font-mono border border-carbon-600/30"
          >
            +{{ post.tags.length - maxTags }}
          </span>
        </div>
      </div>

      <!-- Action Area -->
      <div class="flex items-center justify-between pt-4 border-t border-carbon-700/30">
        <router-link
          :to="`/blog/${post.slug}`"
          class="text-accent-400 hover:text-accent-300 font-mono text-sm transition-colors flex items-center space-x-1 group-link"
        >
          <span>read.more()</span>
          <svg class="w-4 h-4 transition-transform group-link-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>

        <div class="flex items-center space-x-3">
          <!-- Share Button -->
          <button
            @click="sharePost"
            class="text-carbon-400 hover:text-carbon-200 transition-colors hover:scale-110 transform"
            :title="`Share ${post.title}`"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>

          <!-- Article Type Indicator -->
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-accent-400 rounded-full"></div>
            <span class="text-xs font-mono text-carbon-500">
              {{ post.category || 'article' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatReadingTime, generateExcerpt } from '@/utils/format.util'
import { formatDate } from '@/utils/date.util'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  maxTags: {
    type: Number,
    default: 3
  },
  postIndex: {
    type: Number,
    default: 1
  }
})

// Computed
const formattedDate = computed(() => {
  return formatDate(props.post.published_at, 'MMM dd, yyyy')
})

const formattedReadTime = computed(() => {
  return formatReadingTime(props.post.read_time)
})

const displayedTags = computed(() => {
  if (!props.post.tags || !Array.isArray(props.post.tags)) {
    return []
  }
  return props.post.tags.slice(0, props.maxTags)
})

const postUrl = computed(() => {
  return `${window.location.origin}/blog/${props.post.slug}`
})

// Methods
const handleImageError = (event) => {
  // Hide the broken image and show the placeholder
  const imgElement = event.target
  const placeholder = imgElement.nextElementSibling
  
  if (imgElement && placeholder) {
    imgElement.style.display = 'none'
    placeholder.style.display = 'flex'
  }
  
  console.warn(`Failed to load blog post image for: ${props.post.title}`)
}

const sharePost = async () => {
  const shareData = {
    title: props.post.title,
    text: props.post.summary || generateExcerpt(props.post.content),
    url: postUrl.value
  }

  try {
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData)
    } else {
      // Fallback to copying URL to clipboard
      await navigator.clipboard.writeText(postUrl.value)
      // You could add a toast notification here
      console.log('Post URL copied to clipboard')
    }
  } catch (error) {
    console.error('Error sharing post:', error)
    // Fallback: try to copy URL to clipboard
    try {
      await navigator.clipboard.writeText(postUrl.value)
      console.log('Post URL copied to clipboard')
    } catch (clipboardError) {
      console.error('Failed to copy URL to clipboard:', clipboardError)
    }
  }
}
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group-link:hover .group-link-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Custom animations */
@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Improved focus states */
.group:focus-within {
  outline: 2px solid rgba(0, 122, 204, 0.5);
  outline-offset: 2px;
}

/* Better accessibility */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-transform,
  .transition-colors {
    transition: none;
  }
  
  .group:hover .group-hover\:scale-105 {
    transform: none;
  }
}
</style>