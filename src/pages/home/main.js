// Home page entry (Vite)
import '@/css/base.css';
import '@/css/header.css';
import '@/css/hero.css';
import '@/css/home.css';
import '@/css/footer.css';
import '@/css/mobile-nav.css';
import '@/css/productShowcase.css';
import '@/css/testimonials.css';
import '@/css/toast.css';

// Core functionality
import '@/js/components/header.js';
import '@/js/components/cart.js';
import '@/js/components/cartIconPopUp.js';
import '@/js/components/toast.js';

// Modals
import '@/ui/BrokerLoginModal.js';

// Services
import '@/services/toastService.js';

// Effects and animations
import {
    initBeforeAfterSlider
} from '@/js/effects/homeSlider.js';
import '@/js/effects/floating-header.js';
import '@/js/effects/mobile-scroll-animations.js';

// Initialize slider
document.addEventListener("DOMContentLoaded", () => {
    initBeforeAfterSlider(".ba");
});