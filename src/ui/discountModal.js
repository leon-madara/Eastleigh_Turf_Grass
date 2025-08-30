export const discountModal = {
    init() {
        // Initialize discount modal functionality
        console.log('Discount modal initialized');
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
        const existingModal = document.getElementById('discountModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="discountModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Available Discounts</h2>
                        <button class="modal-close" id="closeDiscountModal" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="discount-list" id="discountList">
                            <div class="discount-item">
                                <div class="discount-info">
                                    <h3>Bulk Purchase Discount</h3>
                                    <p>Get 10% off when you purchase 100m² or more</p>
                                    <span class="discount-value">10% OFF</span>
                                </div>
                                <button class="btn btn-primary apply-discount" data-discount="bulk">Apply</button>
                            </div>
                            <div class="discount-item">
                                <div class="discount-info">
                                    <h3>First Time Buyer</h3>
                                    <p>Special discount for first-time customers</p>
                                    <span class="discount-value">5% OFF</span>
                                </div>
                                <button class="btn btn-primary apply-discount" data-discount="first-time">Apply</button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelDiscount">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindEvents();
    },
    
    showModal() {
        const modal = document.getElementById('discountModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    },
    
    hideModal() {
        const modal = document.getElementById('discountModal');
        if (modal) {
            modal.remove();
        }
    },
    
    bindEvents() {
        // Close button
        const closeBtn = document.getElementById('closeDiscountModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Cancel button
        const cancelBtn = document.getElementById('cancelDiscount');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }
        
        // Apply discount buttons
        const applyButtons = document.querySelectorAll('.apply-discount');
        applyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const discountType = e.target.dataset.discount;
                this.applyDiscount(discountType);
            });
        });
        
        // Close on overlay click
        const modal = document.getElementById('discountModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close();
                }
            });
        }
    },
    
    applyDiscount(discountType) {
        // Here you would typically apply the discount to the cart
        // For now, we'll just show a success message
        this.showSuccess(`Discount applied: ${discountType}`);
        
        // Close the modal after a short delay
        setTimeout(() => {
            this.close();
        }, 1500);
    },
    
    showSuccess(message) {
        // You can implement a toast notification here
        console.log('Discount Success:', message);
        alert(message);
    }
};