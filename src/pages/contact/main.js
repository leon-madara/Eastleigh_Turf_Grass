import "@/css/base.css";
import "@/css/header.css";
import "@/css/contact.css";
import "@/css/footer.css";
import "@/css/mobile-nav.css";
import "@/css/toast.css";

// Core functionality
import "@/js/components/header.js";
import "@/js/components/cart.js";
import "@/js/components/cartIconPopUp.js";
import "@/js/components/toast.js";

// Modals
import "@/ui/BrokerLoginModal.js";
import "@/services/toastService.js";

// Effects and animations
import "@/js/effects/floating-header.js";
import "@/js/effects/mobile-scroll-animations.js";

document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
import "@/css/header.css";
import "@/css/contact.css";
import "@/css/footer.css";
import "@/css/mobile-nav.css";
import "@/css/toast.css";

document.addEventListener("DOMContentLoaded", () => {
    // contact page boot logic here if needed
});