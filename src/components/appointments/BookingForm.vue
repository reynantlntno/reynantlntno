<template>
  <div class="space-y-8">
    <!-- Error Message -->
    <div v-if="error" class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-4">
      <div class="flex items-center justify-between px-3 py-2 bg-syntax-error/20 border-b border-syntax-error/30 mb-4 -mx-4 -mt-4">
        <span class="text-syntax-function font-mono text-sm text-syntax-error">error.handler</span>
        <div class="w-2 h-2 bg-syntax-error rounded-full animate-pulse"></div>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-syntax-error/20 rounded-ide flex items-center justify-center">
          <svg class="w-6 h-6 text-syntax-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-syntax-error font-mono text-sm mb-4">
          <span class="text-syntax-comment">// {{ error }}</span>
        </p>
        <Button 
          @click="clearError" 
          variant="ghost" 
          size="sm" 
          class="text-syntax-error hover:bg-syntax-error/10 font-mono"
        >
          try.again()
        </Button>
      </div>
    </div>

    <!-- Booking Form -->
    <form v-if="!successMessage" @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Step 1: Date & Time Selection -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Calendar Component -->
        <Calendar
          :selected-date="selectedDate"
          :available-dates="availableDatesArray"
          :min-date="minDateObj"
          :max-date="maxDateObj"
          @date-selected="handleDateSelected"
          @month-changed="handleMonthChange"
        />

        <!-- Time Slot Selection -->
        <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
          <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
            <div class="flex items-center space-x-2">
              <span class="text-syntax-comment font-mono text-xs">2</span>
              <span class="text-syntax-comment font-mono text-xs">/* Time Slot Selection */</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-syntax-warning rounded-full animate-pulse"></div>
              <span class="text-xs font-mono text-carbon-400">scheduler</span>
            </div>
          </div>

          <div class="p-6">
            <h3 class="text-lg font-semibold text-carbon-100 mb-4 font-mono">
              <span class="text-syntax-function">getAvailableSlots</span>
              <span class="text-carbon-300">()</span>
            </h3>

            <div v-if="!selectedDate" class="text-center py-8">
              <div class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 p-6">
                <div class="w-12 h-12 mx-auto mb-4 bg-carbon-700/50 rounded-ide flex items-center justify-center">
                  <svg class="w-6 h-6 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-carbon-400 font-mono text-sm">
                  <span class="text-syntax-comment">// Please select a date first to view available time slots</span>
                </p>
              </div>
            </div>

            <div v-else-if="slotsLoading" class="text-center py-8">
              <Loader size="md" text="loading.slots()" />
            </div>

            <div v-else-if="availableSlots.length === 0" class="text-center py-8">
              <div class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 p-6">
                <div class="w-12 h-12 mx-auto mb-4 bg-carbon-700/50 rounded-ide flex items-center justify-center">
                  <svg class="w-6 h-6 text-carbon-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-carbon-400 mb-2 font-mono text-sm">
                  <span class="text-syntax-comment">// No available slots for this date</span>
                </p>
                <p class="text-carbon-500 text-xs font-mono">
                  <span class="text-syntax-comment">// Please select a different date or contact me directly</span>
                </p>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 gap-3">
              <button
                v-for="slot in availableSlots"
                :key="slot.id"
                type="button"
                @click="selectSlot(slot)"
                :disabled="loading"
                :class="[
                  'p-4 rounded-ide border transition-all duration-200 text-left font-mono',
                  selectedSlot?.id === slot.id
                    ? 'border-accent-400 bg-accent-500/20 text-accent-300'
                    : 'border-carbon-600/50 bg-carbon-700/30 text-carbon-300 hover:border-carbon-500/50 hover:bg-carbon-600/30',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-sm">{{ formatTime(slot.start_time) }}</div>
                    <div class="text-xs opacity-75">{{ formatTime(slot.end_time) }}</div>
                  </div>
                  <div class="text-xs">
                    <span class="text-syntax-success">{{ slot.available }}/{{ slot.capacity }}</span>
                  </div>
                </div>
              </button>
            </div>

            <div v-if="formErrors.slot_id" class="mt-4">
              <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                <p class="text-syntax-error text-sm font-mono">{{ formErrors.slot_id }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Personal Information -->
      <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
          <div class="flex items-center space-x-2">
            <span class="text-syntax-comment font-mono text-xs">3</span>
            <span class="text-syntax-comment font-mono text-xs">/* Personal Information */</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-syntax-warning rounded-full animate-pulse"></div>
            <span class="text-xs font-mono text-carbon-400">form</span>
          </div>
        </div>

        <div class="p-6">
          <h3 class="text-lg font-semibold text-carbon-100 mb-6 font-mono">
            <span class="text-syntax-function">collectUserInfo</span>
            <span class="text-carbon-300">()</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                <span class="text-syntax-keyword">const</span>
                <span class="text-syntax-variable"> fullName</span>
                <span class="text-carbon-300"> = </span>
                <span class="text-syntax-error">*</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                :disabled="loading"
                @blur="validateField('name')"
                class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 font-mono text-sm"
                placeholder="Your full name..."
              />
              <div v-if="formErrors.name" class="mt-2">
                <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                  <p class="text-syntax-error text-sm font-mono">{{ formErrors.name }}</p>
                </div>
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                <span class="text-syntax-keyword">const</span>
                <span class="text-syntax-variable"> emailAddress</span>
                <span class="text-carbon-300"> = </span>
                <span class="text-syntax-error">*</span>
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                :disabled="loading"
                @blur="validateField('email')"
                class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 font-mono text-sm"
                placeholder="your.email@example.com"
              />
              <div v-if="formErrors.email" class="mt-2">
                <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                  <p class="text-syntax-error text-sm font-mono">{{ formErrors.email }}</p>
                </div>
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                <span class="text-syntax-keyword">const</span>
                <span class="text-syntax-variable"> phoneNumber</span>
                <span class="text-carbon-300"> = </span>
                <span class="text-carbon-500">// optional</span>
              </label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                :disabled="loading"
                @blur="validateField('phone')"
                class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 font-mono text-sm"
                placeholder="+63 912 345 6789"
              />
              <div v-if="formErrors.phone" class="mt-2">
                <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                  <p class="text-syntax-error text-sm font-mono">{{ formErrors.phone }}</p>
                </div>
              </div>
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                <span class="text-syntax-keyword">const</span>
                <span class="text-syntax-variable"> meetingSubject</span>
                <span class="text-carbon-300"> = </span>
                <span class="text-syntax-error">*</span>
              </label>
              <input
                id="subject"
                v-model="formData.subject"
                type="text"
                required
                :disabled="loading"
                @blur="validateField('subject')"
                class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 font-mono text-sm"
                placeholder="e.g., Web Application Development"
              />
              <div v-if="formErrors.subject" class="mt-2">
                <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                  <p class="text-syntax-error text-sm font-mono">{{ formErrors.subject }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <label for="message" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
              <span class="text-syntax-keyword">const</span>
              <span class="text-syntax-variable"> projectDetails</span>
              <span class="text-carbon-300"> = </span>
              <span class="text-carbon-500">// optional</span>
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="4"
              :disabled="loading"
              @blur="validateField('message')"
              class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 resize-none font-mono text-sm"
              placeholder="Tell me about your project, requirements, budget, timeline, or any specific questions you have..."
            ></textarea>
            <div class="flex justify-between items-center mt-2">
              <div v-if="formErrors.message">
                <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                  <p class="text-syntax-error text-sm font-mono">{{ formErrors.message }}</p>
                </div>
              </div>
              <div class="text-carbon-400 text-sm ml-auto font-mono">
                {{ messageLength }}/1000
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Confirmation -->
      <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
          <div class="flex items-center space-x-2">
            <span class="text-syntax-comment font-mono text-xs">4</span>
            <span class="text-syntax-comment font-mono text-xs">/* Confirmation & Booking */</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-mono text-carbon-400">confirm</span>
          </div>
        </div>

        <div class="p-6">
          <h3 class="text-lg font-semibold text-carbon-100 mb-6 font-mono">
            <span class="text-syntax-function">confirmBooking</span>
            <span class="text-carbon-300">()</span>
          </h3>

          <div v-if="selectedDate && selectedSlot" class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 overflow-hidden mb-6">
            <div class="flex items-center justify-between px-4 py-2 bg-carbon-900 border-b border-carbon-700/50">
              <span class="text-syntax-function font-mono text-sm text-carbon-200">appointment.summary</span>
            </div>
            <div class="p-4 space-y-3 font-mono text-sm">
              <div class="flex items-center justify-between">
                <span class="text-carbon-400">date:</span>
                <span class="text-carbon-200">{{ formatDate(selectedDate) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-carbon-400">time:</span>
                <span class="text-carbon-200">{{ formatTime(selectedSlot.start_time) }} - {{ formatTime(selectedSlot.end_time) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-carbon-400">duration:</span>
                <span class="text-carbon-200">{{ getSlotDuration(selectedSlot) }} minutes</span>
              </div>
            </div>
          </div>

          <div class="bg-accent-500/10 border border-accent-500/20 rounded-ide p-4 mb-6">
            <div class="space-y-3 text-sm font-mono">
              <p class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-accent-300">
                  <span class="text-syntax-comment">// You will receive a confirmation email with a unique reference code</span>
                </span>
              </p>
              <p class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 7v10a2 2 0 002 2h4a2 2 0 002-2V7" />
                </svg>
                <span class="text-accent-300">
                  <span class="text-syntax-comment">// All consultations are conducted via video call (Google Meet/Zoom)</span>
                </span>
              </p>
            </div>
          </div>

          <Button
            type="submit"
            variant="accent"
            size="lg"
            :loading="loading"
            :disabled="!isFormValid || loading"
            class="w-full font-mono"
          >
            <template #icon-left v-if="!loading">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1.5 1.5M18 7l1.5 1.5M3 21l1.5-1.5M21 21l-1.5-1.5" />
              </svg>
            </template>
            {{ loading ? 'booking.appointment()' : 'confirm.booking()' }}
          </Button>
        </div>
      </div>
    </form>

    <!-- Success Modal -->
    <Modal
      :show="showSuccessModal"
      type="success"
      size="md"
      terminal-title="~/booking/success.js"
      success-title="appointmentBooked"
      success-message="Your appointment has been successfully booked!"
      :reference-code="bookingReference"
      close-button-text="book.another()"
      @close="handleSuccessModalClose"
    />

    <!-- Error Modal -->
    <Modal
      :show="showErrorModal"
      type="error"
      size="md"
      terminal-title="~/booking/error.js"
      error-title="bookingFailed"
      :error-message="errorMessage"
      close-button-text="try.again()"
      @close="handleErrorModalClose"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '@/stores/appointments/appointments.store'
import { validateField as validateFormField, schemas } from '@/utils/validation.util'
import { formatDate, formatTime } from '@/utils/date.util'
import Button from '@/components/ui/Button.vue'
import Loader from '@/components/ui/Loader.vue'
import Modal from '@/components/ui/Modal.vue'
import Calendar from '@/components/appointments/Calendar.vue'

const appointmentsStore = useAppointmentsStore()

// Store data
const { 
  availableSlots, 
  selectedSlot, 
  loading, 
  error,
  successMessage 
} = storeToRefs(appointmentsStore)

// Local state
const selectedDate = ref('')
const slotsLoading = ref(false)
const bookingReference = ref('')
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const availableDatesLoading = ref(false)
const availableDates = ref([])

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const formErrors = ref({})

// Computed
const minDateObj = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
})

const maxDateObj = computed(() => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60) // 60 days from now
  return maxDate
})

const availableDatesArray = computed(() => availableDates.value)

const messageLength = computed(() => formData.message.length)

const isFormValid = computed(() => {
  // Basic checks without validation during initial steps
  const hasRequiredSelections = selectedDate.value && selectedSlot.value
  const hasRequiredFields = formData.name?.trim() && formData.email?.trim() && formData.subject?.trim()
  const noValidationErrors = Object.keys(formErrors.value).length === 0
  
  return hasRequiredSelections && hasRequiredFields && noValidationErrors
})

// Methods
const handleDateSelected = async (dateString) => {
  selectedDate.value = dateString
  
  // Clear previous slot selection
  appointmentsStore.clearSelectedSlot()
  
  slotsLoading.value = true
  try {
    await appointmentsStore.fetchAvailableSlots(dateString)
  } catch (error) {
    console.error('Error fetching slots:', error)
  } finally {
    slotsLoading.value = false
  }
}

const selectSlot = (slot) => {
  appointmentsStore.selectSlot(slot)
}

const validateField = (field) => {
  const rules = schemas.appointment[field]
  if (!rules) return

  let value = field === 'appointment_date' ? selectedDate.value : 
              field === 'slot_id' ? selectedSlot.value?.id : 
              formData[field]
  
  // Skip validation for optional empty fields
  if ((field === 'phone' || field === 'message') && (!value || value.trim() === '')) {
    delete formErrors.value[field]
    return
  }

  const validation = validateFormField(value, rules)
  
  if (validation.isValid) {
    delete formErrors.value[field]
  } else {
    formErrors.value[field] = validation.errors[0]
  }
}

const validateForm = () => {
  const errors = {};

  // Validate date and slot as before
  if (!selectedDate.value) {
    errors.appointment_date = 'Please select an appointment date';
  }

  if (!selectedSlot.value) {
    errors.slot_id = 'Please select a time slot';
  }

  // Ensure schemas and schemas.appointment exist
  if (!schemas || !schemas.appointment) {
    console.error('Validation schema is missing');
    formErrors.value = errors;
    return Object.keys(errors).length === 0;
  }

  // Validate required fields
  ['name', 'email', 'subject'].forEach(field => {
    const rules = schemas.appointment[field];
    if (rules) {
      const value = formData[field];
      const validation = validateFormField(value, rules);
      if (!validation.isValid) {
        errors[field] = validation.errors[0];
      }
    }
  });

  // Validate optional fields only if they have content
  ['phone', 'message'].forEach(field => {
    const rules = schemas.appointment[field];
    const value = formData[field];
    if (rules && value && value.trim() !== '') {
      const validation = validateFormField(value, rules);
      if (!validation.isValid) {
        errors[field] = validation.errors[0];
      }
    }
  });

  formErrors.value = errors;
  return Object.keys(errors).length === 0;
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  // Clear any previous errors
  showErrorModal.value = false
  errorMessage.value = ''

  // Sync form data to store
  appointmentsStore.setAppointmentData({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    subject: formData.subject,
    message: formData.message
  })
  appointmentsStore.setSelectedDate(selectedDate.value)
  appointmentsStore.selectSlot(selectedSlot.value)

  try {
    const result = await appointmentsStore.bookAppointment()
    if (result.success) {
      bookingReference.value = result.data?.reference_code || result.referenceCode || ''
      showSuccessModal.value = true
    } else {
      // Handle booking failure
      errorMessage.value = result.error || 'Failed to book appointment. Please try again.'
      showErrorModal.value = true
    }
  } catch (error) {
    console.error('Booking error:', error)
    // Handle unexpected errors
    errorMessage.value = getErrorMessage(error)
    showErrorModal.value = true
  }
}

const getErrorMessage = (error) => {
  // Extract meaningful error messages
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.message) {
    return error.message
  }
  
  if (error?.response?.data?.error) {
    return error.response.data.error
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  
  // Common error scenarios
  if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network')) {
    return 'Network error. Please check your connection and try again.'
  }
  
  if (error?.code === 'TIMEOUT' || error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }
  
  if (error?.response?.status === 409) {
    return 'This time slot is no longer available. Please select a different time.'
  }
  
  if (error?.response?.status === 400) {
    return 'Invalid booking information. Please check your details and try again.'
  }
  
  if (error?.response?.status === 500) {
    return 'Server error. Please try again later or contact support.'
  }
  
  // Default fallback
  return 'An unexpected error occurred. Please try again or contact support if the problem persists.'
}

const handleSuccessModalClose = () => {
  showSuccessModal.value = false
  resetForm()
}

const handleErrorModalClose = () => {
  showErrorModal.value = false
  errorMessage.value = ''
  // Don't reset the form on error - let user try again with same data
}

const resetForm = () => {
  selectedDate.value = ''
  appointmentsStore.clearSelectedSlot()
  appointmentsStore.clearMessages()
  
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
  
  formErrors.value = {}
  bookingReference.value = ''
  errorMessage.value = ''
}

const clearError = () => {
  appointmentsStore.clearMessages()
}

const getSlotDuration = (slot) => {
  if (!slot) return 0
  
  const start = new Date(`1970-01-01T${slot.start_time}`)
  const end = new Date(`1970-01-01T${slot.end_time}`)
  return Math.round((end - start) / (1000 * 60))
}

const fetchAvailableDatesForMonth = async (year, month) => {
  availableDatesLoading.value = true
  
  try {
    // Calculate first and last day of the month
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    // Format as YYYY-MM-DD
    const startDate = firstDay.toISOString().split('T')[0]
    const endDate = lastDay.toISOString().split('T')[0]
    
    // Fetch available dates from the appointments store
    const result = await appointmentsStore.fetchAvailableDateRange(startDate, endDate)
    
    if (result.success && result.data?.dates) {
      availableDates.value = result.data.dates
    }
  } catch (error) {
    console.error('Error fetching available dates:', error)
  } finally {
    availableDatesLoading.value = false
  }
}

// Call when component mounts and when month changes
onMounted(() => {
  const now = new Date()
  fetchAvailableDatesForMonth(now.getFullYear(), now.getMonth())
})

// Add this to watch for month changes in the Calendar
const handleMonthChange = (year, month) => {
  fetchAvailableDatesForMonth(year, month)
}

// Watch for form changes to clear errors
watch(formData, () => {
  // Clear specific field errors when user starts typing
  Object.keys(formErrors.value).forEach(field => {
    if (formData[field] !== undefined && formData[field].toString().trim()) {
      delete formErrors.value[field]
    }
  })
}, { deep: true })

// Watch for date/slot changes to clear related errors
watch(selectedDate, () => {
  delete formErrors.value.appointment_date
})

watch(selectedSlot, () => {
  delete formErrors.value.slot_id
})

// Character limit for message
watch(() => formData.message, (newValue) => {
  if (newValue.length > 1000) {
    formData.message = newValue.substring(0, 1000)
  }
})
</script>

<style scoped>
/* Enhanced form focus states */
input:focus,
textarea:focus,
select:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
}

/* Slot button hover effects */
.slot-button:hover {
  transform: translateY(-1px);
}

/* Form validation animations */
.error-message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success message animation */
.success-animation {
  animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>