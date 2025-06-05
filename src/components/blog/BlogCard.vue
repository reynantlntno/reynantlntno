<template>
  <article class="card group cursor-pointer" @click="navigateToPost">
    <!-- Image -->
    <div class="relative h-48 overflow-hidden rounded-t-xl">
      <img
        v-if="post.image_url"
        :src="post.image_url"
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-custom-blue-800 to-custom-slate-700 flex items-center justify-center"
      >
        <DocumentTextIcon class="h-16 w-16 text-white/70" />
      </div>
      
      <!-- Read time overlay -->
      <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
        <span class="text-xs text-white font-medium">{{ readTime }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-custom-blue-100 text-custom-blue-800 dark:bg-custom-blue-800/20 dark:text-custom-blue-400"
        >
          {{ formatTagForDisplay(tag) }}
        </span>
        <span
          v-if="post.tags.length > 3"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
        >
          +{{ post.tags.length - 3 }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-custom-blue-800 dark:group-hover:text-custom-blue-400 transition-colors duration-200">
        {{ post.title }}
      </h3>

      <!-- Summary -->
      <p
        v-if="post.summary"
        class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
      >
        {{ post.summary }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <time :datetime="post.published_at">
          {{ formatDate(post.published_at) }}
        </time>
        
        <div class="flex items-center space-x-2">
          <ClockIcon class="h-4 w-4" />
          <span>{{ readTime }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { DocumentTextIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils/dates.util'
import { formatTagsForDisplay } from '~/utils/format.util'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const readTime = computed(() => {
  return props.post.read_time ? `${props.post.read_time} min read` : 'Quick read'
})

const formatTagForDisplay = (tag) => {
  return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')
}

const navigateToPost = () => {
  navigateTo(`/blog/${props.post.slug}`)
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