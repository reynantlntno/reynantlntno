<template>
  <div class="bg-white dark:bg-custom-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-custom-slate-600 p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Book an Appointment
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Fill in your details to schedule a consultation or meeting.
      </p>
    </div>

    <!-- Selected Slot Summary -->
    <div 
      v-if="appointmentsStore.selectedSlot && appointmentsStore.selectedDate"
      class="mb-6 p-4 bg-custom-blue-50 dark:bg-custom-blue-900/20 rounded-lg border border-custom-blue-200 dark:border-custom-blue-800"
    >
      <h3 class="font-semibold text-custom-blue-900 dark:text-custom-blue-400 mb-2">
        Selected Appointment
      </h3>
      <div class="text-sm text-custom-blue-800 dark:text-custom-blue-300">
        <p><strong>Date:</strong> {{ formatSelectedDate }}</p>
        <p><strong>Time:</strong> {{ formatSelectedTime }}</p>
        <p><strong>Duration:</strong> {{ formatDuration }}</p>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="appointmentsStore.error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <p class="text-red-600 dark:text-red-400 text-sm">{{ appointmentsStore.error }}</p>
    </div>

    <!-- Validation Errors -->
    <div v-if="Object.keys(validationErrors).length > 0" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <h4 class="text-red-800 dark:text-red-400 font-medium mb-2">Please fix the following errors:</h4>
      <ul class="list-disc list-inside text-red-600 dark:text-red-400 text-sm space-y-1">
        <li v-for="(error, field) in validationErrors" :key="field">{{ error }}</li>
      </ul>
    </div>

    <!-- Appointment Form -->
    <form @submit.prevent="submitAppointment" class="space-y-6">
      <!-- Personal Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model="formData.name"
          label="Full Name"
          placeholder="Enter your full name"
          required
          :error="validationErrors.name"
          @input="clearFieldError('name')"
        />

        <BaseInput
          v-model="formData.email"
          type="email"
          label="Email Address"
          placeholder="your.email@example.com"
          required
          :error="validationErrors.email"
          @input="clearFieldError('email')"
        />
      </div>

      <BaseInput
        v-model="formData.phone"
        type="tel"
        label="Phone Number (Optional)"
        placeholder="+ Country Code (e.g., +63 912 345 6789)"
        :error="validationErrors.phone"
        @input="clearFieldError('phone')"
      />

      <!-- Meeting Details -->
      <BaseInput
        v-model="formData.subject"
        label="Meeting Subject"
        placeholder="Brief description of what you'd like to discuss"
        required
        :error="validationErrors.subject"
        @input="clearFieldError('subject')"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Details (Optional)
        </label>
        <textarea
          v-model="formData.message"
          rows="4"
          class="textarea-field"
          placeholder="Provide any additional information about your project, questions, or specific topics you'd like to discuss..."
          :class="{ 'border-red-300 dark:border-red-600': validationErrors.message }"
          @input="clearFieldError('message')"
        ></textarea>
        <p v-if="validationErrors.message" class="text-red-600 dark:text-red-400 text-sm mt-1">
          {{ validationErrors.message }}
        </p>
      </div>

      <!-- Terms and Conditions -->
      <div class="flex items-start">
        <input
          v-model="agreedToTerms"
          type="checkbox"
          id="terms"
          class="mt-1 h-4 w-4 text-custom-blue-800 focus:ring-custom-blue-800 border-gray-300 rounded"
        />
        <label for="terms" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          I agree to the appointment policies and understand that I may need to reschedule with at least 24 hours notice.
          <span class="text-red-500">*</span>
        </label>
      </div>

      <!-- Submit Button -->
      <div class="flex flex-col sm:flex-row gap-3">
        <BaseButton
          type="submit"
          variant="primary"
          class="flex-1"
          :loading="appointmentsStore.loading"
          :disabled="!canSubmit"
        >
          <CalendarIcon class="h-5 w-5 mr-2" />
          {{ appointmentsStore.loading ? 'Booking Appointment...' : 'Book Appointment' }}
        </BaseButton>

        <BaseButton
          @click="resetForm"
          variant="secondary"
          :disabled="appointmentsStore.loading"
        >
          Reset Form
        </BaseButton>
      </div>
    </form>

    <!-- Success Modal -->
    <Teleport to="body">
      <div
        v-if="showSuccessModal"
        @click="closeSuccessModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <div
          @click.stop
          class="bg-white dark:bg-custom-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-custom-slate-600"
        >
          <div class="text-center">
            <!-- Success Icon -->
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon class="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Appointment Booked Successfully!
            </h3>

            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Your appointment has been confirmed. You will receive an email confirmation shortly.
            </p>

            <!-- Appointment Details -->
            <div class="bg-gray-50 dark:bg-custom-slate-700 rounded-lg p-4 mb-6 text-left">
              <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Appointment Details:</h4>
              <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p><strong>Reference:</strong> {{ appointmentReference }}</p>
                <p><strong>Date:</strong> {{ formatSelectedDate }}</p>
                <p><strong>Time:</strong> {{ formatSelectedTime }}</p>
                <p><strong>Subject:</strong> {{ formData.subject }}</p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <BaseButton
                @click="trackAppointment"
                variant="primary"
                size="sm"
              >
                Track Appointment
              </BaseButton>
              
              <BaseButton
                @click="closeSuccessModal"
                variant="secondary"
                size="sm"
              >
                Close
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { CalendarIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAppointmentsStore } from '~/stores/appointments.store'
import { validateAppointmentData } from '~/utils/validation.util'
import { formatDate, formatTime } from '~/utils/dates.util'

const appointmentsStore = useAppointmentsStore()
const { $toast } = useNuxtApp()

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const validationErrors = ref({})
const agreedToTerms = ref(false)
const showSuccessModal = ref(false)
const appointmentReference = ref('')

const formatSelectedDate = computed(() => {
  if (!appointmentsStore.selectedDate) return ''
  return formatDate(appointmentsStore.selectedDate, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const formatSelectedTime = computed(() => {
  if (!appointmentsStore.selectedSlot) return ''
  const start = formatTime(appointmentsStore.selectedSlot.start_time)
  const end = formatTime(appointmentsStore.selectedSlot.end_time)
  return `${start} - ${end}`
})

const formatDuration = computed(() => {
  if (!appointmentsStore.selectedSlot) return ''
  
  const startTime = new Date(`2000-01-01T${appointmentsStore.selectedSlot.start_time}`)
  const endTime = new Date(`2000-01-01T${appointmentsStore.selectedSlot.end_time}`)
  const diffMinutes = (endTime - startTime) / (1000 * 60)
  
  if (diffMinutes >= 60) {
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
  
  return `${diffMinutes}m`
})

const canSubmit = computed(() => {
  return (
    appointmentsStore.selectedSlot &&
    appointmentsStore.selectedDate &&
    formData.name.trim() &&
    formData.email.trim() &&
    formData.subject.trim() &&
    agreedToTerms.value &&
    !appointmentsStore.loading
  )
})

const clearFieldError = (field) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field]
    validationErrors.value = { ...validationErrors.value }
  }
}

const validateForm = () => {
  const appointmentData = {
    ...formData,
    slot_id: appointmentsStore.selectedSlot?.id,
    appointment_date: appointmentsStore.selectedDate
  }

  const validation = validateAppointmentData(appointmentData)
  
  if (!validation.isValid) {
    validationErrors.value = validation.errors
    return false
  }

  if (!agreedToTerms.value) {
    validationErrors.value.terms = 'You must agree to the appointment policies'
    return false
  }

  validationErrors.value = {}
  return true
}

const submitAppointment = async () => {
  appointmentsStore.clearError()
  
  if (!validateForm()) {
    $toast.error('Please fix the validation errors')
    return
  }

  const appointmentData = {
    slot_id: appointmentsStore.selectedSlot.id,
    appointment_date: appointmentsStore.selectedDate,
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim() || null,
    subject: formData.subject.trim(),
    message: formData.message.trim() || null
  }

  try {
    const result = await appointmentsStore.bookAppointment(appointmentData)
    
    if (result) {
      appointmentReference.value = result.reference_code
      showSuccessModal.value = true
      resetForm()
      $toast.success('Appointment booked successfully!')
    }
  } catch (error) {
    $toast.error('Failed to book appointment. Please try again.')
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
  agreedToTerms.value = false
  validationErrors.value = {}
  appointmentsStore.clearSelection()
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  appointmentReference.value = ''
}

const trackAppointment = () => {
  if (appointmentReference.value) {
    navigateTo(`/appointments/${appointmentReference.value}`)
  }
  closeSuccessModal()
}

// Clear form validation when slot selection changes
watch(
  () => [appointmentsStore.selectedSlot, appointmentsStore.selectedDate],
  () => {
    validationErrors.value = {}
  }
)
</script>