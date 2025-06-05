<template>
  <div 
    class="markdown-content prose prose-lg dark:prose-invert max-w-none"
    v-html="renderedContent"
  ></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

// Configure marked options
const markedOptions = computed(() => ({
  breaks: true,
  gfm: true,
  headerIds: true,
  smartLists: true,
  smartypants: true,
  ...props.options
}))

// Custom renderer for enhanced styling
const renderer = new marked.Renderer()

// Customize heading rendering with anchor links
renderer.heading = function(text, level) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
  return `
    <h${level} id="${escapedText}" class="group relative">
      <a href="#${escapedText}" class="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-custom-blue-800 dark:text-custom-blue-400 no-underline" aria-label="Link to ${text}">
        #
      </a>
      ${text}
    </h${level}>
  `
}

// Customize code block rendering
renderer.code = function(code, language) {
  const validLanguage = language && language.length > 0 ? language : 'text'
  return `
    <div class="code-block-wrapper relative group">
      <div class="code-header flex items-center justify-between bg-gray-800 text-gray-200 px-4 py-2 rounded-t-lg text-sm">
        <span class="font-mono text-xs uppercase tracking-wide">${validLanguage}</span>
        <button 
          class="copy-button opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          onclick="copyToClipboard(this)"
          data-code="${encodeURIComponent(code)}"
        >
          Copy
        </button>
      </div>
      <pre class="!mt-0 !rounded-t-none"><code class="language-${validLanguage}">${escapeHtml(code)}</code></pre>
    </div>
  `
}

// Customize inline code rendering
renderer.codespan = function(code) {
  return `<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">${escapeHtml(code)}</code>`
}

// Customize link rendering for external links
renderer.link = function(href, title, text) {
  const isExternal = href.startsWith('http') && !href.includes('reynantlntno.dev')
  const titleAttr = title ? ` title="${title}"` : ''
  const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
  
  return `<a href="${href}"${titleAttr}${externalAttrs} class="text-custom-blue-800 dark:text-custom-blue-400 hover:underline">${text}${isExternal ? ' ↗' : ''}</a>`
}

// Customize blockquote rendering
renderer.blockquote = function(quote) {
  return `
    <blockquote class="border-l-4 border-custom-blue-800 dark:border-custom-blue-400 pl-6 py-2 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg my-6">
      ${quote}
    </blockquote>
  `
}

// Customize table rendering
renderer.table = function(header, body) {
  return `
    <div class="table-wrapper overflow-x-auto my-6">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          ${header}
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          ${body}
        </tbody>
      </table>
    </div>
  `
}

// Configure marked with custom renderer
marked.setOptions({
  ...markedOptions.value,
  renderer
})

const renderedContent = computed(() => {
  if (!props.content) return ''
  
  try {
    return marked(props.content)
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return `<p class="text-red-600">Error rendering content</p>`
  }
})

// Utility function for escaping HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Add copy to clipboard functionality
if (process.client) {
  window.copyToClipboard = function(button) {
    const code = decodeURIComponent(button.dataset.code)
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copied!'
        setTimeout(() => {
          button.textContent = 'Copy'
        }, 2000)
      }).catch(() => {
        fallbackCopy(code, button)
      })
    } else {
      fallbackCopy(code, button)
    }
  }

  function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = 'Copy'
      }, 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
    
    document.body.removeChild(textArea)
  }
}
</script>

<style scoped>
.markdown-content {
  @apply text-gray-900 dark:text-gray-100;
}

/* Enhanced prose styling */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  @apply font-bold text-gray-900 dark:text-white;
}

.markdown-content :deep(h1) {
  @apply text-3xl mb-6 mt-8;
}

.markdown-content :deep(h2) {
  @apply text-2xl mb-4 mt-8;
}

.markdown-content :deep(h3) {
  @apply text-xl mb-3 mt-6;
}

.markdown-content :deep(h4) {
  @apply text-lg mb-2 mt-4;
}

.markdown-content :deep(p) {
  @apply mb-4 leading-relaxed;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  @apply mb-4 pl-6;
}

.markdown-content :deep(li) {
  @apply mb-2;
}

.markdown-content :deep(pre) {
  @apply bg-gray-900 rounded-b-lg p-4 overflow-x-auto;
}

.markdown-content :deep(pre code) {
  @apply text-gray-100 font-mono text-sm;
}

.markdown-content :deep(img) {
  @apply rounded-lg shadow-lg my-6 max-w-full h-auto;
}

.markdown-content :deep(hr) {
  @apply border-gray-300 dark:border-gray-600 my-8;
}

/* Table styling */
.markdown-content :deep(th) {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider;
}

.markdown-content :deep(td) {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100;
}

/* Code block wrapper */
.code-block-wrapper {
  @apply my-6;
}

.copy-button:hover {
  @apply bg-gray-600;
}
</style>