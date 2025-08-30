import "@/css/base.css";
import "@/css/header.css";
import "@/css/footer.css";
import "@/css/mobile-nav.css";
import "@/css/toast.css";
import "@/css/components/broker-login.css";

// Core functionality
import "@/js/components/header.js";
import "@/js/components/toast.js";

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
import "@/css/footer.css";
import "@/css/mobile-nav.css";
import "@/css/toast.css";
import "@/css/components/broker-login.css";

document.addEventListener("DOMContentLoaded", () => {
    // login page boot logic here if needed
});