<template>
  <div class="min-h-screen bg-carbon-950">
    <!-- Global Reading Progress Bar -->
    <div 
      class="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-300 ease-out z-50"
      :style="{ width: `${readingProgress}%` }"
    ></div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-8">
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="font-mono text-carbon-300">compiling.article()</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="max-w-md mx-auto text-center px-4">
        <div class="bg-syntax-error/10 border border-syntax-error/20 rounded-ide p-8">
          <div class="w-16 h-16 mx-auto mb-6 bg-carbon-800/50 rounded-ide flex items-center justify-center">
            <svg class="w-8 h-8 text-syntax-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="font-mono text-sm text-syntax-error mb-4">
            <div class="flex items-center justify-center space-x-2 mb-2">
              <span class="text-syntax-comment">$</span>
              <span>article.fetch()</span>
            </div>
            <div class="text-center">Error: {{ error }}</div>
          </div>
          <Button to="/blog" variant="outline" class="font-mono">
            back.to.blog()
          </Button>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="currentPost" class="min-h-screen">
      <!-- Article Header -->
      <header class="py-16 lg:py-24 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="grid-background"></div>
        </div>

        <!-- Featured Image Background -->
        <div 
          v-if="currentPost.image_url" 
          class="absolute inset-0 opacity-10"
        >
          <img 
            :src="currentPost.image_url" 
            :alt="currentPost.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/80 to-transparent"></div>
        </div>
        
        <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <div class="flex items-center space-x-2 text-sm font-mono">
              <router-link 
                to="/blog" 
                class="text-accent-400 hover:text-accent-300 transition-colors flex items-center space-x-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>blog</span>
              </router-link>
              <span class="text-carbon-500">/</span>
              <span class="text-carbon-300">{{ currentPost.slug || 'loading' }}</span>
            </div>
          </nav>

          <!-- File Header -->
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 overflow-hidden mb-8">
            <div class="flex items-center justify-between px-4 py-2 bg-carbon-800 border-b border-carbon-700">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-syntax-error"></div>
                <div class="w-3 h-3 rounded-full bg-syntax-warning"></div>
                <div class="w-3 h-3 rounded-full bg-syntax-success"></div>
                <span class="font-mono text-xs text-carbon-400 ml-2">
                  ~/blog/{{ currentPost.slug }}.md
                </span>
              </div>
              <div class="flex items-center space-x-4">
                <!-- Share Button -->
                <div class="relative">
                  <button
                    @click="toggleShareMenu"
                    class="p-2 text-carbon-400 hover:text-accent-400 transition-colors relative"
                    :title="'Share article'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                  
                  <!-- Share Menu Dropdown -->
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <div
                      v-if="showShareMenu"
                      v-click-outside="() => showShareMenu = false"
                      class="absolute right-0 top-full mt-2 w-48 bg-carbon-800 border border-carbon-700 rounded-ide shadow-lg z-50"
                    >
                      <div class="py-1">
                        <a
                          :href="twitterShareUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          @click="handleShareClick('𝕏 (Twitter)')"
                          class="flex items-center px-4 py-2 text-sm text-carbon-300 hover:bg-carbon-700 hover:text-white transition-colors"
                        >
                          <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          Share on 𝕏
                        </a>
                        <a
                          :href="linkedinShareUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          @click="handleShareClick('LinkedIn')"
                          class="flex items-center px-4 py-2 text-sm text-carbon-300 hover:bg-carbon-700 hover:text-white transition-colors"
                        >
                          <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          Share on LinkedIn
                        </a>
                        <button
                          @click="copyUrl"
                          class="flex items-center w-full px-4 py-2 text-sm text-carbon-300 hover:bg-carbon-700 hover:text-white transition-colors text-left"
                        >
                          <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-syntax-success rounded-full animate-pulse"></div>
                  <span class="text-xs font-mono text-carbon-400">article</span>
                </div>
              </div>
            </div>
            
            <div class="p-8">
              <!-- Article Metadata -->
              <div class="flex flex-wrap items-center gap-4 mb-6 text-sm font-mono">
                <time 
                  :datetime="currentPost.published_at"
                  class="text-carbon-400"
                >
                  {{ formatDate(currentPost.published_at, 'MMM dd, yyyy') }}
                </time>
                <span v-if="currentPost.read_time" class="flex items-center text-carbon-400">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatReadingTime(currentPost.read_time) }}
                </span>
                <span v-if="currentPost.author" class="text-carbon-400">
                  by {{ currentPost.author }}
                </span>
              </div>

              <!-- Title -->
              <h1 class="text-3xl md:text-5xl font-bold text-carbon-100 mb-6 leading-tight font-mono">
                <span class="text-syntax-string">"{{ currentPost.title }}"</span>
              </h1>
              
              <!-- Summary -->
              <div v-if="currentPost.summary" class="text-lg text-carbon-300 mb-6 font-mono leading-relaxed">
                <span class="text-syntax-comment">// {{ currentPost.summary }}</span>
              </div>

              <!-- Tags -->
              <div v-if="currentPost.tags && currentPost.tags.length > 0" class="mb-6">
                <div class="flex flex-wrap gap-2">
                  <router-link
                    v-for="tag in currentPost.tags"
                    :key="tag"
                    :to="`/blog?tag=${encodeURIComponent(tag)}`"
                    class="bg-carbon-700/50 text-accent-400 px-3 py-1 rounded-ide text-sm font-mono border border-carbon-600/50 hover:border-accent-500/50 transition-colors"
                  >
                    {{ tag.toLowerCase().replace(/\s+/g, '_') }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Table of Contents (if available) -->
      <div 
        v-if="tableOfContents.length > 0" 
        class="sticky top-20 z-40 mb-8"
      >
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-4">
            <details class="group">
              <summary class="cursor-pointer flex items-center justify-between font-mono text-sm text-carbon-300 hover:text-accent-400 transition-colors">
                <span>Table of Contents</span>
                <svg class="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <nav class="mt-4 pl-4 border-l border-carbon-700">
                <ul class="space-y-2">
                  <li 
                    v-for="(heading, index) in tableOfContents" 
                    :key="index"
                    :class="[
                      'font-mono text-sm',
                      heading.level === 1 ? 'text-carbon-200' : 'text-carbon-400',
                      heading.level > 1 ? `ml-${(heading.level - 1) * 4}` : ''
                    ]"
                  >
                    <a 
                      :href="`#${heading.id}`"
                      class="hover:text-accent-400 transition-colors"
                      @click="scrollToHeading(heading.id)"
                    >
                      {{ heading.text }}
                    </a>
                  </li>
                </ul>
              </nav>
            </details>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <main class="pb-16 lg:pb-24" ref="contentArea">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article class="bg-carbon-800/30 rounded-ide border border-carbon-700/30 overflow-hidden">
            <!-- Article Header -->
            <div class="flex items-center justify-between px-6 py-3 bg-carbon-800/50 border-b border-carbon-700/50">
              <div class="flex items-center space-x-2">
                <span class="text-syntax-comment font-mono text-xs">1</span>
                <span class="text-syntax-comment font-mono text-xs">/* Article Content */</span>
              </div>
              <div class="text-xs font-mono text-carbon-400">
                {{ formatFileSize(currentPost.content?.length || 0) }}
              </div>
            </div>
            
            <!-- Content -->
            <div class="p-8 lg:p-12">
              <div 
                ref="articleContent"
                class="prose prose-lg prose-invert max-w-none
                       prose-headings:font-mono prose-headings:text-carbon-100
                       prose-h1:text-3xl prose-h1:text-accent-400 prose-h1:border-b prose-h1:border-carbon-700/50 prose-h1:pb-4
                       prose-h2:text-2xl prose-h2:text-accent-400 prose-h2:mt-12 prose-h2:mb-6
                       prose-h3:text-xl prose-h3:text-carbon-200 prose-h3:mt-8 prose-h3:mb-4
                       prose-p:text-carbon-300 prose-p:leading-relaxed prose-p:mb-6
                       prose-a:text-accent-400 prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-carbon-100 prose-strong:font-semibold
                       prose-code:bg-carbon-700/50 prose-code:text-accent-400 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
                       prose-pre:bg-carbon-900 prose-pre:border prose-pre:border-carbon-700/50 prose-pre:rounded-ide
                       prose-blockquote:border-l-4 prose-blockquote:border-accent-500 prose-blockquote:bg-carbon-700/20 prose-blockquote:p-4 prose-blockquote:rounded-r-ide
                       prose-ul:text-carbon-300 prose-ol:text-carbon-300
                       prose-li:mb-2 prose-li:text-carbon-300
                       prose-img:rounded-ide prose-img:border prose-img:border-carbon-700/50"
                v-html="formattedContent"
              ></div>
            </div>
          </article>
        </div>
      </main>

      <!-- Share Section -->
      <section class="py-12 bg-carbon-900/50 border-t border-carbon-700/30">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-carbon-800/50 rounded-ide border border-carbon-700/50 p-8">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 class="text-lg font-semibold text-carbon-100 mb-2 font-mono">
                  <span class="text-syntax-function">share</span>
                  <span class="text-carbon-300">.article()</span>
                </h3>
                <p class="text-carbon-400 font-mono text-sm">
                  <span class="text-syntax-comment">// Help others discover this content</span>
                </p>
              </div>
              
              <div class="flex flex-wrap gap-3">
                <a
                  :href="twitterShareUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="handleShareClick('𝕏 (Twitter)')"
                  class="flex items-center space-x-2 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-ide transition-all duration-200 hover:scale-105 font-mono text-sm"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>𝕏()</span>
                </a>
                
                <a
                  :href="linkedinShareUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="handleShareClick('LinkedIn')"
                  class="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-ide transition-all duration-200 hover:scale-105 font-mono text-sm"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>linkedin()</span>
                </a>

                <button
                  @click="copyUrl"
                  class="flex items-center space-x-2 bg-carbon-700 hover:bg-carbon-600 text-white px-4 py-2 rounded-ide transition-all duration-200 hover:scale-105 font-mono text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>copy.link()</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Related Articles -->
      <section v-if="relatedPosts.length > 0" class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-2xl md:text-3xl font-bold text-carbon-100 mb-4 font-mono">
              <span class="text-syntax-function">getRelatedArticles</span>
              <span class="text-carbon-300">()</span>
            </h2>
            <p class="text-carbon-400 font-mono">
              <span class="text-syntax-comment">// You might also find these interesting</span>
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard
              v-for="(post, index) in relatedPosts"
              :key="post.id"
              :post="post"
              :post-index="index + 1"
              :class="[
                'transform hover:scale-105 transition-all duration-300',
                'opacity-0 animate-fade-in'
              ]"
              :style="{ animationDelay: `${index * 0.1}s` }"
            />
          </div>
        </div>
      </section>

      <!-- Navigation -->
      <section class="py-16 border-t border-carbon-700/30">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h3 class="text-xl font-bold text-carbon-100 mb-6 font-mono">
              <span class="text-syntax-function">exploreMore</span>
              <span class="text-carbon-300">()</span>
            </h3>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <Button to="/blog" variant="accent" size="lg" class="font-mono">
                <template #icon-left>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </template>
                view.all.articles()
              </Button>
              <Button to="/" variant="outline" size="lg" class="font-mono">
                <template #icon-left>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </template>
                home.directory()
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- SEO Head -->
    <SeoHead
      v-if="currentPost"
      :title="`${currentPost.title} - Reynan Tolentino`"
      :description="currentPost.meta_description || currentPost.summary || generateExcerpt(currentPost.content)"
      :keywords="currentPost.tags ? currentPost.tags.join(', ') : undefined"
      :image="currentPost.image_url"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBlogStore } from '@/stores/blog/blog.store'
import { useToastStore } from '@/stores/ui/toast.store'
import { formatMarkdown, generateExcerpt, formatReadingTime } from '@/utils/format.util'
import { formatDate } from '@/utils/date.util'
import Button from '@/components/ui/Button.vue'
import BlogCard from '@/components/blog/BlogCard.vue'
import SeoHead from '@/components/common/SeoHead.vue'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const toastStore = useToastStore()

const { currentPost, loading, error, posts } = storeToRefs(blogStore)

// Local state
const readingProgress = ref(0)
const showShareMenu = ref(false)
const articleContent = ref(null)
const contentArea = ref(null)
const tableOfContents = ref([])

// Computed
const formattedContent = computed(() => {
  if (!currentPost.value?.content) return ''
  return formatMarkdown(currentPost.value.content)
})

const currentUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  return `${window.location.origin}${route.fullPath}`
})

const twitterShareUrl = computed(() => {
  const text = currentPost.value?.title || ''
  const url = currentUrl.value
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
})

const linkedinShareUrl = computed(() => {
  const url = currentUrl.value
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
})

const relatedPosts = computed(() => {
  if (!currentPost.value || !posts.value.length) return []
  
  // Filter out current post and get related by tags
  const related = posts.value
    .filter(post => post.id !== currentPost.value.id)
    .filter(post => {
      if (!currentPost.value.tags || !post.tags) return false
      return currentPost.value.tags.some(tag => post.tags.includes(tag))
    })
    .slice(0, 3)
  
  return related
})

// Click outside directive for share menu
const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}

// Methods
const updateReadingProgress = () => {
  if (!contentArea.value || !articleContent.value) return
  
  try {
    // Get scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    // Get content area position and dimensions
    const contentRect = contentArea.value.getBoundingClientRect()
    const contentTop = scrollTop + contentRect.top
    const contentHeight = contentArea.value.offsetHeight
    const windowHeight = window.innerHeight
    
    // Calculate reading progress
    const startReading = contentTop - windowHeight * 0.1 // Start when content is 10% visible
    const endReading = contentTop + contentHeight - windowHeight * 0.9 // End when 90% through
    
    if (scrollTop < startReading) {
      readingProgress.value = 0
    } else if (scrollTop >= endReading) {
      readingProgress.value = 100
    } else {
      const progress = ((scrollTop - startReading) / (endReading - startReading)) * 100
      readingProgress.value = Math.round(Math.max(0, Math.min(100, progress)))
    }
  } catch (err) {
    console.warn('Error calculating reading progress:', err)
  }
}

const extractTableOfContents = () => {
  if (!articleContent.value) return
  
  try {
    const headings = articleContent.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
    tableOfContents.value = Array.from(headings).map((heading, index) => {
      const id = heading.id || `heading-${index}`
      if (!heading.id) {
        heading.id = id
      }
      
      return {
        id,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1))
      }
    })
  } catch (err) {
    console.warn('Error extracting table of contents:', err)
  }
}

const scrollToHeading = (id) => {
  event.preventDefault()
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    
    // Show toast notification
    toastStore.show({
      type: 'info',
      variant: 'terminal',
      title: 'Navigation',
      message: `Scrolled to: ${element.textContent.substring(0, 50)}...`,
      duration: 2000
    })
  }
  showShareMenu.value = false
}

const toggleShareMenu = () => {
  showShareMenu.value = !showShareMenu.value
}

const handleShareClick = (platform) => {
  showShareMenu.value = false
  
  // Show share toast
  toastStore.show({
    type: 'info',
    variant: 'code',
    title: 'Article Shared',
    message: `Opening ${platform} share dialog`,
    duration: 3000
  })
}

const copyUrl = async () => {
  try {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl.value
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    } else {
      await navigator.clipboard.writeText(currentUrl.value)
    }
    
    showShareMenu.value = false
    
    // Show success toast
    toastStore.show({
      type: 'success',
      variant: 'terminal',
      title: 'Link Copied!',
      message: 'Article URL copied to clipboard',
      duration: 3000
    })
  } catch (err) {
    console.error('Failed to copy URL:', err)
    
    showShareMenu.value = false
    
    // Show error toast
    toastStore.show({
      type: 'error',
      variant: 'code',
      title: 'Copy Failed',
      message: 'Could not copy URL to clipboard',
      duration: 4000
    })
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 bytes'
  const k = 1024
  const sizes = ['bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Throttled scroll handler for better performance
let scrollTimeout = null
const throttledScrollHandler = () => {
  if (scrollTimeout) return
  
  scrollTimeout = setTimeout(() => {
    updateReadingProgress()
    scrollTimeout = null
  }, 16) // ~60fps
}

// Lifecycle
onMounted(async () => {
  const slug = route.params.slug
  if (slug) {
    // Show loading toast
    toastStore.show({
      type: 'info',
      variant: 'terminal',
      title: 'Loading Article',
      message: `Fetching "${slug}"...`,
      duration: 2000
    })
    
    const result = await blogStore.fetchPostBySlug(slug)
    if (!result.success) {
      // Show error toast
      toastStore.show({
        type: 'error',
        variant: 'code',
        title: 'Article Not Found',
        message: 'The requested article could not be found',
        duration: 5000
      })
      
      router.push('/blog')
      return
    }
    
    // Show success toast for article loaded
    toastStore.show({
      type: 'success',
      variant: 'terminal',
      title: 'Article Loaded',
      message: `"${currentPost.value.title}" is ready to read`,
      duration: 3000
    })
  }
  
  // Setup scroll listener for reading progress
  window.addEventListener('scroll', throttledScrollHandler, { passive: true })
  window.addEventListener('resize', updateReadingProgress, { passive: true })
  
  // Extract table of contents after content is rendered
  await nextTick()
  setTimeout(() => {
    extractTableOfContents()
    updateReadingProgress() // Initial calculation
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledScrollHandler)
  window.removeEventListener('resize', updateReadingProgress)
  
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})

// Watch for route changes
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    // Reset progress
    readingProgress.value = 0
    tableOfContents.value = []
    
    const result = await blogStore.fetchPostBySlug(newSlug)
    if (!result.success) {
      toastStore.show({
        type: 'error',
        variant: 'terminal',
        title: 'Article Not Found',
        message: 'The requested article could not be found',
        duration: 5000
      })
      
      router.push('/blog')
      return
    }
    
    await nextTick()
    setTimeout(() => {
      extractTableOfContents()
      updateReadingProgress() // Recalculate after new content
    }, 100)
  }
})

// Watch for content changes to update TOC and progress
watch(formattedContent, async () => {
  await nextTick()
  setTimeout(() => {
    extractTableOfContents()
    updateReadingProgress() // Recalculate after content change
  }, 100)
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

/* Custom prose styles */
:deep(.prose) {
  color: inherit;
}

:deep(.prose pre) {
  position: relative;
  overflow-x: auto;
}

:deep(.prose pre code) {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
  color: inherit !important;
}

:deep(.prose code::before),
:deep(.prose code::after) {
  content: none !important;
}

/* Code highlighting */
:deep(.prose pre[class*="language-"]) {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 0.375rem;
  background: rgb(13 17 23) !important;
  border: 1px solid rgb(60 60 60 / 0.5);
}

:deep(.prose pre[class*="language-"]::before) {
  content: attr(data-language);
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-family: ui-monospace, SFMono-Regular, monospace;
  background: rgb(60 60 60 / 0.5);
  color: rgb(156 163 175);
  border-bottom-left-radius: 0.25rem;
}

/* Responsive table of contents */
@media (max-width: 768px) {
  .toc-mobile {
    position: static;
    margin-bottom: 2rem;
  }
}

/* Smooth scrolling for the entire page */
html {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid rgba(0, 122, 204, 0.5);
  outline-offset: 2px;
}

/* Share menu animation */
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>