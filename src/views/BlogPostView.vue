<template>
  <div>
    <div v-if="isLoading" class="flex justify-center py-16">
      <LoadingSpinner size="lg" text="Loading article..." />
    </div>
    
    <div v-else-if="error" class="py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-bold mb-4">Article Not Found</h1>
        <p class="text-dark-muted dark:text-light-muted mb-6">
          Sorry, the blog post you are looking for does not exist or has been removed.
        </p>
        <router-link to="/blog">
          <BaseButton>Back to Blog</BaseButton>
        </router-link>
      </div>
    </div>
    
    <div v-else-if="post" class="py-16">
      <!-- Article Header -->
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-sm text-dark-muted dark:text-light-muted">
            {{ formatDate(post.publishedAt) }}
          </span>
          <span v-if="post.tags && post.tags.length" class="inline-flex gap-2">
            <span
              v-for="(tag, index) in post.tags"
              :key="index"
              class="px-2 py-0.5 text-xs font-medium bg-light-muted dark:bg-dark-muted rounded-full"
            >
              {{ tag }}
            </span>
          </span>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold mb-6">{{ post.title }}</h1>
        
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary dark:text-primary-light">
              {{ post.author.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ post.author }}</p>
          </div>
        </div>
      </div>
      
      <!-- Cover Image -->
      <div v-if="post.coverImage" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      
      <!-- Article Content -->
      <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary dark:prose-a:text-primary-light prose-img:rounded-lg prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 mb-10">
        <div v-html="post.content"></div>
      </article>
      
      <!-- Related Posts -->
      <div v-if="relatedPosts && relatedPosts.length" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 class="text-2xl font-bold mb-6">Related Articles</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BlogCard 
            v-for="post in relatedPosts" 
            :key="post._id" 
            :post="post"
          />
        </div>
      </div>
    </div>
    
    <!-- Back to Blog -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex">
      <router-link to="/blog" class="flex items-center text-primary dark:text-primary-light">
        <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to all articles
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useBlogStore } from '@/stores/blogStore';
import { formatDate } from '@/utils/formatters';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import BlogCard from '@/components/Blog/BlogCard.vue';

const route = useRoute();
const blogStore = useBlogStore();

const post = computed(() => blogStore.currentPost);
const isLoading = computed(() => blogStore.isLoading);
const error = computed(() => blogStore.error);
const relatedPosts = ref([]);

const fetchCurrentPost = async () => {
  const result = await blogStore.fetchPostBySlug(route.params.slug);
  if (result && result.relatedPosts) {
    relatedPosts.value = result.relatedPosts;
  }
};

onMounted(fetchCurrentPost);

// Re-fetch post when the slug changes
watch(() => route.params.slug, fetchCurrentPost);
</script>

<style>
/* Add Tailwind typography styles to support markdown content */
@tailwind components;

@layer components {
  .prose img {
    @apply mx-auto my-8;
  }
  
  .prose pre {
    @apply p-4 rounded-lg overflow-x-auto;
  }
  
  .prose code {
    @apply bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm;
  }
  
  .prose blockquote {
    @apply border-l-4 border-primary/50 pl-4 italic;
  }
}
</style>