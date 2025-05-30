<template>
  <div>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Step indicator -->
      <div class="flex justify-center mb-6">
        <div class="flex items-center">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="[
              currentStep >= 1 ? 'bg-primary text-white' : 'bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted'
            ]"
          >
            1
          </div>
          <div class="w-12 h-1" :class="currentStep >= 2 ? 'bg-primary' : 'bg-light-muted dark:bg-dark-muted'"></div>
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="[
              currentStep >= 2 ? 'bg-primary text-white' : 'bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted'
            ]"
          >
            2
          </div>
          <div class="w-12 h-1" :class="currentStep >= 3 ? 'bg-primary' : 'bg-light-muted dark:bg-dark-muted'"></div>
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
            :class="[
              currentStep >= 3 ? 'bg-primary text-white' : 'bg-light-muted dark:bg-dark-muted text-dark-muted dark:text-light-muted'
            ]"
          >
            3
          </div>
        </div>
      </div>
      
      <!-- Step 1: Select Date -->
      <div v-if="currentStep === 1">
        <h3 class="text-lg font-medium mb-4">Select a Date</h3>
        
        <div v-if="loadingDates" class="flex justify-center py-4">
          <LoadingSpinner size="md" text="Loading calendar..." />
        </div>
        <div v-else>
          <div class="mb-4">
            <AppointmentCalendar 
              :availableDates="availableDates"
              @date-selected="handleDateSelected" 
            />
          </div>
          
          <div class="flex items-center justify-end mt-6">
            <BaseButton 
              :disabled="!selectedDate"
              @click="goToStep(2)"
            >
              Continue to Time Selection
            </BaseButton>
          </div>
        </div>
      </div>
      
      <!-- Step 2: Select Time -->
      <div v-if="currentStep === 2">
        <h3 class="text-lg font-medium mb-4">Select a Time</h3>
        
        <div v-if="loadingTimeSlots" class="flex justify-center py-4">
          <LoadingSpinner size="md" text="Loading available times..." />
        </div>
        <div v-else>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <button
              v-for="slot in availableTimeSlots"
              :key="slot.time"
              type="button"
              class="p-3 rounded-md text-center"
              :class="[
                selectedTimeSlot === slot.time ? 
                  'bg-primary text-white' : 
                  'bg-light-muted dark:bg-dark-muted hover:bg-light hover:dark:bg-dark'
              ]"
              :disabled="slot.status !== 'available'"
              @click="selectedTimeSlot = slot.time"
            >
              {{ formatTime(slot.time) }}
            </button>
          </div>
          
          <div class="flex items-center justify-between mt-6">
            <BaseButton variant="outline" @click="goToStep(1)">
              Back
            </BaseButton>
            <BaseButton 
              :disabled="!selectedTimeSlot"
              @click="goToStep(3)"
            >
              Continue to Details
            </BaseButton>
          </div>
        </div>
      </div>
      
      <!-- Step 3: Personal Details -->
      <div v-if="currentStep === 3">
        <h3 class="text-lg font-medium mb-4">Your Details</h3>
        
        <div class="space-y-4">
          <BaseInput
            v-model="formData.name"
            id="name"
            name="name"
            label="Name"
            placeholder="Enter your name"
            required
            :error="errors.name"
          />
          
          <BaseInput
            v-model="formData.email"
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
            :error="errors.email"
          />
          
          <BaseInput
            v-model="formData.phone"
            id="phone"
            name="phone"
            label="Phone (optional)"
            placeholder="Enter your phone number"
            :error="errors.phone"
          />
          
          <BaseInput
            v-model="formData.purpose"
            id="purpose"
            name="purpose"
            label="Purpose"
            placeholder="What would you like to discuss?"
            required
            :error="errors.purpose"
          />
          
          <BaseInput
            v-model="formData.notes"
            id="notes"
            name="notes"
            type="textarea"
            label="Additional Notes (optional)"
            placeholder="Any additional details you'd like to share"
            :error="errors.notes"
          />
        </div>
        
        <div class="flex items-center justify-between mt-8">
          <BaseButton variant="outline" @click="goToStep(2)">
            Back
          </BaseButton>
          <BaseButton 
            type="submit"
            :loading="isSubmitting"
          >
            Book Appointment
          </BaseButton>
        </div>
      </div>
    </form>
    
    <!-- Booking Summary -->
    <div v-if="currentStep > 1" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-medium text-dark dark:text-light mb-2">Booking Summary</h4>
      <p class="text-sm text-dark-muted dark:text-light-muted">
        <span v-if="selectedDate">Date: {{ formatDate(selectedDate, 'EEEE, MMMM d, yyyy') }}</span>
        <span v-if="selectedTimeSlot"> | Time: {{ formatTime(selectedTimeSlot) }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { validateAppointmentForm } from '@/utils/validations';
import { formatDate, formatTime } from '@/utils/formatters';
import { useToast } from 'vue-toastification';
import BaseInput from '@/components/shared/BaseInput.vue';
import BaseButton from '@/components/shared/BaseButton.vue';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import AppointmentCalendar from './AppointmentCalendar.vue';

const emit = defineEmits(['appointment-booked']);
const toast = useToast();
const appointmentStore = useAppointmentStore();

// Form state
const currentStep = ref(1);
const selectedDate = ref(null);
const selectedTimeSlot = ref(null);
const loadingDates = ref(false);
const loadingTimeSlots = ref(false);
const isSubmitting = ref(false);
const errors = ref({});

const formData = ref({
  name: '',
  email: '',
  phone: '',
  purpose: '',
  notes: ''
});

// Computed properties
const availableDates = computed(() => appointmentStore.availableDates);
const availableTimeSlots = computed(() => appointmentStore.availableTimeSlots);

// Methods
const goToStep = (step) => {
  currentStep.value = step;
};

const handleDateSelected = async (date) => {
  selectedDate.value = date;
  selectedTimeSlot.value = null;
  
  loadingTimeSlots.value = true;
  try {
    await appointmentStore.fetchTimeSlots(date);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    toast.error('Could not load available time slots. Please try again.');
  } finally {
    loadingTimeSlots.value = false;
  }
};

const submitForm = async () => {
  // Clear previous errors
  errors.value = {};
  
  // Validate form
  const appointmentData = {
    ...formData.value,
    date: selectedDate.value,
    timeSlot: selectedTimeSlot.value
  };
  
  const validation = validateAppointmentForm(appointmentData);
  
  if (!validation.isValid) {
    errors.value = validation.errors;
    return;
  }
  
  // Submit form
  isSubmitting.value = true;
  
  try {
    await appointmentStore.bookAppointment(appointmentData);
    emit('appointment-booked');
    
    // Reset form
    currentStep.value = 1;
    selectedDate.value = null;
    selectedTimeSlot.value = null;
    formData.value = {
      name: '',
      email: '',
      phone: '',
      purpose: '',
      notes: ''
    };
  } catch (error) {
    console.error('Error booking appointment:', error);
    // Error handling is done in appointmentStore.bookAppointment
  } finally {
    isSubmitting.value = false;
  }
};

// Load available dates
watch(
  () => currentStep.value, 
  (step) => {
    if (step === 1 && !availableDates.value.length) {
      loadingDates.value = true;
      appointmentStore.fetchAvailableDates()
        .finally(() => {
          loadingDates.value = false;
        });
    }
  },
  { immediate: true }
);
</script>