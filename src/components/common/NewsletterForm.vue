<template>
  <div class="space-y-4">
    <!-- Success Message -->
    <div v-if="successMessage" class="bg-syntax-success/10 border border-syntax-success/20 rounded-ide p-3">
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-syntax-success/20 rounded-ide flex items-center justify-center flex-shrink-0">
          <svg class="w-3 h-3 text-syntax-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p class="text-syntax-success font-mono text-sm">
          <span class="text-syntax-comment">// {{ successMessage }}</span>
        </p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-3">
      <div class="flex items-center space-x-2">
        <div class="w-6 h-6 bg-syntax-error/20 rounded-ide flex items-center justify-center flex-shrink-0">
          <svg class="w-3 h-3 text-syntax-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-syntax-error font-mono text-sm">
          <span class="text-syntax-comment">// {{ errorMessage }}</span>
        </p>
      </div>
    </div>

    <!-- Newsletter Form -->
    <form @submit.prevent="handleSubmit" class="space-y-3">
      <div>
        <label for="newsletter-email" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
          <span class="text-syntax-keyword">const</span>
          <span class="text-syntax-variable"> emailAddress</span>
          <span class="text-carbon-300"> = </span>
          <span class="text-syntax-error">*</span>
        </label>
        <div class="flex flex-col sm:flex-row gap-2">
          <div class="flex-1">
            <input
              id="newsletter-email"
              v-model="email"
              type="email"
              placeholder="your.email@example.com"
              required
              :disabled="loading"
              @input="clearMessages"
              class="w-full px-3 py-2 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 font-mono text-sm transition-colors"
            />
          </div>
          <Button
            type="submit"
            :loading="loading"
            :disabled="loading || !email.trim()"
            variant="accent"
            size="md"
            class="sm:px-4 font-mono"
          >
            <template #icon-left v-if="!loading">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </template>
            {{ loading ? 'subscribing...' : 'subscribe()' }}
          </Button>
        </div>
      </div>

      <!-- Features List -->
      <div class="pt-2 border-t border-carbon-700/30">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div class="flex items-center space-x-2">
            <div class="w-1 h-1 bg-syntax-success rounded-full"></div>
            <span class="text-carbon-400 font-mono">
              <span class="text-syntax-comment">// Weekly updates</span>
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-1 h-1 bg-syntax-success rounded-full"></div>
            <span class="text-carbon-400 font-mono">
              <span class="text-syntax-comment">// Coding insights</span>
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-1 h-1 bg-syntax-success rounded-full"></div>
            <span class="text-carbon-400 font-mono">
              <span class="text-syntax-comment">// No spam</span>
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-1 h-1 bg-syntax-success rounded-full"></div>
            <span class="text-carbon-400 font-mono">
              <span class="text-syntax-comment">// Unsubscribe anytime</span>
            </span>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments/appointments.store'
import Button from '@/components/ui/Button.vue'

const appointmentsStore = useAppointmentsStore()

// Form state
const email = ref('')
const successMessage = ref('')
const errorMessage = ref('')

// Computed
const loading = computed(() => appointmentsStore.newsletterLoading)

// Methods
const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const result = await appointmentsStore.subscribeToNewsletter({
      email: email.value.trim()
    })
    
    if (result.success) {
      successMessage.value = 'Welcome to the newsletter! Check your email for confirmation.'
      email.value = ''
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      errorMessage.value = result.error || 'Failed to subscribe. Please try again.'
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        errorMessage.value = ''
      }, 5000)
    }
  } catch (error) {
    errorMessage.value = 'An error occurred. Please try again.'
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  }
}

// Clear messages when user starts typing
const clearMessages = () => {
  if (email.value.trim()) {
    errorMessage.value = ''
  }
}
</script>

<style scoped>
/* Form focus animation */
input:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
}

/* Message animations */
.success-message,
.error-message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>