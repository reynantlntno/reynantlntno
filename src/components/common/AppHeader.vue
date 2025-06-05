<template>
  <header class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-custom-slate-800/90 border-b border-gray-200 dark:border-custom-slate-700">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and brand -->
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-custom-blue-800 dark:hover:text-custom-blue-400 transition-colors duration-200"
          >
            <span class="font-mono">reynantlntno.dev</span>
          </NuxtLink>
        </div>

        <!-- Desktop navigation -->
        <div class="hidden md:flex md:items-center md:space-x-8">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              'nav-link',
              $route.path === item.href || ($route.path.startsWith(item.href) && item.href !== '/')
                ? 'nav-link-active'
                : ''
            ]"
          >
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-4">
          <!-- Theme toggle -->
          <ThemeToggle />
          
          <!-- Contact CTA -->
          <BaseButton
            to="/contact"
            variant="primary"
            size="sm"
            class="hidden sm:inline-flex"
          >
            Get In Touch
          </BaseButton>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-blue-800"
          >
            <Bars3Icon v-if="!mobileMenuOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile navigation -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="mobileMenuOpen"
          class="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-custom-slate-800 border-b border-gray-200 dark:border-custom-slate-700 shadow-lg"
        >
          <div class="px-4 py-2 space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              @click="mobileMenuOpen = false"
              :class="[
                'block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200',
                $route.path === item.href || ($route.path.startsWith(item.href) && item.href !== '/')
                  ? 'bg-custom-blue-800 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-custom-slate-700'
              ]"
            >
              {{ item.name }}
            </NuxtLink>
            
            <!-- Mobile contact button -->
            <div class="pt-2">
              <BaseButton
                to="/contact"
                variant="primary"
                class="w-full"
                @click="mobileMenuOpen = false"
              >
                Get In Touch
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Appointments', href: '/appointments' }
]

// Close mobile menu when clicking outside
const handleClickOutside = (event) => {
  if (mobileMenuOpen.value && !event.target.closest('nav')) {
    mobileMenuOpen.value = false
  }
}

// Close mobile menu on route change
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>