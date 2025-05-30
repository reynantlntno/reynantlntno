<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">Get in Touch</h1>
      <div class="h-1 w-24 bg-primary mb-6"></div>
      
      <p class="text-lg mb-8 text-gray-600 dark:text-gray-300">
        Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible.
      </p>
      
      <div class="glass-panel p-6 md:p-8">
        <!-- Contact Form -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Name field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              :class="['w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20',
              {'border-red-500 dark:border-red-500': errors.name}]"
              placeholder="Your name"
              :disabled="isSubmitting"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
          </div>
          
          <!-- Email field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :class="['w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20',
              {'border-red-500 dark:border-red-500': errors.email}]"
              placeholder="your.email@example.com"
              :disabled="isSubmitting"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
          </div>
          
          <!-- Subject field -->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input
              id="subject"
              v-model="formData.subject"
              type="text"
              :class="['w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20',
              {'border-red-500 dark:border-red-500': errors.subject}]"
              placeholder="What's this about?"
              :disabled="isSubmitting"
            />
            <p v-if="errors.subject" class="mt-1 text-sm text-red-500">{{ errors.subject }}</p>
          </div>
          
          <!-- Message field -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="6"
              :class="['w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20',
              {'border-red-500 dark:border-red-500': errors.message}]"
              placeholder="Your message here..."
              :disabled="isSubmitting"
            ></textarea>
            <p v-if="errors.message" class="mt-1 text-sm text-red-500">{{ errors.message }}</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ messageCharsRemaining }} characters remaining</p>
          </div>
          
          <!-- Submit button -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="btn-primary flex items-center justify-center min-w-[120px]"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="inline-block mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isSubmitting ? 'Sending...' : 'Send Message' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Other Contact Information -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 flex flex-col items-center text-center">
          <div class="bg-primary/10 p-3 rounded-full mb-3">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2">Email</h3>
          <a href="mailto:contact@reynantlntno.dev" class="text-primary hover:underline">contact@reynantlntno.dev</a>
        </div>
        
        <div class="glass-panel p-6 flex flex-col items-center text-center">
          <div class="bg-primary/10 p-3 rounded-full mb-3">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2">Social</h3>
          <div class="flex space-x-3">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>
            </a>
          </div>
        </div>
        
        <div class="glass-panel p-6 flex flex-col items-center text-center">
          <div class="bg-primary/10 p-3 rounded-full mb-3">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2">Schedule a Meeting</h3>
          <router-link to="/appointments" class="text-primary hover:underline">Book an Appointment</router-link>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <transition name="fade">
      <div v-if="toast.show" 
        class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error',
          'bg-blue-500 text-white': toast.type === 'info',
          'bg-yellow-500 text-white': toast.type === 'warning'
        }"
      >
        <span v-if="toast.type === 'success'" class="mr-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </span>
        <span v-else-if="toast.type === 'error'" class="mr-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </span>
        <span>{{ toast.message }}</span>
        <button @click="hideToast" class="ml-3 text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from '@composables/useToast';
import { isValidEmail, isNotEmpty } from '@utils/validators';
import api from '@utils/api';

// Form data
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

// Form validation
const errors = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

// Submission state
const isSubmitting = ref(false);

// Toast notification system
const { toast, showToast, hideToast } = useToast();

// Message character counter
const MAX_MESSAGE_LENGTH = 5000;
const messageCharsRemaining = computed(() => {
  return MAX_MESSAGE_LENGTH - (formData.value.message?.length || 0);
});

// Form validation function
const validateForm = () => {
  let isValid = true;
  
  // Reset errors
  errors.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
  // Validate name
  if (!isNotEmpty(formData.value.name)) {
    errors.value.name = 'Please enter your name';
    isValid = false;
  }
  
  // Validate email
  if (!isNotEmpty(formData.value.email)) {
    errors.value.email = 'Please enter your email address';
    isValid = false;
  } else if (!isValidEmail(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Validate subject
  if (!isNotEmpty(formData.value.subject)) {
    errors.value.subject = 'Please enter a subject';
    isValid = false;
  }
  
  // Validate message
  if (!isNotEmpty(formData.value.message)) {
    errors.value.message = 'Please enter your message';
    isValid = false;
  } else if (formData.value.message.length > MAX_MESSAGE_LENGTH) {
    errors.value.message = `Message is too long (maximum ${MAX_MESSAGE_LENGTH} characters)`;
    isValid = false;
  }
  
  return isValid;
};

// Form submission handler
const submitForm = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  
  try {
    await api.sendContactMessage(formData.value);
    
    // Reset form
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
    showToast('Your message has been sent successfully! I will get back to you soon.', 'success');
  } catch (error) {
    console.error('Error sending contact form:', error);
    
    // Check for validation errors from API
    if (error.response?.data?.errors) {
      const apiErrors = error.response.data.errors;
      apiErrors.forEach(err => {
        if (err.includes('Name')) errors.value.name = err;
        if (err.includes('Email')) errors.value.email = err;
        if (err.includes('Subject')) errors.value.subject = err;
        if (err.includes('Message')) errors.value.message = err;
      });
      showToast('Please fix the errors in the form.', 'error');
    } else {
      showToast('Failed to send your message. Please try again later.', 'error');
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>