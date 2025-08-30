// Coupon Modal Component
export const couponModal = {
    modal: null,
    isOpen: false,

    init() {
        console.log('Coupon modal initialized');
    },

    open() {
        this.createModal();
        this.showModal();
    },

    close() {
        this.hideModal();
    },

    createModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('couponModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="couponModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Enter Coupon Code</h2>
                        <button class="modal-close" id="closeCouponModal" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="couponForm">
                            <div class="form-group">
                                <label for="couponCode">Coupon Code</label>
                                <input type="text" id="couponCode" placeholder="Enter your coupon code" required>
                            </div>
                            <div class="coupon-info" id="couponInfo" style="display: none;">
                                <div class="info-row">
                                    <span>Discount:</span>
                                    <span id="couponDiscount">0%</span>
                                </div>
                                <div class="info-row">
                                    <span>Valid until:</span>
                                    <span id="couponExpiry">N/A</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelCoupon">Cancel</button>
                        <button type="button" class="btn btn-primary" id="applyCoupon">Apply Coupon</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindEvents();
    },

    showModal() {
        const modal = document.getElementById('couponModal');
        if (modal) {
            modal.style.display = 'flex';
            // Focus on the coupon code input
            const couponInput = document.getElementById('couponCode');
            if (couponInput) {
                couponInput.focus();
            }
        }
    },

    hideModal() {
        const modal = document.getElementById('couponModal');
        if (modal) {
            modal.remove();
        }
    },

    bindEvents() {
        // Close button
        const closeBtn = document.getElementById('closeCouponModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelCoupon');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }

        // Apply button
        const applyBtn = document.getElementById('applyCoupon');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyCoupon());
        }

        // Close on overlay click
        const modal = document.getElementById('couponModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close();
                }
            });
        }

        // Enter key to apply coupon
        const couponInput = document.getElementById('couponCode');
        if (couponInput) {
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyCoupon();
                }
            });
        }
    },

    applyCoupon() {
        const couponCode = document.getElementById('couponCode').value.trim();

        if (!couponCode) {
            this.showError('Please enter a coupon code');
            return;
        }

        // Here you would typically validate the coupon with your backend
        // For now, we'll just show a success message
        this.showSuccess('Coupon applied successfully!');

        // Close the modal after a short delay
        setTimeout(() => {
            this.close();
        }, 1500);
    },

    showError(message) {
        // You can implement a toast notification here
        console.error('Coupon Error:', message);
        alert(message);
    },

    showSuccess(message) {
        // You can implement a toast notification here
        console.log('Coupon Success:', message);
        alert(message);
    }
};