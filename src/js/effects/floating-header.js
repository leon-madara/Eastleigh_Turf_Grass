/**
 * Floating Navbar Controller
 * 
 * Implements a floating navbar that activates when user scrolls past hero section
 * Works with both glassmorphism and floating states
 */
document.addEventListener('DOMContentLoaded', function () {
    // Prevent duplicate initialization
    const header = document.querySelector('.header');
    if (header?.dataset.floatingHeaderInitialized) {
        return;
    }

    // DOM Elements
    const heroSection = document.querySelector('.contact-hero') ||
        document.querySelector('.hero') ||
        document.querySelector('.title-page');

    // Configuration
    const config = {
        // Distance from top when floating should activate
        offset: 100,
        // Class to add when floating
        floatingClass: 'floating',
        // Smoothness of the transition
        debounceDelay: 100, // Note: not used, see below
        // Mobile breakpoint (disable floating on mobile)
        mobileBreakpoint: 768
    };

    // State tracking
    let isFloating = false;
    let ticking = false;
    let lastScrollY = window.scrollY;

    /**
     * Check if we're on mobile
     */
    function isMobile() {
        return window.innerWidth <= config.mobileBreakpoint;
    }

    /**
     * Check scroll position and update navbar state
     */
    function checkScroll() {
        // Disable floating on mobile
        if (isMobile()) {
            if (isFloating) {
                updateFloatingState(false);
            }
            ticking = false;
            return;
        }

        const currentScrollY = window.scrollY;

        // Determine if we should be floating
        const shouldBeFloating = currentScrollY >= config.offset;

        // Only update if state changed
        if (shouldBeFloating !== isFloating) {
            updateFloatingState(shouldBeFloating);
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    /**
     * Update the floating state of the navbar
     * @param {boolean} floating - Whether to activate floating state
     */
    function updateFloatingState(floating) {
        if (floating) {
            header.classList.add(config.floatingClass);
            // Add data attribute for CSS targeting
            header.setAttribute('data-state', 'floating');
        } else {
            header.classList.remove(config.floatingClass);
            header.removeAttribute('data-state');
        }

        isFloating = floating;

        // Dispatch custom event for other scripts to listen to
        const event = new CustomEvent('navbarStateChange', {
            detail: {
                floating: isFloating
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Debounced scroll handler to improve performance
     */
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    /**
     * Initialize the floating navbar
     */
    function init() {
        // Initial state check
        checkScroll();

        // Add scroll event listener
        window.addEventListener('scroll', onScroll, {
            passive: true
        });

        // Handle resize events (important for mobile)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Check if mobile state changed and update accordingly
                checkScroll();
            }, 250);
        });

        // Handle orientation change (mobile)
        window.addEventListener('orientationchange', () => {
            // Small delay to ensure DOM has settled
            setTimeout(checkScroll, 300);
        });

        // Optional: Add smooth transition when page loads
        setTimeout(() => {
            if (header) {
                header.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        }, 100);
    }

    // Only initialize if header exists
    if (!header) {
        console.warn('Floating navbar not initialized: .header element not found.');
        return;
    }

    // Initialize when DOM is ready
    init();

    // Mark as initialized
    header.dataset.floatingHeaderInitialized = 'true';

    // Expose public methods for external use
    window.Navbar = {
        enableFloating: () => updateFloatingState(true),
        disableFloating: () => updateFloatingState(false),
        toggleFloating: () => updateFloatingState(!isFloating),
        getState: () => ({
            floating: isFloating
        }),
        refresh: () => checkScroll()
    };
});