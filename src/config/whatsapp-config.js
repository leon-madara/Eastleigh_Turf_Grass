// WhatsApp Configuration
// Update these settings to customize your WhatsApp integration

window.WhatsAppConfig = {
    // Your WhatsApp number (with country code, no + symbol)
    // Example: '254743375997' for Kenya
    PHONE_NUMBER: '254743375997',

    // Company name for message templates
    COMPANY_NAME: 'Eastleigh Turf Grass',

    // Default broker information (can be made dynamic later)
    DEFAULT_BROKER: {
        name: 'Broker User',
        email: 'broker@eastleighturf.com'
    },

    // Default customer information (can be made dynamic later)
    DEFAULT_CUSTOMER: {
        name: 'Customer',
        email: 'customer@example.com'
    },

    // Message customization
    MESSAGES: {
        SUCCESS: 'Form submitted successfully! WhatsApp will open with your message.',
        ERROR: 'Failed to send message. Please try again.',
        LOADING: 'Sending...',
        VALIDATION: {
            REQUIRED_FIELDS: 'Please fill in all required fields',
            INVALID_EMAIL: 'Please enter a valid email address',
            EMPTY_CART: 'Please add items to your cart before checkout'
        }
    },

    // Currency settings
    CURRENCY: {
        CODE: 'KES',
        SYMBOL: 'KES',
        LOCALE: 'en-KE'
    }
};