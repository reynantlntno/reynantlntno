<template>
  <div class="min-h-screen bg-carbon-950">
    <!-- Hero Section -->
    <section class="relative py-24 lg:py-32 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="grid-background"></div>
      </div>
      
      <!-- Floating Code Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="floating-code-element absolute top-20 left-10 opacity-30 animate-float">
          <span class="font-mono text-xs text-accent-400">const meeting = {</span>
        </div>
        <div class="floating-code-element absolute top-40 right-20 opacity-30 animate-float" style="animation-delay: 2s">
          <span class="font-mono text-xs text-syntax-variable">type: 'consultation'</span>
        </div>
        <div class="floating-code-element absolute bottom-32 left-1/4 opacity-30 animate-float" style="animation-delay: 4s">
          <span class="font-mono text-xs text-syntax-comment">// let's build together</span>
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <!-- Terminal-style Header -->
          <div class="inline-flex items-center space-x-2 mb-6">
            <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
            <span class="font-mono text-sm text-carbon-400 ml-3">
              {{ trackingMode ? '~/track/appointment.js' : '~/book/consultation.js' }}
            </span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold text-carbon-100 mb-6 leading-tight font-mono">
            {{ trackingMode 
              ? 'appointment.track()'
              : 'consultation.book()'
            }}
          </h1>
          <p class="text-xl md:text-2xl text-carbon-300 mb-8 max-w-3xl mx-auto font-mono">
            <span class="text-syntax-comment">
              {{ trackingMode 
                ? '// Check the status of your scheduled meeting using your reference code'
                : '// Schedule a consultation to discuss your software development needs'
              }}
            </span>
          </p>
          
          <!-- Mode Toggle -->
          <div class="flex justify-center mb-8">
            <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-1">
              <button
                @click="setMode(false)"
                :class="[
                  'px-4 py-2 rounded font-mono text-sm transition-all duration-200',
                  !trackingMode 
                    ? 'bg-accent-500 text-white shadow-glow-accent' 
                    : 'text-carbon-300 hover:text-accent-400'
                ]"
              >
                book.meeting()
              </button>
              <button
                @click="setMode(true)"
                :class="[
                  'px-4 py-2 rounded font-mono text-sm transition-all duration-200',
                  trackingMode 
                    ? 'bg-accent-500 text-white shadow-glow-accent' 
                    : 'text-carbon-300 hover:text-accent-400'
                ]"
              >
                track.status()
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tracking Mode -->
    <section v-if="trackingMode" class="py-16 lg:py-24">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
          <!-- Terminal Header -->
          <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
            <div class="flex items-center space-x-2">
              <span class="text-syntax-comment font-mono text-xs">1</span>
              <span class="text-syntax-comment font-mono text-xs">/* Appointment Tracker */</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
              <span class="text-xs font-mono text-carbon-400">tracking</span>
            </div>
          </div>
          
          <div class="p-8">
            <form @submit.prevent="handleTrackingSubmit" class="space-y-6">
              <div>
                <label for="reference" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                  <span class="text-syntax-keyword">const</span>
                  <span class="text-syntax-variable"> referenceCode</span>
                  <span class="text-carbon-300"> =</span>
                </label>
                <div class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 overflow-hidden">
                  <div class="flex items-center px-3 py-2 bg-carbon-900 border-b border-carbon-700/50">
                    <span class="text-syntax-comment font-mono text-xs mr-2">$</span>
                    <span class="text-carbon-300 font-mono text-xs">input --reference</span>
                  </div>
                  <input
                    id="reference"
                    v-model="trackingCode"
                    type="text"
                    placeholder="Enter your reference code..."
                    required
                    :disabled="loading"
                    class="w-full px-4 py-3 bg-transparent text-carbon-100 placeholder-carbon-500 focus:outline-none font-mono text-sm disabled:opacity-50"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                :loading="loading"
                :disabled="loading || !trackingCode.trim()"
                variant="accent"
                size="lg"
                class="w-full font-mono"
              >
                <template #icon-left v-if="!loading">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </template>
                {{ loading ? 'searching...' : 'track.appointment()' }}
              </Button>
            </form>

            <!-- Tracking Results -->
            <div v-if="trackedAppointment" class="mt-8">
              <div class="bg-carbon-900/50 rounded-ide border border-carbon-700/50 overflow-hidden">
                <div class="flex items-center justify-between px-4 py-2 bg-carbon-900 border-b border-carbon-700/50">
                  <span class="text-syntax-function font-mono text-sm text-carbon-200">appointment.details</span>
                  <span :class="getStatusColor(trackedAppointment.status)" class="px-2 py-1 rounded text-xs font-mono">
                    {{ formatStatus(trackedAppointment.status) }}
                  </span>
                </div>
                <div class="p-6 space-y-4 font-mono text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-carbon-400">reference:</span>
                    <span class="text-accent-400 font-mono bg-carbon-700/50 px-2 py-1 rounded">
                      {{ trackedAppointment.reference_code }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-carbon-400">status:</span>
                    <span :class="getStatusColor(trackedAppointment.status)" class="px-2 py-1 rounded text-xs font-mono">
                      {{ formatStatus(trackedAppointment.status) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-carbon-400">date:</span>
                    <span class="text-carbon-200">{{ formatDate(trackedAppointment.appointment_date, 'MMMM dd, yyyy') }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-carbon-400">time:</span>
                    <span class="text-carbon-200">{{ formatTime(trackedAppointment.start_time) }} - {{ formatTime(trackedAppointment.end_time) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-carbon-400">subject:</span>
                    <span class="text-carbon-200">{{ trackedAppointment.subject }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-6">
              <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-4">
                <div class="flex items-center space-x-2 mb-2">
                  <svg class="w-4 h-4 text-syntax-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span class="text-syntax-error font-mono text-sm">Error:</span>
                </div>
                <p class="text-syntax-error text-sm font-mono">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking Mode -->
    <section v-else class="py-16 lg:py-24">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Use BookingForm Component -->
        <BookingForm />
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 lg:py-24 bg-carbon-900 border-t border-carbon-700/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-function">getConsultationDetails</span>
            <span class="text-carbon-300">()</span>
          </h2>
          <p class="text-carbon-400 font-mono">
            <span class="text-syntax-comment">// What to expect during our consultation</span>
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-accent-500/20 rounded-ide flex items-center justify-center">
              <svg class="w-8 h-8 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-carbon-100 mb-2 font-mono">
              <span class="text-syntax-variable">duration</span>
              <span class="text-carbon-300">: </span>
              <span class="text-syntax-string">'30-60 min'</span>
            </h3>
            <p class="text-carbon-400 text-sm font-mono">
              <span class="text-syntax-comment">// Comprehensive discussion about your project requirements and goals</span>
            </p>
          </div>
          
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-syntax-success/20 rounded-ide flex items-center justify-center">
              <svg class="w-8 h-8 text-syntax-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-carbon-100 mb-2 font-mono">
              <span class="text-syntax-variable">cost</span>
              <span class="text-carbon-300">: </span>
              <span class="text-syntax-string">'free'</span>
            </h3>
            <p class="text-carbon-400 text-sm font-mono">
              <span class="text-syntax-comment">// No cost initial consultation to understand your needs and provide recommendations</span>
            </p>
          </div>
          
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-syntax-warning/20 rounded-ide flex items-center justify-center">
              <svg class="w-8 h-8 text-syntax-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-carbon-100 mb-2 font-mono">
              <span class="text-syntax-variable">format</span>
              <span class="text-carbon-300">: </span>
              <span class="text-syntax-string">'detailed'</span>
            </h3>
            <p class="text-carbon-400 text-sm font-mono">
              <span class="text-syntax-comment">// In-depth conversation about technology stack, timeline, and implementation approach</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="py-16 lg:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-function">consultationProcess</span>
            <span class="text-carbon-300">()</span>
          </h2>
        </div>
        
        <div class="space-y-6">
          <div v-for="(step, index) in consultationSteps" :key="index" class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
              <div class="flex items-center space-x-2">
                <span class="text-syntax-comment font-mono text-xs">{{ index + 1 }}</span>
                <span class="text-syntax-comment font-mono text-xs">/* {{ step.title }} */</span>
              </div>
              <div class="flex items-center space-x-2">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  step.status === 'active' ? 'bg-syntax-success animate-pulse' : 'bg-carbon-600'
                ]"></div>
                <span class="text-xs font-mono text-carbon-400">{{ step.status }}</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-semibold text-carbon-100 mb-2 font-mono">
                <span class="text-syntax-function">{{ step.function }}</span>
                <span class="text-carbon-300">()</span>
              </h3>
              <p class="text-carbon-400 font-mono text-sm">
                <span class="text-syntax-comment">// {{ step.description }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 lg:py-24 bg-gradient-to-br from-carbon-950 via-carbon-900 to-accent-950/20 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-accent-900/10 to-accent-800/10"></div>
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="space-y-8">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-carbon-100 mb-6 font-mono">
              <span class="text-syntax-keyword">function</span>
              <span class="text-syntax-function"> startProject</span>
              <span class="text-carbon-300">() {</span>
            </h2>
            <p class="text-xl text-carbon-300 font-mono mb-4">
              <span class="text-syntax-comment">  // Ready to discuss your next software project?</span>
            </p>
            <p class="text-lg text-carbon-400 font-mono">
              <span class="text-syntax-keyword">  return</span>
              <span class="text-syntax-string"> 'Let\'s build something amazing together'</span>
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              @click="setMode(false)"
              v-if="trackingMode"
              variant="accent"
              size="lg"
              class="text-base px-8 py-3 font-mono"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1.5 1.5M18 7l1.5 1.5M3 21l1.5-1.5M21 21l-1.5-1.5" />
                </svg>
              </template>
              book.consultation()
            </Button>
            <Button
              to="/contact"
              variant="outline"
              size="lg"
              class="text-base px-8 py-3 font-mono"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </template>
              contact.direct()
            </Button>
          </div>
          
          <div class="text-carbon-300 font-mono text-xl">
            <span class="text-carbon-300">}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Head -->
    <SeoHead
      :title="trackingMode ? 'Track Appointment - Reynan Tolentino' : 'Schedule Appointment - Reynan Tolentino'"
      :description="trackingMode ? 'Track the status of your scheduled appointment using your reference code.' : 'Schedule a consultation or meeting to discuss your software development project needs.'"
      :keywords="trackingMode ? 'track appointment, appointment status, reference code' : 'appointments, consultation, meeting, software development services'"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '@/stores/appointments/appointments.store'
import { formatDate, formatTime } from '@/utils/date.util'
import { formatStatus } from '@/utils/format.util'
import Button from '@/components/ui/Button.vue'
import BookingForm from '@/components/appointments/BookingForm.vue'
import SeoHead from '@/components/common/SeoHead.vue'

const props = defineProps({
  trackingMode: {
    type: Boolean,
    default: false
  }
})

const appointmentsStore = useAppointmentsStore()

const {
  trackedAppointment,
  loading,
  error
} = storeToRefs(appointmentsStore)

// Local state
const trackingCode = ref('')
const trackingMode = ref(props.trackingMode)

// Consultation process steps
const consultationSteps = ref([
  {
    title: 'Initial Discussion',
    function: 'discussRequirements',
    description: 'We\'ll discuss your project goals, requirements, and vision',
    status: 'active'
  },
  {
    title: 'Technical Analysis',
    function: 'analyzeTechStack',
    description: 'Recommend the best technology stack and architecture for your project',
    status: 'pending'
  },
  {
    title: 'Project Planning',
    function: 'createRoadmap',
    description: 'Develop a detailed timeline and milestone roadmap',
    status: 'pending'
  },
  {
    title: 'Proposal & Next Steps',
    function: 'deliverProposal',
    description: 'Provide detailed proposal with timeline and next steps',
    status: 'pending'
  }
])

// Methods
const setMode = (isTracking) => {
  trackingMode.value = isTracking
  // Clear any previous state when switching modes
  appointmentsStore.clearMessages()
  appointmentsStore.clearTrackedAppointment()
  trackingCode.value = ''
}

const handleTrackingSubmit = async () => {
  await appointmentsStore.trackAppointment(trackingCode.value.trim().toUpperCase())
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-syntax-warning/20 text-syntax-warning border border-syntax-warning/30',
    confirmed: 'bg-syntax-success/20 text-syntax-success border border-syntax-success/30',
    cancelled: 'bg-syntax-error/20 text-syntax-error border border-syntax-error/30',
    completed: 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
  }
  return colors[status] || 'bg-carbon-700/20 text-carbon-400 border border-carbon-700/30'
}

// Initialize
onMounted(() => {
  // Clear any previous state
  appointmentsStore.clearMessages()
  appointmentsStore.clearTrackedAppointment()
})
</script>

<style scoped>
/* Grid Background */
.grid-background {
  background-image: 
    linear-gradient(rgba(0, 122, 204, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 122, 204, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  width: 100%;
  height: 100%;
}

/* Floating Code Elements */
.floating-code-element {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Enhanced form focus states */
input:focus,
textarea:focus,
select:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .floating-code-element {
    display: none;
  }
}

/* Animation for success/error messages */
.fade-in-message {
  animation: fadeInMessage 0.3s ease-out;
}

@keyframes fadeInMessage {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>