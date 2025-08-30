/**
 * Broker Dashboard Payment Summary Logic
 * Handles order total calculations and input formatting with improved user experience
 */

/**
 * Payment Summary Handler Class
 * Manages all payment calculation and input formatting functionality
 */
class PaymentSummaryHandler {
    constructor() {
        // Store references to DOM elements
        this.elements = {
            orderTotalSpan: document.getElementById('orderTotal'),
            amountToPayInput: document.getElementById('amount-to-pay-input'),
            creditBalanceSpan: document.getElementById('credit-balance')
        };



        // Initialize the handler
        this.initialize();
    }

    /**
     * Initialize event listeners and setup
     */
    initialize() {
        console.log('PaymentSummaryHandler: Initializing...');

        if (!this.areElementsValid()) {
            console.warn('Payment summary elements not found');
            return;
        }

        console.log('PaymentSummaryHandler: Elements found, setting up event listeners...');
        this.setupEventListeners();
        this.updateCreditBalance(); // Initial calculation
        console.log('PaymentSummaryHandler: Initialization complete');
    }

    /**
     * Validate that all required elements exist
     * @returns {boolean} True if all elements are present
     */
    areElementsValid() {
        const {
            orderTotalSpan,
            amountToPayInput,
            creditBalanceSpan
        } = this.elements;
        return !!(orderTotalSpan && amountToPayInput && creditBalanceSpan);
    }

    /**
     * Setup all event listeners for the payment input
     */
    setupEventListeners() {
        const {
            amountToPayInput
        } = this.elements;

        if (!amountToPayInput) return;

        // Initialize number formatting with proper event handling
        this.initializeNumberFormatting();

        // Add event listener for credit balance update when number formatting is complete
        amountToPayInput.addEventListener('numberFormatted', () => {
            this.updateCreditBalance();
        });

        // Also add blur event listener as fallback
        amountToPayInput.addEventListener('blur', () => {
            this.updateCreditBalance();
        });

        // Add keydown event listener for Enter key
        amountToPayInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                amountToPayInput.blur();
            }
        });
    }

    /**
     * Initialize number formatting for the payment input
     */
    initializeNumberFormatting() {
        const {
            amountToPayInput
        } = this.elements;

        console.log('PaymentSummaryHandler: Initializing number formatting...');
        console.log('PaymentSummaryHandler: numberFormatter available?', !!window.numberFormatter);

        if (window.numberFormatter) {
            console.log('PaymentSummaryHandler: Using number formatter');
            window.numberFormatter.initInputFormatting(amountToPayInput, {
                allowDecimals: true,
                decimalPlaces: 2,
                currency: 'KES'
            });
        } else {
            console.log('PaymentSummaryHandler: Waiting for number formatter...');
            // Fallback: wait for formatter to be available
            const checkFormatter = setInterval(() => {
                if (window.numberFormatter) {
                    console.log('PaymentSummaryHandler: Number formatter now available, initializing...');
                    window.numberFormatter.initInputFormatting(amountToPayInput, {
                        allowDecimals: true,
                        decimalPlaces: 2,
                        currency: 'KES'
                    });
                    clearInterval(checkFormatter);
                }
            }, 100);
        }
    }







    /**
     * Update the credit balance based on order total and amount to pay
     */
    updateCreditBalance() {
        const {
            orderTotalSpan,
            amountToPayInput,
            creditBalanceSpan
        } = this.elements;

        if (!orderTotalSpan || !amountToPayInput || !creditBalanceSpan) {
            console.warn('Cannot update credit balance: missing elements');
            return;
        }

        // Get order total (remove commas, parse as float)
        const orderTotal = window.numberFormatter ? window.numberFormatter.parseFormattedNumber(orderTotalSpan.textContent || '') : 0;

        // Get input value (remove commas, parse as float)
        const amountToPay = window.numberFormatter ? window.numberFormatter.parseFormattedNumber(amountToPayInput.value) : 0;

        // Calculate credit (cannot be negative)
        const credit = Math.max(0, orderTotal - amountToPay);

        // Update credit balance display
        creditBalanceSpan.textContent = window.numberFormatter ? window.numberFormatter.formatCurrency(credit) : credit.toFixed(2);
    }
}

/**
 * Initialize the Payment Summary Handler when DOM is fully loaded
 * This ensures all elements are available before trying to access them
 */
function initializePaymentSummary() {
    // Create new instance of the payment handler
    window.paymentSummaryHandler = new PaymentSummaryHandler();
}

// Multiple ways to ensure DOM is loaded before initialization
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', initializePaymentSummary);
} else {
    // DOM is already loaded, initialize immediately
    initializePaymentSummary();
}