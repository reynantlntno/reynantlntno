<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Hero Section -->
    <section class="gradient-cobalt text-white py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Track Appointment</h1>
        <p class="text-xl text-gray-300">
          Check your appointment status and details using your reference code.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <!-- Loading State -->
      <div v-if="appointmentsStore.loading" class="card p-8 text-center">
        <LoadingSpinner size="lg" text="Loading appointment details..." color="primary" centered />
      </div>

      <!-- Error State -->
      <div v-else-if="appointmentsStore.error" class="card p-8 text-center">
        <ExclamationTriangleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ isInvalidReference ? 'Appointment Not Found' : 'Unable to Load Appointment' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ appointmentsStore.error }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton @click="fetchAppointment" variant="primary">
            Try Again
          </BaseButton>
          <BaseButton to="/appointments" variant="secondary">
            Book New Appointment
          </BaseButton>
        </div>
      </div>

      <!-- Appointment Details -->
      <div v-else-if="appointment" class="space-y-8">
        <!-- Status Banner -->
        <div :class="statusBannerClass" class="rounded-lg p-6 border">
          <div class="flex items-center">
            <component 
              :is="statusIcon" 
              class="h-8 w-8 mr-4"
              :class="statusIconClass"
            />
            <div>
              <h2 class="text-xl font-semibold mb-1" :class="statusTextClass">
                {{ statusMessage }}
              </h2>
              <p class="text-sm opacity-90">
                Reference: {{ appointment.reference_code }}
              </p>
            </div>
          </div>
        </div>

        <!-- Appointment Details Card -->
        <div class="card p-8">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Appointment Details
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left Column -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date & Time
                </label>
                <div class="flex items-center text-lg text-gray-900 dark:text-white">
                  <CalendarIcon class="h-5 w-5 mr-2 text-custom-blue-800" />
                  {{ formatAppointmentDateTime }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <div class="flex items-center text-lg text-gray-900 dark:text-white">
                  <ClockIcon class="h-5 w-5 mr-2 text-custom-blue-800" />
                  {{ formatDuration }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <p class="text-lg text-gray-900 dark:text-white">
                  {{ appointment.subject }}
                </p>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Information
                </label>
                <div class="space-y-2">
                  <div class="flex items-center text-gray-900 dark:text-white">
                    <UserIcon class="h-4 w-4 mr-2 text-gray-500" />
                    {{ appointment.name }}
                  </div>
                  <div class="flex items-center text-gray-900 dark:text-white">
                    <EnvelopeIcon class="h-4 w-4 mr-2 text-gray-500" />
                    {{ appointment.email }}
                  </div>
                  <div v-if="appointment.phone" class="flex items-center text-gray-900 dark:text-white">
                    <PhoneIcon class="h-4 w-4 mr-2 text-gray-500" />
                    {{ appointment.phone }}
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Booked On
                </label>
                <p class="text-gray-900 dark:text-white">
                  {{ formatDate(appointment.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div v-if="appointment.message" class="mt-8 pt-6 border-t border-gray-200 dark:border-custom-slate-600">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Message
            </label>
            <div class="bg-gray-50 dark:bg-custom-slate-700 rounded-lg p-4">
              <p class="text-gray-900 dark:text-white whitespace-pre-wrap">
                {{ appointment.message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="card p-8 bg-custom-blue-50 dark:bg-custom-blue-900/20 border-custom-blue-200 dark:border-custom-blue-800">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What's Next?
          </h3>
          
          <div class="space-y-3 text-gray-700 dark:text-gray-300">
            <div v-if="appointment.status === 'pending'" class="space-y-2">
              <p class="flex items-start">
                <span class="bg-custom-blue-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                I'll review your appointment request within 24 hours.
              </p>
              <p class="flex items-start">
                <span class="bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                You'll receive a confirmation email with meeting details.
              </p>
              <p class="flex items-start">
                <span class="bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                Join the meeting at the scheduled time via the provided link.
              </p>
            </div>

            <div v-else-if="appointment.status === 'confirmed'" class="space-y-2">
              <p class="flex items-start">
                <CheckCircleIcon class="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                Your appointment has been confirmed! Check your email for meeting details.
              </p>
              <p class="flex items-start">
                <ClockIcon class="h-5 w-5 text-custom-blue-800 mr-3 mt-0.5" />
                Join the meeting at the scheduled time via the link in your confirmation email.
              </p>
            </div>

            <div v-else-if="appointment.status === 'cancelled'" class="space-y-2">
              <p class="flex items-start text-red-600 dark:text-red-400">
                <XCircleIcon class="h-5 w-5 mr-3 mt-0.5" />
                This appointment has been cancelled. If you need to reschedule, please book a new appointment.
              </p>
            </div>

            <div v-else-if="appointment.status === 'completed'" class="space-y-2">
              <p class="flex items-start text-green-600 dark:text-green-400">
                <CheckCircleIcon class="h-5 w-5 mr-3 mt-0.5" />
                This appointment has been completed. Thank you for your time!
              </p>
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row gap-4">
            <BaseButton v-if="canReschedule" to="/appointments" variant="primary">
              Book Another Appointment
            </BaseButton>
            <BaseButton to="/contact" variant="secondary">
              Contact Me Directly
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon as PendingIcon
} from '@heroicons/vue/24/outline'
import { useAppointmentsStore } from '~/stores/appointments.store'
import { formatDate, formatTime, formatDateTime } from '~/utils/dates.util'

// Get route params
const route = useRoute()
const { reference } = route.params

// Store
const appointmentsStore = useAppointmentsStore()

// Computed
const appointment = computed(() => appointmentsStore.currentAppointment)

const isInvalidReference = computed(() => {
  return appointmentsStore.error && appointmentsStore.error.includes('not found')
})

const statusMessage = computed(() => {
  if (!appointment.value) return ''
  
  const statusMessages = {
    pending: 'Appointment Pending Review',
    confirmed: 'Appointment Confirmed',
    cancelled: 'Appointment Cancelled',
    completed: 'Appointment Completed'
  }
  
  return statusMessages[appointment.value.status] || 'Unknown Status'
})

const statusIcon = computed(() => {
  if (!appointment.value) return PendingIcon
  
  const icons = {
    pending: PendingIcon,
    confirmed: CheckCircleIcon,
    cancelled: XCircleIcon,
    completed: CheckCircleIcon
  }
  
  return icons[appointment.value.status] || PendingIcon
})

const statusBannerClass = computed(() => {
  if (!appointment.value) return ''
  
  const classes = {
    pending: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    confirmed: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    cancelled: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    completed: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  }
  
  return classes[appointment.value.status] || classes.pending
})

const statusIconClass = computed(() => {
  if (!appointment.value) return ''
  
  const classes = {
    pending: 'text-yellow-600',
    confirmed: 'text-green-600',
    cancelled: 'text-red-600',
    completed: 'text-blue-600'
  }
  
  return classes[appointment.value.status] || classes.pending
})

const statusTextClass = computed(() => {
  if (!appointment.value) return ''
  
  const classes = {
    pending: 'text-yellow-800 dark:text-yellow-200',
    confirmed: 'text-green-800 dark:text-green-200',
    cancelled: 'text-red-800 dark:text-red-200',
    completed: 'text-blue-800 dark:text-blue-200'
  }
  
  return classes[appointment.value.status] || classes.pending
})

const formatAppointmentDateTime = computed(() => {
  if (!appointment.value || !appointment.value.slot) return ''
  
  const date = formatDate(appointment.value.appointment_date, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const startTime = formatTime(appointment.value.slot.start_time)
  const endTime = formatTime(appointment.value.slot.end_time)
  
  return `${date} at ${startTime} - ${endTime}`
})

const formatDuration = computed(() => {
  if (!appointment.value || !appointment.value.slot) return ''
  
  const startTime = new Date(`2000-01-01T${appointment.value.slot.start_time}`)
  const endTime = new Date(`2000-01-01T${appointment.value.slot.end_time}`)
  const diffMinutes = (endTime - startTime) / (1000 * 60)
  
  if (diffMinutes >= 60) {
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
  
  return `${diffMinutes}m`
})

const canReschedule = computed(() => {
  return appointment.value && ['cancelled', 'completed'].includes(appointment.value.status)
})

// Methods
const fetchAppointment = async () => {
  await appointmentsStore.fetchAppointmentByReference(reference)
}

// SEO
useHead({
  title: computed(() => {
    if (appointment.value) {
      return `Appointment ${appointment.value.reference_code} - Reynan Tolentino`
    }
    return 'Track Appointment - Reynan Tolentino'
  }),
  meta: [
    {
      name: 'description',
      content: 'Track your appointment status and view details using your reference code.'
    },
    { name: 'robots', content: 'noindex, nofollow' } // Private page
  ]
})

// Lifecycle
onMounted(async () => {
  if (reference) {
    await fetchAppointment()
  }
  
  // Handle invalid reference
  if (!appointmentsStore.loading && !appointment.value && !appointmentsStore.error) {
    appointmentsStore.error = 'Invalid reference code. Please check your reference and try again.'
  }
})

// Clear appointment on unmount
onUnmounted(() => {
  appointmentsStore.clearCurrentAppointment()
})
</script>