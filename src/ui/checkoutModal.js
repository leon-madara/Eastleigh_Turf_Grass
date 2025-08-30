// Checkout Modal Component
export const checkoutModal = {
    modal: null,
    isInitialized: false,

    init() {
        console.log('Checkout modal initialized');
        this.isInitialized = true;
    },

    async open() {
        await this.createModal();
        this.showModal();
        // Initialize step state
        this.currentStep = 1;
        this.totalSteps = 3;
    },

    close() {
        this.hideModal();
    },

    async createModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('checkoutModal');
        if (existingModal) {
            existingModal.remove();
        }

        try {
            // Load the HTML partial
            const response = await fetch('/src/public/partials/checkout-modal.html');
            if (!response.ok) {
                throw new Error(`Failed to load HTML partial: ${response.status}`);
            }

            const modalHTML = await response.text();
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Initialize the modal
            this.initializeModal();
            this.bindEvents();
            this.updateStepIndicator();
            this.updateOrderSummary();

        } catch (error) {
            console.error('Error loading checkout modal:', error);
            // Fallback to basic modal if partial fails to load
            this.createFallbackModal();
        }
    },

    createFallbackModal() {
        const modalHTML = `
            <div id="checkoutModal" class="checkout-modal active">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">                        
                        <button class="modal-close" id="closeCheckoutModal" aria-label="Close modal">
                            <i class="fas fa-times"></i>
                        <h2>Checkout</h2>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Error loading checkout form. Please try again.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn-secondary" id="closeCheckoutModal">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindEvents();
    },

    initializeModal() {
        // Initialize step state
        this.currentStep = 1;
        this.totalSteps = 3;

        console.log('Modal initialized, currentStep:', this.currentStep);

        // Show first step
        this.showStep(1);

        // Update button states
        this.updateButtonStates();

        // Populate order summary with cart data
        this.populateOrderSummary();

        // Debug: Check if back button exists
        const backBtn = document.getElementById('backBtn');
        console.log('Back button in initializeModal:', backBtn);
        if (backBtn) {
            console.log('Back button styles:', backBtn.style.cssText);
            console.log('Back button computed styles:', window.getComputedStyle(backBtn));
        }
    },

    showModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.add('active');
            modal.removeAttribute('hidden');

            // Initialize floating labels after modal is shown
            setTimeout(() => {
                this.initFloatingLabels();
            }, 100);

            // Focus on the first input
            const nameInput = document.getElementById('customerName');
            if (nameInput) {
                nameInput.focus();
            }
        }
    },

    hideModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.remove();
        }
    },

    bindEvents() {
        // Close button
        const closeBtn = document.getElementById('closeCheckoutModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.previousStep());
        }

        // Next button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }

        // Send button
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendOrder());
        }

        // Step indicator clicks
        const stepButtons = document.querySelectorAll('.md3-stepper .step');
        stepButtons.forEach((step, index) => {
            step.addEventListener('click', () => {
                const stepNumber = index + 1;
                if (stepNumber <= this.currentStep) {
                    this.showStep(stepNumber);
                }
            });
        });

        // Close on overlay click
        const modal = document.getElementById('checkoutModal');
        const backdrop = document.querySelector('.md3-modal__backdrop');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target === backdrop) {
                    this.close();
                }
            });
        }
        if (backdrop) {
            backdrop.addEventListener('click', () => this.close());
        }

        // Form submission
        const form = document.getElementById('customerDetailsForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        }

        // Phone detection button
        const detectPhoneBtn = document.getElementById('detectPhoneBtn');
        if (detectPhoneBtn) {
            detectPhoneBtn.addEventListener('click', () => this.detectPhoneFromContacts());
        }

        // Location detection button
        const detectLocationBtn = document.getElementById('detectLocationBtn');
        if (detectLocationBtn) {
            detectLocationBtn.addEventListener('click', () => this.detectLocationFromGPS());
        }

        // Load saved details if available
        this.loadSavedDetails();

        // Initialize floating labels
        this.initFloatingLabels();
    },

    populateOrderSummary() {
        // Get cart data
        const cartItems = window.CartComponent ? window.CartComponent.getItems() : [];
        const subtotal = window.CartComponent ? window.CartComponent.getTotal() : 0;
        const delivery = 500; // Fixed delivery cost
        const total = subtotal + delivery;

        // Update summary elements
        const summaryName = document.getElementById('summaryName');
        const summaryPhone = document.getElementById('summaryPhone');
        const summaryLocation = document.getElementById('summaryLocation');
        const totalArea = document.getElementById('totalArea');
        const summarySubtotal = document.getElementById('summarySubtotal');
        const summaryDiscount = document.getElementById('summaryDiscount');
        const summaryTotal = document.getElementById('summaryTotal');

        // Update contact summary (will be populated when user fills form)
        if (summaryName) summaryName.textContent = '';
        if (summaryPhone) summaryPhone.textContent = '';
        if (summaryLocation) summaryLocation.textContent = '';

        // Update order summary
        if (totalArea) totalArea.textContent = '0 m²'; // Calculate from cart items
        if (summarySubtotal) summarySubtotal.textContent = `KES ${subtotal.toLocaleString()}`;
        if (summaryDiscount) summaryDiscount.textContent = '-KES 0';
        if (summaryTotal) summaryTotal.textContent = `KES ${total.toLocaleString()}`;

        // Populate order items list
        const orderItemsList = document.getElementById('orderItemsList');
        if (orderItemsList && cartItems.length > 0) {
            orderItemsList.innerHTML = cartItems.map(item => `
                <div class="order-item">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">${item.quantity} units</span>
                    <span class="item-price">KES ${item.price.toLocaleString()}</span>
                </div>
            `).join('');
        }
    },

    updateOrderSummary() {
        // Get cart total from the global cart state
        let subtotal = 0;
        if (window.CartComponent) {
            subtotal = window.CartComponent.getTotal();
        }

        const delivery = 500; // Fixed delivery cost
        const total = subtotal + delivery;

        // Update the summary display
        const subtotalEl = document.getElementById('summarySubtotal');
        const deliveryEl = document.getElementById('summaryDelivery');
        const totalEl = document.getElementById('summaryTotal');

        if (subtotalEl) subtotalEl.textContent = `KES ${subtotal.toLocaleString()}`;
        if (deliveryEl) deliveryEl.textContent = `KES ${delivery.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `KES ${total.toLocaleString()}`;
    },

    sendOrder() {
        // Get customer details from step 1
        const name = document.getElementById('customerName') ? document.getElementById('customerName').value : '';
        const phone = document.getElementById('customerPhone') ? document.getElementById('customerPhone').value : '';
        const location = document.getElementById('customerLocation') ? document.getElementById('customerLocation').value : '';

        // Validate required fields
        if (!name || !phone || !location) {
            this.showError('Please fill in all required fields in step 1');
            this.showStep(1);
            return;
        }

        // Generate WhatsApp message
        const message = this.generateWhatsAppMessage(name, phone, location);

        // Open WhatsApp with the message
        const whatsappUrl = `https://wa.me/254743375997?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Show success message
        this.showSuccess('Order sent to WhatsApp! Please complete your order there.');

        // Close modal after delay
        setTimeout(() => {
            this.close();
        }, 3000);
    },

    generateWhatsAppMessage(name, phone, location) {
        const cartItems = window.CartComponent ? window.CartComponent.getItems() : [];
        const total = window.CartComponent ? window.CartComponent.getTotal() : 0;

        let message = `🏠 *TURF GRASS ORDER*\n\n`;
        message += `*Customer Details:*\n`;
        message += `Name: ${name}\n`;
        message += `Phone: +254${phone}\n`;
        message += `Location: ${location}\n\n`;

        message += `*Order Items:*\n`;
        cartItems.forEach(item => {
            message += `• ${item.name} - ${item.quantity} units - KES ${item.price.toLocaleString()}\n`;
        });

        message += `\n*Total: KES ${total.toLocaleString()}*\n\n`;
        message += `Please confirm this order and provide delivery details.`;

        return message;
    },

    placeOrder() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;

        const orderData = {
            name: document.getElementById('checkoutName') ? document.getElementById('checkoutName').value : '',
            email: document.getElementById('checkoutEmail') ? document.getElementById('checkoutEmail').value : '',
            phone: document.getElementById('checkoutPhone') ? document.getElementById('checkoutPhone').value : '',
            location: document.getElementById('checkoutLocation') ? document.getElementById('checkoutLocation').value : '',
            address: document.getElementById('checkoutAddress') ? document.getElementById('checkoutAddress').value : '',
            city: document.getElementById('checkoutCity') ? document.getElementById('checkoutCity').value : '',
            saveDetails: document.getElementById('saveDetails') ? document.getElementById('saveDetails').checked : false,
            allowPhoneContact: document.getElementById('allowPhoneContact') ? document.getElementById('allowPhoneContact').checked : false,
            items: window.CartComponent ? window.CartComponent.getItems() : [],
            total: window.CartComponent ? window.CartComponent.getTotal() : 0
        };

        // Validate required fields
        if (!orderData.name || !orderData.email || !orderData.phone || !orderData.location || !orderData.address || !orderData.city) {
            this.showError('Please fill in all required fields');
            return;
        }

        // Save details if checkbox is checked
        if (orderData.saveDetails) {
            this.saveDetails();
        }

        // Here you would typically send the order to your backend
        // For now, we'll just show a success message
        const contactMethod = orderData.allowPhoneContact ? 'phone call' : 'email';
        this.showSuccess(`Order placed successfully! We will contact you via ${contactMethod} soon.`);

        // Clear cart
        if (window.CartComponent) {
            window.CartComponent.clear();
        }

        // Close the modal after a short delay
        setTimeout(() => {
            this.close();
        }, 2000);
    },

    showError(message) {
        // You can implement a toast notification here
        console.error('Checkout Error:', message);
        alert(message);
    },

    showSuccess(message) {
        // You can implement a toast notification here
        console.log('Checkout Success:', message);
        alert(message);
    },

    async detectPhoneFromContacts() {
        const detectBtn = document.getElementById('detectPhoneBtn');
        const phoneInput = document.getElementById('customerPhone');

        if (!detectBtn || !phoneInput) return;

        // Set loading state
        detectBtn.classList.add('loading');
        detectBtn.innerHTML = '<i class="fas fa-spinner"></i><span>Detecting...</span>';
        detectBtn.disabled = true;

        try {
            // Check if the Contacts API is available
            if ('contacts' in navigator && 'select' in navigator.contacts) {
                const contacts = await navigator.contacts.select(['name', 'tel'], {
                    multiple: false
                });

                if (contacts && contacts.length > 0) {
                    const contact = contacts[0];
                    const phoneNumber = contact.tel && contact.tel.length > 0 ? contact.tel[0] : null;

                    if (phoneNumber) {
                        // Extract just the number part (remove country code if it's +254)
                        let cleanNumber = phoneNumber.replace(/\D/g, '');
                        if (cleanNumber.startsWith('254')) {
                            cleanNumber = cleanNumber.substring(3);
                        }

                        phoneInput.value = cleanNumber;

                        // Set success state
                        detectBtn.classList.remove('loading');
                        detectBtn.classList.add('success');
                        detectBtn.innerHTML = '<i class="fas fa-check"></i><span>Detected</span>';

                        setTimeout(() => {
                            detectBtn.classList.remove('success');
                            detectBtn.innerHTML = '<i class="fas fa-address-book"></i><span>Detect from Contacts</span>';
                            detectBtn.disabled = false;
                        }, 2000);

                        this.showSuccess('Phone number detected from contacts!');
                    } else {
                        throw new Error('No phone number found in selected contact');
                    }
                } else {
                    throw new Error('No contact selected');
                }
            } else {
                // Fallback: Show a prompt to manually enter or copy from contacts
                const manualNumber = prompt('Please enter your phone number or copy it from your contacts:');
                if (manualNumber) {
                    phoneInput.value = manualNumber.replace(/\D/g, '');
                    detectBtn.classList.remove('loading');
                    detectBtn.classList.add('success');
                    detectBtn.innerHTML = '<i class="fas fa-check"></i><span>Entered</span>';

                    setTimeout(() => {
                        detectBtn.classList.remove('success');
                        detectBtn.innerHTML = '<i class="fas fa-address-book"></i><span>Detect from Contacts</span>';
                        detectBtn.disabled = false;
                    }, 2000);
                } else {
                    throw new Error('No phone number entered');
                }
            }
        } catch (error) {
            console.error('Error detecting phone:', error);

            // Set error state
            detectBtn.classList.remove('loading');
            detectBtn.classList.add('error');
            detectBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Failed</span>';

            setTimeout(() => {
                detectBtn.classList.remove('error');
                detectBtn.innerHTML = '<i class="fas fa-address-book"></i><span>Detect from Contacts</span>';
                detectBtn.disabled = false;
            }, 2000);

            this.showError('Could not detect phone number. Please enter it manually.');
        }
    },

    async detectLocationFromGPS() {
        const detectBtn = document.getElementById('detectLocationBtn');
        const locationInput = document.getElementById('customerLocation');

        if (!detectBtn || !locationInput) return;

        // Set loading state
        detectBtn.classList.add('loading');
        detectBtn.innerHTML = '<i class="fas fa-spinner"></i><span>Detecting...</span>';
        detectBtn.disabled = true;

        try {
            // Check if geolocation is available
            if ('geolocation' in navigator) {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 60000
                    });
                });

                const {
                    latitude,
                    longitude
                } = position.coords;

                // Use reverse geocoding to get address
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await response.json();

                    if (data.display_name) {
                        locationInput.value = data.display_name;

                        // Set success state
                        detectBtn.classList.remove('loading');
                        detectBtn.classList.add('success');
                        detectBtn.innerHTML = '<i class="fas fa-check"></i><span>Detected</span>';

                        setTimeout(() => {
                            detectBtn.classList.remove('success');
                            detectBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>Use GPS</span>';
                            detectBtn.disabled = false;
                        }, 2000);

                        this.showSuccess('Location detected from GPS!');
                    } else {
                        // Fallback: Use coordinates
                        locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                        detectBtn.classList.remove('loading');
                        detectBtn.classList.add('success');
                        detectBtn.innerHTML = '<i class="fas fa-check"></i><span>Detected</span>';

                        setTimeout(() => {
                            detectBtn.classList.remove('success');
                            detectBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>Use GPS</span>';
                            detectBtn.disabled = false;
                        }, 2000);
                    }
                } catch (geocodingError) {
                    // Fallback: Use coordinates if geocoding fails
                    locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    detectBtn.classList.remove('loading');
                    detectBtn.classList.add('success');
                    detectBtn.innerHTML = '<i class="fas fa-check"></i><span>Detected</span>';

                    setTimeout(() => {
                        detectBtn.classList.remove('success');
                        detectBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>Use GPS</span>';
                        detectBtn.disabled = false;
                    }, 2000);
                }
            } else {
                throw new Error('Geolocation not supported');
            }
        } catch (error) {
            console.error('Error detecting location:', error);

            // Set error state
            detectBtn.classList.remove('loading');
            detectBtn.classList.add('error');
            detectBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Failed</span>';

            setTimeout(() => {
                detectBtn.classList.remove('error');
                detectBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i><span>Use GPS</span>';
                detectBtn.disabled = false;
            }, 2000);

            this.showError('Could not detect location. Please enter it manually.');
        }
    },

    loadSavedDetails() {
        try {
            const savedDetails = localStorage.getItem('checkoutDetails');
            if (savedDetails) {
                const details = JSON.parse(savedDetails);

                if (details.name) {
                    const nameInput = document.getElementById('customerName');
                    if (nameInput) nameInput.value = details.name;
                }
                if (details.phone) {
                    const phoneInput = document.getElementById('customerPhone');
                    if (phoneInput) phoneInput.value = details.phone;
                }
                if (details.email) {
                    const emailInput = document.getElementById('customerEmail');
                    if (emailInput) emailInput.value = details.email;
                }
                if (details.location) {
                    const locationInput = document.getElementById('customerLocation');
                    if (locationInput) locationInput.value = details.location;
                }

                // Check the remember details checkbox if we loaded saved data
                const rememberDetailsCheckbox = document.getElementById('rememberDetails');
                if (rememberDetailsCheckbox) {
                    rememberDetailsCheckbox.checked = true;
                }

                // Update floating labels for loaded values
                setTimeout(() => {
                    this.initFloatingLabels();
                }, 50);
            }
        } catch (error) {
            console.error('Error loading saved details:', error);
        }
    },

    saveDetails() {
        const rememberDetailsCheckbox = document.getElementById('rememberDetails');
        if (rememberDetailsCheckbox && rememberDetailsCheckbox.checked) {
            try {
                const details = {
                    name: document.getElementById('customerName') ? document.getElementById('customerName').value : '',
                    phone: document.getElementById('customerPhone') ? document.getElementById('customerPhone').value : '',
                    email: document.getElementById('customerEmail') ? document.getElementById('customerEmail').value : '',
                    location: document.getElementById('customerLocation') ? document.getElementById('customerLocation').value : ''
                };

                localStorage.setItem('checkoutDetails', JSON.stringify(details));
                console.log('Details saved to localStorage');
            } catch (error) {
                console.error('Error saving details:', error);
            }
        }
    },

    // Step navigation methods
    showStep(stepNumber) {
        console.log('showStep called with stepNumber:', stepNumber);

        // Hide all steps
        const steps = document.querySelectorAll('.checkout-step');
        steps.forEach(step => step.classList.remove('active'));

        // Show current step
        const currentStep = document.getElementById(`step${stepNumber}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }

        this.currentStep = stepNumber;
        console.log('Current step updated to:', this.currentStep);

        this.updateStepIndicator();
        this.updateButtonStates();

        // Populate summary data when moving to step 2
        if (stepNumber === 2) {
            this.populateSummaryData();
        }

        // Populate message preview when moving to step 3
        if (stepNumber === 3) {
            this.populateMessagePreview();
        }
    },

    populateSummaryData() {
        // Get form data
        const name = document.getElementById('customerName') ? document.getElementById('customerName').value : '';
        const phone = document.getElementById('customerPhone') ? document.getElementById('customerPhone').value : '';
        const location = document.getElementById('customerLocation') ? document.getElementById('customerLocation').value : '';

        // Update summary elements
        const summaryName = document.getElementById('summaryName');
        const summaryPhone = document.getElementById('summaryPhone');
        const summaryLocation = document.getElementById('summaryLocation');

        if (summaryName) summaryName.textContent = name || 'Not provided';
        if (summaryPhone) summaryPhone.textContent = phone ? `+254${phone}` : 'Not provided';
        if (summaryLocation) summaryLocation.textContent = location || 'Not provided';
    },

    populateMessagePreview() {
        // Get customer details
        const name = document.getElementById('customerName') ? document.getElementById('customerName').value : '';
        const phone = document.getElementById('customerPhone') ? document.getElementById('customerPhone').value : '';
        const location = document.getElementById('customerLocation') ? document.getElementById('customerLocation').value : '';

        // Generate message
        const message = this.generateWhatsAppMessage(name, phone, location);

        // Update message preview
        const messagePreview = document.getElementById('messagePreview');
        if (messagePreview) {
            messagePreview.textContent = message;
        }
    },

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        }
    },

    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    },

    updateStepIndicator() {
        const steps = document.querySelectorAll('.md3-stepper .step');
        const rails = document.querySelectorAll('.md3-stepper .rail');

        console.log('Updating step indicator. Current step:', this.currentStep);
        console.log('Found steps:', steps.length, 'Found rails:', rails.length);

        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('is-active', 'completed');

            if (stepNumber === this.currentStep) {
                step.classList.add('is-active');
                console.log(`Step ${stepNumber} is now active`);
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                console.log(`Step ${stepNumber} is now completed`);
            }
        });

        // Update rail filling
        rails.forEach((rail, index) => {
            rail.classList.remove('completed', 'active');
            console.log(`Rail ${index + 1} classes removed`);

            if (index < this.currentStep - 1) {
                // Rail is fully completed
                rail.classList.add('completed');
                console.log(`Rail ${index + 1} is now completed`);
            } else if (index === this.currentStep - 1) {
                // Rail is partially filled (current step)
                rail.classList.add('active');
                console.log(`Rail ${index + 1} is now active (50% filled)`);
            }
        });
    },

    updateButtonStates() {
        const backBtn = document.getElementById('backBtn');
        const nextBtn = document.getElementById('nextBtn');
        const sendBtn = document.getElementById('sendBtn');

        // Debug logging
        console.log('updateButtonStates called, currentStep:', this.currentStep);
        console.log('backBtn found:', !!backBtn);

        // Show/hide back button (now in header)
        if (backBtn) {
            // Always show back button - it can close the modal
            backBtn.style.display = 'grid';
            console.log('Back button should be visible');
        } else {
            console.log('Back button not found in DOM');
        }

        // Update next button text
        if (nextBtn) {
            if (this.currentStep === 1) {
                nextBtn.innerHTML = 'Review Order <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
            } else if (this.currentStep === 2) {
                nextBtn.innerHTML = 'Send Order <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
            }
        }

        // Show/hide send button
        if (sendBtn) {
            if (this.currentStep === 3) {
                sendBtn.style.display = 'inline-flex';
                if (nextBtn) nextBtn.style.display = 'none';
            } else {
                sendBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'inline-flex';
            }
        }
    },

    initFloatingLabels() {
        // Get all Material Design 3 input fields
        const inputs = document.querySelectorAll('.md3-field input');

        console.log('Initializing floating labels for', inputs.length, 'inputs');

        inputs.forEach((input, index) => {
            // Ensure placeholder is set to a single space for proper floating label behavior
            if (!input.placeholder || input.placeholder === '') {
                input.placeholder = ' ';
            }

            // Remove existing event listeners to prevent duplicates
            input.removeEventListener('input', this.updateFloatingLabel.bind(this, input));
            input.removeEventListener('focus', this.updateFloatingLabel.bind(this, input));
            input.removeEventListener('blur', this.updateFloatingLabel.bind(this, input));

            // Add event listeners for proper floating label behavior
            input.addEventListener('input', () => {
                this.updateFloatingLabel(input);
            });

            input.addEventListener('focus', () => {
                this.updateFloatingLabel(input);
            });

            input.addEventListener('blur', () => {
                this.updateFloatingLabel(input);
            });

            // Initialize floating label state
            this.updateFloatingLabel(input);

            console.log(`Input ${index + 1}:`, input.id || input.name, 'initialized');
        });
    },

    updateFloatingLabel(input) {
        const label = input.parentElement.querySelector('.md3-label');
        if (!label) {
            console.warn('No label found for input:', input.id || input.name);
            return;
        }

        const hasValue = input.value.trim().length > 0;
        const isFocused = document.activeElement === input;

        // Update input classes
        if (hasValue) {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }

        // Update label classes
        if (hasValue || isFocused) {
            label.classList.add('floating');
        } else {
            label.classList.remove('floating');
        }

        // Hide placeholder when input has value or is focused
        if (hasValue || isFocused) {
            input.style.setProperty('--placeholder-opacity', '0');
        } else {
            input.style.removeProperty('--placeholder-opacity');
        }

        console.log(`Updated floating label for ${input.id || input.name}:`, {
            hasValue,
            isFocused,
            hasValueClass: input.classList.contains('has-value'),
            hasFloatingClass: label.classList.contains('floating')
        });
    }
};