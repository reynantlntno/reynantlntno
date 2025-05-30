<template>
  <AdminLayout :title="isEditMode ? 'Edit Blog Post' : 'Create Blog Post'">
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" text="Loading blog post data..." />
    </div>
    
    <div v-else>
      <form @submit.prevent="savePost" class="space-y-6">
        <!-- Post Title -->
        <BaseInput
          v-model="formData.title"
          id="title"
          name="title"
          label="Post Title"
          placeholder="Enter a title for your blog post"
          required
          :error="errors.title"
        />
        
        <!-- Post Slug -->
        <BaseInput
          v-model="formData.slug"
          id="slug"
          name="slug"
          label="URL Slug"
          placeholder="post-url-slug"
          required
          :error="errors.slug"
        >
          <template #hint>
            <span class="flex items-center justify-between">
              <span>The URL-friendly version of the title.</span>
              <button 
                type="button" 
                @click="generateSlug" 
                class="text-xs text-primary dark:text-primary-light hover:underline"
              >
                Generate from title
              </button>
            </span>
          </template>
        </BaseInput>
        
        <!-- Author -->
        <BaseInput
          v-model="formData.author"
          id="author"
          name="author"
          label="Author"
          placeholder="Enter the author's name"
          required
          :error="errors.author"
        />
        
        <!-- Cover Image URL -->
        <BaseInput
          v-model="formData.coverImage"
          id="coverImage"
          name="coverImage"
          label="Cover Image URL"
          placeholder="https://example.com/image.jpg"
          :error="errors.coverImage"
        >
          <template #hint>
            URL to an image for the blog post header. Leave blank for no image.
          </template>
        </BaseInput>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Published Status -->
          <div>
            <label class="block text-sm font-medium text-dark dark:text-light mb-1">Publication Status</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  name="published" 
                  :value="true"
                  v-model="formData.published" 
                  class="form-radio text-primary focus:ring-primary"
                >
                <span class="ml-2">Published</span>
              </label>
              <label class="inline-flex items-center">
                <input 
                  type="radio" 
                  name="published" 
                  :value="false"
                  v-model="formData.published" 
                  class="form-radio text-primary focus:ring-primary"
                >
                <span class="ml-2">Draft</span>
              </label>
            </div>
          </div>
          
          <!-- Featured Status -->
          <div>
            <label class="block text-sm font-medium text-dark dark:text-light mb-1">Featured Post</label>
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                v-model="formData.featured" 
                class="form-checkbox rounded text-primary focus:ring-primary"
              >
              <span class="ml-2">Feature this post on the homepage</span>
            </label>
          </div>
        </div>
        
        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-medium text-dark dark:text-light mb-1">Tags</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span 
              v-for="(tag, index) in formData.tags" 
              :key="index"
              class="px-3 py-1 bg-light-muted dark:bg-dark-muted rounded-full text-sm flex items-center"
            >
              {{ tag }}
              <button 
                type="button" 
                @click="removeTag(index)" 
                class="ml-1 text-dark-muted dark:text-light-muted hover:text-red-500"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
          <div class="flex">
            <input 
              v-model="tagInput"
              type="text"
              class="flex-1 border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-l-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
              placeholder="Add a tag and press Enter"
              @keydown.enter.prevent="addTag"
            />
            <button 
              type="button" 
              @click="addTag" 
              class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-r-md"
            >
              Add
            </button>
          </div>
          <p v-if="errors.tags" class="mt-1 text-sm text-red-500">{{ errors.tags }}</p>
        </div>
        
        <!-- Excerpt -->
        <BaseInput
          v-model="formData.excerpt"
          id="excerpt"
          name="excerpt"
          type="textarea"
          label="Excerpt"
          placeholder="Brief summary of the blog post"
          required
          :error="errors.excerpt"
          rows="3"
        >
          <template #hint>
            A short summary that appears on blog listing pages. Keep it concise.
          </template>
        </BaseInput>
        
        <!-- Content (Markdown) -->
        <div>
          <label for="content" class="block text-sm font-medium text-dark dark:text-light mb-1">
            Content <span class="text-red-500">*</span>
          </label>
          <div class="mb-1">
            <div class="flex justify-between items-center">
              <span class="text-xs text-dark-muted dark:text-light-muted">Markdown supported</span>
              <div class="flex gap-2">
                <button 
                  type="button" 
                  @click="previewMode = !previewMode" 
                  class="text-xs text-primary dark:text-primary-light hover:underline"
                >
                  {{ previewMode ? "Edit" : "Preview" }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Markdown Editor -->
          <textarea 
            v-if="!previewMode"
            v-model="formData.content"
            id="content"
            name="content"
            class="w-full min-h-[400px] border-gray-300 dark:border-gray-700 dark:bg-dark-muted dark:text-light rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 font-mono text-sm"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errors.content }"
            placeholder="Write your blog post content here using markdown..."
            required
          ></textarea>
          
          <!-- Markdown Preview -->
          <div 
            v-if="previewMode"
            class="w-full min-h-[400px] border border-gray-300 dark:border-gray-700 rounded-md shadow-sm p-4 overflow-auto"
          >
            <article class="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary dark:prose-a:text-primary-light prose-img:rounded-lg">
              <div v-html="markdownPreview"></div>
            </article>
            
            <p v-if="!formData.content.trim()" class="text-dark-muted dark:text-light-muted italic">
              Preview will appear here. Enter some content to see the preview.
            </p>
          </div>
          
          <p v-if="errors.content" class="mt-1 text-sm text-red-500">{{ errors.content }}</p>
        </div>
        
        <!-- Form Actions -->
        <div class="flex justify-between pt-6">
          <BaseButton 
            type="button" 
            variant="outline" 
            @click="cancelEdit"
          >
            Cancel
          </BaseButton>
          <div class="flex gap-3">
            <BaseButton 
              v-if="isEditMode"
              type="button" 
              variant="secondary"
              @click="previewPost"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </BaseButton>
            <BaseButton 
              type="submit" 
              :loading="isSaving"
            >
              {{ isEditMode ? 'Update Post' : 'Create Post' }}
            </BaseButton>
          </div>
        </div>
      </form>
    </div>
    
    <!-- Unsaved Changes Warning Dialog -->
    <Teleport to="body">
      <Modal v-if="showUnsavedWarning" @close="closeUnsavedWarning(false)">
        <template #header>
          <h3 class="text-lg font-medium">Unsaved Changes</h3>
        </template>
        
        <template #default>
          <p class="text-dark-muted dark:text-light-muted">
            You have unsaved changes that will be lost if you leave this page. 
            Do you want to continue?
          </p>
        </template>
        
        <template #footer>
          <div class="flex justify-end space-x-3">
            <BaseButton variant="outline" @click="closeUnsavedWarning(false)">
              Stay on Page
            </BaseButton>
            <BaseButton variant="danger" @click="closeUnsavedWarning(true)">
              Discard Changes
            </BaseButton>
          </div>
        </template>
      </Modal>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { formatSlug } from '@/utils/formatters';
import axios from 'axios';
import AdminLayout from '@/components/Admin/AdminLayout.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import Modal from '@/components/shared/Modal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// State variables
const isLoading = ref(false);
const isSaving = ref(false);
const errors = ref({});
const originalFormData = ref({});
const formData = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  author: 'Reynan Tolentino', // Default author
  coverImage: '',
  tags: [],
  published: true,
  featured: false
});
const tagInput = ref('');
const previewMode = ref(false);
const showUnsavedWarning = ref(false);
const pendingNavigation = ref(null);

// Computed properties
const isEditMode = computed(() => !!route.params.id);

const hasUnsavedChanges = computed(() => {
  if (!originalFormData.value || !Object.keys(originalFormData.value).length) {
    return false;
  }
  
  // Compare current form data with original data
  return JSON.stringify(formData.value) !== JSON.stringify(originalFormData.value);
});

// Simple markdown to HTML converter (in a real app, you'd use a proper library like marked)
const markdownPreview = computed(() => {
  if (!formData.value.content) return '';
  
  let html = formData.value.content
    // Headers
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Paragraphs
    .replace(/^\s*(\n)?(.+)/gim, function(m) {
      return /\<(\/)?(h|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>'+m+'</p>';
    })
    // Line breaks
    .replace(/\n/gim, '<br>');
    
  return html;
});

// Methods
const generateSlug = () => {
  if (!formData.value.title) {
    toast.warning('Please enter a title first');
    return;
  }
  formData.value.slug = formatSlug(formData.value.title);
};

const addTag = () => {
  const tag = tagInput.value.trim();
  if (!tag) return;
  
  // Don't add duplicate tags
  if (!formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag);
  }
  tagInput.value = '';
};

const removeTag = (index) => {
  formData.value.tags.splice(index, 1);
};

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.value.title) {
    newErrors.title = 'Title is required';
  }
  
  if (!formData.value.slug) {
    newErrors.slug = 'Slug is required';
  } else if (!/^[a-z0-9-]+$/.test(formData.value.slug)) {
    newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
  }
  
  if (!formData.value.excerpt) {
    newErrors.excerpt = 'Excerpt is required';
  }
  
  if (!formData.value.content) {
    newErrors.content = 'Content is required';
  }
  
  if (!formData.value.author) {
    newErrors.author = 'Author is required';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const savePost = async () => {
  if (!validateForm()) {
    toast.error('Please fix the errors in the form');
    return;
  }
  
  isSaving.value = true;
  
  try {
    const postData = { ...formData.value };
    
    // Add/update timestamp
    if (!isEditMode.value) {
      postData.publishedAt = new Date().toISOString();
    } else {
      postData.updatedAt = new Date().toISOString();
    }
    
    let response;
    if (isEditMode.value) {
      response = await axios.put(`/api/admin/blog/posts/${route.params.id}`, postData);
      toast.success('Blog post updated successfully');
    } else {
      response = await axios.post('/api/admin/blog/posts', postData);
      toast.success('Blog post created successfully');
    }
    
    // Update original data to match current state
    originalFormData.value = JSON.parse(JSON.stringify(formData.value));
    
    // Redirect to post list or view the post
    router.push('/admin/blog');
  } catch (error) {
    console.error('Error saving blog post:', error);
    let errorMessage = 'Failed to save blog post. Please try again.';
    
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
      
      // Handle duplicate slug error
      if (error.response.status === 409) {
        errors.value.slug = 'This slug is already in use. Please choose another one.';
      }
    }
    
    toast.error(errorMessage);
  } finally {
    isSaving.value = false;
  }
};

const cancelEdit = () => {
  if (hasUnsavedChanges.value) {
    showUnsavedWarning.value = true;
  } else {
    router.push('/admin/blog');
  }
};

const closeUnsavedWarning = (shouldProceed) => {
  showUnsavedWarning.value = false;
  
  if (shouldProceed) {
    router.push('/admin/blog');
  }
};

const previewPost = () => {
  if (isEditMode.value) {
    window.open(`/blog/${formData.value.slug}`, '_blank');
  }
};

const fetchPost = async () => {
  isLoading.value = true;
  
  try {
    const response = await axios.get(`/api/admin/blog/posts/${route.params.id}`);
    const post = response.data.post;
    
    // Populate form fields
    formData.value = {
      title: post.title || '',
      slug: post.slug || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      author: post.author || 'Reynan Tolentino',
      coverImage: post.coverImage || '',
      tags: post.tags || [],
      published: post.published !== undefined ? post.published : true,
      featured: post.featured || false
    };
    
    // Store original data for change detection
    originalFormData.value = JSON.parse(JSON.stringify(formData.value));
  } catch (error) {
    console.error('Error fetching blog post:', error);
    toast.error('Failed to load blog post. Please try again.');
    router.push('/admin/blog');
  } finally {
    isLoading.value = false;
  }
};

// Navigation guard for unsaved changes
const handleBeforeUnload = (event) => {
  if (hasUnsavedChanges.value) {
    event.preventDefault();
    event.returnValue = '';
  }
};

// Initial setup
onMounted(async () => {
  // If we're in edit mode, fetch the post
  if (isEditMode.value) {
    await fetchPost();
  } else {
    // For new posts, start with a clean slate
    originalFormData.value = JSON.parse(JSON.stringify(formData.value));
  }
  
  // Add beforeunload event listener to warn about unsaved changes
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// Navigation guard using Vue Router
const unregisterRouterGuard = router.beforeEach((to, from, next) => {
  if (hasUnsavedChanges.value && to.path !== from.path) {
    showUnsavedWarning.value = true;
    pendingNavigation.value = { to, from, next };
    next(false);
  } else {
    next();
  }
});
</script>

<style>
/* Add Tailwind typography styles for markdown preview */
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