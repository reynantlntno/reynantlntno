import axios from 'axios';

// Define API URL based on environment
const API_BASE_URL = 
  import.meta.env.MODE === 'development'
    ? '/api' // This will be proxied in development
    : 'https://mabinianelamp.net/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.API_KEY
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('API No Response:', error.request);
    } else {
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default {
  // Contact form
  async sendContactMessage(data) {
    return instance.post('/contact', data);
  },

  // Appointments
  async getAvailableSlots(date) {
    return instance.get(`/appointments?date=${date}`);
  },

  async getServices() {
    return instance.get('/services');
  },

  async scheduleAppointment(appointmentData) {
    return instance.post('/appointments', appointmentData);
  },

  // Blog
  async getBlogPosts(page = 1, limit = 10) {
    return instance.get(`/blog?page=${page}&limit=${limit}`);
  },

  async getBlogPost(slug) {
    return instance.get(`/blog/${slug}`);
  },
  
  // Projects
  async getProjects(category = '') {
    const params = category ? `?category=${category}` : '';
    return instance.get(`/projects${params}`);
  },
  
  async getFeaturedProjects(limit = 3) {
    return instance.get(`/projects/featured?limit=${limit}`);
  },
  
  async getProjectBySlug(slug) {
    return instance.get(`/projects/${slug}`);
  }
};