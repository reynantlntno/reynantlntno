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
          <span class="font-mono text-xs text-accent-400">const contact = {</span>
        </div>
        <div class="floating-code-element absolute top-40 right-20 opacity-30 animate-float" style="animation-delay: 2s">
          <span class="font-mono text-xs text-syntax-variable">method: 'sendMessage'</span>
        </div>
        <div class="floating-code-element absolute bottom-32 left-1/4 opacity-30 animate-float" style="animation-delay: 4s">
          <span class="font-mono text-xs text-syntax-comment">// let's collaborate</span>
        </div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <!-- Terminal-style Header -->
          <div class="inline-flex items-center space-x-2 mb-6">
            <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
            <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
            <span class="font-mono text-sm text-carbon-400 ml-3">~/contact/message.js</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold text-carbon-100 mb-6 leading-tight font-mono">
            contact.send()
          </h1>
          <p class="text-xl md:text-2xl text-carbon-300 mb-8 max-w-3xl mx-auto font-mono">
            <span class="text-syntax-comment">
              // Have a project idea? Let's discuss how we can bring it to life
            </span>
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Contact Form - Takes 2 columns -->
          <div class="lg:col-span-2">
            <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
              <!-- Terminal Header -->
              <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
                <div class="flex items-center space-x-2">
                  <span class="text-syntax-comment font-mono text-xs">1</span>
                  <span class="text-syntax-comment font-mono text-xs">/* Contact Form */</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-syntax-warning rounded-full animate-pulse"></div>
                  <span class="text-xs font-mono text-carbon-400">form</span>
                </div>
              </div>

              <div class="p-8">
                <h3 class="text-lg font-semibold text-carbon-100 mb-6 font-mono">
                  <span class="text-syntax-function">sendMessage</span>
                  <span class="text-carbon-300">()</span>
                </h3>

                <!-- Success Message -->
                <div v-if="contactSuccess" class="mb-8 bg-syntax-success/10 border border-syntax-success/20 rounded-ide p-6">
                  <div class="flex items-center justify-between px-4 py-2 bg-syntax-success/20 border-b border-syntax-success/30 mb-4 -mx-6 -mt-6">
                    <span class="text-syntax-function font-mono text-sm text-syntax-success">message.sent</span>
                    <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
                  </div>
                  
                  <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-6 bg-syntax-success/20 rounded-ide flex items-center justify-center">
                      <svg class="w-8 h-8 text-syntax-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <h4 class="text-lg font-semibold text-syntax-success mb-4 font-mono">
                      <span class="text-syntax-function">messageDelivered</span>
                      <span class="text-carbon-300">()</span>
                    </h4>
                    
                    <p class="text-syntax-success mb-6 font-mono text-sm">
                      <span class="text-syntax-comment">// Thank you for reaching out! I'll get back to you within 24 hours.</span>
                    </p>
                    
                    <Button 
                      @click="resetForm" 
                      variant="outline" 
                      size="sm" 
                      class="border-syntax-success text-syntax-success hover:bg-syntax-success/10 font-mono"
                    >
                      send.another()
                    </Button>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="contactError" class="mb-8 bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-4">
                  <div class="flex items-center justify-between px-3 py-2 bg-syntax-error/20 border-b border-syntax-error/30 mb-4 -mx-4 -mt-4">
                    <span class="text-syntax-function font-mono text-sm text-syntax-error">error.handler</span>
                    <div class="w-2 h-2 bg-syntax-error rounded-full animate-pulse"></div>
                  </div>
                  
                  <div class="text-center">
                    <div class="w-12 h-12 mx-auto mb-4 bg-syntax-error/20 rounded-ide flex items-center justify-center">
                      <svg class="w-6 h-6 text-syntax-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p class="text-syntax-error font-mono text-sm mb-4">
                      <span class="text-syntax-comment">// {{ contactError }}</span>
                    </p>
                    <Button 
                      @click="clearError" 
                      variant="ghost" 
                      size="sm" 
                      class="text-syntax-error hover:bg-syntax-error/10 font-mono"
                    >
                      try.again()
                    </Button>
                  </div>
                </div>

                <!-- Contact Form -->
                <form v-if="!contactSuccess" @submit.prevent="handleSubmit" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="name" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                        <span class="text-syntax-keyword">const</span>
                        <span class="text-syntax-variable"> fullName</span>
                        <span class="text-carbon-300"> = </span>
                        <span class="text-syntax-error">*</span>
                      </label>
                      <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        required
                        :disabled="contactLoading"
                        @blur="validateField('name')"
                        class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 font-mono text-sm"
                        placeholder="Your full name..."
                      />
                      <div v-if="formErrors.name" class="mt-2">
                        <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                          <p class="text-syntax-error text-sm font-mono">{{ formErrors.name }}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label for="email" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                        <span class="text-syntax-keyword">const</span>
                        <span class="text-syntax-variable"> emailAddress</span>
                        <span class="text-carbon-300"> = </span>
                        <span class="text-syntax-error">*</span>
                      </label>
                      <input
                        id="email"
                        v-model="formData.email"
                        type="email"
                        required
                        :disabled="contactLoading"
                        @blur="validateField('email')"
                        class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 font-mono text-sm"
                        placeholder="your.email@example.com"
                      />
                      <div v-if="formErrors.email" class="mt-2">
                        <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                          <p class="text-syntax-error text-sm font-mono">{{ formErrors.email }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label for="subject" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                      <span class="text-syntax-keyword">const</span>
                      <span class="text-syntax-variable"> messageSubject</span>
                      <span class="text-carbon-300"> = </span>
                      <span class="text-syntax-error">*</span>
                    </label>
                    <input
                      id="subject"
                      v-model="formData.subject"
                      type="text"
                      required
                      :disabled="contactLoading"
                      @blur="validateField('subject')"
                      class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 font-mono text-sm"
                      placeholder="e.g., Project Collaboration Inquiry"
                    />
                    <div v-if="formErrors.subject" class="mt-2">
                      <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                        <p class="text-syntax-error text-sm font-mono">{{ formErrors.subject }}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label for="message" class="block text-sm font-medium text-carbon-200 mb-2 font-mono">
                      <span class="text-syntax-keyword">const</span>
                      <span class="text-syntax-variable"> messageContent</span>
                      <span class="text-carbon-300"> = </span>
                      <span class="text-syntax-error">*</span>
                    </label>
                    <textarea
                      id="message"
                      v-model="formData.message"
                      rows="6"
                      required
                      :disabled="contactLoading"
                      @blur="validateField('message')"
                      class="w-full px-4 py-3 bg-carbon-900/50 border border-carbon-700/50 rounded-ide text-carbon-100 placeholder-carbon-500 focus:outline-none focus:border-accent-500/50 disabled:opacity-50 resize-none font-mono text-sm"
                      placeholder="Tell me about your project, goals, timeline, budget, or any questions you have. The more details you provide, the better I can help you!"
                    ></textarea>
                    <div class="flex justify-between items-center mt-2">
                      <div v-if="formErrors.message">
                        <div class="bg-syntax-error/10 border border-syntax-error/20 rounded p-2">
                          <p class="text-syntax-error text-sm font-mono">{{ formErrors.message }}</p>
                        </div>
                      </div>
                      <div class="text-carbon-400 text-sm ml-auto font-mono">
                        {{ messageLength }}/5000
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    :loading="contactLoading"
                    :disabled="!isFormValid || contactLoading"
                    class="w-full font-mono"
                  >
                    <template #icon-left v-if="!contactLoading">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </template>
                    {{ contactLoading ? 'sending.message()' : 'send.message()' }}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <!-- Sidebar Information -->
          <div class="space-y-8">
            <!-- Contact Information -->
            <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
              <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
                <div class="flex items-center space-x-2">
                  <span class="text-syntax-comment font-mono text-xs">2</span>
                  <span class="text-syntax-comment font-mono text-xs">/* Contact Info */</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
                  <span class="text-xs font-mono text-carbon-400">info</span>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-lg font-semibold text-carbon-100 mb-6 font-mono">
                  <span class="text-syntax-function">getContactInfo</span>
                  <span class="text-carbon-300">()</span>
                </h3>
                
                <div class="space-y-6">
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-accent-500/20 rounded-ide flex items-center justify-center">
                      <svg class="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-carbon-100 font-medium font-mono text-sm">
                        <span class="text-syntax-variable">email</span>
                        <span class="text-carbon-300">:</span>
                      </h4>
                      <a href="mailto:hello@reynantlntno.dev" class="text-accent-400 hover:text-accent-300 transition-colors font-mono text-sm">
                        hello@reynantlntno.dev
                      </a>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-syntax-success/20 rounded-ide flex items-center justify-center">
                      <svg class="w-5 h-5 text-syntax-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-carbon-100 font-medium font-mono text-sm">
                        <span class="text-syntax-variable">responseTime</span>
                        <span class="text-carbon-300">:</span>
                      </h4>
                      <p class="text-carbon-300 font-mono text-sm">
                        <span class="text-syntax-string">'&lt; 24 hours'</span>
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-carbon-600/20 rounded-ide flex items-center justify-center">
                      <svg class="w-5 h-5 text-carbon-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-carbon-100 font-medium font-mono text-sm">
                        <span class="text-syntax-variable">github</span>
                        <span class="text-carbon-300">:</span>
                      </h4>
                      <a href="https://github.com/reynantlntno" target="_blank" rel="noopener noreferrer" class="text-carbon-400 hover:text-accent-400 transition-colors font-mono text-sm">
                        github.com/reynantlntno
                      </a>
                    </div>
                  </div>

                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-600/20 rounded-ide flex items-center justify-center">
                      <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-carbon-100 font-medium font-mono text-sm">
                        <span class="text-syntax-variable">linkedin</span>
                        <span class="text-carbon-300">:</span>
                      </h4>
                      <a href="https://www.linkedin.com/in/reynan-fuertez/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 transition-colors font-mono text-sm">
                        linkedin.com/in/reynan-fuertez
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
              <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
                <div class="flex items-center space-x-2">
                  <span class="text-syntax-comment font-mono text-xs">3</span>
                  <span class="text-syntax-comment font-mono text-xs">/* Quick Actions */</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                  <span class="text-xs font-mono text-carbon-400">actions</span>
                </div>
              </div>

              <div class="p-6">
                <h3 class="text-lg font-semibold text-carbon-100 mb-6 font-mono">
                  <span class="text-syntax-function">quickActions</span>
                  <span class="text-carbon-300">()</span>
                </h3>
                
                <div class="space-y-4">
                  <Button
                    to="/appointments"
                    variant="outline"
                    size="lg"
                    class="w-full justify-start border-carbon-600/50 text-carbon-200 hover:bg-carbon-700/30 hover:border-accent-500/50 font-mono"
                  >
                    <template #icon-left>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1.5 1.5M18 7l1.5 1.5M3 21l1.5-1.5M21 21l-1.5-1.5" />
                      </svg>
                    </template>
                    schedule.consultation()
                  </Button>
                  
                  <Button
                    to="/projects"
                    variant="ghost"
                    size="lg"
                    class="w-full justify-start text-carbon-300 hover:bg-carbon-700/30 hover:text-accent-400 font-mono"
                  >
                    <template #icon-left>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </template>
                    view.portfolio()
                  </Button>

                  <Button
                    href="mailto:hello@reynantlntno.dev"
                    variant="ghost"
                    size="lg"
                    class="w-full justify-start text-carbon-300 hover:bg-carbon-700/30 hover:text-accent-400 font-mono"
                  >
                    <template #icon-left>
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </template>
                    email.direct()
                  </Button>
                </div>
              </div>
            </div>

            <!-- Response Time Info -->
            <div class="bg-accent-500/10 border border-accent-500/20 rounded-ide p-6">
              <div class="space-y-3 text-sm font-mono">
                <p class="flex items-start">
                  <svg class="w-4 h-4 mr-2 mt-0.5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-accent-300">
                    <span class="text-syntax-comment">// I typically respond to messages within 24 hours</span>
                  </span>
                </p>
                <p class="flex items-start">
                  <svg class="w-4 h-4 mr-2 mt-0.5 text-accent-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-accent-300">
                    <span class="text-syntax-comment">// For urgent matters, schedule a consultation for faster response</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 lg:py-24 bg-carbon-900 border-t border-carbon-700/30">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-carbon-100 mb-4 font-mono">
            <span class="text-syntax-function">getFrequentlyAsked</span>
            <span class="text-carbon-300">()</span>
          </h2>
          <p class="text-carbon-400 font-mono">
            <span class="text-syntax-comment">// Common questions about working together</span>
          </p>
        </div>

        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden">
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-carbon-700/30 transition-colors"
            >
              <h3 class="text-carbon-100 font-medium font-mono text-sm">{{ faq.question }}</h3>
              <svg
                :class="['w-5 h-5 text-carbon-400 transition-transform', activeFaq === index ? 'rotate-180' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="activeFaq === index" class="px-6 pb-4 border-t border-carbon-700/50">
              <p class="text-carbon-300 font-mono text-sm pt-4">
                <span class="text-syntax-comment">// {{ faq.answer }}</span>
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
              <span class="text-syntax-function"> startCollaboration</span>
              <span class="text-carbon-300">() {</span>
            </h2>
            <p class="text-xl text-carbon-300 font-mono mb-4">
              <span class="text-syntax-comment">  // Ready to bring your ideas to life?</span>
            </p>
            <p class="text-lg text-carbon-400 font-mono">
              <span class="text-syntax-keyword">  return</span>
              <span class="text-syntax-string"> 'Let\'s create something extraordinary together'</span>
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              @click="scrollToTop"
              variant="accent"
              size="lg"
              class="text-base px-8 py-3 font-mono"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </template>
              send.message()
            </Button>
            <Button
              to="/appointments"
              variant="outline"
              size="lg"
              class="text-base px-8 py-3 font-mono border-carbon-600/50 text-carbon-200 hover:border-accent-500/50"
            >
              <template #icon-left>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1.5 1.5M18 7l1.5 1.5M3 21l1.5-1.5M21 21l-1.5-1.5" />
                </svg>
              </template>
              schedule.meeting()
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
      title="Contact - Reynan Tolentino"
      description="Get in touch with me for software development projects, collaborations, or general inquiries. I typically respond within 24 hours."
      keywords="contact, software developer, web development services, collaboration, freelance developer"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppointmentsStore } from '@/stores/appointments/appointments.store'
import { validateField as validateFormField, schemas } from '@/utils/validation.util'
import Button from '@/components/ui/Button.vue'
import SeoHead from '@/components/common/SeoHead.vue'

const appointmentsStore = useAppointmentsStore()

const { contactLoading, contactError, contactSuccess } = storeToRefs(appointmentsStore)

// Form state
const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const formErrors = ref({})
const activeFaq = ref(null)

// Computed
const messageLength = computed(() => formData.message.length)

const isFormValid = computed(() => {
  return formData.name.trim() &&
         formData.email.trim() &&
         formData.subject.trim() &&
         formData.message.trim() &&
         formData.message.length <= 5000 &&
         Object.keys(formErrors.value).length === 0
})

// FAQ data
const faqs = [
  {
    question: "What types of projects do you work on?",
    answer: "I specialize in web applications, APIs, database design, and full-stack development using modern technologies like Vue.js, Node.js, and MySQL. I work on everything from small business websites to complex enterprise applications."
  },
  {
    question: "What's your typical project timeline?",
    answer: "Project timelines vary based on complexity and scope. Simple websites typically take 2-4 weeks, while complex applications can take 2-6 months. I'll provide a detailed timeline estimate during our consultation."
  },
  {
    question: "Do you provide ongoing support and maintenance?",
    answer: "Yes, I offer ongoing support and maintenance packages for all projects. This includes bug fixes, security updates, performance optimization, and feature enhancements as needed."
  },
  {
    question: "How do you handle project communication?",
    answer: "I believe in transparent communication. I provide regular updates via email, schedule check-in calls, and use project management tools to keep you informed of progress throughout the development process."
  },
  {
    question: "What information should I include in my message?",
    answer: "Please describe your project goals, target audience, desired features, timeline, and budget range. The more details you provide, the better I can understand your needs and provide accurate recommendations."
  },
  {
    question: "Do you work with international clients?",
    answer: "Absolutely! I work with clients worldwide and am comfortable with remote collaboration across different time zones. All consultations can be conducted via video call."
  }
]

// Methods
const validateField = (field) => {
  const rules = schemas.contact[field]
  if (!rules) return

  const value = formData[field]
  const validation = validateFormField(value, rules)
  
  if (validation.isValid) {
    delete formErrors.value[field]
  } else {
    formErrors.value[field] = validation.errors[0]
  }
}

const handleSubmit = async () => {
  // Validate all fields
  Object.keys(formData).forEach(field => validateField(field))
  
  if (!isFormValid.value) {
    return
  }

  // Send message
  const result = await appointmentsStore.sendContactMessage(formData)
  
  if (result.success) {
    // Form will reset automatically through the resetForm function
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
  formErrors.value = {}
  appointmentsStore.clearMessages()
}

const clearError = () => {
  appointmentsStore.clearMessages()
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for form changes to clear errors
watch(formData, () => {
  // Clear specific field errors when user starts typing
  Object.keys(formErrors.value).forEach(field => {
    if (formData[field] !== undefined && formData[field].toString().trim()) {
      delete formErrors.value[field]
    }
  })
}, { deep: true })

// Character limit for message
watch(() => formData.message, (newValue) => {
  if (newValue.length > 5000) {
    formData.message = newValue.substring(0, 5000)
  }
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

/* Form validation animations */
.error-message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success message animation */
.success-animation {
  animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>