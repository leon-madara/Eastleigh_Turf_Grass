// Toast Notification System
class ToastSystem {
    constructor() {
        this.toastContainer = null;
        this.toasts = [];
        this.init();
    }

    // Initialize toast system
    init() {
        this.createToastContainer();
        this.makeGlobal();
    }

    // Create toast container
    createToastContainer() {
        // Check if container already exists
        this.toastContainer = document.getElementById('toast-container');

        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'toast-container';
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }
    }

    // Make toast system globally available
    makeGlobal() {
        window.showToast = (title, message, type = 'info') => {
            this.show(title, message, type);
        };
    }

    // Show toast notification
    show(title, message, type = 'info', duration = 4000) {
        const toast = this.createToast(title, message, type);
        this.toastContainer.appendChild(toast);
        this.toasts.push(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto remove after duration
        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    }

    // Create toast element
    createToast(title, message, type) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;

        const icon = this.getIconForType(type);

        toast.innerHTML = `
            <div class="toast-header">
                <i class="${icon}"></i>
                <span class="toast-title">${title}</span>
                <button class="toast-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="toast-message">${message}</div>
        `;

        // Add close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.remove(toast);
        });

        return toast;
    }

    // Get icon for toast type
    getIconForType(type) {
        switch (type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            case 'info':
            default:
                return 'fas fa-info-circle';
        }
    }

    // Remove toast
    remove(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.remove('show');
        toast.classList.add('hiding');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }

            // Remove from toasts array
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    // Clear all toasts
    clear() {
        this.toasts.forEach(toast => {
            this.remove(toast);
        });
    }

    // Show success toast
    success(title, message, duration) {
        return this.show(title, message, 'success', duration);
    }

    // Show error toast
    error(title, message, duration) {
        return this.show(title, message, 'error', duration);
    }

    // Show warning toast
    warning(title, message, duration) {
        return this.show(title, message, 'warning', duration);
    }

    // Show info toast
    info(title, message, duration) {
        return this.show(title, message, 'info', duration);
    }
}

// Initialize toast system
const toastSystem = new ToastSystem();

// Export for use in other modules
export default toastSystem;