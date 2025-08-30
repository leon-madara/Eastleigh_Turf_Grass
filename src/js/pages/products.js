import {
    Cart
} from '../../state/cartState.js';
import {
    createProductCard
} from '../../ui/components/productCard.js';
import '../components/header.js';
import '../components/cart.js';
import '../components/toast.js';
import '../../css/header.css';
import '../../css/toast.css';
import '../../css/products.css';
import '../../services/toastService.js';

// Make Cart state available globally for discount functionality
window.CartState = Cart;

// Ensure all modals are available on products page (optional - don't block if they fail)
Promise.allSettled([
    import('../../ui/checkoutModal.js').then(module => {
        window.checkoutModal = module.checkoutModal;
        console.log('Checkout modal loaded');
    }).catch(err => console.warn('Checkout modal not available:', err)),
    import('../../ui/discountModal.js').then(module => {
        window.discountModal = module.discountModal;
        console.log('Discount modal loaded');
    }).catch(err => console.warn('Discount modal not available:', err)),
    import('../../ui/components/couponModal.js').then(module => {
        window.couponModal = module.couponModal;
        console.log('Coupon modal loaded');
    }).catch(err => console.warn('Coupon modal not available:', err)),
    import('../../ui/BrokerLoginModal.js').then(() => {
        console.log('Broker login modal loaded');
    }).catch(err => console.warn('Broker login modal not available:', err))
]);

// Products Page Controller
(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('Products page loaded');
        const grid = document.getElementById('productsGrid');

        if (!grid) {
            console.error('Products grid not found!');
            return;
        }

        console.log('Products grid found, loading products...');

        try {
            // Fetch products data
            const res = await fetch('/src/data/products.json', {
                cache: 'no-cache'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const products = await res.json();
            console.log('Products loaded:', products.length, 'products');

            products.forEach((product) => {
                const card = createProductCard(product);
                grid.appendChild(card);
            });

            console.log('Product cards added to grid');

            // Check if we need to scroll to cart section
            if (window.location.hash === '#cart') {
                setTimeout(() => {
                    const cartSection = document.getElementById('cart');
                    if (cartSection) {
                        cartSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 500); // Small delay to ensure page is loaded
            }
        } catch (err) {
            console.error('Error loading products:', err);
        }
    });
})();