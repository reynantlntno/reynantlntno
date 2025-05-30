<template>
  <AdminLayout title="Blog Posts">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <div class="relative rounded-md shadow-sm max-w-xs">
          <input 
            v-model="searchQuery" 
            type="text"
            placeholder="Search posts..."
            class="block w-full pr-10 border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <router-link to="/admin/blog/new">
        <BaseButton>
          <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </BaseButton>
      </router-link>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" text="Loading blog posts..." />
    </div>
    
    <div v-else-if="filteredPosts.length === 0" class="text-center py-12 bg-white dark:bg-dark rounded-lg">
      <p class="text-dark-muted dark:text-light-muted text-lg">
        No blog posts found. 
        <span v-if="searchQuery">Try a different search term.</span>
      </p>
    </div>
    
    <div v-else class="overflow-x-auto bg-white dark:bg-dark rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
            <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-dark divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="post in filteredPosts" :key="post._id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img v-if="post.coverImage" class="h-10 w-10 rounded-md object-cover" :src="post.coverImage" :alt="post.title" />
                  <div v-else class="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-dark dark:text-light">{{ post.title }}</div>
                  <div class="flex items-center space-x-2 mt-1">
                    <span v-for="(tag, idx) in limitTags(post.tags)" :key="idx" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted">
                      {{ tag }}
                    </span>
                    <span v-if="post.tags && post.tags.length > 2" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted">
                      +{{ post.tags.length - 2 }}
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-muted dark:text-light-muted">
              {{ post.author }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-muted dark:text-light-muted">
              {{ formatDate(post.publishedAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="post.published ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'">
                {{ post.published ? 'Published' : 'Draft' }}
              </span>
              <span v-if="post.featured" class="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800/30 dark:text-purple-300">
                Featured
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="inline-flex items-center rounded-md">
                <router-link :to="`/admin/blog/edit/${post._id}`" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-l-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Edit
                </router-link>
                <a :href="`/blog/${post.slug}`" target="_blank" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium text-white bg-primary-dark hover:bg-primary-dark/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  View
                </a>
                <button @click="confirmDelete(post)" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6">
      <nav class="inline-flex rounded-md shadow">
        <button 
          @click="currentPage > 1 && (currentPage--)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 text-dark-muted dark:text-light-muted hover:bg-light-muted dark:hover:bg-dark-muted disabled:opacity-50"
        >
          Previous
        </button>
        <span class="px-3 py-2 border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-dark text-dark dark:text-light font-medium">
          {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          @click="currentPage < totalPages && (currentPage++)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 text-dark-muted dark:text-light-muted hover:bg-light-muted dark:hover:bg-dark-muted disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Modal v-if="showDeleteModal" @close="showDeleteModal = false">
        <template #header>
          <h3 class="text-lg font-medium">Delete Blog Post</h3>
        </template>
        
        <template #default>
          <p class="text-dark-muted dark:text-light-muted">
            Are you sure you want to delete the blog post "{{ postToDelete?.title }}"? 
            This action cannot be undone.
          </p>
        </template>
        
        <template #footer>
          <div class="flex justify-end space-x-3">
            <BaseButton variant="ghost" @click="showDeleteModal = false">Cancel</BaseButton>
            <BaseButton 
              variant="danger" 
              :loading="isDeleting"
              @click="deletePost"
            >
              Delete Post
            </BaseButton>
          </div>
        </template>
      </Modal>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { formatDate } from '@/utils/formatters';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import AdminLayout from '@/components/Admin/AdminLayout.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import Modal from '@/components/shared/Modal.vue';

const toast = useToast();
const searchQuery = ref('');
const currentPage = ref(1);
const postsPerPage = 10;
const totalPosts = ref(0);
const posts = ref([]);
const isLoading = ref(true);
const showDeleteModal = ref(false);
const postToDelete = ref(null);
const isDeleting = ref(false);

// Computed properties
const totalPages = computed(() => Math.ceil(totalPosts.value / postsPerPage));

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value;
  
  const query = searchQuery.value.toLowerCase();
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.author.toLowerCase().includes(query) ||
    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
  );
});

// Methods
const fetchPosts = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/api/admin/blog/posts', {
      params: {
        page: currentPage.value,
        limit: postsPerPage
      }
    });
    
    posts.value = response.data.posts;
    totalPosts.value = response.data.pagination.total;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    toast.error('Failed to load blog posts. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const limitTags = (tags) => {
  if (!tags || !Array.isArray(tags)) return [];
  return tags.slice(0, 2);
};

const confirmDelete = (post) => {
  postToDelete.value = post;
  showDeleteModal.value = true;
};

const deletePost = async () => {
  if (!postToDelete.value) return;
  
  isDeleting.value = true;
  try {
    await axios.delete(`/api/admin/blog/posts/${postToDelete.value._id}`);
    
    // Remove post from list
    posts.value = posts.value.filter(post => post._id !== postToDelete.value._id);
    toast.success('Blog post deleted successfully');
    
    // Refetch if deleting the last item on a page
    if (posts.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
      await fetchPosts();
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    toast.error('Failed to delete blog post. Please try again.');
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
    postToDelete.value = null;
  }
};

// Watch for page changes
watch(currentPage, fetchPosts);

// Fetch posts on component mount
onMounted(fetchPosts);
</script>