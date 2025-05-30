import { defineStore } from 'pinia';
import api from '@utils/api';

// Blog store for managing blog posts
export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [],
    currentPost: null,
    isLoading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0
    }
  }),
  
  actions: {
    async fetchPosts(page = 1, limit = 6) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.getBlogPosts(page, limit);
        this.posts = response.data.posts;
        this.pagination = {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalPosts: response.data.totalPosts
        };
      } catch (error) {
        this.error = 'Failed to load blog posts. Please try again later.';
        console.error('Error fetching blog posts:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchPostBySlug(slug) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.getBlogPost(slug);
        this.currentPost = response.data;
      } catch (error) {
        this.error = 'Failed to load blog post. Please try again later.';
        console.error('Error fetching blog post:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});

// Appointment store for managing scheduling
export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    availableSlots: [],
    selectedDate: null,
    selectedTime: null,
    selectedService: null,
    services: [],
    isLoading: false,
    isLoadingServices: false,
    error: null,
    bookingStatus: null // 'success', 'error', or null
  }),
  
  actions: {
    async fetchServices() {
      this.isLoadingServices = true;
      this.error = null;
      
      try {
        const response = await api.getServices();
        this.services = response.data;
      } catch (error) {
        this.error = 'Failed to load services. Please try again later.';
        console.error('Error fetching services:', error);
      } finally {
        this.isLoadingServices = false;
      }
    },
    
    async fetchAvailableSlots(date) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.getAvailableSlots(date);
        this.availableSlots = response.data.slots;
        this.selectedDate = date;
      } catch (error) {
        this.error = 'Failed to load available appointment slots. Please try again later.';
        console.error('Error fetching appointment slots:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    selectTime(time) {
      this.selectedTime = time;
    },
    
    selectService(service) {
      this.selectedService = service;
    },
    
    async bookAppointment(appointmentData) {
      this.isLoading = true;
      this.error = null;
      this.bookingStatus = null;
      
      try {
        await api.scheduleAppointment({
          ...appointmentData,
          date: this.selectedDate,
          time: this.selectedTime,
          service: this.selectedService
        });
        
        this.bookingStatus = 'success';
        // Reset selection after successful booking
        this.selectedTime = null;
      } catch (error) {
        this.bookingStatus = 'error';
        this.error = error.response?.data?.error || 'Failed to book appointment. Please try again later.';
        console.error('Error booking appointment:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    resetBookingStatus() {
      this.bookingStatus = null;
      this.error = null;
    }
  }
});

// Projects store for managing projects
export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    featuredProjects: [],
    currentProject: null,
    isLoading: false,
    isLoadingFeatured: false,
    error: null
  }),
  
  actions: {
    async fetchProjects(category = '') {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.getProjects(category);
        this.projects = response.data;
      } catch (error) {
        this.error = 'Failed to load projects. Please try again later.';
        console.error('Error fetching projects:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchFeaturedProjects(limit = 3) {
      this.isLoadingFeatured = true;
      this.error = null;
      
      try {
        const response = await api.getFeaturedProjects(limit);
        this.featuredProjects = response.data;
      } catch (error) {
        this.error = 'Failed to load featured projects.';
        console.error('Error fetching featured projects:', error);
      } finally {
        this.isLoadingFeatured = false;
      }
    },
    
    async fetchProjectBySlug(slug) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await api.getProjectBySlug(slug);
        this.currentProject = response.data;
      } catch (error) {
        this.error = 'Failed to load project details.';
        console.error('Error fetching project:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});

// UI store for managing UI state
export const useUiStore = defineStore('ui', {
  state: () => ({
    isMobileMenuOpen: false,
    activeSection: 'home',
    scrollProgress: 0
  }),
  
  actions: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    
    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },
    
    setActiveSection(section) {
      this.activeSection = section;
    },
    
    updateScrollProgress(progress) {
      this.scrollProgress = progress;
    }
  }
});