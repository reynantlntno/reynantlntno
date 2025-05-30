import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast();
  const token = ref(localStorage.getItem('admin_token') || null);
  const user = ref(null);
  const loading = ref(false);
  
  const isAuthenticated = computed(() => !!token.value);
  
  const login = async (credentials) => {
    loading.value = true;
    try {
      const response = await axios.post('/api/admin/auth/login', credentials);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('admin_token', token.value);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      
      toast.success('Login successful');
      
      // Redirect to the intended page or dashboard
      const redirect = router.currentRoute.value.query.redirect || '/admin/dashboard';
      router.push(redirect);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('admin_token');
    delete axios.defaults.headers.common['Authorization'];
    
    toast.info('You have been logged out');
    router.push('/admin/login');
  };
  
  const checkAuth = async () => {
    if (!token.value) return false;
    
    loading.value = true;
    try {
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      
      // Verify token with backend
      const response = await axios.get('/api/admin/auth/verify');
      user.value = response.data.user;
      return true;
    } catch (error) {
      console.error('Auth verification error:', error);
      // If token is invalid, log out
      logout();
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Set the Authorization header initially if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
});