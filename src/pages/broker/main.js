// Broker Dashboard Main Entry Point
// This file initializes all broker dashboard functionality

// Import core functionality
import "@/js/components/header.js";
import "@/js/components/cart.js";
import "@/js/components/cartIconPopUp.js";
import "@/js/components/toast.js";

// Import broker-specific modules
import "@/js/broker/broker.js";
import "@/js/broker/dashboard.js";
import "@/js/broker/modules/orders.js";

// Import WhatsApp service
import "@/services/whatsappService.js";
import "@/services/toastService.js";

// Import other broker modules if they exist
try {
    import("@/js/broker/modules/preorders.js");
} catch (error) {
    console.warn('Preorders module not available:', error);
}

try {
    import("@/js/broker/modules/inquiry.js");
} catch (error) {
    console.warn('Inquiry module not available:', error);
}

// Initialize broker dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Broker dashboard initialized');

    // Check if user is authenticated
    const authState = localStorage.getItem('authState');
    if (!authState) {
        // Redirect to login if not authenticated
        window.location.href = '/index.html';
        return;
    }

    try {
        const user = JSON.parse(authState);
        if (!user.loggedIn || !user.user) {
            // Redirect to login if not properly authenticated
            window.location.href = '/index.html';
            return;
        }

        // Set broker info in localStorage for the orders module
        const brokerInfo = {
            id: 'BROKER001',
            name: user.user.username || 'Broker User',
            email: user.user.email || 'broker@eastleighturf.com',
            phone: user.user.phone || '+254700000000'
        };
        localStorage.setItem('brokerInfo', JSON.stringify(brokerInfo));

    } catch (error) {
        console.error('Error parsing auth state:', error);
        window.location.href = '/index.html';
        return;
    }

    // Initialize broker dashboard
    if (window.BrokerDashboard) {
        console.log('Broker dashboard modules loaded successfully');
    } else {
        console.error('Broker dashboard modules failed to load');
    }
});

// Export for potential external use
export default {
    name: 'BrokerDashboard'
};