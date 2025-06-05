<template>
  <article class="card group cursor-pointer" @click="navigateToProject">
    <!-- Project Image -->
    <div class="relative h-48 overflow-hidden rounded-t-xl">
      <img
        v-if="project.thumbnail_url"
        :src="project.thumbnail_url"
        :alt="project.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-custom-blue-800 to-custom-slate-700 flex items-center justify-center"
      >
        <CodeBracketIcon class="h-16 w-16 text-white/70" />
      </div>
      
      <!-- Featured Badge -->
      <div
        v-if="project.featured"
        class="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold"
      >
        Featured
      </div>
      
      <!-- Project Links Overlay -->
      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
        <a
          v-if="project.github_url"
          :href="project.github_url"
          @click.stop
          target="_blank"
          rel="noopener noreferrer"
          class="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
          :title="`View ${project.title} on GitHub`"
        >
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
        </a>
        
        <a
          v-if="project.demo_url"
          :href="project.demo_url"
          @click.stop
          target="_blank"
          rel="noopener noreferrer"
          class="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors duration-200"
          :title="`View ${project.title} demo`"
        >
          <ArrowTopRightOnSquareIcon class="w-6 h-6 text-white" />
        </a>
      </div>
    </div>

    <!-- Project Content -->
    <div class="p-6">
      <!-- Technologies -->
      <div v-if="project.technologies && project.technologies.length > 0" class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tech in displayTechnologies"
          :key="tech"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-custom-blue-100 text-custom-blue-800 dark:bg-custom-blue-800/20 dark:text-custom-blue-400"
        >
          {{ tech }}
        </span>
        <span
          v-if="project.technologies.length > maxVisibleTech"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
        >
          +{{ project.technologies.length - maxVisibleTech }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-custom-blue-800 dark:group-hover:text-custom-blue-400 transition-colors duration-200">
        {{ project.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {{ project.description }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <a
            v-if="project.github_url"
            :href="project.github_url"
            @click.stop
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-500 dark:text-gray-400 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
            title="View on GitHub"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
          
          <a
            v-if="project.demo_url"
            :href="project.demo_url"
            @click.stop
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-500 dark:text-gray-400 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
            title="View demo"
          >
            <ArrowTopRightOnSquareIcon class="w-5 h-5" />
          </a>
        </div>
        
        <time 
          :datetime="project.created_at"
          class="text-sm text-gray-500 dark:text-gray-400"
        >
          {{ formatDate(project.created_at, { month: 'short', year: 'numeric' }) }}
        </time>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { CodeBracketIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils/dates.util'

const props = defineProps({
  project: {
    type: Object,
    required: true,
    validator: (project) => {
      return project && 
             typeof project.id === 'number' &&
             typeof project.slug === 'string' &&
             typeof project.title === 'string' &&
             typeof project.description === 'string'
    }
  },
  maxVisibleTech: {
    type: Number,
    default: 4
  },
  showOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'tech-click'])

const displayTechnologies = computed(() => {
  if (!props.project.technologies || !Array.isArray(props.project.technologies)) {
    return []
  }
  return props.project.technologies.slice(0, props.maxVisibleTech)
})

const navigateToProject = () => {
  navigateTo(`/projects/${props.project.slug}`)
  emit('click', props.project)
}

const handleImageError = (event) => {
  // Hide broken image and show placeholder
  event.target.style.display = 'none'
}

const handleTechClick = (tech, event) => {
  event.stopPropagation()
  emit('tech-click', tech)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>