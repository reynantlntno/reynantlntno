<!-- filepath: /Users/reynantolentino/reynantlntno.dev/src/components/common/SeoHead.vue -->
<template>
  <Head>
    <!-- Primary Meta Tags -->
    <title>{{ pageTitle }}</title>
    <meta name="title" :content="pageTitle" />
    <meta name="description" :content="pageDescription" />
    <meta name="keywords" :content="pageKeywords" />
    <meta name="author" content="Reynan Tolentino" />
    <meta name="robots" content="index, follow" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" :content="currentUrl" />
    <meta property="og:title" :content="pageTitle" />
    <meta property="og:description" :content="pageDescription" />
    <meta property="og:image" :content="ogImage" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Reynan Tolentino Portfolio" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" :content="currentUrl" />
    <meta property="twitter:title" :content="pageTitle" />
    <meta property="twitter:description" :content="pageDescription" />
    <meta property="twitter:image" :content="ogImage" />
    
    <!-- Canonical URL -->
    <link rel="canonical" :href="currentUrl" />
  </Head>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Head } from '@vueuse/head'

const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  keywords: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  }
})

// Computed meta values
const pageTitle = computed(() => {
  return props.title || route.meta.title || 'Reynan Tolentino - Software Developer Portfolio'
})

const pageDescription = computed(() => {
  return props.description || route.meta.description || 'Full-stack software developer specializing in Vue.js, Node.js, and modern web technologies. Explore my projects, blog, and schedule a consultation.'
})

const pageKeywords = computed(() => {
  return props.keywords || route.meta.keywords || 'software developer, web developer, vue.js, node.js, javascript, portfolio, reynan tolentino'
})

const currentUrl = computed(() => {
  return `https://reynantlntno.netlify.app${route.fullPath}`
})

const ogImage = computed(() => {
  return props.image || 'https://reynantlntno.netlify.app/images/og/default.jpg'
})
</script>