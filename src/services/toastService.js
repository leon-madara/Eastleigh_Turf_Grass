// Unified Toast Service
class ToastService {
    constructor() {
        this.toastContainer = null;
        this.toastQueue = [];
        this.isProcessing = false;
        this.defaultDuration = 3000;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container')) {
            this.createToastContainer();
        }
        this.toastContainer = document.getElementById('toast-container');
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    show(message, type = 'info', duration = this.defaultDuration) {
        const toast = this.createToast(message, type);
        this.toastQueue.push({
            toast,
            duration
        });

        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;

        const icon = this.getIconForType(type);

        toast.innerHTML = `
            <div class="toast-header">
                <i class="${icon}"></i>
                <span class="toast-title">${this.getTitleForType(type)}</span>
                <button class="toast-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="toast-message">${message}</div>
        `;

        // Add close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hideToast(toast);
        });

        return toast;
    }

    getIconForType(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getTitleForType(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || titles.info;
    }

    processQueue() {
        if (this.toastQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const {
            toast,
            duration
        } = this.toastQueue.shift();

        this.toastContainer.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-hide after duration
        setTimeout(() => {
            this.hideToast(toast);
        }, duration);
    }

    hideToast(toast) {
        toast.classList.add('hiding');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.processQueue();
        }, 300);
    }

    // Convenience methods
    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }

    // Clear all toasts
    clear() {
        if (this.toastContainer) {
            this.toastContainer.innerHTML = '';
        }
        this.toastQueue = [];
        this.isProcessing = false;
    }
}

// Create global instance
const toastService = new ToastService();

// Expose globally for backward compatibility
window.ToastService = toastService;

// Legacy compatibility functions
window.showToast = (title, message, type = 'info') => {
    toastService.show(message || title, type);
};

export default toastService;