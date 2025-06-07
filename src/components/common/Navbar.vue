<!-- filepath: /Users/reynantolentino/reynantlntno.dev/src/components/common/Navbar.vue -->
<template>
  <nav class="sticky top-0 z-50 bg-carbon-900/95 dark:bg-carbon-950/95 backdrop-blur-md border-b border-carbon-700/50 dark:border-carbon-800/50 shadow-ide">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-14">
        <!-- Terminal-style Logo -->
        <div class="flex-shrink-0 flex items-center">
          <router-link 
            to="/" 
            class="flex items-center space-x-2 group"
          >
            <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
            <div class="ml-3 font-mono text-sm font-medium">
              <span class="text-carbon-100 group-hover:text-accent-400 transition-colors">
                ~/reynantlntno
              </span>
              <span class="text-accent-500">.dev</span>
              <span class="text-syntax-success animate-pulse">▊</span>
            </div>
          </router-link>
        </div>
        
        <!-- Terminal Tabs (Desktop Navigation) -->
        <div class="hidden md:flex items-center">
          <div class="flex bg-carbon-800/50 dark:bg-carbon-900/50 rounded-ide p-1 space-x-1">
            <router-link
              v-for="(item, index) in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                'relative px-3 py-1.5 text-xs font-mono font-medium rounded-sm transition-all duration-200',
                'flex items-center space-x-2',
                isActiveRoute(item) 
                  ? 'bg-carbon-700 dark:bg-carbon-800 text-accent-400 shadow-inner-ide' 
                  : 'text-carbon-300 hover:text-carbon-100 hover:bg-carbon-700/50'
              ]"
            >
              <span class="w-2 h-2 rounded-full" :class="getTabIndicator(item)"></span>
              <span>{{ item.label.toLowerCase() }}</span>
              <button 
                v-if="isActiveRoute(item)"
                class="w-3 h-3 rounded-full hover:bg-carbon-600 flex items-center justify-center text-carbon-400 hover:text-carbon-200"
                @click.prevent.stop
              >
                <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </router-link>
          </div>
        </div>
        
        <!-- Terminal Controls -->
        <div class="flex items-center space-x-2">
          <ThemeToggle />
          
          <!-- Terminal Menu Button (Mobile) -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-ide bg-carbon-800/50 hover:bg-carbon-700/50 text-carbon-300 hover:text-carbon-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500/50 relative z-50"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle navigation menu"
          >
            <!-- Animated hamburger/close icon -->
            <div class="w-5 h-5 flex flex-col justify-center items-center">
              <span 
                :class="[
                  'block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out',
                  mobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'
                ]"
              ></span>
              <span 
                :class="[
                  'block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out',
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                ]"
              ></span>
              <span 
                :class="[
                  'block h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out',
                  mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'
                ]"
              ></span>
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Full-Screen Mobile Menu Overlay -->
    <Teleport to="body">
      <div 
        v-show="mobileMenuOpen"
        class="fixed inset-0 z-50 md:hidden"
        @click="closeMobileMenu"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-carbon-950/98 backdrop-blur-lg"
          :class="mobileMenuOpen ? 'menu-backdrop-enter' : 'menu-backdrop-exit'"
        ></div>
        
        <!-- Menu Content -->
        <div 
          class="relative h-full flex flex-col"
          :class="mobileMenuOpen ? 'menu-content-enter' : 'menu-content-exit'"
          @click.stop
        >
          <!-- Terminal Header -->
          <div class="flex items-center justify-between p-6 border-b border-carbon-700/30">
            <div class="flex items-center space-x-3">
              <div class="flex space-x-1.5">
                <div class="w-3 h-3 rounded-full bg-syntax-error animate-pulse"></div>
                <div class="w-3 h-3 rounded-full bg-syntax-warning animate-pulse" style="animation-delay: 0.2s"></div>
                <div class="w-3 h-3 rounded-full bg-syntax-success animate-pulse" style="animation-delay: 0.4s"></div>
              </div>
              <div class="font-mono text-sm text-carbon-300">
                <span class="text-syntax-comment">// </span>
                <span class="text-syntax-function">navigation</span>
                <span class="text-carbon-300">.menu</span>
              </div>
            </div>
            <button
              @click="closeMobileMenu"
              class="p-2 rounded-ide bg-carbon-800/50 hover:bg-carbon-700/50 text-carbon-300 hover:text-carbon-100 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500/50"
              aria-label="Close navigation menu"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Terminal Content Area -->
          <div class="flex-1 p-6 overflow-y-auto">
            <!-- Command Prompt Style Header -->
            <div class="mb-8">
              <div class="font-mono text-sm text-carbon-400 mb-2">
                <span class="text-syntax-comment">$</span>
                <span class="typing-animation">cd ~/navigation && ls -la</span>
              </div>
              <div class="font-mono text-xs text-carbon-500 space-y-1">
                <div>total {{ navigationItems.length }}</div>
                <div class="text-syntax-comment">// Available routes:</div>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="space-y-2">
              <router-link
                v-for="(item, index) in navigationItems"
                :key="item.name"
                :to="item.to"
                @click="closeMobileMenu"
                :class="[
                  'group flex items-center space-x-4 p-4 rounded-ide transition-all duration-300 hover:bg-carbon-800/30 focus:bg-carbon-800/50 focus:outline-none',
                  isActiveRoute(item) 
                    ? 'bg-gradient-to-r from-accent-900/20 to-accent-800/10 border-l-4 border-accent-500 text-accent-400' 
                    : 'text-carbon-300 hover:text-carbon-100 border-l-4 border-transparent hover:border-carbon-600/50'
                ]"
                :style="{ animationDelay: `${index * 0.1}s` }"
                class="menu-item-enter"
              >
                <!-- File Icon -->
                <div class="flex-shrink-0">
                  <div 
                    :class="[
                      'w-8 h-8 rounded-ide flex items-center justify-center text-sm font-mono transition-colors',
                      isActiveRoute(item) 
                        ? 'bg-accent-500/20 text-accent-400' 
                        : 'bg-carbon-700/50 text-carbon-400 group-hover:bg-carbon-600/50 group-hover:text-carbon-200'
                    ]"
                  >
                    {{ getFileExtension(item.name) }}
                  </div>
                </div>

                <!-- Link Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <span class="font-mono text-base font-medium">
                      {{ item.label.toLowerCase() }}
                    </span>
                    <span 
                      :class="[
                        'w-2 h-2 rounded-full transition-colors',
                        isActiveRoute(item) ? 'bg-accent-500 animate-pulse' : 'bg-carbon-600'
                      ]"
                    ></span>
                  </div>
                  <div class="font-mono text-xs text-carbon-500 mt-1">
                    <span class="text-syntax-comment">// </span>
                    {{ getRouteDescription(item.name) }}
                  </div>
                </div>

                <!-- Arrow -->
                <div class="flex-shrink-0">
                  <svg 
                    class="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </router-link>
            </nav>

            <!-- Terminal Status -->
            <div class="mt-12 pt-6 border-t border-carbon-700/30">
              <div class="font-mono text-xs text-carbon-500 space-y-2">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
                  <span>System online</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-accent-500 rounded-full"></div>
                  <span>Route: {{ $route.path }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-syntax-warning rounded-full"></div>
                  <span>{{ new Date().toLocaleTimeString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Terminal Footer -->
          <div class="p-6 border-t border-carbon-700/30">
            <div class="font-mono text-xs text-carbon-500 text-center">
              <span class="text-syntax-comment">// </span>
              Press <kbd class="px-2 py-1 bg-carbon-800/50 rounded border border-carbon-600/50 text-carbon-300">ESC</kbd> to close
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'home', label: 'Home', to: '/', icon: 'home' },
  { name: 'about', label: 'About', to: '/about', icon: 'user' },
  { name: 'projects', label: 'Projects', to: '/projects', activePath: '/projects', icon: 'folder' },
  { name: 'blog', label: 'Blog', to: '/blog', activePath: '/blog', icon: 'document' },
  { name: 'appointments', label: 'Schedule', to: '/appointments', activePath: '/appointments', icon: 'calendar' },
  { name: 'contact', label: 'Contact', to: '/contact', icon: 'mail' }
]

const isActiveRoute = (item) => {
  // Special handling for home route to avoid always matching
  if (item.name === 'home') {
    return route.path === '/' || route.name === 'home'
  }
  
  // For other routes, use activePath if available, otherwise use 'to'
  const pathToMatch = item.activePath || item.to
  return route.name === item.name || route.path.startsWith(pathToMatch)
}

const getTabIndicator = (item) => {
  if (isActiveRoute(item)) return 'bg-accent-500'
  return 'bg-carbon-600'
}

const getFileExtension = (routeName) => {
  const extensions = {
    home: 'js',
    about: 'md',
    projects: 'vue',
    blog: 'jsx',
    appointments: 'ts',
    contact: 'json'
  }
  return extensions[routeName] || 'txt'
}

const getRouteDescription = (routeName) => {
  const descriptions = {
    home: 'Welcome & introduction',
    about: 'Developer profile & skills',
    projects: 'Portfolio & case studies',
    blog: 'Articles & insights',
    appointments: 'Schedule consultation',
    contact: 'Get in touch'
  }
  return descriptions[routeName] || 'Navigation route'
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Handle ESC key
const handleEscKey = (event) => {
  if (event.key === 'Escape' && mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Menu Animations */
.menu-backdrop-enter {
  animation: backdrop-fade-in 0.3s ease-out;
}

.menu-backdrop-exit {
  animation: backdrop-fade-out 0.2s ease-in;
}

.menu-content-enter {
  animation: content-slide-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-content-exit {
  animation: content-slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item-enter {
  opacity: 1;
  transform: translateX(0);
}

@media (min-width: 768px) {
  .menu-item-enter {
    opacity: 0;
    transform: translateX(-20px);
    animation: item-fade-in 0.5s ease-out forwards;
  }
}

@keyframes backdrop-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes backdrop-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes content-slide-in {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes content-slide-out {
  from { 
    opacity: 1;
    transform: translateY(0);
  }
  to { 
    opacity: 0;
    transform: translateY(-20px);
  }
}

@keyframes item-fade-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Typing Animation */
.typing-animation {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(30, end) infinite;
}

@keyframes typing {
  0%, 50% { width: 0; }
  100% { width: 100%; }
}

/* Smooth transitions for hamburger menu */
.md\:hidden button span {
  transform-origin: center;
}

/* Custom scrollbar for mobile menu */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(60, 60, 60, 0.3);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 122, 204, 0.5);
  border-radius: 2px;
}

/* Prevent scroll on body when menu is open */
body.menu-open {
  overflow: hidden;
}

/* Focus styles for accessibility */
nav a:focus,
button:focus {
  outline: 2px solid rgba(0, 122, 204, 0.5);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .menu-backdrop-enter,
  .menu-backdrop-exit {
    background: rgba(0, 0, 0, 0.95);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .menu-backdrop-enter,
  .menu-backdrop-exit,
  .menu-content-enter,
  .menu-content-exit,
  .menu-item-enter,
  .typing-animation {
    animation: none;
  }
  
  .menu-item-enter {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>