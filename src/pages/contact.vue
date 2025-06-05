<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Hero Section -->
    <section class="gradient-obsidian text-white py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
        <p class="text-xl text-gray-300">
          Ready to start your next project? Let's discuss how I can help bring your ideas to life.
        </p>
      </div>
    </section>

    <!-- Contact Form Section -->
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Contact Information -->
        <div class="lg:col-span-1">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
          
          <div class="space-y-6">
            <div class="flex items-start">
              <EnvelopeIcon class="h-6 w-6 text-custom-blue-800 mt-1 mr-3" />
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">Email</h3>
                <a 
                  href="mailto:hello@reynantlntno.dev"
                  class="text-custom-blue-800 dark:text-custom-blue-400 hover:underline"
                >
                  hello@reynantlntno.dev
                </a>
              </div>
            </div>
            
            <div class="flex items-start">
              <GlobeAltIcon class="h-6 w-6 text-custom-blue-800 mt-1 mr-3" />
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">GitHub</h3>
                <a 
                  href="https://github.com/reynantlntno"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-custom-blue-800 dark:text-custom-blue-400 hover:underline"
                >
                  github.com/reynantlntno
                </a>
              </div>
            </div>
            
            <div class="flex items-start">
              <UserIcon class="h-6 w-6 text-custom-blue-800 mt-1 mr-3" />
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">LinkedIn</h3>
                <a 
                  href="https://www.linkedin.com/in/reynan-fuertez/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-custom-blue-800 dark:text-custom-blue-400 hover:underline"
                >
                  linkedin.com/in/reynan-fuertez
                </a>
              </div>
            </div>
          </div>

          <div class="mt-8 p-6 bg-custom-blue-50 dark:bg-custom-blue-900/20 rounded-lg">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">Response Time</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              I typically respond to messages within 24 hours. For urgent matters, feel free to 
              <NuxtLink to="/appointments" class="text-custom-blue-800 dark:text-custom-blue-400 hover:underline">
                schedule a meeting
              </NuxtLink>.
            </p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <div class="card p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
            
            <!-- Success Message -->
            <div v-if="submitted" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div class="flex items-center">
                <CheckCircleIcon class="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <p class="text-green-800 dark:text-green-400 font-medium">
                  Message sent successfully! I'll get back to you soon.
                </p>
              </div>
            </div>

            <!-- Error Messages -->
            <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div class="flex items-center">
                <ExclamationCircleIcon class="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p class="text-red-800 dark:text-red-400 font-medium">{{ error }}</p>
              </div>
            </div>

            <!-- Validation Errors -->
            <div v-if="Object.keys(validationErrors).length > 0" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div class="flex items-start">
                <ExclamationCircleIcon class="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
                <div>
                  <p class="text-red-800 dark:text-red-400 font-medium mb-2">Please fix the following errors:</p>
                  <ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li v-for="(error, field) in validationErrors" :key="field">{{ error }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInput
                  v-model="formData.name"
                  label="Name"
                  placeholder="Your full name"
                  required
                  :error="validationErrors.name"
                  @input="clearFieldError('name')"
                />
                
                <BaseInput
                  v-model="formData.email"
                  type="email"
                  label="Email"
                  placeholder="your.email@example.com"
                  required
                  :error="validationErrors.email"
                  @input="clearFieldError('email')"
                />
              </div>

              <BaseInput
                v-model="formData.subject"
                label="Subject"
                placeholder="What's this about?"
                required
                :error="validationErrors.subject"
                @input="clearFieldError('subject')"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="formData.message"
                  rows="6"
                  class="textarea-field"
                  :class="{ 'border-red-500 dark:border-red-400': validationErrors.message }"
                  placeholder="Tell me about your project or question..."
                  required
                  @input="clearFieldError('message')"
                ></textarea>
                <p v-if="validationErrors.message" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ validationErrors.message }}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  <span class="text-red-500">*</span> Required fields
                </p>
                
                <BaseButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  :loading="loading"
                  :disabled="!canSubmit"
                  loading-text="Sending..."
                >
                  Send Message
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  EnvelopeIcon,
  GlobeAltIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'
import { validateContactData } from '~/utils/validation.util'

// SEO
useHead({
  title: 'Contact - Reynan Tolentino',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with Reynan Tolentino for software development projects, collaborations, or general inquiries. Quick response guaranteed.'
    },
    { property: 'og:title', content: 'Contact - Reynan Tolentino' },
    { property: 'og:description', content: 'Get in touch with Reynan Tolentino for software development projects, collaborations, or general inquiries.' }
  ]
})

// State
const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const submitted = ref(false)
const error = ref('')
const validationErrors = ref({})

// Computed
const canSubmit = computed(() => {
  return formData.name.trim() && 
         formData.email.trim() && 
         formData.subject.trim() && 
         formData.message.trim() && 
         !loading.value
})

// Methods
const clearFieldError = (field) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field]
    validationErrors.value = { ...validationErrors.value }
  }
}

const validateForm = () => {
  const validation = validateContactData(formData)
  
  if (!validation.isValid) {
    validationErrors.value = validation.errors
    return false
  }

  validationErrors.value = {}
  return true
}

const submitForm = async () => {
  error.value = ''
  submitted.value = false
  
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const { $contactApi } = useNuxtApp()
    const response = await $contactApi.sendMessage(formData)

    if (response.success) {
      submitted.value = true
      // Reset form
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
      
      // Show success toast
      const { $toast } = useNuxtApp()
      $toast.success('Message sent successfully!')
    } else {
      error.value = response.error || 'Failed to send message. Please try again.'
    }
  } catch (err) {
    console.error('Contact form error:', err)
    error.value = 'An error occurred. Please try again later.'
  } finally {
    loading.value = false
  }
}
</script>