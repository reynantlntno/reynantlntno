import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle different error scenarios
    if (!response) {
      console.error('Network error or server is not responding');
      return Promise.reject(new Error('Network error or server is not responding. Please check your internet connection.'));
    }
    
    // Log errors but don't expose internals to users
    console.error(`API Error: ${response.status} - ${response.statusText}`, response.data);
    
    // Return a cleaned-up error for the frontend
    return Promise.reject({
      status: response.status,
      message: response.data?.message || response.statusText || 'An unexpected error occurred',
      data: response.data,
    });
  }
);

// Helper functions
const apiClient = {
  // Appointment API
  appointments: {
    getAvailability: (date) => api.get('/appointment/get', { params: { date } }),
    createAppointment: (data) => api.post('/appointment/create', data),
    updateAppointment: (id, data) => api.put(`/appointment/update?id=${id}`, data),
  },
  
  // Blog API
  blog: {
    getPosts: () => api.get('/blog/getPosts'),
    getPost: (slug) => api.get('/blog/getPost', { params: { slug } }),
  },
  
  // Contact API
  contact: {
    submitForm: (data) => api.post('/contact/submit', data),
  },
};

export default apiClient;