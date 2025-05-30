<template>
  <div class="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg">
    <div v-if="post.coverImage" class="relative h-48 overflow-hidden">
      <img 
        :src="post.coverImage" 
        :alt="post.title"
        class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
    
    <div class="p-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs text-dark-muted dark:text-light-muted">
          {{ formatDate(post.publishedAt) }}
        </span>
        <span v-if="post.featured" class="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary dark:text-primary-light rounded-full">
          Featured
        </span>
      </div>
      
      <h3 class="text-xl font-semibold mb-2 line-clamp-2">{{ post.title }}</h3>
      
      <p class="text-dark-muted dark:text-light-muted mb-4 text-sm line-clamp-3">
        {{ post.excerpt }}
      </p>
      
      <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="(tag, index) in post.tags.slice(0, 3)" 
          :key="index"
          class="px-2 py-1 text-xs font-medium bg-light-muted dark:bg-dark-muted rounded-full"
        >
          {{ tag }}
        </span>
        <span v-if="post.tags.length > 3" class="px-2 py-1 text-xs font-medium bg-light-muted dark:bg-dark-muted rounded-full">
          +{{ post.tags.length - 3 }}
        </span>
      </div>
      
      <router-link :to="`/blog/${post.slug}`" class="text-primary dark:text-primary-light font-medium flex items-center">
        Read Article
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/utils/formatters';

defineProps({
  post: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
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
</style>