// Checkout State Management - Enhanced for Material 3 Design
class CheckoutState {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.customerData = {
            name: '',
            phone: '',
            email: '',
            location: ''
        };
        this.rememberDetails = true;
        this.subscribers = [];
        this.stepValidation = {
            1: false, // Details step
            2: false, // Review step
            3: false // Send step
        };
        this.loadSavedData();
    }

    // Load saved customer data from localStorage
    loadSavedData() {
        try {
            const saved = localStorage.getItem('checkout_customer_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.customerData = {
                    ...this.customerData,
                    ...data
                };
                // Re-validate current step after loading data
                this.validateCurrentStep();
            }
        } catch (error) {
            console.warn('Failed to load saved checkout data:', error);
        }
    }

    // Save customer data to localStorage
    saveCustomerData() {
        if (this.rememberDetails) {
            try {
                localStorage.setItem('checkout_customer_data', JSON.stringify(this.customerData));
            } catch (error) {
                console.warn('Failed to save checkout data:', error);
            }
        } else {
            localStorage.removeItem('checkout_customer_data');
        }
    }

    // Update customer data
    updateCustomerData(field, value) {
        this.customerData[field] = value;
        this.saveCustomerData();
        this.validateCurrentStep();
        this.notifySubscribers();
    }

    // Update remember details preference
    updateRememberDetails(value) {
        this.rememberDetails = value;
        this.saveCustomerData();
        this.notifySubscribers();
    }

    // Navigate to next step
    nextStep() {
        if (this.currentStep < this.totalSteps && this.stepValidation[this.currentStep]) {
            this.currentStep++;
            this.validateCurrentStep();
            this.notifySubscribers();
            this.updateStepIndicators();
            return true;
        }
        return false;
    }

    // Navigate to previous step
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.notifySubscribers();
            this.updateStepIndicators();
            return true;
        }
        return false;
    }

    // Go to specific step
    goToStep(step) {
        if (step >= 1 && step <= this.totalSteps) {
            // Only allow going to steps that are accessible
            if (step <= this.currentStep || this.stepValidation[step - 1]) {
                this.currentStep = step;
                this.notifySubscribers();
                this.updateStepIndicators();
                return true;
            }
        }
        return false;
    }

    // Update step indicators in the UI
    updateStepIndicators() {
        const stepElements = document.querySelectorAll('.step');
        const stepLines = document.querySelectorAll('.step-line');

        stepElements.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');

            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update progress lines
        stepLines.forEach((line, index) => {
            const stepNumber = index + 1;
            if (stepNumber < this.currentStep) {
                line.style.setProperty('--progress', '100%');
            } else {
                line.style.setProperty('--progress', '0%');
            }
        });
    }

    // Reset checkout state
    reset() {
        this.currentStep = 1;
        this.stepValidation = {
            1: false,
            2: false,
            3: false
        };
        this.updateStepIndicators();
        this.notifySubscribers();
    }

    // Get current state
    getState() {
        return {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps,
            customerData: {
                ...this.customerData
            },
            rememberDetails: this.rememberDetails,
            stepValidation: {
                ...this.stepValidation
            },
            canProceed: this.stepValidation[this.currentStep]
        };
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            const index = this.subscribers.indexOf(callback);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
        };
    }

    // Notify subscribers of state changes
    notifySubscribers() {
        this.subscribers.forEach(callback => {
            try {
                callback(this.getState());
            } catch (error) {
                console.error('Error in checkout state subscriber:', error);
            }
        });
    }

    // Validate current step
    validateCurrentStep() {
        const validation = this.validateStep(this.currentStep);
        this.stepValidation[this.currentStep] = validation.valid;
        return validation;
    }

    // Validate specific step
    validateStep(step) {
        switch (step) {
            case 1:
                return this.validateCustomerDetails();
            case 2:
                return this.validateReviewStep();
            case 3:
                return this.validateSendStep();
            default:
                return {
                    valid: false, message: 'Invalid step'
                };
        }
    }

    // Validate customer details
    validateCustomerDetails() {
        const {
            name,
            phone,
            location
        } = this.customerData;

        if (!name || name.trim().length < 2) {
            return {
                valid: false,
                field: 'name',
                message: 'Name must be at least 2 characters'
            };
        }

        if (!phone || phone.trim().length < 9) {
            return {
                valid: false,
                field: 'phone',
                message: 'Please enter a valid phone number'
            };
        }

        if (!location || location.trim().length < 3) {
            return {
                valid: false,
                field: 'location',
                message: 'Please enter your location'
            };
        }

        return {
            valid: true,
            message: 'All details are valid'
        };
    }

    // Validate review step
    validateReviewStep() {
        // Review step is always valid if we reached it
        return {
            valid: true,
            message: 'Review step is ready'
        };
    }

    // Validate send step
    validateSendStep() {
        // Send step is always valid if we reached it
        return {
            valid: true,
            message: 'Ready to send'
        };
    }

    // Get cart data for order summary
    getCartData() {
        if (window.CartComponent) {
            return {
                items: window.CartComponent.getItems(),
                total: window.CartComponent.getTotal(),
                count: window.CartComponent.getCount()
            };
        }
        return {
            items: [],
            total: 0,
            count: 0
        };
    }

    // Get discount data
    getDiscountData() {
        if (window.CartState) {
            return {
                subtotal: window.CartState.getSubtotal(),
                discountAmount: window.CartState.getDiscountAmount(),
                total: window.CartState.getTotal(),
                appliedCoupon: window.CartState.appliedCoupon,
                appliedPromotion: window.CartState.appliedPromotion
            };
        }
        return {
            subtotal: 0,
            discountAmount: 0,
            total: 0,
            appliedCoupon: null,
            appliedPromotion: null
        };
    }

    // Generate WhatsApp message
    generateWhatsAppMessage() {
        const {
            name,
            phone,
            location
        } = this.customerData;
        const cartData = this.getCartData();
        const discountData = this.getDiscountData();

        let message = `🏠 *TURF GRASS ORDER*\n\n`;
        message += `👤 *Customer Details:*\n`;
        message += `• Name: ${name}\n`;
        message += `• Phone: +254${phone}\n`;
        message += `• Location: ${location}\n\n`;

        message += `🛒 *Order Items:*\n`;
        cartData.items.forEach(item => {
            message += `• ${item.name} - ${item.quantity} units\n`;
            message += `  Size: ${item.size || 'Standard'}\n`;
            message += `  Price: KES ${item.price.toLocaleString()}\n\n`;
        });

        message += `💰 *Order Summary:*\n`;
        message += `• Subtotal: KES ${discountData.subtotal.toLocaleString()}\n`;
        if (discountData.discountAmount > 0) {
            message += `• Discount: -KES ${discountData.discountAmount.toLocaleString()}\n`;
        }
        message += `• *Total: KES ${discountData.total.toLocaleString()}*\n\n`;

        message += `📅 *Order Date:* ${new Date().toLocaleDateString('en-KE')}\n`;
        message += `🆔 *Order ID:* ${this.generateOrderId()}\n\n`;

        message += `Please confirm this order and provide delivery instructions.`;

        return message;
    }

    // Generate unique order ID
    generateOrderId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `TG-${timestamp}-${random}`.toUpperCase();
    }

    // Get step title
    getStepTitle(step) {
        const titles = {
            1: 'Enter Details',
            2: 'Verify Details',
            3: 'Send Order'
        };
        return titles[step] || 'Unknown Step';
    }

    // Get step description
    getStepDescription(step) {
        const descriptions = {
            1: 'Please provide your contact information and delivery details',
            2: 'Review your order details and contact information',
            3: 'Send your order via WhatsApp to complete the purchase'
        };
        return descriptions[step] || '';
    }

    // Check if step is accessible
    isStepAccessible(step) {
        if (step === 1) return true;
        if (step <= this.currentStep) return true;
        return this.stepValidation[step - 1];
    }

    // Get progress percentage
    getProgressPercentage() {
        return (this.currentStep / this.totalSteps) * 100;
    }
}

// Export singleton instance
export const checkoutState = new CheckoutState();