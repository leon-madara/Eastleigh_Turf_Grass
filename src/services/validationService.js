// Validation Service
class ValidationService {
    constructor() {
        this.phoneRegex = /^(\+254|0)?[17]\d{8}$/;
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    }

    // Validate phone number (Kenyan format)
    validatePhone(phone) {
        if (!phone) {
            return {
                valid: false,
                message: 'Phone number is required'
            };
        }

        const cleanPhone = phone.replace(/\s+/g, '');

        if (!this.phoneRegex.test(cleanPhone)) {
            return {
                valid: false,
                message: 'Please enter a valid Kenyan phone number'
            };
        }

        return {
            valid: true,
            formatted: this.formatPhone(cleanPhone)
        };
    }

    // Format phone number for display
    formatPhone(phone) {
        let clean = phone.replace(/\D/g, '');

        // Remove leading 0 and add +254
        if (clean.startsWith('0')) {
            clean = '254' + clean.substring(1);
        }

        // Add + if not present
        if (!clean.startsWith('+')) {
            clean = '+' + clean;
        }

        return clean;
    }

    // Detect phone number using various methods
    async detectPhone() {
        try {
            // Method 1: Contact Picker API (most reliable)
            if ('contacts' in navigator && 'select' in navigator.contacts) {
                return await this.detectPhoneFromContacts();
            }

            // Method 2: SIM Card detection (limited support)
            if ('connection' in navigator) {
                return await this.detectPhoneFromSIM();
            }

            // Method 3: Browser-specific APIs
            return await this.detectPhoneFromBrowser();

        } catch (error) {
            console.warn('Phone detection failed:', error);
            return {
                success: false,
                error: 'Phone detection not available. Please enter manually.',
                type: 'not_supported'
            };
        }
    }

    // Detect phone from device contacts
    async detectPhoneFromContacts() {
        try {
            const contacts = await navigator.contacts.select(['tel'], {
                multiple: false
            });

            if (contacts && contacts.length > 0) {
                const phone = contacts[0].tel[0];
                const formatted = this.formatPhone(phone);

                return {
                    success: true,
                    phone: formatted,
                    method: 'contacts',
                    message: 'Phone number detected from contacts'
                };
            }

            return {
                success: false,
                error: 'No phone number selected from contacts',
                type: 'no_selection'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Contact access denied or not available',
                type: 'permission_denied'
            };
        }
    }

    // Detect phone from SIM card (limited support)
    async detectPhoneFromSIM() {
        try {
            // This is experimental and may not work in all browsers
            if ('connection' in navigator && navigator.connection.effectiveType) {
                // Some mobile browsers expose phone number through connection API
                // This is very limited and not standardized
                return {
                    success: false,
                    error: 'SIM detection not available in this browser',
                    type: 'not_supported'
                };
            }

            return {
                success: false,
                error: 'SIM detection not supported',
                type: 'not_supported'
            };
        } catch (error) {
            return {
                success: false,
                error: 'SIM detection failed',
                type: 'error'
            };
        }
    }

    // Detect phone from browser-specific APIs
    async detectPhoneFromBrowser() {
        try {
            // Try various browser-specific methods
            if (navigator.userAgent.includes('Android')) {
                // Android-specific detection (if available)
                return {
                    success: false,
                    error: 'Please use the contact picker or enter manually',
                    type: 'android_fallback'
                };
            }

            if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
                // iOS-specific detection (if available)
                return {
                    success: false,
                    error: 'Please use the contact picker or enter manually',
                    type: 'ios_fallback'
                };
            }

            return {
                success: false,
                error: 'Phone detection not available in this browser',
                type: 'browser_not_supported'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Browser detection failed',
                type: 'error'
            };
        }
    }

    // Check if phone detection is supported
    isPhoneDetectionSupported() {
        return (
            ('contacts' in navigator && 'select' in navigator.contacts) ||
            ('connection' in navigator) ||
            navigator.userAgent.includes('Android') ||
            navigator.userAgent.includes('iPhone')
        );
    }

    // Validate name
    validateName(name) {
        if (!name) {
            return {
                valid: false,
                message: 'Name is required'
            };
        }

        const trimmed = name.trim();

        if (trimmed.length < 2) {
            return {
                valid: false,
                message: 'Name must be at least 2 characters'
            };
        }

        if (trimmed.length > 50) {
            return {
                valid: false,
                message: 'Name must be less than 50 characters'
            };
        }

        // Check for valid characters (letters, spaces, hyphens, apostrophes)
        if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
            return {
                valid: false,
                message: 'Name contains invalid characters'
            };
        }

        return {
            valid: true,
            formatted: this.formatName(trimmed)
        };
    }

    // Format name (capitalize first letter of each word)
    formatName(name) {
        return name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }

    // Validate location
    validateLocation(location) {
        if (!location) {
            return {
                valid: false,
                message: 'Location is required'
            };
        }

        const trimmed = location.trim();

        if (trimmed.length < 3) {
            return {
                valid: false,
                message: 'Location must be at least 3 characters'
            };
        }

        if (trimmed.length > 100) {
            return {
                valid: false,
                message: 'Location must be less than 100 characters'
            };
        }

        return {
            valid: true,
            formatted: this.formatLocation(trimmed)
        };
    }

    // Format location (capitalize first letter)
    formatLocation(location) {
        return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
    }

    // Validate email
    validateEmail(email) {
        if (!email) {
            return {
                valid: false,
                message: 'Email is required'
            };
        }

        if (!this.emailRegex.test(email)) {
            return {
                valid: false,
                message: 'Please enter a valid email address'
            };
        }

        return {
            valid: true,
            formatted: email.toLowerCase()
        };
    }

    // Real-time validation with debouncing
    createDebouncedValidator(validator, delay = 300) {
        let timeout;

        return (value) => {
            clearTimeout(timeout);

            return new Promise((resolve) => {
                timeout = setTimeout(() => {
                    const result = validator(value);
                    resolve(result);
                }, delay);
            });
        };
    }

    // Show validation error
    showError(input, message) {
        const formGroup = input.closest('.form-group');
        const existingError = formGroup.querySelector('.error-message');

        if (existingError) {
            existingError.remove();
        }

        input.classList.add('error');

        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        formGroup.appendChild(errorElement);
    }

    // Clear validation error
    clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('error');
    }

    // Validate entire form
    validateForm(formData) {
        const errors = {};

        // Validate name
        const nameValidation = this.validateName(formData.name);
        if (!nameValidation.valid) {
            errors.name = nameValidation.message;
        }

        // Validate phone
        const phoneValidation = this.validatePhone(formData.phone);
        if (!phoneValidation.valid) {
            errors.phone = phoneValidation.message;
        }

        // Validate location
        const locationValidation = this.validateLocation(formData.location);
        if (!locationValidation.valid) {
            errors.location = locationValidation.message;
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors,
            formattedData: {
                name: nameValidation.formatted || formData.name,
                phone: phoneValidation.formatted || formData.phone,
                location: locationValidation.formatted || formData.location
            }
        };
    }

    // Auto-format input as user types
    setupAutoFormat(input, formatter) {
        input.addEventListener('input', (e) => {
            const formatted = formatter(e.target.value);
            if (formatted !== e.target.value) {
                e.target.value = formatted;
            }
        });
    }

    // Setup phone number formatting
    setupPhoneFormatting(input) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            // Limit to 9 digits (Kenyan mobile)
            if (value.length > 9) {
                value = value.substring(0, 9);
            }

            // Format as user types
            if (value.length > 0) {
                if (value.startsWith('0')) {
                    value = value.substring(1);
                }

                // Add spaces for readability
                if (value.length >= 3) {
                    value = value.substring(0, 3) + ' ' + value.substring(3);
                }
                if (value.length >= 7) {
                    value = value.substring(0, 7) + ' ' + value.substring(7);
                }
            }

            e.target.value = value;
        });
    }
}

// Export singleton instance
export const validationService = new ValidationService();