// Broker Dashboard JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    showWelcomeToast();
});

// Dashboard Initialization
function initializeDashboard() {
    initializeTabs();
    initializeButtons();
    loadUserData();
}

// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });
}

// Button Initialization
function initializeButtons() {
    // Add Item Button
    const addItemBtn = document.getElementById('addItemBtn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', handleAddItem);
    }

    // Submit Order Button
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', handleSubmitOrder);
    }

    // Add Preorder Button
    const addPreorderBtn = document.getElementById('addPreorderBtn');
    if (addPreorderBtn) {
        addPreorderBtn.addEventListener('click', handleAddPreorder);
    }

    // Submit Preorders Button
    const submitPreordersBtn = document.getElementById('submitPreordersBtn');
    if (submitPreordersBtn) {
        submitPreordersBtn.addEventListener('click', handleSubmitPreorders);
    }

    // Add Inquiry Button
    const addInquiryBtn = document.getElementById('addInquiryBtn');
    if (addInquiryBtn) {
        addInquiryBtn.addEventListener('click', handleAddInquiry);
    }

    // Submit Inquiries Button
    const submitInquiriesBtn = document.getElementById('submitInquiriesBtn');
    if (submitInquiriesBtn) {
        submitInquiriesBtn.addEventListener('click', handleSubmitInquiries);
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// User Data Management
function loadUserData() {
    // Check if user is authenticated
    const authState = localStorage.getItem('authState');
    if (authState) {
        try {
            const user = JSON.parse(authState);
            if (user.loggedIn && user.user) {
                updateProfileDisplay(user.user);
            }
        } catch (e) {
            console.error('Error parsing auth state:', e);
        }
    }

    // Update cart count
    updateCartCount();
}

// Cart Count Management
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;

    let totalCount = 0;

    // Count orders
    if (window.OrdersModule) {
        totalCount += window.OrdersModule.getItemCount();
    }

    // Count preorders
    if (window.PreordersModule) {
        totalCount += window.PreordersModule.getItemCount();
    }

    // Count inquiries
    if (window.InquiryModule) {
        totalCount += window.InquiryModule.getItemCount();
    }

    cartCount.textContent = totalCount;

    // Show/hide cart count badge
    if (totalCount > 0) {
        cartCount.style.display = 'block';
    } else {
        cartCount.style.display = 'none';
    }
}

function updateProfileDisplay(user) {
    const nameInput = document.getElementById('broker-name');
    const emailInput = document.getElementById('broker-email');

    if (nameInput) {
        nameInput.value = user.username || 'Broker User';
    }

    if (emailInput) {
        emailInput.value = user.email || 'broker@eastleighturf.com';
    }
}

// Event Handlers
function handleAddItem() {
    if (window.OrdersModule) {
        window.OrdersModule.addItem();
    }
}

function handleSubmitOrder() {
    if (window.OrdersModule) {
        window.OrdersModule.submitOrder();
    }
}

function handleAddPreorder() {
    if (window.PreordersModule) {
        window.PreordersModule.addPreorder();
    }
}

function handleSubmitPreorders() {
    if (window.PreordersModule) {
        window.PreordersModule.submitPreorders();
    }
}

function handleAddInquiry() {
    if (window.InquiryModule) {
        window.InquiryModule.addInquiry();
    }
}

function handleSubmitInquiries() {
    if (window.InquiryModule) {
        window.InquiryModule.submitInquiries();
    }
}

function handleLogout() {
    // Clear authentication state
    localStorage.removeItem('authState');
    localStorage.removeItem('brokerInfo');

    // Show logout message
    showToast('Logging out...', 'success');

    // Redirect to home page
    window.location.href = '/index.html';
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon i');

    // Set message
    toastMessage.textContent = message;

    // Set icon and styling based on type
    if (type === 'success') {
        toastIcon.className = 'fas fa-check-circle';
        toast.className = 'toast success';
    } else if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toast.className = 'toast error';
    } else if (type === 'info') {
        toastIcon.className = 'fas fa-info-circle';
        toast.className = 'toast info';
    }

    // Show toast
    toast.classList.remove('hidden');

    // Auto-hide after 4 seconds
    setTimeout(() => {
        hideToast();
    }, 4000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('hidden');
}

// Welcome Toast
function showWelcomeToast() {
    setTimeout(() => {
        showToast('Login Successful\nWelcome to your broker dashboard.', 'success');
    }, 500);
}

// Utility Functions
function contains(text, searchText) {
    return text.toLowerCase().includes(searchText.toLowerCase());
}



// Export functions for external use
window.BrokerDashboard = {
    showToast,
    hideToast,
    handleLogout,
    updateCartCount
};

// Add click event for toast close button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('toast-close')) {
        hideToast();
    }
});

// Mobile Navigation is now handled by the unified header.js component