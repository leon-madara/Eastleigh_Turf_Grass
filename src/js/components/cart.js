// Cart Component
(() => {
    let cartItems = [];
    let cartTotal = 0;

    // Initialize cart
    function init() {
        try {
            loadCartFromStorage();
            updateCartDisplay();
            bindEvents();
            initDiscountCouponButtons();

            // Subscribe to Cart state changes
            if (window.CartState) {
                window.CartState.subscribe((state) => {
                    updateCartSummary();
                });
            }
        } catch (error) {
            console.warn('Cart initialization failed:', error);
        }
    }

    // Load cart from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('eastleighCart');
        if (savedCart) {
            try {
                cartItems = JSON.parse(savedCart);
                calculateTotal();
            } catch (error) {
                console.error('Error loading cart from storage:', error);
                cartItems = [];
            }
        }
    }

    // Save cart to localStorage
    function saveCartToStorage() {
        localStorage.setItem('eastleighCart', JSON.stringify(cartItems));
    }

    // Add item to cart
    function addItem(item) {
        const existingItemIndex = cartItems.findIndex(cartItem =>
            cartItem.id === item.id &&
            cartItem.length === item.length &&
            cartItem.width === item.width
        );

        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += item.quantity;
        } else {
            cartItems.push(item);
        }

        calculateTotal();
        saveCartToStorage();
        updateCartDisplay();

        // Also add to Cart state for discount calculations
        if (window.CartState) {
            window.CartState.add(item);
        }

        showToast('Item Added', `${item.name} has been added to your cart`, 'success');
    }

    // Remove item from cart
    function removeItem(index) {
        const removedItem = cartItems[index];
        cartItems.splice(index, 1);
        calculateTotal();
        saveCartToStorage();
        updateCartDisplay();

        // Also update Cart state
        if (window.CartState) {
            window.CartState.remove(removedItem.id);
        }

        showToast('Item Removed', `${removedItem.name} has been removed from your cart`, 'error');
    }

    // Update item quantity
    function updateItemQuantity(index, newQuantity) {
        if (newQuantity <= 0) {
            removeItem(index);
            return;
        }

        cartItems[index].quantity = newQuantity;
        cartItems[index].total = cartItems[index].area * cartItems[index].price * newQuantity;
        calculateTotal();
        saveCartToStorage();
        updateCartDisplay();
    }

    // Calculate total
    function calculateTotal() {
        cartTotal = cartItems.reduce((total, item) => total + item.total, 0);
    }

    // Update cart summary with discount information
    function updateCartSummary() {
        try {
            const cartTotalElement = document.getElementById('cartTotal');
            const applyDiscountBtn = document.getElementById('applyDiscountBtn');
            const enterCouponBtn = document.getElementById('enterCouponBtn');

            if (!cartTotalElement) return;

            // Get discount information from Cart state
            const subtotal = cartItems.reduce((total, item) => total + item.total, 0);
            const discountAmount = window.CartState ? window.CartState.getDiscountAmount() : 0;
            const finalTotal = subtotal - discountAmount;

            // Update total display
            if (discountAmount > 0) {
                cartTotalElement.innerHTML = `
                    <div class="cart-total-breakdown">
                        <div class="subtotal">Subtotal: KES ${subtotal.toLocaleString()}</div>
                        <div class="discount">Discount: -KES ${discountAmount.toLocaleString()}</div>
                        <div class="final-total">Total: KES ${finalTotal.toLocaleString()}</div>
                    </div>
                `;
            } else {
                cartTotalElement.textContent = `KES ${subtotal.toLocaleString()}`;
            }

            // Update button states
            if (applyDiscountBtn) {
                const hasDiscount = window.CartState && window.CartState.getDiscountAmount() > 0;
                applyDiscountBtn.innerHTML = hasDiscount ?
                    '<i class="fas fa-check"></i> Discount Applied' :
                    '<i class="fas fa-tag"></i> Apply Discount';
                applyDiscountBtn.classList.toggle('applied', hasDiscount);
            }

            if (enterCouponBtn) {
                const hasCoupon = window.CartState && window.CartState.appliedCoupon;
                enterCouponBtn.innerHTML = hasCoupon ?
                    '<i class="fas fa-check"></i> Coupon Applied' :
                    '<i class="fas fa-ticket-alt"></i> Enter Coupon';
                enterCouponBtn.classList.toggle('applied', hasCoupon);
            }
        } catch (error) {
            console.warn('Cart summary update failed:', error);
        }
    }

    // Update cart display
    function updateCartDisplay() {
        try {
            updateCartCount();
            updateCartPanel();
            // updateCartModal(); // Removed - cart modal functionality was removed
        } catch (error) {
            console.warn('Cart display update failed:', error);
        }
    }

    // Update cart count in header
    function updateCartCount() {
        try {
            const cartCount = document.getElementById('cartCount');
            const cartCountBadge = document.getElementById('cartCountBadge');
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

            if (cartCount) cartCount.textContent = totalItems;
            if (cartCountBadge) cartCountBadge.textContent = totalItems;
        } catch (error) {
            console.warn('Cart count update failed:', error);
        }
    }

    // Update cart panel
    function updateCartPanel() {
        try {
            const cartItemsContainer = document.getElementById('cartItems');
            const cartSummary = document.getElementById('cartSummary');
            const cartTotalElement = document.getElementById('cartTotal');

            if (!cartItemsContainer) return;

            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-basket"></i>
                        <p>Your cart is empty</p>
                        <span>Add some products to get started</span>
                    </div>
                `;
                if (cartSummary) cartSummary.style.display = 'none';
            } else {
                cartItemsContainer.innerHTML = cartItems.map((item, index) => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}" />
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-dimensions">${item.length}m × ${item.width}m</div>
                            <div class="cart-item-price">KES ${item.total.toLocaleString()}</div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="window.CartComponent.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" onclick="window.CartComponent.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-item-btn" onclick="window.CartComponent.remove(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');

                if (cartSummary) {
                    cartSummary.style.display = 'block';
                    updateCartSummary();
                }
            }
        } catch (error) {
            console.warn('Cart panel update failed:', error);
        }
    }





    // Clear cart
    function clearCart() {
        cartItems = [];
        cartTotal = 0;
        saveCartToStorage();
        updateCartDisplay();

        // Also clear Cart state
        if (window.CartState) {
            window.CartState.clear();
        }

        showToast('Cart Cleared', 'All items have been removed from your cart', 'error');
    }

    // Checkout via WhatsApp
    function checkoutViaWhatsApp() {
        if (cartItems.length === 0) {
            showToast('Empty Cart', 'Please add items to your cart before checkout', 'error');
            return;
        }

        try {
            // Prepare cart data for WhatsApp
            const cartData = {
                customerName: 'Customer', // You can make this dynamic
                customerEmail: 'customer@example.com', // You can make this dynamic
                items: cartItems.map(item => ({
                    product: {
                        name: item.name
                    },
                    quantity: item.quantity,
                    unitPrice: item.price,
                    total: item.total
                })),
                total: cartTotal
            };

            // Send to WhatsApp
            const success = window.WhatsAppService.sendOrderForm(cartData);

            if (success) {
                showToast('Checkout', 'WhatsApp will open with your order details. Please complete your purchase there.', 'success');
                // Optionally clear cart after successful checkout
                // clearCart();
            } else {
                showToast('Checkout Failed', 'Failed to open WhatsApp. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showToast('Checkout Error', 'An error occurred during checkout. Please try again.', 'error');
        }
    }

    // Show toast notification using unified service
    function showToast(title, description, type = 'success') {
        // Use the unified toast service if available
        if (window.ToastService) {
            window.ToastService.show(description || title, type);
        } else {
            // Fallback to old method if service not available
            const toast = document.getElementById('toast');
            if (!toast) return;

            const toastMessage = toast.querySelector('.toast-message');
            const toastIcon = toast.querySelector('.toast-icon i');

            if (toastMessage) toastMessage.textContent = description || title;

            // Set icon based on type
            if (toastIcon) {
                switch (type) {
                    case 'success':
                        toastIcon.className = 'fas fa-check-circle';
                        break;
                    case 'error':
                        toastIcon.className = 'fas fa-exclamation-circle';
                        break;
                    case 'warning':
                        toastIcon.className = 'fas fa-exclamation-triangle';
                        break;
                    case 'info':
                        toastIcon.className = 'fas fa-info-circle';
                        break;
                    default:
                        toastIcon.className = 'fas fa-check-circle';
                }
            }

            toast.className = `toast ${type}`;
            toast.classList.remove('hidden');
            toast.classList.add('show');

            // Auto-hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 300);
            }, 3000);

            // Add close button functionality
            const closeBtn = toast.querySelector('.toast-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    toast.classList.remove('show');
                    setTimeout(() => {
                        toast.classList.add('hidden');
                    }, 300);
                });
            }
        }
    }

    // Initialize discount and coupon buttons
    function initDiscountCouponButtons() {
        // Only load modals on products page
        if (window.location.pathname.includes('products.html') ||
            (window.location.pathname === '/' && window.location.hash === '#cart')) {

            // Import modals dynamically to avoid circular dependencies
            import('../../ui/discountModal.js').then(module => {
                window.discountModal = module.discountModal;
            });

            import('../../ui/components/couponModal.js').then(module => {
                window.couponModal = module.couponModal;
            });

            // Initialize checkout modal
            import('../../ui/checkoutModal.js').then(module => {
                window.checkoutModal = module.checkoutModal;
                window.checkoutModal.init();
            });
        }
    }

    // Bind events
    function bindEvents() {
        try {
            // Clear cart buttons
            const clearCartBtn = document.getElementById('clearCartBtn');

            if (clearCartBtn) {
                clearCartBtn.addEventListener('click', clearCart);
            }

            // Checkout buttons
            const submitOrderBtn = document.getElementById('submitOrderBtn');

            if (submitOrderBtn) {
                submitOrderBtn.addEventListener('click', () => {
                    if (window.checkoutModal) {
                        window.checkoutModal.open();
                    } else {
                        // Redirect to products page if checkout modal is not available
                        window.location.href = '/products.html#cart';
                    }
                });
            }

            // Discount and coupon buttons
            const applyDiscountBtn = document.getElementById('applyDiscountBtn');
            const enterCouponBtn = document.getElementById('enterCouponBtn');

            if (applyDiscountBtn) {
                applyDiscountBtn.addEventListener('click', () => {
                    if (window.discountModal) {
                        window.discountModal.open();
                    } else {
                        // Redirect to products page if discount modal is not available
                        window.location.href = '/products.html#cart';
                    }
                });
            }

            if (enterCouponBtn) {
                enterCouponBtn.addEventListener('click', () => {
                    if (window.couponModal) {
                        window.couponModal.open();
                    } else {
                        // Redirect to products page if coupon modal is not available
                        window.location.href = '/products.html#cart';
                    }
                });
            }
        } catch (error) {
            console.warn('Cart events binding failed:', error);
        }
    }

    // Public API - Keep the old cart system for backward compatibility
    window.CartComponent = {
        init,
        add: addItem,
        remove: removeItem,
        updateQuantity: updateItemQuantity,
        clear: clearCart,
        getItems: () => cartItems,
        getTotal: () => cartTotal,
        getCount: () => cartItems.reduce((total, item) => total + item.quantity, 0)
    };



    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();