// Cart icon popup UI component
// Cart Icon Popup - Desktop Only
console.log('🔧 Initializing cart icon popup (desktop only)...');

// Check if we're on mobile
const isMobile = window.innerWidth <= 768;

// Get the elements
const cartBtn = document.getElementById('cartIconBtn');
const popup = document.getElementById('cartIconPopUp');
const closeBtn = document.getElementById('cartPopUpCloseBtn');

// Only initialize popup on desktop
if (!isMobile && cartBtn && popup) {
    console.log('Desktop detected, initializing cart popup...');

    // Clone the button to remove existing event listeners
    const cleanCartBtn = cartBtn.cloneNode(true);
    cartBtn.parentNode.replaceChild(cleanCartBtn, cartBtn);

    // Add desktop-only popup event listener
    cleanCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('✅ Desktop cart button clicked - opening popup');

        const isHidden = popup.classList.contains('hidden');

        if (isHidden) {
            popup.classList.remove('hidden');
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            popup.classList.add('hidden');
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Clean close button listeners
    if (closeBtn) {
        const cleanCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(cleanCloseBtn, closeBtn);

        cleanCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('❌ Close button clicked');

            popup.classList.add('hidden');
            popup.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
            console.log('⌨️ Escape key pressed');
            popup.classList.add('hidden');
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Click outside to close
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            console.log('🖱️ Clicked outside popup');
            popup.classList.add('hidden');
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    console.log('✅ Desktop cart popup initialized successfully!');

} else if (isMobile) {
    console.log('📱 Mobile detected - cart icon will redirect to products page');
    // On mobile, let the natural link behavior work (redirect to products.html#cart)
} else {
    console.error('❌ Cart elements not found:', {
        cartBtn: !!cartBtn,
        popup: !!popup
    });
}