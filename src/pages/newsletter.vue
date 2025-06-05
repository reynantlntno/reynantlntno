<template>
  <div class="min-h-screen bg-gray-50 dark:bg-custom-slate-800">
    <!-- Hero Section -->
    <section class="gradient-navy-slate text-white py-20">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">Newsletter</h1>
        <p class="text-xl text-gray-300">
          Stay updated with the latest in software development, tech insights, and project updates.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <!-- Success State -->
      <div v-if="subscribed" class="card p-8 text-center">
        <CheckCircleIcon class="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Successfully Subscribed!
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Thank you for subscribing to my newsletter. You'll receive updates about new blog posts, 
          project releases, and tech insights directly in your inbox.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <BaseButton to="/blog" variant="primary">
            Read Latest Posts
          </BaseButton>
          <BaseButton to="/" variant="secondary">
            Back to Home
          </BaseButton>
        </div>
      </div>

      <!-- Subscription Form -->
      <div v-else class="space-y-8">
        <!-- Newsletter Benefits -->
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why Subscribe?
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-8 h-8 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <DocumentTextIcon class="h-4 w-4 text-custom-blue-800 dark:text-custom-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                    Latest Blog Posts
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">
                    Get notified when I publish new articles about web development, programming tips, and tech tutorials.
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-8 h-8 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CodeBracketIcon class="h-4 w-4 text-custom-blue-800 dark:text-custom-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                    Project Updates
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">
                    Be the first to know about new projects, open-source contributions, and development milestones.
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-8 h-8 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <LightBulbIcon class="h-4 w-4 text-custom-blue-800 dark:text-custom-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                    Tech Insights
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">
                    Exclusive insights, development tips, and industry observations you won't find elsewhere.
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-8 h-8 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <CalendarIcon class="h-4 w-4 text-custom-blue-800 dark:text-custom-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                    Weekly Digest
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">
                    A curated weekly roundup of interesting developments, tools, and resources in the tech world.
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-8 h-8 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <GiftIcon class="h-4 w-4 text-custom-blue-800 dark:text-custom-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                    Exclusive Content
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">
                    Subscriber-only content including code snippets, resources, and behind-the-scenes development stories.
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="w-8 h-8 bg-custom-blue-100 dark:bg-custom-blue-800/20 rounded-full flex items-center justify-center mr-4 mt-1">
                  <ShieldCheckIcon class="h-4 w-4 text-custom-blue-800 dark:text-custom-blue-400" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                    No Spam Promise
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">
                    Quality over quantity. Only valuable content, and you can unsubscribe anytime with one click.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Subscription Form -->
        <div class="card p-8">
          <div class="max-w-md mx-auto">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Subscribe Now
            </h2>

            <!-- Error Message -->
            <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div class="flex items-center">
                <ExclamationTriangleIcon class="h-5 w-5 text-red-600 mr-2" />
                <p class="text-red-800 dark:text-red-200 text-sm">{{ error }}</p>
              </div>
            </div>

            <!-- Validation Errors -->
            <div v-if="Object.keys(validationErrors).length > 0" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 class="text-red-800 dark:text-red-200 font-medium mb-2">Please fix the following errors:</h4>
              <ul class="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1">
                <li v-for="(error, field) in validationErrors" :key="field">{{ error }}</li>
              </ul>
            </div>

            <form @submit.prevent="subscribe" class="space-y-6">
              <div>
                <BaseInput
                  v-model="formData.name"
                  label="Name (Optional)"
                  placeholder="Your name"
                  :error="validationErrors.name"
                  @input="clearFieldError('name')"
                />
              </div>

              <div>
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

              <div class="flex items-start">
                <input
                  id="privacy-agreement"
                  v-model="agreedToPrivacy"
                  type="checkbox"
                  class="mt-1 h-4 w-4 text-custom-blue-800 focus:ring-custom-blue-800 border-gray-300 rounded"
                  required
                />
                <label for="privacy-agreement" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  I agree to receive email newsletters and understand that I can unsubscribe at any time. 
                  View our 
                  <NuxtLink to="/privacy" class="text-custom-blue-800 hover:underline">
                    Privacy Policy
                  </NuxtLink>.
                </label>
              </div>

              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="loading"
                :disabled="!canSubmit"
                class="w-full"
              >
                <EnvelopeIcon class="h-5 w-5 mr-2" />
                Subscribe to Newsletter
              </BaseButton>
            </form>

            <p class="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Join {{ subscriberCount > 0 ? subscriberCount : '' }} other developers staying updated with quality content.
            </p>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          
          <div class="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                How often will I receive emails?
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                I send newsletters weekly, typically on Sundays. You'll also receive immediate notifications 
                for new blog posts and major project announcements, but never more than 2-3 emails per week.
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                Can I unsubscribe anytime?
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Absolutely! Every email includes an unsubscribe link. You can also email me directly at 
                hello@reynantlntno.dev to manage your subscription preferences.
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                What type of content do you share?
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                I focus on practical web development tutorials, project case studies, tool recommendations, 
                industry insights, and occasional behind-the-scenes development stories.
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                Do you share subscriber information?
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Never. Your email and information are kept strictly confidential and will never be shared, 
                sold, or used for any purpose other than sending you the newsletter you subscribed to.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  LightBulbIcon,
  CalendarIcon,
  GiftIcon,
  ShieldCheckIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline'
import { validateEmail, validateRequired, validateMinLength } from '~/utils/validation.util'

// SEO
useHead({
  title: 'Newsletter - Reynan Tolentino',
  meta: [
    {
      name: 'description',
      content: 'Subscribe to Reynan Tolentino\'s newsletter for the latest web development insights, project updates, and tech tutorials delivered to your inbox.'
    },
    { property: 'og:title', content: 'Newsletter - Reynan Tolentino' },
    { property: 'og:description', content: 'Subscribe for the latest web development insights, project updates, and tech tutorials.' }
  ]
})

// State
const formData = reactive({
  name: '',
  email: ''
})

const loading = ref(false)
const subscribed = ref(false)
const error = ref('')
const validationErrors = ref({})
const agreedToPrivacy = ref(false)
const subscriberCount = ref(0)

// Computed
const canSubmit = computed(() => {
  return formData.email.trim() && 
         agreedToPrivacy.value && 
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
  const errors = {}
  
  if (!validateRequired(formData.email)) {
    errors.email = 'Email address is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (formData.name && !validateMinLength(formData.name, 2)) {
    errors.name = 'Name must be at least 2 characters'
  }

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const subscribe = async () => {
  error.value = ''
  
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const { $newsletterApi } = useNuxtApp()
    const response = await $newsletterApi.subscribe(
      formData.email.trim(),
      formData.name.trim() || null
    )

    if (response.success) {
      subscribed.value = true
      
      // Show success toast
      const { $toast } = useNuxtApp()
      $toast.success('Successfully subscribed to newsletter!')
      
      // Clear form
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
      agreedToPrivacy.value = false
    } else {
      error.value = response.error || 'Failed to subscribe. Please try again.'
    }
  } catch (err) {
    console.error('Newsletter subscription error:', err)
    error.value = 'An error occurred. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Fetch subscriber count on mount (optional)
onMounted(async () => {
  try {
    // This could be a separate endpoint to get public stats
    // For now, we'll set a placeholder or skip this
    subscriberCount.value = 150 // Placeholder
  } catch (err) {
    // Silently fail - not critical
  }
})
</script>