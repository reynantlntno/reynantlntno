import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Lazy-load route components for better performance
const HomeView = () => import('@/views/HomeView.vue');
const AboutView = () => import('@/views/AboutView.vue');
const ProjectsView = () => import('@/views/ProjectsView.vue');
const AppointmentView = () => import('@/views/AppointmentView.vue');
const ContactView = () => import('@/views/ContactView.vue');
const BlogView = () => import('@/views/BlogView.vue');
const BlogPostView = () => import('@/views/BlogPostView.vue');
const NotFoundView = () => import('@/views/NotFoundView.vue');

// Admin routes
const AdminLoginView = () => import('@/views/Admin/AdminLoginView.vue');
const AdminDashboardView = () => import('@/views/Admin/AdminDashboardView.vue');
const AdminBlogView = () => import('@/views/Admin/AdminBlogView.vue');
const AdminBlogEditView = () => import('@/views/Admin/AdminBlogEditView.vue');
const AdminAppointmentsView = () => import('@/views/Admin/AdminAppointmentsView.vue');
const AdminMessagesView = () => import('@/views/Admin/AdminMessagesView.vue');
const AdminSettingsView = () => import('@/views/Admin/AdminSettingsView.vue');

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
  
  // Admin routes
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLoginView,
    meta: { 
      title: 'Admin Login | Reynan Tolentino',
      allowUnauthenticated: true
    }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: { 
      title: 'Admin Dashboard | Reynan Tolentino',
      requiresAuth: true
    }
  },
  {
    path: '/admin/blog',
    name: 'admin-blog',
    component: AdminBlogView,
    meta: { 
      title: 'Manage Blog | Reynan Tolentino',
      requiresAuth: true
    }
  },
  {
    path: '/admin/blog/new',
    name: 'admin-blog-new',
    component: AdminBlogEditView,
    meta: { 
      title: 'New Blog Post | Reynan Tolentino',
      requiresAuth: true
    }
  },
  {
    path: '/admin/blog/edit/:id',
    name: 'admin-blog-edit',
    component: AdminBlogEditView,
    props: true,
    meta: { 
      title: 'Edit Blog Post | Reynan Tolentino',
      requiresAuth: true
    }
  },
  {
    path: '/admin/appointments',
    name: 'admin-appointments',
    component: AdminAppointmentsView,
    meta: { 
      title: 'Manage Appointments | Reynan Tolentino',
      requiresAuth: true
    }
  },
  {
    path: '/admin/messages',
    name: 'admin-messages',
    component: AdminMessagesView,
    meta: { 
      title: 'Contact Messages | Reynan Tolentino',
      requiresAuth: true
    }
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: AdminSettingsView,
    meta: { 
      title: 'Admin Settings | Reynan Tolentino',
      requiresAuth: true
    }
  },
  
  // 404 route
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

// Navigation guards for auth
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = to.meta.title || 'Reynan Tolentino | Software Developer';
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const authStore = useAuthStore();
    
    // If not authenticated or token validation fails
    if (!authStore.isAuthenticated) {
      const isValid = await authStore.checkAuth();
      if (!isValid) {
        // Redirect to login page with return URL
        next({ 
          name: 'admin-login',
          query: { redirect: to.fullPath }
        });
        return;
      }
    }
  }
  
  // Check if user is already logged in and trying to access login page
  if (to.name === 'admin-login') {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated && await authStore.checkAuth()) {
      // Redirect to dashboard if already logged in
      next({ name: 'admin-dashboard' });
      return;
    }
  }
  
  next();
});

export default router;