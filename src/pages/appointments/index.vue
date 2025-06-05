<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Hero Section -->
    <section class="gradient-cobalt text-white py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Book an Appointment</h1>
        <p class="text-xl text-gray-300">
          Schedule a consultation to discuss your project needs and explore how we can work together.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Calendar -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Select Date & Time</h2>
          <AppointmentCalendar
            @slot-selected="handleSlotSelected"
            @date-selected="handleDateSelected"
          />
        </div>

        <!-- Appointment Form -->
        <div>
          <AppointmentForm />
        </div>
      </div>

      <!-- Information Section -->
      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon class="w-8 h-8 text-custom-blue-800 dark:text-custom-blue-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Flexible Scheduling</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Choose from available time slots that work best for your schedule.
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <VideoCameraIcon class="w-8 h-8 text-custom-blue-800 dark:text-custom-blue-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Video Consultation</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Meet virtually via Google Meet, Zoom, or your preferred platform.
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClockIcon class="w-8 h-8 text-custom-blue-800 dark:text-custom-blue-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Free Consultation</h3>
          <p class="text-gray-600 dark:text-gray-300">
            Initial 30-minute consultation to discuss your project requirements.
          </p>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">How long is a consultation?</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Initial consultations are typically 30 minutes, but can be extended if needed to properly discuss your project.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">What should I prepare?</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Come with a clear idea of your project goals, any existing materials, and questions about timeline and budget.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I reschedule?</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Yes, you can reschedule or cancel up to 24 hours before your appointment using your reference code.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">What happens after booking?</h3>
            <p class="text-gray-600 dark:text-gray-300">
              You'll receive a confirmation email with meeting details and a calendar invite for the scheduled time.
            </p>
          </div>
        </div>
      </div>

      <!-- Alternative Contact -->
      <div class="mt-16 text-center bg-gray-100 dark:bg-custom-slate-700 rounded-xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Prefer a Different Approach?</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          If scheduling doesn't work for you, feel free to reach out directly via email or the contact form.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton to="/contact" variant="primary">
            Send Message
          </BaseButton>
          <BaseButton href="mailto:hello@reynantlntno.dev" variant="secondary">
            Email Directly
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  CalendarIcon, 
  VideoCameraIcon, 
  ClockIcon 
} from '@heroicons/vue/24/outline'
import { useAppointmentsStore } from '~/stores/appointments.store'

// SEO
useHead({
  title: 'Book Appointment - Reynan Tolentino',
  meta: [
    {
      name: 'description',
      content: 'Schedule a consultation with Reynan Tolentino to discuss your software development project needs and requirements.'
    },
    { property: 'og:title', content: 'Book Appointment - Reynan Tolentino' },
    { property: 'og:description', content: 'Schedule a consultation with Reynan Tolentino to discuss your software development project needs and requirements.' }
  ]
})

// Store
const appointmentsStore = useAppointmentsStore()

// Methods
const handleSlotSelected = (slot) => {
  appointmentsStore.setSelectedSlot(slot)
}

const handleDateSelected = (date) => {
  appointmentsStore.setSelectedDate(date)
}
</script>