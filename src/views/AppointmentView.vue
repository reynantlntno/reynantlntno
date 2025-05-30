<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">Schedule an Appointment</h1>
      <div class="h-1 w-24 bg-primary mb-6"></div>
      
      <p class="text-lg mb-8 text-gray-600 dark:text-gray-300">
        Book a consultation or project discussion. Please select an available date and time slot below.
      </p>
      
      <div v-if="appointmentStore.bookingStatus === 'success'" class="glass-panel p-8 text-center mb-8">
        <div class="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2">Appointment Booked!</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for scheduling an appointment. I'll be in touch shortly with confirmation details.
        </p>
        <button @click="appointmentStore.resetBookingStatus" class="btn-primary">
          Schedule Another
        </button>
      </div>
      
      <div v-else class="glass-panel p-6 md:p-8">
        <!-- Step 1: Service Selection -->
        <div v-if="currentStep === 1">
          <h2 class="text-2xl font-semibold mb-4">Select Service Type</h2>
          
          <!-- Loading state for services -->
          <div v-if="appointmentStore.isLoadingServices" class="my-8 space-y-4">
            <div v-for="i in 2" :key="i" class="animate-pulse">
              <div class="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
            </div>
          </div>
          
          <!-- Error state -->
          <div v-else-if="appointmentStore.error" class="glass-panel p-6 text-center my-8">
            <h3 class="text-xl text-red-500 mb-2">Failed to load services</h3>
            <p class="mb-4">{{ appointmentStore.error }}</p>
            <button @click="appointmentStore.fetchServices()" class="btn-primary">Try Again</button>
          </div>
          
          <!-- Services list -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div 
              v-for="service in appointmentStore.services" 
              :key="service.id"
              class="border rounded-lg p-4 cursor-pointer transition"
              :class="[
                selectedService && selectedService.id === service.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary'
              ]"
              @click="selectService(service)"
            >
              <h3 class="font-medium text-lg mb-1">{{ service.name }}</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ service.description }}</p>
              <div class="flex justify-between text-sm">
                <span class="text-primary font-medium">{{ service.price }}</span>
                <span class="text-gray-500 dark:text-gray-400">{{ service.duration }} minutes</span>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="goToNextStep"
              class="btn-primary"
              :disabled="!selectedService"
            >
              Continue
            </button>
          </div>
        </div>
        
        <!-- Step 2: Date & Time Selection -->
        <div v-else-if="currentStep === 2">
          <div class="flex items-center justify-between mb-6">
            <button @click="goToPrevStep" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </button>
            <h2 class="text-2xl font-semibold">Select Date & Time</h2>
            <div></div>
          </div>
          
          <!-- Date Selection -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-3">Select Date</h3>
            <div class="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
              <button 
                v-for="date in availableDates" 
                :key="formatDate(date)"
                @click="selectDate(date)"
                class="px-4 py-3 border rounded-lg whitespace-nowrap transition min-w-[100px]"
                :class="[
                  selectedDate === formatDate(date) 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                ]"
              >
                <div class="text-sm">{{ format(date, 'E') }}</div>
                <div class="font-medium">{{ format(date, 'd') }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ format(date, 'MMM') }}</div>
              </button>
            </div>
          </div>
          
          <!-- Time Selection -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium">Select Time</h3>
              <div class="text-sm">
                <span class="text-primary">{{ selectedDate ? formatReadableDate(selectedDate) : '' }}</span>
              </div>
            </div>
            
            <div v-if="appointmentStore.error" class="text-center p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-lg mb-4">
              {{ appointmentStore.error }}
            </div>
            
            <div v-else-if="appointmentStore.availableSlots.length === 0 && !appointmentStore.isLoading && selectedDate" class="text-center p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg mb-4">
              No available time slots for this date. Please select another date.
            </div>
            
            <div v-else-if="selectedDate" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <button 
                v-for="slot in appointmentStore.availableSlots" 
                :key="slot.time"
                @click="selectTimeSlot(slot.time)"
                class="py-2 px-4 border rounded-lg text-center transition"
                :class="[
                  selectedTime === slot.time
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                ]"
                :disabled="!slot.available"
              >
                {{ slot.time }}
              </button>
            </div>
            
            <div v-else class="text-center p-4 text-gray-500 dark:text-gray-400">
              <p>Please select a date to see available time slots</p>
            </div>
            
            <div v-if="appointmentStore.isLoading" class="flex items-center text-gray-600 dark:text-gray-400">
              <svg class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm">Loading available slots...</span>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button 
              @click="goToNextStep"
              class="btn-primary"
              :disabled="!selectedTime || !selectedDate"
            >
              Continue
            </button>
          </div>
        </div>
        
        <!-- Step 3: Contact Information -->
        <div v-else-if="currentStep === 3">
          <div class="flex items-center justify-between mb-6">
            <button @click="goToPrevStep" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back
            </button>
            <h2 class="text-2xl font-semibold">Your Information</h2>
            <div></div>
          </div>
          
          <div class="mb-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
              <h3 class="font-medium mb-2">Appointment Summary</h3>
              <div class="grid grid-cols-2 text-sm gap-2">
                <div class="text-gray-600 dark:text-gray-400">Service:</div>
                <div>{{ selectedService?.name }}</div>
                <div class="text-gray-600 dark:text-gray-400">Date:</div>
                <div>{{ formatReadableDate(selectedDate) }}</div>
                <div class="text-gray-600 dark:text-gray-400">Time:</div>
                <div>{{ selectedTime }}</div>
                <div class="text-gray-600 dark:text-gray-400">Duration:</div>
                <div>{{ selectedService?.duration }}</div>
              </div>
            </div>
          </div>
          
          <form @submit.prevent="submitAppointment" class="space-y-4">
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
                :disabled="appointmentStore.isLoading"
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
                :disabled="appointmentStore.isLoading"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>
            
            <!-- Phone field -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number (Optional)</label>
              <input
                id="phone"
                v-model="formData.phone"
                type="text"
                :class="['w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20',
                {'border-red-500 dark:border-red-500': errors.phone}]"
                placeholder="(123) 456-7890"
                :disabled="appointmentStore.isLoading"
              />
              <p v-if="errors.phone" class="mt-1 text-sm text-red-500">{{ errors.phone }}</p>
            </div>
            
            <!-- Message field -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes (Optional)</label>
              <textarea
                id="message"
                v-model="formData.message"
                rows="4"
                :class="['w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-4 py-3 focus:border-primary focus:ring focus:ring-primary/20',
                {'border-red-500 dark:border-red-500': errors.message}]"
                placeholder="Any specific topics or questions you'd like to discuss..."
                :disabled="appointmentStore.isLoading"
              ></textarea>
              <p v-if="errors.message" class="mt-1 text-sm text-red-500">{{ errors.message }}</p>
            </div>
            
            <!-- Submit button -->
            <div class="flex justify-end pt-4">
              <button
                type="submit"
                class="btn-primary flex items-center justify-center min-w-[180px]"
                :disabled="appointmentStore.isLoading"
              >
                <span v-if="appointmentStore.isLoading" class="inline-block mr-2">
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ appointmentStore.isLoading ? 'Booking...' : 'Book Appointment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Information Section -->
      <div class="mt-12">
        <h2 class="text-xl font-bold mb-6">What to Expect</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="glass-panel p-6">
            <div class="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">Scheduling</h3>
            <p class="text-gray-600 dark:text-gray-400">
              After booking, you'll receive an email confirmation with details and calendar invitation.
            </p>
          </div>
          
          <div class="glass-panel p-6">
            <div class="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">Meeting</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Meetings are held via Zoom or Google Meet. The link will be provided in your confirmation email.
            </p>
          </div>
          
          <div class="glass-panel p-6">
            <div class="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium mb-2">Follow-up</h3>
            <p class="text-gray-600 dark:text-gray-400">
              After our meeting, I'll send a summary email with discussed points and next steps.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast notification -->
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
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppointmentStore } from '@store/index';
import { useToast } from '@composables/useToast';
import { formatDate, getNextNDays, getReadableDate } from '@utils/dateHelpers';
import { isValidEmail, isValidPhone, isNotEmpty } from '@utils/validators';
import { format } from 'date-fns';

// Initialize stores and composables
const appointmentStore = useAppointmentStore();
const { toast, showToast, hideToast } = useToast();

// Fetch services when component mounts
onMounted(() => {
  appointmentStore.fetchServices();
});

// Step management
const currentStep = ref(1);
const goToNextStep = () => {
  if (currentStep.value === 1 && !selectedService.value) {
    showToast('Please select a service', 'error');
    return;
  }
  
  if (currentStep.value === 2 && (!selectedDate.value || !selectedTime.value)) {
    showToast('Please select both date and time', 'error');
    return;
  }
  
  currentStep.value++;
};

const goToPrevStep = () => {
  currentStep.value--;
};

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

// Form validation
const errors = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
});

// Services data
const services = ref([
  {
    id: 1,
    name: 'Project Consultation',
    description: 'Discuss your project needs, technologies, and get expert advice.',
    duration: '30 minutes',
    price: 'Free'
  },
  {
    id: 2,
    name: 'Code Review Session',
    description: 'Get feedback on your code structure, performance, and best practices.',
    duration: '45 minutes',
    price: '$75'
  },
  {
    id: 3,
    name: 'Website Audit',
    description: 'Comprehensive review of your website for performance, SEO, and UX improvements.',
    duration: '60 minutes',
    price: '$120'
  },
  {
    id: 4,
    name: 'Custom Development Planning',
    description: 'Plan your custom development project with technical specifications and roadmap.',
    duration: '60 minutes',
    price: '$150'
  }
]);

// Selected values
const selectedService = ref(null);
const selectedDate = ref(null);
const selectedTime = ref(null);

// Available dates (next 14 days)
const availableDates = ref(getNextNDays(14));

// Select service
const selectService = (service) => {
  selectedService.value = service;
  appointmentStore.selectService(service.name);
};

// Format date for display
const formatReadableDate = (date) => {
  if (!date) return '';
  
  return getReadableDate(date);
};

// Select date and fetch available slots
const selectDate = (date) => {
  const formattedDate = formatDate(date);
  selectedDate.value = formattedDate;
  selectedTime.value = null; // Reset time when date changes
  fetchAvailableSlotsForDate();
};

// Fetch available slots
const fetchAvailableSlotsForDate = () => {
  if (selectedDate.value) {
    appointmentStore.fetchAvailableSlots(selectedDate.value);
  }
};

// Select time
const selectTimeSlot = (time) => {
  selectedTime.value = time;
  appointmentStore.selectTime(time);
};

// Form validation
const validateForm = () => {
  let isValid = true;
  errors.value = { name: '', email: '', phone: '', message: '' };
  
  if (!isNotEmpty(formData.value.name)) {
    errors.value.name = 'Name is required';
    isValid = false;
  }
  
  if (!isNotEmpty(formData.value.email)) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!isValidEmail(formData.value.email)) {
    errors.value.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  if (formData.value.phone && !isValidPhone(formData.value.phone)) {
    errors.value.phone = 'Please enter a valid phone number';
    isValid = false;
  }
  
  return isValid;
};

// Submit appointment
const submitAppointment = async () => {
  if (!validateForm()) return;
  
  try {
    await appointmentStore.bookAppointment({
      ...formData.value,
      date: selectedDate.value,
      time: selectedTime.value,
      service: selectedService.value.name
    });
    
    if (appointmentStore.error) {
      showToast(appointmentStore.error, 'error');
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    showToast('Failed to book appointment. Please try again later.', 'error');
  }
};

// Watch for booking status changes
watch(() => appointmentStore.bookingStatus, (newStatus) => {
  if (newStatus === 'error' && appointmentStore.error) {
    showToast(appointmentStore.error, 'error');
  }
});
</script>

<style>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>