import { createRouter, createWebHistory } from 'vue-router';

// Lazy-load route components for better performance
const HomeView = () => import('@/views/HomeView.vue');
const AboutView = () => import('@/views/AboutView.vue');
const ProjectsView = () => import('@/views/ProjectsView.vue');
const AppointmentView = () => import('@/views/AppointmentView.vue');
const ContactView = () => import('@/views/ContactView.vue');
const BlogView = () => import('@/views/BlogView.vue');
const BlogPostView = () => import('@/views/BlogPostView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home | Reynan Tolentino' }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'About | Reynan Tolentino' }
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView,
    meta: { title: 'Projects | Reynan Tolentino' }
  },
  {
    path: '/appointment',
    name: 'appointment',
    component: AppointmentView,
    meta: { title: 'Book an Appointment | Reynan Tolentino' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
    meta: { title: 'Contact | Reynan Tolentino' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
    meta: { title: 'Blog | Reynan Tolentino' }
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: BlogPostView,
    props: true,
    meta: { title: 'Blog Post | Reynan Tolentino' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: '404 - Page Not Found | Reynan Tolentino' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Reynan Tolentino | Software Developer';
  next();
});

export default router;