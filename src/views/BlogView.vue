<template>
  <div>
    <!-- Header Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            Insights, tutorials, and thoughts on web development, design, and technology.
          </p>
        </div>
      </div>
    </section>
    
    <!-- Blog Filter -->
    <section class="mb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center gap-2">
          <button 
            @click="selectedTag = 'All'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="selectedTag === 'All' ? 
              'bg-primary text-white' : 
              'bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted hover:bg-light hover:dark:bg-dark'"
          >
            All
          </button>
          <button 
            v-for="tag in uniqueTags" 
            :key="tag"
            @click="selectedTag = tag"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="selectedTag === tag ? 
              'bg-primary text-white' : 
              'bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted hover:bg-light hover:dark:bg-dark'"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </section>
    
    <!-- Blog Posts -->
    <section class="pb-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading blog posts..." />
        </div>
        
        <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
          <p class="text-dark-muted dark:text-light-muted text-lg">No blog posts found.</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard 
            v-for="post in filteredPosts" 
            :key="post._id" 
            :post="post"
          />
        </div>
        
        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="flex justify-center mt-10">
          <div class="flex space-x-1">
            <button
              v-for="page in pagination.pages"
              :key="page"
              @click="currentPage = page"
              class="px-4 py-2 rounded-md transition-colors"
              :class="currentPage === page ? 
                'bg-primary text-white' : 
                'bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted hover:bg-light hover:dark:bg-dark'"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useBlogStore } from '@/stores/blogStore';
import BlogCard from '@/components/Blog/BlogCard.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';

const blogStore = useBlogStore();
const selectedTag = ref('All');
const currentPage = ref(1);
const postsPerPage = 9;

// Computed properties
const isLoading = computed(() => blogStore.isLoading);
const posts = computed(() => blogStore.posts || []);

const uniqueTags = computed(() => {
  const tags = new Set();
  posts.value.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags);
});

const filteredPosts = computed(() => {
  let filtered = [...posts.value];
  
  if (selectedTag.value !== 'All') {
    filtered = filtered.filter(post => 
      post.tags && post.tags.includes(selectedTag.value)
    );
  }
  
  // Apply pagination
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return filtered.slice(start, end);
});

const pagination = computed(() => {
  let filteredCount = posts.value.length;
  
  if (selectedTag.value !== 'All') {
    filteredCount = posts.value.filter(post => 
      post.tags && post.tags.includes(selectedTag.value)
    ).length;
  }
  
  return {
    total: filteredCount,
    pages: Math.ceil(filteredCount / postsPerPage),
    currentPage: currentPage.value
  };
});

// Fetch blog posts on component mount
onMounted(async () => {
  if (!posts.value.length) {
    await blogStore.fetchPosts();
  }
});

// Reset to first page when tag changes
watch(selectedTag, () => {
  currentPage.value = 1;
});
</script>