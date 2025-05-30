<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">Blog</h1>
      <div class="h-1 w-24 bg-primary mb-6"></div>
      
      <p class="text-lg mb-8 text-gray-600 dark:text-gray-300">
        Technical insights, tutorials, and thoughts on modern web development.
      </p>
      
      <!-- Loading State -->
      <div v-if="blogStore.isLoading" class="my-12 space-y-8">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="blogStore.error" class="glass-panel p-8 text-center my-12">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="text-2xl font-bold mb-2">Failed to Load Blog Posts</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ blogStore.error }}
        </p>
        <button @click="loadBlogPosts" class="btn-primary">
          Try Again
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="blogStore.posts.length === 0" class="glass-panel p-8 text-center my-12">
        <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <h2 class="text-2xl font-bold mb-2">No Blog Posts Yet</h2>
        <p class="text-gray-600 dark:text-gray-400">
          Check back soon for new content!
        </p>
      </div>
      
      <!-- Blog Posts Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div 
          v-for="post in blogStore.posts" 
          :key="post.id" 
          class="glass-panel overflow-hidden flex flex-col h-full"
        >
          <div class="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <img 
              v-if="post.coverImage" 
              :src="post.coverImage" 
              :alt="post.title" 
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div class="p-6 flex-grow">
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span>{{ formatDate(post.publishedAt, 'MMM d, yyyy') }}</span>
              <span class="mx-2">•</span>
              <span>{{ post.readTime || '5 min read' }}</span>
            </div>
            <h2 class="text-xl font-bold mb-3 hover:text-primary transition-colors">
              <router-link :to="`/blog/${post.slug}`">{{ post.title }}</router-link>
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {{ post.excerpt }}
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in post.tags" 
                :key="tag" 
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <div class="px-6 pb-6">
            <router-link :to="`/blog/${post.slug}`" class="text-primary hover:underline font-medium">Read More →</router-link>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="blogStore.pagination.totalPages > 1" class="flex justify-center items-center space-x-2 mt-16">
        <button 
          @click="changePage(blogStore.pagination.currentPage - 1)"
          :disabled="blogStore.pagination.currentPage <= 1"
          class="px-4 py-2 border rounded-lg transition"
          :class="blogStore.pagination.currentPage <= 1 
            ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary'"
        >
          Previous
        </button>
        
        <div class="flex items-center space-x-1">
          <button 
            v-for="page in paginationNumbers"
            :key="page"
            @click="changePage(page)"
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center transition',
              page === blogStore.pagination.currentPage 
                ? 'bg-primary text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="changePage(blogStore.pagination.currentPage + 1)"
          :disabled="blogStore.pagination.currentPage >= blogStore.pagination.totalPages"
          class="px-4 py-2 border rounded-lg transition"
          :class="blogStore.pagination.currentPage >= blogStore.pagination.totalPages 
            ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary'"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBlogStore } from '@store/index';
import { formatDate } from '@utils/dateHelpers';

// Initialize store
const blogStore = useBlogStore();
const currentPage = ref(1);

// Load blog posts when component mounts
onMounted(() => {
  loadBlogPosts();
});

// Load blog posts with current page
const loadBlogPosts = async () => {
  await blogStore.fetchPosts(currentPage.value);
};

// Handle page change
const changePage = (page) => {
  // Don't do anything if requesting an invalid page
  if (page < 1 || page > blogStore.pagination.totalPages) {
    return;
  }
  
  currentPage.value = page;
  loadBlogPosts();
};

// Calculate page numbers to show in pagination
const paginationNumbers = computed(() => {
  const total = blogStore.pagination.totalPages;
  const current = blogStore.pagination.currentPage;
  
  // If 5 or fewer pages, show all
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  // If current page is near start
  if (current <= 3) {
    return [1, 2, 3, 4, 5];
  }
  
  // If current page is near end
  if (current >= total - 2) {
    return [total - 4, total - 3, total - 2, total - 1, total];
  }
  
  // Otherwise show current and 2 in each direction
  return [current - 2, current - 1, current, current + 1, current + 2];
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>