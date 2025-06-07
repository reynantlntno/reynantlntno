import { createRouter, createWebHistory } from 'vue-router'
import { useHead } from '@vueuse/head'

// Import layouts
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// Import views
import HomeView from '@/views/home/HomeView.vue'
import AboutView from '@/views/about/AboutView.vue'
import ProjectsView from '@/views/projects/ProjectsView.vue'
import ProjectDetailView from '@/views/projects/ProjectDetailView.vue'
import BlogView from '@/views/blog/BlogView.vue'
import BlogPostView from '@/views/blog/BlogPostView.vue'
import AppointmentsView from '@/views/appointments/AppointmentsView.vue'
import ContactView from '@/views/contact/ContactView.vue'

// Define routes
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: {
          title: 'Reynan Tolentino - Software Developer Portfolio',
          description: 'Full-stack software developer specializing in Vue.js, Node.js, and modern web technologies. Explore my projects, blog, and schedule a consultation.',
          keywords: 'software developer, web developer, vue.js, node.js, javascript, portfolio, reynan tolentino'
        }
      },
      {
        path: '/about',
        name: 'about',
        component: AboutView,
        meta: {
          title: 'About - Reynan Tolentino',
          description: 'Learn about my journey as a software developer, my skills, and experience in building modern web applications.',
          keywords: 'about, skills, experience, software developer, web development'
        }
      },
      {
        path: '/projects',
        name: 'projects',
        component: ProjectsView,
        meta: {
          title: 'Projects - Reynan Tolentino',
          description: 'Explore my portfolio of web applications and software projects built with modern technologies.',
          keywords: 'projects, portfolio, web applications, software development, vue.js, node.js'
        }
      },
      {
        path: '/projects/:slug',
        name: 'project-detail',
        component: ProjectDetailView,
        meta: {
          title: 'Project Details - Reynan Tolentino',
          description: 'Detailed view of my software development project including technologies used and implementation details.',
          keywords: 'project details, web application, software development'
        }
      },
      {
        path: '/blog',
        name: 'blog',
        component: BlogView,
        meta: {
          title: 'Blog - Reynan Tolentino',
          description: 'Read my thoughts on software development, web technologies, and programming best practices.',
          keywords: 'blog, software development, web development, programming, tutorials'
        }
      },
      {
        path: '/blog/:slug',
        name: 'blog-post',
        component: BlogPostView,
        meta: {
          title: 'Blog Post - Reynan Tolentino',
          description: 'Read my latest blog post about software development and web technologies.',
          keywords: 'blog post, software development, programming, web development'
        }
      },
      {
        path: '/appointments',
        name: 'appointments',
        component: AppointmentsView,
        meta: {
          title: 'Schedule Appointment - Reynan Tolentino',
          description: 'Schedule a consultation or meeting to discuss your software development project needs.',
          keywords: 'appointments, consultation, meeting, software development services'
        }
      },
      {
        path: '/appointments/track',
        name: 'appointment-tracking',
        component: AppointmentsView,
        props: { trackingMode: true },
        meta: {
          title: 'Track Appointment - Reynan Tolentino',
          description: 'Track the status of your scheduled appointment using your reference code.',
          keywords: 'track appointment, appointment status, reference code'
        }
      },
      {
        path: '/contact',
        name: 'contact',
        component: ContactView,
        meta: {
          title: 'Contact - Reynan Tolentino',
          description: 'Get in touch with me for software development projects, collaborations, or general inquiries.',
          keywords: 'contact, software developer, web development services, collaboration'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found - Reynan Tolentino',
      description: 'The page you are looking for could not be found.',
      keywords: '404, page not found'
    }
  }
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update page title and meta tags
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Set meta description
  if (to.meta.description) {
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      description.setAttribute('content', to.meta.description)
    }
  }
  
  // Set meta keywords
  if (to.meta.keywords) {
    const keywords = document.querySelector('meta[name="keywords"]')
    if (keywords) {
      keywords.setAttribute('content', to.meta.keywords)
    }
  }
  
  next()
})

export default router