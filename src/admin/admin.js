// Admin panel functionality
// Import CSS files for bundling
import '../css/admin.css';

// Admin Dashboard Main JavaScript
import {
    AdminAuth
} from './auth.js';
import {
    DiscountManager
} from './discounts.js';
import {
    CouponManager
} from './coupons.js';
import {
    BrokerManager
} from './brokers.js';
import {
    OrderManager
} from './orders.js';
import {
    AnalyticsManager
} from './analytics.js';
import {
    SettingsManager
} from './settings.js';
import {
    ToastSystem
} from './toast.js';

class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.modals = {};
        this.managers = {};
        // Don't auto-initialize, wait for authentication
    }

    async init() {
        try {
            // Initialize authentication
            this.auth = new AdminAuth();

            // Check if user is authenticated
            if (!this.auth.isAuthenticated()) {
                this.auth.showLoginForm();
                return;
            }

            // Initialize managers
            this.initializeManagers();

            // Initialize UI components
            this.initializeUI();

            // Load initial data
            await this.loadDashboardData();

            // Show success message
            this.showToast('success', 'Admin Dashboard Loaded', 'Welcome back!');

        } catch (error) {
            console.error('Failed to initialize admin dashboard:', error);
            this.showToast('error', 'Initialization Error', 'Failed to load dashboard');
        }
    }

    // Method to re-initialize after login
    async reInit() {
        try {
            // Initialize managers
            this.initializeManagers();

            // Initialize UI components
            this.initializeUI();

            // Load initial data
            await this.loadDashboardData();

            // Show success message
            this.showToast('success', 'Admin Dashboard Loaded', 'Welcome back!');

        } catch (error) {
            console.error('Failed to re-initialize admin dashboard:', error);
            this.showToast('error', 'Initialization Error', 'Failed to load dashboard');
        }
    }

    initializeManagers() {
        this.managers = {
            discounts: new DiscountManager(this),
            coupons: new CouponManager(this),
            brokers: new BrokerManager(this),
            orders: new OrderManager(this),
            analytics: new AnalyticsManager(this),
            settings: new SettingsManager(this)
        };
    }

    initializeUI() {
        this.bindNavigationEvents();
        this.bindHeaderEvents();
        this.bindModalEvents();
        this.bindKeyboardEvents();
        this.initializeToast();
    }

    bindNavigationEvents() {
        // Sidebar navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.querySelector('.admin-sidebar');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    bindHeaderEvents() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.auth.logout();
            });
        }

        // Notification button
        const notificationsBtn = document.getElementById('notificationsBtn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }

        // Help button
        const helpBtn = document.getElementById('helpBtn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelp();
            });
        }
    }

    bindModalEvents() {
        // Modal overlay
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeAllModals();
                }
            });
        }

        // Close buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    bindKeyboardEvents() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for quick search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showQuickSearch();
            }

            // Ctrl/Cmd + N for new item
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.showNewItemModal();
            }
        });
    }

    initializeToast() {
        this.toast = new ToastSystem();
        window.showToast = (type, title, message) => {
            this.toast.show(type, title, message);
        };
    }

    navigateToSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(sectionEl => {
            sectionEl.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        // Update page title
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = this.getSectionTitle(section);
        }

        // Load section data
        this.loadSectionData(section);

        // Update current section
        this.currentSection = section;

        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
            document.querySelector('.admin-sidebar').classList.remove('active');
        }
    }

    getSectionTitle(section) {
        const titles = {
            dashboard: 'Dashboard',
            discounts: 'Discount Management',
            coupons: 'Coupon Management',
            brokers: 'Broker Management',
            orders: 'Order Management',
            analytics: 'Analytics & Reports',
            settings: 'System Settings'
        };
        return titles[section] || 'Dashboard';
    }

    async loadSectionData(section) {
        try {
            switch (section) {
                case 'dashboard':
                    await this.loadDashboardData();
                    break;
                case 'discounts':
                    await this.managers.discounts.loadDiscounts();
                    break;
                case 'coupons':
                    await this.managers.coupons.loadCoupons();
                    break;
                case 'brokers':
                    await this.managers.brokers.loadBrokers();
                    break;
                case 'orders':
                    await this.managers.orders.loadOrders();
                    break;
                case 'analytics':
                    await this.managers.analytics.loadAnalytics();
                    break;
                case 'settings':
                    await this.managers.settings.loadSettings();
                    break;
            }
        } catch (error) {
            console.error(`Failed to load ${section} data:`, error);
            this.showToast('error', 'Data Load Error', `Failed to load ${section} data`);
        }
    }

    async loadDashboardData() {
        try {
            // Load recent orders
            await this.loadRecentOrders();

            // Load active promotions
            await this.loadActivePromotions();

            // Update stats
            await this.updateDashboardStats();

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    async loadRecentOrders() {
        try {
            const recentOrdersContainer = document.getElementById('recentOrders');
            if (!recentOrdersContainer) return;

            // Simulate loading recent orders
            const recentOrders = [{
                    id: 'ORD-001',
                    customer: 'John Doe',
                    total: 'KES 45,000',
                    status: 'Pending',
                    date: '2024-01-15'
                },
                {
                    id: 'ORD-002',
                    customer: 'Jane Smith',
                    total: 'KES 32,500',
                    status: 'Completed',
                    date: '2024-01-14'
                },
                {
                    id: 'ORD-003',
                    customer: 'Mike Johnson',
                    total: 'KES 67,800',
                    status: 'Processing',
                    date: '2024-01-13'
                }
            ];

            recentOrdersContainer.innerHTML = recentOrders.map(order => `
                <div class="recent-order-item">
                    <div class="order-info">
                        <div class="order-id">${order.id}</div>
                        <div class="order-customer">${order.customer}</div>
                        <div class="order-total">${order.total}</div>
                    </div>
                    <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
                    <div class="order-date">${order.date}</div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Failed to load recent orders:', error);
        }
    }

    async loadActivePromotions() {
        try {
            const activePromotionsContainer = document.getElementById('activePromotions');
            if (!activePromotionsContainer) return;

            // Simulate loading active promotions
            const activePromotions = [{
                    name: 'First Time Buyer',
                    type: 'Percentage',
                    value: '10%',
                    status: 'Active'
                },
                {
                    name: 'Bulk Order Discount',
                    type: 'Fixed',
                    value: 'KES 5,000',
                    status: 'Active'
                },
                {
                    name: 'Seasonal Sale',
                    type: 'Percentage',
                    value: '15%',
                    status: 'Active'
                }
            ];

            activePromotionsContainer.innerHTML = activePromotions.map(promo => `
                <div class="promotion-item">
                    <div class="promotion-info">
                        <div class="promotion-name">${promo.name}</div>
                        <div class="promotion-type">${promo.type}: ${promo.value}</div>
                    </div>
                    <div class="promotion-status active">${promo.status}</div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Failed to load active promotions:', error);
        }
    }

    async updateDashboardStats() {
        try {
            // Simulate updating stats
            const stats = {
                totalOrders: 1247,
                revenue: 'KES 2.4M',
                activeBrokers: 24,
                couponsUsed: 156
            };

            // Update stat numbers (in a real app, these would be fetched from API)
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const values = Object.values(stats);
                if (values[index]) {
                    stat.textContent = values[index];
                }
            });

        } catch (error) {
            console.error('Failed to update dashboard stats:', error);
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modalOverlay');

        if (modal && overlay) {
            modal.classList.add('active');
            overlay.classList.add('active');
            this.modals[modalId] = modal;
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modalOverlay');

        if (modal) {
            modal.classList.remove('active');
        }

        // Check if any other modals are open
        const activeModals = document.querySelectorAll('.modal.active');
        if (activeModals.length === 0) {
            overlay.classList.remove('active');
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        const overlay = document.getElementById('modalOverlay');

        modals.forEach(modal => {
            modal.classList.remove('active');
        });

        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showNotifications() {
        this.showToast('info', 'Notifications', 'No new notifications');
    }

    showHelp() {
        this.showToast('info', 'Help', 'Help documentation coming soon');
    }

    showQuickSearch() {
        this.showToast('info', 'Quick Search', 'Search functionality coming soon');
    }

    showNewItemModal() {
        // Show appropriate modal based on current section
        switch (this.currentSection) {
            case 'discounts':
                this.showModal('discountModal');
                break;
            case 'coupons':
                this.showModal('couponModal');
                break;
            case 'brokers':
                this.showModal('brokerModal');
                break;
            default:
                this.showToast('info', 'New Item', 'Select a section to add new items');
        }
    }

    showToast(type, title, message) {
        if (this.toast) {
            this.toast.show(type, title, message);
        } else {
            console.log(`${type.toUpperCase()}: ${title} - ${message}`);
        }
    }

    // Utility methods
    formatCurrency(amount, currency = 'KES') {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

// Export for use in other modules
export {
    AdminDashboard
};