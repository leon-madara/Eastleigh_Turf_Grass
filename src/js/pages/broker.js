import '../components/cart.js';

// Broker Dashboard JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    showWelcomeToast();

    // Load modules
    loadModules();
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

// Update profile display
function updateProfileDisplay(user) {
    const nameField = document.getElementById('broker-name');
    const emailField = document.getElementById('broker-email');

    if (nameField) nameField.value = user.name || 'Broker User';
    if (emailField) emailField.value = user.email || 'broker@eastleighturf.com';
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = '0'; // Default for broker dashboard
    }
}

// Show welcome toast
function showWelcomeToast() {
    // Implementation for welcome toast
    console.log('Welcome to Broker Dashboard');
}

// Load modules
function loadModules() {
    // Load additional modules if needed
    console.log('Loading broker modules...');
}

// Event handlers
function handleAddItem() {
    console.log('Add item clicked');
    // Implementation for adding items
}

function handleSubmitOrder() {
    console.log('Submit order clicked');
    // Implementation for submitting orders
}

function handleAddPreorder() {
    console.log('Add preorder clicked');
    // Implementation for adding preorders
}

function handleSubmitPreorders() {
    console.log('Submit preorders clicked');
    // Implementation for submitting preorders
}

function handleAddInquiry() {
    console.log('Add inquiry clicked');
    // Implementation for adding inquiries
}

function handleSubmitInquiries() {
    console.log('Submit inquiries clicked');
    // Implementation for submitting inquiries
}

function handleLogout() {
    console.log('Logout clicked');
    // Clear auth state
    localStorage.removeItem('authState');
    // Redirect to home page
    window.location.href = '/index.html';
}