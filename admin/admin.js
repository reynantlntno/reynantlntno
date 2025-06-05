function adminApp() {
    return {
        // Authentication
        isAuthenticated: false,
        apiKey: '',
        loading: false,
        error: '',
        
        // UI State
        sidebarOpen: false,
        currentSection: 'dashboard',
        showModal: false,
        modalType: '',
        modalData: {},
        editingItem: null,
        
        // Menu Items
        menuItems: [
            { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
            { id: 'blog', name: 'Blog Posts', icon: 'fas fa-blog' },
            { id: 'projects', name: 'Projects', icon: 'fas fa-code' },
            { id: 'contact', name: 'Contact Messages', icon: 'fas fa-envelope' },
            { id: 'newsletter', name: 'Newsletter', icon: 'fas fa-newspaper' },
            { id: 'appointments', name: 'Appointments', icon: 'fas fa-calendar' },
            { id: 'about', name: 'About & Skills', icon: 'fas fa-user' },
        ],

        // Data
        stats: [],
        recentActivity: [],
        blogPosts: [],
        blogPagination: { page: 1, totalPages: 1, hasNext: false, hasPrev: false },
        blogFilters: { search: '', published: '', sortBy: 'published_at', sortOrder: 'desc' },
        projects: [],
        contactMessages: [],
        contactFilters: { read: '' },
        newsletterSubscribers: [],
        newsletterStats: { total: 0, active: 0 },
        appointments: [],
        appointmentSlots: [],
        aboutContent: {},
        skills: [],
        skillCategories: [],

        // Base API URL
        apiBase: '/.netlify/functions',

        // Initialize
        init() {
            // Check if API key is stored
            const stored = localStorage.getItem('admin_api_key');
            if (stored) {
                this.apiKey = stored;
                this.testAuth();
            }

            // Set up section watcher
            this.$watch('currentSection', (newSection) => {
                this.loadSectionData(newSection);
            });
        },

        // Authentication
        async login() {
            this.loading = true;
            this.error = '';
            
            try {
                // Test the API key by making a simple authenticated request
                const response = await this.apiCall('/contact/messages', { page: 1, limit: 1 });
                
                if (response) {
                    this.isAuthenticated = true;
                    localStorage.setItem('admin_api_key', this.apiKey);
                    await this.loadDashboard();
                }
            } catch (error) {
                this.error = 'Invalid API key or server error';
            }
            
            this.loading = false;
        },

        async testAuth() {
            try {
                const response = await this.apiCall('/contact/messages', { page: 1, limit: 1 });
                if (response) {
                    this.isAuthenticated = true;
                    await this.loadDashboard();
                }
            } catch (error) {
                localStorage.removeItem('admin_api_key');
                this.apiKey = '';
            }
        },

        logout() {
            this.isAuthenticated = false;
            this.apiKey = '';
            localStorage.removeItem('admin_api_key');
            this.currentSection = 'dashboard';
        },

        // API Helper
        async apiCall(endpoint, params = {}, method = 'GET', body = null) {
            const url = new URL(`${this.apiBase}${endpoint}`, 'http://reynantlntno.netlify.app');
            
            // Add query params for GET requests
            if (method === 'GET' && Object.keys(params).length > 0) {
                Object.keys(params).forEach(key => {
                    if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
                        url.searchParams.append(key, params[key]);
                    }
                });
            }

            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.apiKey,
                },
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(url, options);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();
            return data.data;
        },

        // Section Management
        async loadSectionData(section) {
            try {
                switch (section) {
                    case 'dashboard':
                        await this.loadDashboard();
                        break;
                    case 'blog':
                        await this.loadBlogPosts();
                        break;
                    case 'projects':
                        await this.loadProjects();
                        break;
                    case 'contact':
                        await this.loadContactMessages();
                        break;
                    case 'newsletter':
                        await this.loadNewsletterSubscribers();
                        break;
                    case 'appointments':
                        await this.loadAppointments();
                        await this.loadAppointmentSlots();
                        break;
                    case 'about':
                        await this.loadAboutContent();
                        await this.loadSkills();
                        break;
                }
            } catch (error) {
                console.error(`Failed to load ${section} data:`, error);
                this.showNotification('Error loading data', 'error');
            }
        },

        // Dashboard
        async loadDashboard() {
            try {
                // Load basic stats in parallel
                const [blogStats, projectStats, contactStats, newsletterStats] = await Promise.all([
                    this.apiCall('/blog', { page: 1, limit: 1 }),
                    this.apiCall('/projects', { page: 1, limit: 1 }),
                    this.apiCall('/contact/messages', { page: 1, limit: 1 }),
                    this.apiCall('/newsletter', { page: 1, limit: 1 })
                ]);

                this.stats = [
                    { label: 'Blog Posts', value: blogStats.pagination?.total || 0, icon: '📝' },
                    { label: 'Projects', value: projectStats.pagination?.total || 0, icon: '💼' },
                    { label: 'Contact Messages', value: contactStats.pagination?.total || 0, icon: '📧' },
                    { label: 'Newsletter Subscribers', value: newsletterStats.pagination?.total || 0, icon: '📰' },
                ];

                this.recentActivity = [
                    { message: 'Dashboard loaded successfully', time: new Date().toLocaleString() }
                ];

            } catch (error) {
                console.error('Failed to load dashboard:', error);
            }
        },

        // Blog Management
        async loadBlogPosts() {
            try {
                const data = await this.apiCall('/blog', {
                    ...this.blogFilters,
                    page: this.blogPagination.page,
                    limit: 10
                });
                
                this.blogPosts = data.posts || [];
                this.blogPagination = data.pagination || {};
            } catch (error) {
                console.error('Failed to load blog posts:', error);
            }
        },

        async createBlogPost(postData) {
            try {
                const data = await this.apiCall('/blog', {}, 'POST', postData);
                await this.loadBlogPosts();
                this.closeModal();
                this.showNotification('Blog post created successfully', 'success');
                return data;
            } catch (error) {
                console.error('Failed to create blog post:', error);
                throw error;
            }
        },

        async updateBlogPost(slug, postData) {
            try {
                const data = await this.apiCall(`/blog/${slug}`, {}, 'PUT', postData);
                await this.loadBlogPosts();
                this.closeModal();
                this.showNotification('Blog post updated successfully', 'success');
                return data;
            } catch (error) {
                console.error('Failed to update blog post:', error);
                throw error;
            }
        },

        async deleteBlogPost(slug) {
            try {
                await this.apiCall(`/blog/${slug}`, {}, 'DELETE');
                await this.loadBlogPosts();
                this.showNotification('Blog post deleted successfully', 'success');
            } catch (error) {
                console.error('Failed to delete blog post:', error);
                throw error;
            }
        },

        // Projects Management
        async loadProjects() {
            try {
                const data = await this.apiCall('/projects', { page: 1, limit: 50 });
                this.projects = data.projects || [];
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        },

        async createProject(projectData) {
            try {
                const data = await this.apiCall('/projects', {}, 'POST', projectData);
                await this.loadProjects();
                this.closeModal();
                this.showNotification('Project created successfully', 'success');
                return data;
            } catch (error) {
                console.error('Failed to create project:', error);
                throw error;
            }
        },

        async updateProject(slug, projectData) {
            try {
                const data = await this.apiCall(`/projects/${slug}`, {}, 'PUT', projectData);
                await this.loadProjects();
                this.closeModal();
                this.showNotification('Project updated successfully', 'success');
                return data;
            } catch (error) {
                console.error('Failed to update project:', error);
                throw error;
            }
        },

        async deleteProject(slug) {
            try {
                await this.apiCall(`/projects/${slug}`, {}, 'DELETE');
                await this.loadProjects();
                this.showNotification('Project deleted successfully', 'success');
            } catch (error) {
                console.error('Failed to delete project:', error);
                throw error;
            }
        },

        // Contact Management
        async loadContactMessages() {
            try {
                const data = await this.apiCall('/contact/messages', {
                    ...this.contactFilters,
                    page: 1,
                    limit: 50
                });
                
                this.contactMessages = data.messages || [];
            } catch (error) {
                console.error('Failed to load contact messages:', error);
            }
        },

        async toggleMessageRead(message) {
            try {
                await this.apiCall(`/contact/messages/${message.id}`, {}, 'PUT', {
                    read: !message.read
                });
                
                message.read = !message.read;
            } catch (error) {
                console.error('Failed to update message:', error);
            }
        },

        async deleteContactMessage(messageId) {
            if (!confirm('Are you sure you want to delete this message?')) return;
            
            try {
                await this.apiCall(`/contact/messages/${messageId}`, {}, 'DELETE');
                await this.loadContactMessages();
                this.showNotification('Message deleted successfully', 'success');
            } catch (error) {
                console.error('Failed to delete message:', error);
            }
        },

        // Newsletter Management
        async loadNewsletterSubscribers() {
            try {
                const data = await this.apiCall('/newsletter', { page: 1, limit: 100 });
                this.newsletterSubscribers = data.subscribers || [];
                this.newsletterStats = data.statistics || {};
            } catch (error) {
                console.error('Failed to load newsletter subscribers:', error);
            }
        },

        async deleteSubscriber(subscriberId) {
            if (!confirm('Are you sure you want to delete this subscriber?')) return;
            
            try {
                await this.apiCall(`/newsletter/${subscriberId}`, {}, 'DELETE');
                await this.loadNewsletterSubscribers();
                this.showNotification('Subscriber deleted successfully', 'success');
            } catch (error) {
                console.error('Failed to delete subscriber:', error);
            }
        },

        // Appointments Management
        async loadAppointments() {
            try {
                const data = await this.apiCall('/appointments', { page: 1, limit: 50 });
                this.appointments = data.appointments || [];
            } catch (error) {
                console.error('Failed to load appointments:', error);
            }
        },

        async loadAppointmentSlots() {
            try {
                const data = await this.apiCall('/appointments/slots', {});
                this.appointmentSlots = data || [];
            } catch (error) {
                console.error('Failed to load appointment slots:', error);
            }
        },

        async updateAppointmentStatus(referenceCode, newStatus) {
            try {
                await this.apiCall(`/appointments/${referenceCode}`, {}, 'PUT', {
                    status: newStatus
                });
                
                // Update local state
                const appointment = this.appointments.find(a => a.reference_code === referenceCode);
                if (appointment) {
                    appointment.status = newStatus;
                }

                this.showNotification('Appointment status updated', 'success');
            } catch (error) {
                console.error('Failed to update appointment:', error);
            }
        },

        async deleteAppointment(referenceCode) {
            if (!confirm('Are you sure you want to delete this appointment?')) return;
            
            try {
                await this.apiCall(`/appointments/${referenceCode}`, {}, 'DELETE');
                await this.loadAppointments();
                this.showNotification('Appointment deleted successfully', 'success');
            } catch (error) {
                console.error('Failed to delete appointment:', error);
            }
        },

        async createAppointmentSlot(slotData) {
            try {
                await this.apiCall('/appointments/slots', {}, 'POST', slotData);
                await this.loadAppointmentSlots();
                this.closeModal();
                this.showNotification('Appointment slot created successfully', 'success');
            } catch (error) {
                console.error('Failed to create appointment slot:', error);
                throw error;
            }
        },

        async updateAppointmentSlot(slotId, slotData) {
            try {
                await this.apiCall(`/appointments/slots/${slotId}`, {}, 'PUT', slotData);
                await this.loadAppointmentSlots();
                this.closeModal();
                this.showNotification('Appointment slot updated successfully', 'success');
            } catch (error) {
                console.error('Failed to update appointment slot:', error);
                throw error;
            }
        },

        async deleteAppointmentSlot(slotId) {
            if (!confirm('Are you sure you want to delete this slot?')) return;
            
            try {
                await this.apiCall(`/appointments/slots/${slotId}`, {}, 'DELETE');
                await this.loadAppointmentSlots();
                this.showNotification('Appointment slot deleted successfully', 'success');
            } catch (error) {
                console.error('Failed to delete appointment slot:', error);
            }
        },

        // About & Skills Management
        async loadAboutContent() {
            try {
                const data = await this.apiCall('/about/content');
                this.aboutContent = data || {};
            } catch (error) {
                console.error('Failed to load about content:', error);
            }
        },

        async loadSkills() {
            try {
                const data = await this.apiCall('/about/skills');
                this.skills = data.skills || [];
                this.skillCategories = [...new Set(this.skills.map(s => s.category))];
            } catch (error) {
                console.error('Failed to load skills:', error);
            }
        },

        getSkillsByCategory(category) {
            return this.skills.filter(skill => skill.category === category);
        },

        async createAboutContent(contentData) {
            try {
                await this.apiCall('/about/content', {}, 'POST', contentData);
                await this.loadAboutContent();
                this.closeModal();
                this.showNotification('Content created successfully', 'success');
            } catch (error) {
                console.error('Failed to create content:', error);
                throw error;
            }
        },

        async updateAboutContent(contentId, contentData) {
            try {
                await this.apiCall(`/about/content/${contentId}`, {}, 'PUT', contentData);
                await this.loadAboutContent();
                this.closeModal();
                this.showNotification('Content updated successfully', 'success');
            } catch (error) {
                console.error('Failed to update content:', error);
                throw error;
            }
        },

        async deleteAboutContent(contentId) {
            if (!confirm('Are you sure you want to delete this content?')) return;
            
            try {
                await this.apiCall(`/about/content/${contentId}`, {}, 'DELETE');
                await this.loadAboutContent();
                this.showNotification('Content deleted successfully', 'success');
            } catch (error) {
                console.error('Failed to delete content:', error);
            }
        },

        async createSkill(skillData) {
            try {
                await this.apiCall('/about/skills', {}, 'POST', skillData);
                await this.loadSkills();
                this.closeModal();
                this.showNotification('Skill created successfully', 'success');
            } catch (error) {
                console.error('Failed to create skill:', error);
                throw error;
            }
        },

        async updateSkill(skillId, skillData) {
            try {
                await this.apiCall(`/about/skills/${skillId}`, {}, 'PUT', skillData);
                await this.loadSkills();
                this.closeModal();
                this.showNotification('Skill updated successfully', 'success');
            } catch (error) {
                console.error('Failed to update skill:', error);
                throw error;
            }
        },

        async deleteSkill(skillId) {
            if (!confirm('Are you sure you want to delete this skill?')) return;
            
            try {
                await this.apiCall(`/about/skills/${skillId}`, {}, 'DELETE');
                await this.loadSkills();
                this.showNotification('Skill deleted successfully', 'success');
            } catch (error) {
                console.error('Failed to delete skill:', error);
            }
        },

        // Modal Management
        showCreateModal(type) {
            this.modalType = type;
            this.editingItem = null;
            this.modalData = {};
            this.showModal = true;
        },

        showEditModal(type, item) {
            this.modalType = type;
            this.editingItem = item;
            this.modalData = { ...item };
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.modalType = '';
            this.editingItem = null;
            this.modalData = {};
        },

        async submitModal() {
            try {
                this.loading = true;
                
                if (this.editingItem) {
                    // Update existing item
                    await this.updateItem(this.modalType, this.editingItem, this.modalData);
                } else {
                    // Create new item
                    await this.createItem(this.modalType, this.modalData);
                }
            } catch (error) {
                this.showNotification(error.message, 'error');
            } finally {
                this.loading = false;
            }
        },

        async createItem(type, data) {
            switch (type) {
                case 'blog':
                    return await this.createBlogPost(data);
                case 'projects':
                    return await this.createProject(data);
                case 'content':
                    return await this.createAboutContent(data);
                case 'skills':
                    return await this.createSkill(data);
                case 'slots':
                    return await this.createAppointmentSlot(data);
                default:
                    throw new Error('Unknown item type');
            }
        },

        async updateItem(type, item, data) {
            switch (type) {
                case 'blog':
                    return await this.updateBlogPost(item.slug, data);
                case 'projects':
                    return await this.updateProject(item.slug, data);
                case 'content':
                    return await this.updateAboutContent(item.id, data);
                case 'skills':
                    return await this.updateSkill(item.id, data);
                case 'slots':
                    return await this.updateAppointmentSlot(item.id, data);
                default:
                    throw new Error('Unknown item type');
            }
        },

        // Generic Item Management
        editItem(type, item) {
            this.showEditModal(type, item);
        },

        async deleteItem(type, id, name) {
            if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
            
            try {
                switch (type) {
                    case 'blog':
                        await this.deleteBlogPost(id);
                        break;
                    case 'projects':
                        await this.deleteProject(id);
                        break;
                    case 'content':
                        await this.deleteAboutContent(id);
                        break;
                    case 'skills':
                        await this.deleteSkill(id);
                        break;
                    case 'slots':
                        await this.deleteAppointmentSlot(id);
                        break;
                    default:
                        throw new Error('Unknown item type');
                }
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        },

        // View Modal for Messages and Appointments
        viewMessage(message) {
            this.modalType = 'view-message';
            this.modalData = message;
            this.showModal = true;
            
            // Mark as read if not already
            if (!message.read) {
                this.toggleMessageRead(message);
            }
        },

        viewAppointment(appointment) {
            this.modalType = 'view-appointment';
            this.modalData = appointment;
            this.showModal = true;
        },

        // Section Management
        getCurrentSectionName() {
            const section = this.menuItems.find(item => item.id === this.currentSection);
            return section ? section.name : 'Dashboard';
        },

        // Pagination
        changePage(section, page) {
            if (section === 'blog') {
                this.blogPagination.page = page;
                this.loadBlogPosts();
            }
        },

        getPaginationPages(pagination) {
            const pages = [];
            const start = Math.max(1, pagination.page - 2);
            const end = Math.min(pagination.totalPages, pagination.page + 2);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            return pages;
        },

        // Utility Functions
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString();
        },

        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleString();
        },

        // Notifications
        showNotification(message, type = 'info') {
            // Simple notification system - you can enhance this with a proper toast library
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                type === 'success' ? 'bg-green-500' : 
                type === 'error' ? 'bg-red-500' : 
                'bg-blue-500'
            } text-white`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 5000);
        },

        // Form Helpers
        getModalTitle() {
            if (!this.modalType) return '';
            
            const isEdit = !!this.editingItem;
            const typeNames = {
                blog: 'Blog Post',
                projects: 'Project',
                content: 'Content',
                skills: 'Skill',
                slots: 'Time Slot',
                'view-message': 'Contact Message',
                'view-appointment': 'Appointment Details'
            };
            
            const typeName = typeNames[this.modalType] || this.modalType;
            
            if (this.modalType.startsWith('view-')) {
                return typeName;
            }
            
            return `${isEdit ? 'Edit' : 'Create'} ${typeName}`;
        },

        getFormFields() {
            switch (this.modalType) {
                case 'blog':
                    return [
                        { name: 'title', label: 'Title', type: 'text', required: true },
                        { name: 'slug', label: 'Slug', type: 'text', required: true },
                        { name: 'summary', label: 'Summary', type: 'textarea' },
                        { name: 'content', label: 'Content', type: 'textarea', required: true, rows: 10 },
                        { name: 'image_url', label: 'Image URL', type: 'url' },
                        { name: 'published', label: 'Published', type: 'checkbox' },
                        { name: 'meta_title', label: 'Meta Title', type: 'text' },
                        { name: 'meta_description', label: 'Meta Description', type: 'textarea' },
                        { name: 'tags', label: 'Tags (comma separated)', type: 'text' }
                    ];
                case 'projects':
                    return [
                        { name: 'title', label: 'Title', type: 'text', required: true },
                        { name: 'slug', label: 'Slug', type: 'text', required: true },
                        { name: 'description', label: 'Description', type: 'textarea', required: true },
                        { name: 'content', label: 'Content', type: 'textarea', rows: 8 },
                        { name: 'thumbnail_url', label: 'Thumbnail URL', type: 'url' },
                        { name: 'github_url', label: 'GitHub URL', type: 'url' },
                        { name: 'demo_url', label: 'Demo URL', type: 'url' },
                        { name: 'technologies', label: 'Technologies (comma separated)', type: 'text' },
                        { name: 'featured', label: 'Featured', type: 'checkbox' },
                        { name: 'display_order', label: 'Display Order', type: 'number' }
                    ];
                case 'content':
                    return [
                        { name: 'type', label: 'Type', type: 'text', required: true },
                        { name: 'title', label: 'Title', type: 'text' },
                        { name: 'content', label: 'Content', type: 'textarea', required: true, rows: 8 },
                        { name: 'format', label: 'Format', type: 'select', options: ['markdown', 'json', 'text'] }
                    ];
                case 'skills':
                    return [
                        { name: 'name', label: 'Name', type: 'text', required: true },
                        { name: 'category', label: 'Category', type: 'text', required: true },
                        { name: 'proficiency', label: 'Proficiency (1-10)', type: 'number', min: 1, max: 10, required: true },
                        { name: 'icon', label: 'Icon', type: 'text' },
                        { name: 'description', label: 'Description', type: 'textarea' },
                        { name: 'display_order', label: 'Display Order', type: 'number' }
                    ];
                case 'slots':
                    return [
                        { name: 'recurring', label: 'Recurring', type: 'checkbox' },
                        { name: 'day_of_week', label: 'Day of Week (0-6, 0=Sunday)', type: 'number', min: 0, max: 6 },
                        { name: 'specific_date', label: 'Specific Date', type: 'date' },
                        { name: 'start_time', label: 'Start Time', type: 'time', required: true },
                        { name: 'end_time', label: 'End Time', type: 'time', required: true },
                        { name: 'capacity', label: 'Capacity', type: 'number', min: 1, max: 10, required: true }
                    ];
                default:
                    return [];
            }
        },

        // Data Processing Helpers
        processFormData(data) {
            const processed = { ...data };
            
            // Process tags for blog posts
            if (this.modalType === 'blog' && processed.tags) {
                processed.tags = processed.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            
            // Process technologies for projects
            if (this.modalType === 'projects' && processed.technologies) {
                processed.technologies = processed.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
            }
            
            // Convert string values to appropriate types
            ['published', 'featured', 'recurring'].forEach(field => {
                if (processed[field] !== undefined) {
                    processed[field] = processed[field] === true || processed[field] === 'true';
                }
            });
            
            ['proficiency', 'display_order', 'capacity', 'day_of_week'].forEach(field => {
                if (processed[field] !== undefined && processed[field] !== '') {
                    processed[field] = parseInt(processed[field]);
                }
            });
            
            return processed;
        },

        // Initialize form data for editing
        initModalData() {
            if (this.editingItem && this.modalType === 'blog') {
                // Convert tags array back to string
                if (this.modalData.tags && Array.isArray(this.modalData.tags)) {
                    this.modalData.tags = this.modalData.tags.join(', ');
                }
            }
            
            if (this.editingItem && this.modalType === 'projects') {
                // Convert technologies array back to string
                if (this.modalData.technologies && Array.isArray(this.modalData.technologies)) {
                    this.modalData.technologies = this.modalData.technologies.join(', ');
                }
            }
        }
    };
}
