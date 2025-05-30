import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';

export const useBlogStore = defineStore('blog', () => {
  const toast = useToast();
  
  const posts = ref([]);
  const currentPost = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Get all blog posts
  const fetchPosts = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('/api/blog/getPosts');
      posts.value = response.data.posts;
    } catch (err) {
      error.value = 'Failed to load blog posts';
      toast.error('Failed to load blog posts. Please try again later.');
      console.error('Error fetching blog posts:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  // Get a single blog post by slug
  const fetchPostBySlug = async (slug) => {
    isLoading.value = true;
    error.value = null;
    currentPost.value = null;
    
    try {
      const response = await axios.get(`/api/blog/getPost?slug=${slug}`);
      currentPost.value = response.data.post;
      return response.data.post;
    } catch (err) {
      error.value = 'Failed to load blog post';
      toast.error('Failed to load the blog post. It may have been removed or does not exist.');
      console.error('Error fetching blog post:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  const featuredPosts = computed(() => {
    return posts.value.filter(post => post.featured).slice(0, 3);
  });
  
  return {
    posts,
    currentPost,
    isLoading,
    error,
    fetchPosts,
    fetchPostBySlug,
    featuredPosts
  };
});