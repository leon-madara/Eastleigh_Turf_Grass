/**
 * Number Formatter Utility for Broker Dashboard
 * Provides consistent number formatting with commas across all inputs
 */

class NumberFormatter {
    constructor() {
        this.isFormatting = false;
    }

    /**
     * Initialize number formatting for an input field
     * @param {HTMLInputElement} input - The input element to format
     * @param {Object} options - Configuration options
     */
    initInputFormatting(input, options = {}) {
        if (!input) {
            console.warn('NumberFormatter: No input element provided');
            return;
        }

        console.log('NumberFormatter: Initializing formatting for input:', input.id || input.name);

        const config = {
            allowDecimals: true,
            decimalPlaces: 2,
            currency: 'KES',
            ...options
        };

        // Store config on input element
        input._numberFormatterConfig = config;

        // Add event listeners
        input.addEventListener('input', (event) => {
            this.handleInputFormatting(event);
        });

        input.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });

        input.addEventListener('blur', (event) => {
            this.handleInputBlur(event);
        });

        // Add inputmode for better mobile experience
        input.setAttribute('inputmode', 'decimal');

        console.log('NumberFormatter: Formatting initialized successfully for:', input.id || input.name);
    }

    /**
     * Handle input formatting while typing
     * @param {Event} event - The input event
     */
    handleInputFormatting(event) {
        if (this.isFormatting) return;

        const input = event.target;
        const config = input._numberFormatterConfig || {};
        const cursorPosition = input.selectionStart || 0;
        const oldValue = input.value;

        console.log('NumberFormatter: Input event triggered for:', input.id || input.name, 'Value:', oldValue);

        // Count digits before cursor position
        const digitsBeforeCursor = this.countDigitsBeforePosition(oldValue, cursorPosition);

        // Clean the value (remove non-numeric except decimal)
        let cleanValue = oldValue.replace(/[^\d.]/g, '');

        // Handle decimal points
        if (config.allowDecimals) {
            const decimalIndex = cleanValue.indexOf('.');
            if (decimalIndex !== -1) {
                cleanValue = cleanValue.substring(0, decimalIndex + 1) +
                    cleanValue.substring(decimalIndex + 1).replace(/\./g, '');
            }
        } else {
            cleanValue = cleanValue.replace(/\./g, '');
        }

        // Format with commas
        const formattedValue = this.formatNumberWithCommas(cleanValue, config);

        // Update input value
        this.isFormatting = true;
        input.value = formattedValue;
        this.isFormatting = false;

        // Calculate new cursor position
        const newCursorPosition = this.getPositionAfterDigits(formattedValue, digitsBeforeCursor);

        // Set cursor position
        setTimeout(() => {
            input.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    }

    /**
     * Handle keydown events
     * @param {KeyboardEvent} event - The keyboard event
     */
    handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.target.blur();
        }
    }

    /**
     * Handle input blur for final formatting
     * @param {Event} event - The blur event
     */
    handleInputBlur(event) {
        const input = event.target;
        const config = input._numberFormatterConfig || {};

        if (config.allowDecimals) {
            this.ensureProperDecimalFormatting(input, config);
        }

        // Trigger a custom event for external listeners (like credit balance updates)
        const blurEvent = new CustomEvent('numberFormatted', {
            detail: {
                input: input,
                value: input.value,
                numericValue: this.parseFormattedNumber(input.value)
            }
        });
        input.dispatchEvent(blurEvent);
    }

    /**
     * Count digits before a position in a string
     * @param {string} value - The string to analyze
     * @param {number} position - The position to count digits before
     * @returns {number} Number of digits before the position
     */
    countDigitsBeforePosition(value, position) {
        let digitCount = 0;
        for (let i = 0; i < Math.min(position, value.length); i++) {
            if (/\d/.test(value[i])) {
                digitCount++;
            }
        }
        return digitCount;
    }

    /**
     * Get cursor position after specific number of digits
     * @param {string} formattedValue - The formatted string
     * @param {number} digitCount - Number of digits after which to place cursor
     * @returns {number} The cursor position
     */
    getPositionAfterDigits(formattedValue, digitCount) {
        let digitsFound = 0;
        let position = 0;

        for (let i = 0; i < formattedValue.length; i++) {
            if (/\d/.test(formattedValue[i])) {
                digitsFound++;
                if (digitsFound === digitCount) {
                    position = i + 1;
                    break;
                }
            }
            if (digitsFound < digitCount) {
                position = i + 1;
            }
        }

        return Math.min(position, formattedValue.length);
    }

    /**
     * Format number with commas
     * @param {string} value - The number string to format
     * @param {Object} config - Configuration options
     * @returns {string} Formatted number with commas
     */
    formatNumberWithCommas(value, config = {}) {
        if (!value) return '';

        const {
            allowDecimals = true, decimalPlaces = 2
        } = config;

        if (allowDecimals) {
            // Split by decimal point
            const parts = value.split('.');

            // Add commas to integer part
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            // Handle decimal part
            if (parts.length > 1) {
                parts[1] = parts[1].substring(0, decimalPlaces);
            }

            return parts.join('.');
        } else {
            // Integer only
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }

    /**
     * Ensure proper decimal formatting on blur
     * @param {HTMLInputElement} input - The input element
     * @param {Object} config - Configuration options
     */
    ensureProperDecimalFormatting(input, config = {}) {
        const value = input.value;
        const numericValue = this.parseFormattedNumber(value);

        if (numericValue > 0) {
            const formattedValue = this.formatCurrency(numericValue, config);
            input.value = formattedValue;
        }
    }

    /**
     * Parse formatted number string to float
     * @param {string} value - The formatted number string
     * @returns {number} The parsed number
     */
    parseFormattedNumber(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/,/g, '')) || 0;
    }

    /**
     * Format number as currency
     * @param {number} value - The number to format
     * @param {Object} config - Configuration options
     * @returns {string} Formatted currency string
     */
    formatCurrency(value, config = {}) {
        const {
            decimalPlaces = 2
        } = config;

        return value.toLocaleString('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        });
    }

    /**
     * Format display value with currency prefix
     * @param {number} value - The number to format
     * @param {Object} config - Configuration options
     * @returns {string} Formatted currency string with prefix
     */
    formatCurrencyDisplay(value, config = {}) {
        const {
            currency = 'KES'
        } = config;
        const formatted = this.formatCurrency(value, config);
        return `${currency} ${formatted}`;
    }
}

// Create global instance
window.numberFormatter = new NumberFormatter();

// Add error handling for when formatter is not available
window.initNumberFormatting = function(input, options = {}) {
    if (window.numberFormatter) {
        window.numberFormatter.initInputFormatting(input, options);
    } else {
        console.warn('Number formatter not available');
    }
};

// Export for module use
export default window.numberFormatter;