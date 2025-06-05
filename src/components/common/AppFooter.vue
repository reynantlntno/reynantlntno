<template>
  <footer class="bg-white dark:bg-custom-slate-800 border-t border-gray-200 dark:border-custom-slate-700">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand & Description -->
        <div class="md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-xl font-bold font-mono text-gray-900 dark:text-white">
              reynantlntno.dev
            </span>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            Full-stack software developer passionate about creating innovative web solutions 
            and building meaningful digital experiences.
          </p>
          
          <!-- Social Links -->
          <div class="flex space-x-4">
            <a
              href="https://github.com/reynantlntno"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-500 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
              aria-label="GitHub Profile"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
            
            <a
              href="https://www.linkedin.com/in/reynan-fuertez/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-500 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
              aria-label="LinkedIn Profile"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            <a
              href="mailto:hello@reynantlntno.dev"
              class="text-gray-500 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
              aria-label="Email Contact"
            >
              <EnvelopeIcon class="h-6 w-6" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Quick Links
          </h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/about"
                class="text-gray-600 dark:text-gray-300 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
              >
                About
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/projects"
                class="text-gray-600 dark:text-gray-300 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
              >
                Projects
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/blog"
                class="text-gray-600 dark:text-gray-300 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
              >
                Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/appointments"
                class="text-gray-600 dark:text-gray-300 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
              >
                Book Appointment
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Services
          </h3>
          <ul class="space-y-3">
            <li class="text-gray-600 dark:text-gray-300">
              Web Development
            </li>
            <li class="text-gray-600 dark:text-gray-300">
              API Development
            </li>
            <li class="text-gray-600 dark:text-gray-300">
              Database Design
            </li>
            <li class="text-gray-600 dark:text-gray-300">
              Technical Consulting
            </li>
          </ul>
        </div>
      </div>

      <!-- Newsletter Signup -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-custom-slate-700">
        <div class="max-w-md">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Stay Updated
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm">
            Get notified about new blog posts and project updates.
          </p>
          
          <form @submit.prevent="subscribeToNewsletter" class="flex space-x-3">
            <div class="flex-1">
              <label for="newsletter-email" class="sr-only">Email address</label>
              <input
                id="newsletter-email"
                v-model="newsletterEmail"
                type="email"
                required
                placeholder="Enter your email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-custom-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-custom-blue-800 focus:border-transparent bg-white dark:bg-custom-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                :disabled="subscribing"
              />
            </div>
            <BaseButton
              type="submit"
              :loading="subscribing"
              size="sm"
              variant="primary"
            >
              Subscribe
            </BaseButton>
          </form>
          
          <p v-if="subscriptionMessage" class="mt-2 text-sm" :class="subscriptionSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ subscriptionMessage }}
          </p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-custom-slate-700 flex flex-col sm:flex-row justify-between items-center">
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          © {{ currentYear }} Reynan Tolentino. All rights reserved.
        </p>
        
        <div class="flex items-center space-x-6 mt-4 sm:mt-0">
          <NuxtLink
            to="/privacy"
            class="text-gray-500 dark:text-gray-400 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 text-sm transition-colors duration-200"
          >
            Privacy Policy
          </NuxtLink>
          
          <span class="text-gray-300 dark:text-gray-600">•</span>
          
          <a
            href="/sitemap.xml"
            target="_blank"
            class="text-gray-500 dark:text-gray-400 hover:text-custom-blue-800 dark:hover:text-custom-blue-400 text-sm transition-colors duration-200"
          >
            Sitemap
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EnvelopeIcon } from '@heroicons/vue/24/outline'

const newsletterEmail = ref('')
const subscribing = ref(false)
const subscriptionMessage = ref('')
const subscriptionSuccess = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const subscribeToNewsletter = async () => {
  if (!newsletterEmail.value.trim()) return

  subscribing.value = true
  subscriptionMessage.value = ''

  try {
    const { $newsletterApi } = useNuxtApp()
    const response = await $newsletterApi.subscribe(newsletterEmail.value.trim())

    if (response.success) {
      subscriptionSuccess.value = true
      subscriptionMessage.value = 'Successfully subscribed to the newsletter!'
      newsletterEmail.value = ''
    } else {
      subscriptionSuccess.value = false
      subscriptionMessage.value = response.error || 'Failed to subscribe. Please try again.'
    }
  } catch (error) {
    subscriptionSuccess.value = false
    subscriptionMessage.value = 'An error occurred. Please try again later.'
  } finally {
    subscribing.value = false
    
    // Clear message after 5 seconds
    setTimeout(() => {
      subscriptionMessage.value = ''
    }, 5000)
  }
}
</script>