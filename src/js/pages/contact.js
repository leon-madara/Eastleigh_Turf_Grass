import '../components/header.js';
import '../components/cart.js';

// Contact Page JavaScript
(() => {
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    // Initialize contact page
    function init() {
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Set current year in footer
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Handle form submission
    async function handleFormSubmit(event) {
        event.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.fullName || !data.email || !data.projectType) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        try {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Send to WhatsApp
            const success = window.WhatsAppService.sendContactForm(data);

            if (success) {
                showToast('Form submitted successfully! WhatsApp will open with your message.', 'success');
                contactForm.reset();
            } else {
                showToast('Failed to send message. Please try again.', 'error');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            // Reset button state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        if (!toast) return;

        const title = toast.querySelector('.toast-title');
        const description = toast.querySelector('.toast-description');

        if (title) title.textContent = type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info';
        if (description) description.textContent = message;

        // Update toast styling based on type
        toast.className = `toast toast-${type}`;

        // Show toast
        toast.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 5000);
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();