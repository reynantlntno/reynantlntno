import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@views/HomeView.vue'),
    meta: { title: 'Home | Reynan Tolentino' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@views/AboutView.vue'),
    meta: { title: 'About | Reynan Tolentino' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@views/ProjectsView.vue'),
    meta: { title: 'Projects | Reynan Tolentino' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@views/BlogView.vue'),
    meta: { title: 'Blog | Reynan Tolentino' }
  },
  {
    path: '/appointments',
    name: 'Appointments',
    component: () => import('@views/AppointmentView.vue'),
    meta: { title: 'Schedule Appointment | Reynan Tolentino' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@views/ContactView.vue'),
    meta: { title: 'Contact | Reynan Tolentino' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@views/NotFoundView.vue'),
    meta: { title: 'Page Not Found | Reynan Tolentino' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Update document title based on route meta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Reynan Tolentino | Software Developer';
  next();
});

export default router;