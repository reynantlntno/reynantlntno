<template>
  <div class="group relative bg-carbon-800/50 backdrop-blur-sm rounded-ide border border-carbon-700/50 overflow-hidden hover:border-accent-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-glow-accent">
    <!-- Project Thumbnail -->
    <div class="aspect-video relative overflow-hidden bg-carbon-900">
      <img
        v-if="project.thumbnail_url"
        :src="project.thumbnail_url"
        :alt="`${project.title} thumbnail`"
        class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 max-h-[240px]"
        @error="handleImageError"
        loading="lazy"
        fetchpriority="low"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="w-16 h-16 bg-carbon-700/50 rounded-ide flex items-center justify-center">
          <svg class="w-8 h-8 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>
      
      <!-- Overlay with action buttons -->
      <div class="absolute inset-0 bg-carbon-950/0 group-hover:bg-carbon-950/80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="flex space-x-3">
          <router-link
            v-if="project.slug"
            :to="`/projects/${project.slug}`"
            class="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-ide font-mono text-sm transition-all duration-200 flex items-center space-x-2 hover:scale-105"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>view()</span>
          </router-link>
          
          <a
            v-if="project.demo_url"
            :href="project.demo_url"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-syntax-success hover:bg-green-600 text-white px-4 py-2 rounded-ide font-mono text-sm transition-all duration-200 flex items-center space-x-2 hover:scale-105"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>demo()</span>
          </a>
          
          <a
            v-if="project.github_url"
            :href="project.github_url"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-carbon-700 hover:bg-carbon-600 text-white px-4 py-2 rounded-ide font-mono text-sm transition-all duration-200 flex items-center space-x-2 hover:scale-105"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>code()</span>
          </a>
        </div>
      </div>
      
      <!-- Featured Badge -->
      <div v-if="project.featured" class="absolute top-3 left-3">
        <div class="bg-accent-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-ide text-xs font-mono flex items-center space-x-1 border border-accent-400/50">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>featured</span>
        </div>
      </div>

      <!-- Status Indicator -->
      <div class="absolute top-3 right-3">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
          <span class="text-xs font-mono text-carbon-200">active</span>
        </div>
      </div>
    </div>

    <!-- Project Content -->
    <div class="p-6">
      <!-- File Header -->
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-carbon-700/30">
        <div class="flex items-center space-x-2">
          <span class="text-syntax-comment font-mono text-xs">1</span>
          <span class="text-syntax-comment font-mono text-xs">/* {{ project.title }} */</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-syntax-success rounded-full"></div>
          <span class="text-xs font-mono text-carbon-400">project</span>
        </div>
      </div>

      <!-- Title and Description -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-carbon-100 mb-2 group-hover:text-accent-400 transition-colors font-mono">
          <span class="text-syntax-variable"> {{ project.title.replace(/\s+/g, '') }}</span>
        </h3>
        <p class="text-carbon-300 text-sm leading-relaxed line-clamp-2 font-mono">
          <span class="text-syntax-comment">// {{ project.description }}</span>
        </p>
      </div>

      <!-- Technologies -->
      <div v-if="project.technologies && project.technologies.length > 0" class="mb-6">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tech in displayedTechnologies"
            :key="tech"
            class="bg-carbon-700/50 text-accent-400 px-2 py-1 rounded text-xs font-mono border border-carbon-600/50 hover:border-accent-500/50 transition-colors"
          >
            {{ tech.toLowerCase().replace(/\s+/g, '_') }}
          </span>
          <span
            v-if="project.technologies.length > maxTechnologies"
            class="bg-carbon-700/30 text-carbon-500 px-2 py-1 rounded text-xs font-mono border border-carbon-600/30"
          >
            +{{ project.technologies.length - maxTechnologies }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-4 border-t border-carbon-700/30">
        <router-link
          v-if="project.slug"
          :to="`/projects/${project.slug}`"
          class="text-accent-400 hover:text-accent-300 font-mono text-sm transition-colors flex items-center space-x-1 group-link"
        >
          <span>learn.more()</span>
          <svg class="w-4 h-4 transition-transform group-link-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>

        <div class="flex items-center space-x-3">
          <a
            v-if="project.github_url"
            :href="project.github_url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-carbon-400 hover:text-carbon-200 transition-colors hover:scale-110 transform"
            :title="`View ${project.title} source code`"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          
          <a
            v-if="project.demo_url"
            :href="project.demo_url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-carbon-400 hover:text-carbon-200 transition-colors hover:scale-110 transform"
            :title="`View ${project.title} live demo`"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <!-- Project Type Indicator -->
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-accent-400 rounded-full"></div>
            <span class="text-xs font-mono text-carbon-500">
              {{ project.type || 'web' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true,
    validator: (project) => {
      return project && typeof project === 'object' && project.title
    }
  },
  maxTechnologies: {
    type: Number,
    default: 3
  }
})

// Computed
const displayedTechnologies = computed(() => {
  if (!props.project.technologies || !Array.isArray(props.project.technologies)) {
    return []
  }
  return props.project.technologies.slice(0, props.maxTechnologies)
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
  
  console.warn(`Failed to load project thumbnail for: ${props.project.title}`)
}
</script>

<style scoped>
/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
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

/* Status indicator animation */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
  
  .animate-pulse {
    animation: none;
  }
  
  .group:hover .group-hover\:scale-105 {
    transform: none;
  }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .bg-carbon-800 {
    backdrop-filter: blur(8px);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-carbon-700 {
    border-color: rgb(156 163 175); /* carbon-400 equivalent */
  }
  
  .text-carbon-300 {
    color: rgb(243 244 246); /* carbon-100 equivalent */
  }
  
  .text-carbon-400 {
    color: rgb(209 213 219); /* carbon-200 equivalent */
  }
}

/* Print styles */
@media print {
  .group {
    border: 1px solid rgb(156 163 175);
    box-shadow: none;
    break-inside: avoid;
  }
  
  .absolute {
    position: static;
  }
  
  .hover\:scale-105:hover {
    transform: none;
  }
}
</style>