<template>
  <div>
    <!-- Header Section -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Schedule an Appointment</h1>
          <p class="text-lg text-dark-muted dark:text-light-muted max-w-2xl mx-auto">
            Book a time for us to discuss your project, provide consultation, or answer any questions you might have.
          </p>
        </div>
      </div>
    </section>
    
    <!-- Appointment Form -->
    <section class="pb-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass-card">
          <h2 class="text-2xl font-bold mb-6">Book Your Appointment</h2>
          
          <div v-if="isLoading" class="flex justify-center py-8">
            <LoadingSpinner size="md" text="Loading availability..." />
          </div>
          
          <AppointmentForm v-else @appointment-booked="handleAppointmentBooked" />
        </div>
      </div>
    </section>
    
    <!-- Available Times Section -->
    <section class="py-16 bg-light-muted dark:bg-dark-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="glass-card">
          <div class="text-center mb-8">
            <h2 class="text-2xl md:text-3xl font-bold mb-4">My Availability</h2>
            <p class="text-dark-muted dark:text-light-muted">
              I'm generally available for meetings Monday through Friday, 9 AM to 5 PM (PST).
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="p-4">
              <h3 class="font-bold mb-2">Initial Consultation</h3>
              <p class="text-dark-muted dark:text-light-muted">
                30-minute call to discuss your project requirements and goals.
              </p>
            </div>
            
            <div class="p-4">
              <h3 class="font-bold mb-2">Technical Discussion</h3>
              <p class="text-dark-muted dark:text-light-muted">
                60-minute deep dive into technical aspects and implementation details.
              </p>
            </div>
            
            <div class="p-4">
              <h3 class="font-bold mb-2">Project Review</h3>
              <p class="text-dark-muted dark:text-light-muted">
                45-minute session to review progress, address concerns, and plan next steps.
              </p>
            </div>
          </div>
          
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-center mb-4">What to Expect</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary dark:text-primary-light mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You'll receive a confirmation email with meeting details</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary dark:text-primary-light mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Meetings are conducted via Zoom or Google Meet</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary dark:text-primary-light mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Please come prepared with specific questions or topics you'd like to discuss</span>
              </li>
              <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary dark:text-primary-light mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Need to reschedule? You can do so up to 24 hours before our meeting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useToast } from 'vue-toastification';
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue';
import AppointmentForm from '@/components/Appointment/AppointmentForm.vue';

const appointmentStore = useAppointmentStore();
const toast = useToast();
const isLoading = ref(true);

onMounted(async () => {
  try {
    await appointmentStore.fetchAvailableDates();
  } catch (error) {
    console.error('Error fetching availability:', error);
    toast.error('Could not load availability data. Please refresh the page or try again later.');
  } finally {
    isLoading.value = false;
  }
});

const handleAppointmentBooked = () => {
  toast.success('Your appointment has been booked successfully! Check your email for confirmation details.');
  // Could redirect to a success page or show additional information
};
</script>