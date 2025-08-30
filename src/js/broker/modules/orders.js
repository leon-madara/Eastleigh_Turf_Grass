// Orders Module - Enhanced functionality for order management
(() => {
    let products = [];
    let orderItems = [];
    let nextItemId = 1;
    let currentBroker = null;
    let availableDiscounts = [];
    let availableCoupons = [];
    let appliedDiscount = null;
    let appliedCoupon = null;

    // Initialize the orders module
    async function init() {
        await loadProducts();
        await loadDiscounts();
        await loadCoupons();
        loadBrokerInfo();
        updateUI();
        bindEvents();
    }

    // Load products from the main site's JSON
    async function loadProducts() {
        try {
            const response = await fetch('/src/data/products.json');
            products = await response.json();
            console.log('Products loaded:', products.length, 'products');
        } catch (error) {
            console.error('Failed to load products:', error);
            showToast('Failed to load products', 'error');
        }
    }

    // Load available discounts
    async function loadDiscounts() {
        try {
            const response = await fetch('/src/data/discounts.json');
            const data = await response.json();
            availableDiscounts = data.promotions.filter(promo => promo.active);
            console.log('Discounts loaded:', availableDiscounts.length, 'active discounts');
        } catch (error) {
            console.error('Failed to load discounts:', error);
            availableDiscounts = [];
        }
    }

    // Load available coupons
    async function loadCoupons() {
        try {
            const response = await fetch('/src/data/coupons.json');
            const data = await response.json();
            availableCoupons = data.coupons.filter(coupon =>
                coupon.usedCount < coupon.usageLimit &&
                new Date() >= new Date(coupon.validFrom) &&
                new Date() <= new Date(coupon.validTo)
            );
            console.log('Coupons loaded:', availableCoupons.length, 'available coupons');
        } catch (error) {
            console.error('Failed to load coupons:', error);
            availableCoupons = [];
        }
    }

    // Load broker information
    function loadBrokerInfo() {
        // Get broker info from localStorage or use defaults
        const brokerData = localStorage.getItem('brokerInfo');
        if (brokerData) {
            currentBroker = JSON.parse(brokerData);
        } else {
            currentBroker = {
                id: 'BROKER001',
                name: 'Broker User',
                email: 'broker@eastleighturf.com',
                phone: '+254700000000'
            };
        }
    }

    // Bind event listeners
    function bindEvents() {
        const addItemBtn = document.getElementById('addItemBtn');
        const submitOrderBtn = document.getElementById('submitOrderBtn');

        if (addItemBtn) {
            addItemBtn.addEventListener('click', showAddItemModal);
        }

        if (submitOrderBtn) {
            submitOrderBtn.addEventListener('click', submitOrder);
        }
    }

    // Show add item modal
    function showAddItemModal() {
        createAddItemModal();
        const modal = document.getElementById('addItemModal');
        if (modal) {
            modal.style.display = 'flex';
            // Initially disable discount and coupon options
            disableDiscountCouponOptions();
        }
    }

    // Create add item modal
    function createAddItemModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('addItemModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div id="addItemModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Add Order Item</h2>
                        <button class="modal-close" id="closeAddItemModal" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addItemForm">
                            <div class="form-group">
                                <label for="modalProduct">Product *</label>
                                <select id="modalProduct" required>
                                    <option value="">Select a product</option>
                                    ${products.map(product =>
            `<option value="${product.id}">${product.name} (${product.thickness})</option>`
        ).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="modalQuantity">Quantity (m²) *</label>
                                <input type="number" id="modalQuantity" min="0.1" step="0.1" required placeholder="Enter quantity">
                            </div>

                            <div class="form-group">
                                <label>Unit Price (KES)</label>
                                <input type="text" id="modalUnitPrice" readonly value="0">
                            </div>

                            <div class="form-group">
                                <label>Subtotal (KES)</label>
                                <input type="text" id="modalSubtotal" readonly value="0">
                            </div>

                            <div class="discount-section">
                                <h3>Discounts & Coupons</h3>
                                
                                <div class="form-group">
                                    <label for="modalDiscount">Available Discounts</label>
                                    <select id="modalDiscount" disabled>
                                        <option value="">No discount</option>
                                        ${availableDiscounts.map(discount =>
            `<option value="${discount.id}">${discount.name} - ${discount.description}</option>`
        ).join('')}
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="modalCoupon">Coupon Code</label>
                                    <div class="coupon-input-group">
                                        <input type="text" id="modalCoupon" placeholder="Enter coupon code" disabled>
                                        <button type="button" id="applyCouponBtn" disabled>Apply</button>
                                    </div>
                                </div>

                                <div class="discount-summary" id="discountSummary" style="display: none;">
                                    <div class="summary-row">
                                        <span>Subtotal:</span>
                                        <span id="summarySubtotal">KES 0</span>
                                    </div>
                                    <div class="summary-row discount-row" id="discountRow" style="display: none;">
                                        <span>Discount:</span>
                                        <span id="summaryDiscount">-KES 0</span>
                                    </div>
                                    <div class="summary-row coupon-row" id="couponRow" style="display: none;">
                                        <span>Coupon:</span>
                                        <span id="summaryCoupon">-KES 0</span>
                                    </div>
                                    <div class="summary-row final-total">
                                        <span>Final Total:</span>
                                        <span id="summaryFinalTotal">KES 0</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelAddItem">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmAddItem" disabled>Add to Order</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        bindModalEvents();
    }

    // Bind modal events
    function bindModalEvents() {
        const modal = document.getElementById('addItemModal');
        const closeBtn = document.getElementById('closeAddItemModal');
        const cancelBtn = document.getElementById('cancelAddItem');
        const confirmBtn = document.getElementById('confirmAddItem');
        const productSelect = document.getElementById('modalProduct');
        const quantityInput = document.getElementById('modalQuantity');
        const applyCouponBtn = document.getElementById('applyCouponBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeAddItemModal);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeAddItemModal);
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', addItemToOrder);
        }

        if (productSelect) {
            productSelect.addEventListener('change', handleProductChange);
        }

        if (quantityInput) {
            quantityInput.addEventListener('input', handleQuantityChange);

            // Add number formatting for quantity input
            if (window.numberFormatter) {
                window.numberFormatter.initInputFormatting(quantityInput, {
                    allowDecimals: true,
                    decimalPlaces: 1,
                    currency: 'KES'
                });
            } else {
                // Fallback: wait for formatter to be available
                const checkFormatter = setInterval(() => {
                    if (window.numberFormatter) {
                        window.numberFormatter.initInputFormatting(quantityInput, {
                            allowDecimals: true,
                            decimalPlaces: 1,
                            currency: 'KES'
                        });
                        clearInterval(checkFormatter);
                    }
                }, 100);
            }
        }

        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', applyCoupon);
        }

        // Close modal on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeAddItemModal();
                }
            });
        }
    }

    // Handle product selection
    function handleProductChange() {
        const productSelect = document.getElementById('modalProduct');
        const quantityInput = document.getElementById('modalQuantity');
        const unitPriceInput = document.getElementById('modalUnitPrice');
        const subtotalInput = document.getElementById('modalSubtotal');

        if (productSelect && productSelect.value) {
            const product = products.find(p => p.id === productSelect.value);
            if (product) {
                unitPriceInput.value = product.price.toLocaleString('en-US');
                updateSubtotal();
                checkEnableDiscountCoupon();
            }
        } else {
            unitPriceInput.value = '0';
            subtotalInput.value = '0';
            disableDiscountCouponOptions();
        }
    }

    // Handle quantity change
    function handleQuantityChange() {
        updateSubtotal();
        checkEnableDiscountCoupon();
    }

    // Update subtotal
    function updateSubtotal() {
        const productSelect = document.getElementById('modalProduct');
        const quantityInput = document.getElementById('modalQuantity');
        const subtotalInput = document.getElementById('modalSubtotal');

        if (productSelect && productSelect.value && quantityInput && quantityInput.value) {
            const product = products.find(p => p.id === productSelect.value);
            const quantity = window.numberFormatter ? window.numberFormatter.parseFormattedNumber(quantityInput.value) : parseFloat(quantityInput.value) || 0;
            const subtotal = product.price * quantity;

            subtotalInput.value = window.numberFormatter ? window.numberFormatter.formatCurrency(subtotal) : subtotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            updateDiscountSummary();
        } else {
            subtotalInput.value = '0';
        }
    }

    // Check if discount and coupon options should be enabled
    function checkEnableDiscountCoupon() {
        const productSelect = document.getElementById('modalProduct');
        const quantityInput = document.getElementById('modalQuantity');
        const discountSelect = document.getElementById('modalDiscount');
        const couponInput = document.getElementById('modalCoupon');
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        const confirmBtn = document.getElementById('confirmAddItem');

        const hasProduct = productSelect && productSelect.value;
        const hasQuantity = quantityInput && quantityInput.value && (window.numberFormatter ? window.numberFormatter.parseFormattedNumber(quantityInput.value) : parseFloat(quantityInput.value)) > 0;

        if (hasProduct && hasQuantity) {
            enableDiscountCouponOptions();
            if (confirmBtn) confirmBtn.disabled = false;
        } else {
            disableDiscountCouponOptions();
            if (confirmBtn) confirmBtn.disabled = true;
        }
    }

    // Enable discount and coupon options
    function enableDiscountCouponOptions() {
        const discountSelect = document.getElementById('modalDiscount');
        const couponInput = document.getElementById('modalCoupon');
        const applyCouponBtn = document.getElementById('applyCouponBtn');

        if (discountSelect) discountSelect.disabled = false;
        if (couponInput) couponInput.disabled = false;
        if (applyCouponBtn) applyCouponBtn.disabled = false;

        // Add event listeners for discount changes
        if (discountSelect) {
            discountSelect.addEventListener('change', updateDiscountSummary);
        }
    }

    // Disable discount and coupon options
    function disableDiscountCouponOptions() {
        const discountSelect = document.getElementById('modalDiscount');
        const couponInput = document.getElementById('modalCoupon');
        const applyCouponBtn = document.getElementById('applyCouponBtn');

        if (discountSelect) {
            discountSelect.disabled = true;
            discountSelect.value = '';
        }
        if (couponInput) {
            couponInput.disabled = true;
            couponInput.value = '';
        }
        if (applyCouponBtn) applyCouponBtn.disabled = true;

        // Reset discount summary
        appliedDiscount = null;
        appliedCoupon = null;
        updateDiscountSummary();
    }

    // Apply coupon
    function applyCoupon() {
        const couponInput = document.getElementById('modalCoupon');
        const couponCode = couponInput.value.trim().toUpperCase();

        if (!couponCode) {
            showToast('Please enter a coupon code', 'error');
            return;
        }

        const coupon = availableCoupons.find(c => c.code === couponCode);
        if (!coupon) {
            showToast('Invalid coupon code', 'error');
            return;
        }

        const subtotal = getCurrentSubtotal();
        if (subtotal < coupon.minOrder) {
            showToast(`Minimum order amount for this coupon is KES ${coupon.minOrder.toLocaleString()}`, 'error');
            return;
        }

        appliedCoupon = coupon;
        showToast(`Coupon ${coupon.code} applied successfully!`, 'success');
        updateDiscountSummary();
    }

    // Update discount summary
    function updateDiscountSummary() {
        const subtotal = getCurrentSubtotal();
        const discountSummary = document.getElementById('discountSummary');
        const summarySubtotal = document.getElementById('summarySubtotal');
        const discountRow = document.getElementById('discountRow');
        const summaryDiscount = document.getElementById('summaryDiscount');
        const couponRow = document.getElementById('couponRow');
        const summaryCoupon = document.getElementById('summaryCoupon');
        const summaryFinalTotal = document.getElementById('summaryFinalTotal');

        if (!discountSummary) return;

        summarySubtotal.textContent = `KES ${subtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        let finalTotal = subtotal;
        let discountAmount = 0;
        let couponAmount = 0;

        // Calculate discount
        const discountSelect = document.getElementById('modalDiscount');
        if (discountSelect && discountSelect.value) {
            const discount = availableDiscounts.find(d => d.id === discountSelect.value);
            if (discount && subtotal >= discount.minOrder) {
                if (discount.type === 'percentage') {
                    discountAmount = (subtotal * discount.value / 100);
                    if (discount.maxDiscount) {
                        discountAmount = Math.min(discountAmount, discount.maxDiscount);
                    }
                } else {
                    discountAmount = discount.value;
                }
                finalTotal -= discountAmount;
                appliedDiscount = discount;
            }
        }

        // Calculate coupon
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percentage') {
                couponAmount = (subtotal * appliedCoupon.value / 100);
                if (appliedCoupon.maxDiscount) {
                    couponAmount = Math.min(couponAmount, appliedCoupon.maxDiscount);
                }
            } else {
                couponAmount = appliedCoupon.value;
            }
            finalTotal -= couponAmount;
        }

        // Show/hide discount row
        if (discountAmount > 0) {
            discountRow.style.display = 'flex';
            summaryDiscount.textContent = `-KES ${discountAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        } else {
            discountRow.style.display = 'none';
        }

        // Show/hide coupon row
        if (couponAmount > 0) {
            couponRow.style.display = 'flex';
            summaryCoupon.textContent = `-KES ${couponAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        } else {
            couponRow.style.display = 'none';
        }

        summaryFinalTotal.textContent = `KES ${finalTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        discountSummary.style.display = 'block';
    }

    // Get current subtotal from modal
    function getCurrentSubtotal() {
        const productSelect = document.getElementById('modalProduct');
        const quantityInput = document.getElementById('modalQuantity');

        if (productSelect && productSelect.value && quantityInput && quantityInput.value) {
            const product = products.find(p => p.id === productSelect.value);
            const quantity = parseFloat(quantityInput.value) || 0;
            return product.price * quantity;
        }
        return 0;
    }

    // Add item to order
    function addItemToOrder() {
        const productSelect = document.getElementById('modalProduct');
        const quantityInput = document.getElementById('modalQuantity');

        if (!productSelect.value || !quantityInput.value) {
            showToast('Please select a product and enter quantity', 'error');
            return;
        }

        const product = products.find(p => p.id === productSelect.value);
        const quantity = parseFloat(quantityInput.value);
        const subtotal = getCurrentSubtotal();

        const item = {
            id: nextItemId++,
            productId: product.id,
            product: product,
            quantity: quantity,
            unitPrice: product.price,
            subtotal: subtotal,
            discount: appliedDiscount,
            coupon: appliedCoupon,
            finalTotal: subtotal - (appliedDiscount ? calculateDiscountAmount(subtotal, appliedDiscount) : 0) - (appliedCoupon ? calculateCouponAmount(subtotal, appliedCoupon) : 0)
        };

        orderItems.push(item);
        closeAddItemModal();
        updateUI();
        showToast('Item added to order', 'success');

        // Update cart count
        if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
            window.BrokerDashboard.updateCartCount();
        }
    }

    // Calculate discount amount
    function calculateDiscountAmount(subtotal, discount) {
        if (discount.type === 'percentage') {
            let amount = (subtotal * discount.value / 100);
            if (discount.maxDiscount) {
                amount = Math.min(amount, discount.maxDiscount);
            }
            return amount;
        }
        return discount.value;
    }

    // Calculate coupon amount
    function calculateCouponAmount(subtotal, coupon) {
        if (coupon.type === 'percentage') {
            let amount = (subtotal * coupon.value / 100);
            if (coupon.maxDiscount) {
                amount = Math.min(amount, coupon.maxDiscount);
            }
            return amount;
        }
        return coupon.value;
    }

    // Close add item modal
    function closeAddItemModal() {
        const modal = document.getElementById('addItemModal');
        if (modal) {
            modal.remove();
        }
        // Reset applied discounts
        appliedDiscount = null;
        appliedCoupon = null;
    }

    // Remove an item from the order
    function removeItem(itemId) {
        orderItems = orderItems.filter(item => item.id !== itemId);
        updateUI();
        showToast('Item removed from order', 'success');

        // Update cart count
        if (window.BrokerDashboard && window.BrokerDashboard.updateCartCount) {
            window.BrokerDashboard.updateCartCount();
        }
    }

    // Calculate order total
    function calculateTotal() {
        return orderItems.reduce((sum, item) => sum + item.finalTotal, 0);
    }

    // Update the UI
    function updateUI() {
        const tableBody = document.getElementById('orderTableBody');
        const emptyState = document.getElementById('emptyOrderState');
        const orderTotal = document.getElementById('orderTotal');
        const submitBtn = document.getElementById('submitOrderBtn');

        if (!tableBody || !emptyState || !orderTotal || !submitBtn) return;

        // Show/hide empty state
        if (orderItems.length === 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'block';
            submitBtn.disabled = true;
        } else {
            emptyState.style.display = 'none';
            submitBtn.disabled = false;
            // Render table rows
            tableBody.innerHTML = orderItems.map(item => createOrderRow(item)).join('');
            // Add event listeners to new elements
            orderItems.forEach(item => {
                const deleteBtn = document.getElementById(`delete-${item.id}`);
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => {
                        removeItem(item.id);
                    });
                }
            });
        }

        // Update total
        const total = calculateTotal();
        orderTotal.textContent = total.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // Update credit balance when order total changes
        if (window.paymentSummaryHandler && window.paymentSummaryHandler.updateCreditBalance) {
            window.paymentSummaryHandler.updateCreditBalance();
        }
    }

    // Create order row HTML
    function createOrderRow(item) {
        const discountText = item.discount ? `${item.discount.name} (-${item.discount.value}%)` : '';
        const couponText = item.coupon ? `${item.coupon.code} (-${item.coupon.value}${item.coupon.type === 'percentage' ? '%' : ' KES'})` : '';

        return `
            <tr>
                <td>
                    <div class="order-field">
                        <label>Product Name</label>
                        <strong>${item.product.name} (${item.product.thickness})</strong>
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Quantity (m²)</label>
                        <strong>${item.quantity}</strong>
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Unit Price (KES)</label>
                        <strong>${item.unitPrice.toLocaleString('en-US')}</strong>
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Subtotal (KES)</label>
                        <strong>${item.subtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</strong>
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Final Total (KES)</label>
                        <strong>${item.finalTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}</strong>
                        ${discountText || couponText ? `<br><small class="discount-info">${discountText}${discountText && couponText ? ', ' : ''}${couponText}</small>` : ''}
                    </div>
                </td>
                <td>
                    <div class="order-field">
                        <label>Action</label>
                        <button class="delete-btn" id="delete-${item.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    // Submit order
    function submitOrder() {
        if (orderItems.length === 0) {
            showToast('No items in order', 'error');
            return;
        }

        const orderData = {
            brokerId: currentBroker.id,
            brokerName: currentBroker.name,
            brokerEmail: currentBroker.email,
            brokerPhone: currentBroker.phone,
            items: orderItems,
            total: calculateTotal(),
            subtotal: orderItems.reduce((sum, item) => sum + item.subtotal, 0),
            totalDiscount: orderItems.reduce((sum, item) => {
                let itemDiscount = 0;
                if (item.discount) {
                    itemDiscount += calculateDiscountAmount(item.subtotal, item.discount);
                }
                if (item.coupon) {
                    itemDiscount += calculateCouponAmount(item.subtotal, item.coupon);
                }
                return sum + itemDiscount;
            }, 0),
            orderDate: new Date().toISOString()
        };

        // Send to WhatsApp
        sendOrderToWhatsApp(orderData);
    }

    // Send order to WhatsApp
    function sendOrderToWhatsApp(orderData) {
        const message = generateOrderMessage(orderData);

        if (window.WhatsAppService && window.WhatsAppService.sendToWhatsApp) {
            const success = window.WhatsAppService.sendToWhatsApp(message, 'broker-order');
            if (success) {
                showToast('Order sent to WhatsApp successfully!', 'success');
                // Clear order after successful submission
                orderItems = [];
                updateUI();
            } else {
                showToast('Failed to send order to WhatsApp', 'error');
            }
        } else {
            // Fallback: open WhatsApp manually
            const whatsappNumber = '254743375997';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            showToast('Order opened in WhatsApp!', 'success');
            // Clear order after successful submission
            orderItems = [];
            updateUI();
        }
    }

    // Generate order message for WhatsApp
    function generateOrderMessage(orderData) {
        const itemsList = orderData.items.map(item => {
            let itemText = `• ${item.product.name} (${item.product.thickness})\n`;
            itemText += `  Quantity: ${item.quantity} m²\n`;
            itemText += `  Unit Price: KES ${item.unitPrice.toLocaleString()}\n`;
            itemText += `  Subtotal: KES ${item.subtotal.toLocaleString()}`;

            if (item.discount || item.coupon) {
                itemText += `\n  Final Total: KES ${item.finalTotal.toLocaleString()}`;
                if (item.discount) {
                    itemText += ` (${item.discount.name} applied)`;
                }
                if (item.coupon) {
                    itemText += ` (${item.coupon.code} applied)`;
                }
            }
            return itemText;
        }).join('\n\n');

        return `*BROKER ORDER SUBMISSION - Eastleigh Turf Grass*

*Broker Details:*
• ID: ${orderData.brokerId}
• Name: ${orderData.brokerName}
• Email: ${orderData.brokerEmail}
• Phone: ${orderData.brokerPhone}

*Order Items:*
${itemsList}

*Order Summary:*
• Total Items: ${orderData.items.length}
• Subtotal: KES ${orderData.subtotal.toLocaleString()}
• Total Discount: KES ${orderData.totalDiscount.toLocaleString()}
• Final Total: KES ${orderData.total.toLocaleString()}

*Submitted:* ${new Date().toLocaleString('en-KE')}`;
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');

        if (toast && toastMessage) {
            toast.className = `toast ${type}`;
            toastMessage.textContent = message;
            toast.classList.remove('hidden');

            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
    }

    // Get item count for cart
    function getItemCount() {
        return orderItems.length;
    }

    // Initialize the module when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await init();
        });
    } else {
        (async () => {
            await init();
        })();
    }

    // Expose module to window object
    window.OrdersModule = {
        addItem: showAddItemModal,
        removeItem,
        getItemCount,
        calculateTotal,
        updateUI,
        submitOrder
    };

})();