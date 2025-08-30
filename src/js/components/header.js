// Header Component
(() => {
    let hamburgerMenu, mobileNav;

    function init() {
        // Prevent duplicate initialization
        if (document.querySelector('.header')?.dataset.headerInitialized) {
            return;
        }

        hamburgerMenu = document.getElementById('hamburgerMenu');
        mobileNav = document.getElementById('mobileNav');

        if (hamburgerMenu && mobileNav) {
            bindEvents();
            // Mark as initialized
            document.querySelector('.header').dataset.headerInitialized = 'true';
        }
    }

    function bindEvents() {
        // Hamburger menu toggle
        hamburgerMenu.addEventListener('click', toggleMobileMenu);

        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && !mobileNav.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }



    function toggleMobileMenu() {
        hamburgerMenu.classList.toggle('active');
        mobileNav.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeMobileMenu() {
        hamburgerMenu.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();