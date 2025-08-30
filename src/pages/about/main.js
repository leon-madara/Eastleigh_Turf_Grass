// Import styles
import "@/css/base.css";
import "@/css/header.css";
import "@/css/about.css";
import "@/css/footer.css";
import "@/css/mobile-nav.css";
import "@/css/toast.css";

// Import core functionality
import "@/js/components/header.js";
import "@/js/components/cart.js";
import "@/js/components/cartIconPopUp.js";
import "@/js/components/toast.js";

// Import modals
import "@/ui/BrokerLoginModal.js";

// Import services
import "@/services/toastService.js";

// Import effects and animations
import "@/js/effects/floating-header.js";
import "@/js/effects/mobile-scroll-animations.js";

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});