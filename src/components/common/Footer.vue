<template>
  <footer class="bg-carbon-900/95 dark:bg-carbon-950/95 backdrop-blur-md border-t border-carbon-700/50 dark:border-carbon-800/50 shadow-ide">
    <!-- Simple Terminal Header - Just one! -->
    <div class="border-b border-carbon-700/30 dark:border-carbon-800/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-10">
          <div class="flex items-center space-x-2">
            <div class="terminal-controls">
              <div class="terminal-control close"></div>
              <div class="terminal-control minimize"></div>
              <div class="terminal-control maximize"></div>
            </div>
            <span class="text-xs font-mono text-carbon-400 ml-2">~/footer.terminal</span>
          </div>
          <div class="flex items-center space-x-4 text-xs font-mono text-carbon-500">
            <span>© {{ currentYear }}</span>
            <span>•</span>
            <span>status: ready</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand Section - Simple Card -->
        <div class="col-span-1 md:col-span-2">
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <span class="text-syntax-comment text-sm font-mono">$</span>
              <span class="text-syntax-keyword text-sm font-mono">whoami</span>
            </div>
            <div class="text-carbon-100 text-xl font-mono">
              <span class="text-syntax-variable">reynantlntno</span><span class="text-accent-500">.dev</span>
            </div>
            <div class="text-carbon-300 text-sm">
              Full-stack developer specializing in modern web technologies.
              Building innovative solutions with Vue.js, Node.js, and more.
            </div>
            <div class="flex items-center space-x-4 mt-4">
              <a
                href="https://github.com/reynantlntno"
                target="_blank"
                rel="noopener noreferrer"
                class="text-carbon-400 hover:text-syntax-variable transition-colors"
                aria-label="GitHub"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/reynan-fuertez/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-carbon-400 hover:text-syntax-function transition-colors"
                aria-label="LinkedIn"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@reynantlntno.dev"
                class="text-carbon-400 hover:text-syntax-string transition-colors"
                aria-label="Email"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <!-- Navigation Links - Clean Cards -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-mono font-semibold text-carbon-100">Navigation</h3>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-syntax-success rounded-full"></div>
              <span class="text-xs font-mono text-carbon-400">active</span>
            </div>
          </div>
          
          <div class="space-y-3">
            <router-link 
              to="/about" 
              class="block text-sm font-mono text-carbon-300 hover:text-accent-400 transition-colors flex items-center space-x-2"
            >
              <span class="text-syntax-comment">></span>
              <span>about.me</span>
            </router-link>
            <router-link 
              to="/projects" 
              class="block text-sm font-mono text-carbon-300 hover:text-accent-400 transition-colors flex items-center space-x-2"
            >
              <span class="text-syntax-comment">></span>
              <span>projects.list</span>
            </router-link>
            <router-link 
              to="/blog" 
              class="block text-sm font-mono text-carbon-300 hover:text-accent-400 transition-colors flex items-center space-x-2"
            >
              <span class="text-syntax-comment">></span>
              <span>blog.posts</span>
            </router-link>
            <router-link 
              to="/contact" 
              class="block text-sm font-mono text-carbon-300 hover:text-accent-400 transition-colors flex items-center space-x-2"
            >
              <span class="text-syntax-comment">></span>
              <span>contact.form</span>
            </router-link>
          </div>
        </div>
        
        <!-- Services - Clean Cards -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-mono font-semibold text-carbon-100">Services</h3>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-syntax-warning rounded-full"></div>
              <span class="text-xs font-mono text-carbon-400">available</span>
            </div>
          </div>
          
          <div class="space-y-3">
            <router-link 
              to="/appointments" 
              class="block text-sm font-mono text-carbon-300 hover:text-accent-400 transition-colors flex items-center space-x-2"
            >
              <span class="text-syntax-comment">></span>
              <span>consultations</span>
            </router-link>
            <div class="text-sm font-mono text-carbon-400 flex items-center space-x-2">
              <span class="text-syntax-comment">></span>
              <span>web_development</span>
            </div>
            <div class="text-sm font-mono text-carbon-400 flex items-center space-x-2">
              <span class="text-syntax-comment">></span>
              <span>fullstack_solutions</span>
            </div>
            <div class="text-sm font-mono text-carbon-400 flex items-center space-x-2">
              <span class="text-syntax-comment">></span>
              <span>tech_consulting</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Newsletter Section - Simple Card -->
      <div class="mt-12 pt-8 border-t border-carbon-700/50 dark:border-carbon-800/50">
        <div class="max-w-md">
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <span class="text-syntax-comment text-sm font-mono">#</span>
              <h3 class="text-lg font-mono font-semibold text-carbon-100">Stay Updated</h3>
            </div>
            <div class="text-sm text-carbon-300">
              Subscribe for notifications about new blog posts and project updates.
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>
      
      <!-- Status Bar -->
      <div class="status-bar mt-8 pt-8 border-t border-carbon-700/50 dark:border-carbon-800/50">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-4">
            <span class="text-carbon-400">© {{ currentYear }} Reynan Tolentino</span>
            <div class="flex items-center space-x-1">
              <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
              <span class="text-carbon-500">all rights reserved</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="status-item">
              <span class="text-carbon-500">files:</span>
              <a href="/humans.txt" class="text-carbon-400 hover:text-carbon-200 transition-colors">
                humans.txt
              </a>
            </div>
            <div class="status-item">
              <span class="text-carbon-500">map:</span>
              <a href="/sitemap.xml" class="text-carbon-400 hover:text-carbon-200 transition-colors">
                sitemap.xml
              </a>
            </div>
            <div class="status-item">
              <span class="text-carbon-500">sec:</span>
              <a href="/.well-known/security.txt" class="text-carbon-400 hover:text-carbon-200 transition-colors">
                security.txt
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import NewsletterForm from '@/components/common/NewsletterForm.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>