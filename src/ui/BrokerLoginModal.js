/**
 * Broker Login Modal Component
 * Static HTML architecture for maximum performance and reliability
 * Handles authentication for broker users with green glass UI
 * Redirects to broker.html on successful login
 */
(() => {
    // Prevent duplicate initialization
    if (window.brokerModalInitialized) {
        return;
    }
    window.brokerModalInitialized = true;

    // DOM element references
    let modal = null;
    let form = null;
    let userInput = null;
    let passInput = null;
    let submitBtn = null;

    // Configuration constants
    const DEMO_USERNAME = 'BROKER';
    const DEMO_PASSWORD = '123';
    const DASHBOARD_URL = '/broker.html';
    const LOADING_DELAY = 700; // Simulated network delay

    /**
     * Creates and embeds the modal HTML in the DOM
     */
    function createModal() {
        const modalHTML = `
            <div id="brokerLogin" class="bl-modal" hidden>
                <div class="bl-overlay"></div>
                <div class="bl-dialog">
                    <button class="bl-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="bl-head">
                        <div class="bl-mark">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10,17 15,12 10,7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </div>
                        <h2 class="bl-title">Broker Login</h2>
                        <p class="bl-sub">Enter your credentials to access the broker dashboard</p>
                    </div>
                    
                    <form id="bl-form" class="bl-form">
                        <div class="bl-row">
                            <label for="bl-user">Username</label>
                            <input type="text" id="bl-user" name="username" placeholder="Enter your username" required>
                        </div>
                        
                        <div class="bl-row">
                            <label for="bl-pass">Password</label>
                            <input type="password" id="bl-pass" name="password" placeholder="Enter your password" required>
                        </div>
                        
                        <button type="submit" class="bl-btn bl-btn-primary bl-btn-block">
                            <span class="btn-text">Login</span>
                            <span class="btn-loading" hidden>
                                <i class="fas fa-spinner fa-spin"></i>
                                Logging in...
                            </span>
                        </button>
                        
                        <p class="bl-note">Demo Credentials</p>
                        <p class="bl-help">Username: <code>BROKER</code> | Password: <code>123</code></p>
                    </form>
                </div>
            </div>
        `;

        // Insert modal at the end of body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get DOM references
        modal = document.getElementById('brokerLogin');
        form = document.getElementById('bl-form');
        userInput = document.getElementById('bl-user');
        passInput = document.getElementById('bl-pass');
        submitBtn = document.querySelector('.bl-btn');
    }

    /**
     * Opens the broker login modal
     * Sets focus to username field and prevents body scrolling
     */
    function open() {
        if (!modal) {
            console.warn('Modal not initialized');
            return;
        }

        // Remove hidden attribute to show modal
        modal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';

        // Small delay to ensure modal is fully rendered before focusing
        setTimeout(() => {
            if (userInput) userInput.focus();
        }, 40);
    }

    /**
     * Closes the broker login modal
     * Resets form, clears errors, and restores body scrolling
     */
    function close() {
        if (!modal) {
            console.warn('Modal not initialized');
            return;
        }

        // Add hidden attribute to hide modal
        modal.setAttribute('hidden', '');
        if (form) form.reset();
        clearErrors();
        setLoadingState(false);
        document.body.style.overflow = '';
    }

    /**
     * Removes all error styling and messages from the form
     */
    function clearErrors() {
        if (!form) return;

        // Remove error classes from inputs
        const errorInputs = form.querySelectorAll('.bl-error');
        errorInputs.forEach(element => {
            element.classList.remove('bl-error');
        });

        // Remove error text elements
        const errorElements = form.querySelectorAll('.bl-errtext');
        errorElements.forEach(errorElement => {
            errorElement.remove();
        });
    }

    /**
     * Displays an error message for a specific input field
     * @param {HTMLInputElement} input - The input element that has the error
     * @param {string} message - The error message to display
     */
    function showError(input, message) {
        // Add error styling to the input
        input.classList.add('bl-error');

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bl-errtext';
        errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;

        // Insert error message after the input
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    /**
     * Sets the loading state of the submit button
     * @param {boolean} isLoading - Whether the button should show loading state
     */
    function setLoadingState(isLoading) {
        if (!submitBtn) return;

        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.hidden = false;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.hidden = true;
        }
    }

    /**
     * Redirects to the broker dashboard
     */
    function redirectToDashboard() {
        console.log('Redirecting to broker dashboard...');

        // Set authentication state
        const authState = {
            loggedIn: true,
            user: {
                username: DEMO_USERNAME,
                email: 'broker@eastleighturf.com',
                phone: '+254700000000',
                role: 'broker'
            },
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('authState', JSON.stringify(authState));

        // Redirect to dashboard
        window.location.href = DASHBOARD_URL;
    }

    /**
     * Handles form submission and authentication
     * @param {Event} event - The form submission event
     */
    function handleSubmit(event) {
        event.preventDefault();

        if (!form || !userInput || !passInput) {
            console.error('Form elements not found');
            return;
        }

        // Clear previous errors
        clearErrors();

        // Get form data
        const username = userInput.value.trim();
        const password = passInput.value.trim();

        // Validate inputs
        if (!username) {
            showError(userInput, 'Username is required');
            userInput.focus();
            return;
        }

        if (!password) {
            showError(passInput, 'Password is required');
            passInput.focus();
            return;
        }

        // Set loading state
        setLoadingState(true);

        // Simulate authentication API call
        // TODO: Replace with actual authentication API
        setTimeout(() => {
            if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
                // Successful authentication
                redirectToDashboard();
            } else {
                // Authentication failed
                setLoadingState(false);
                if (userInput) {
                    showError(userInput, 'Invalid credentials. Use demo username: BROKER');
                }
                if (passInput) {
                    showError(passInput, 'Invalid credentials. Use demo password: 123');
                }
                if (userInput) userInput.focus();
            }
        }, LOADING_DELAY);
    }

    /**
     * Handles keyboard events for modal interaction
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleKeydown(event) {
        // Close modal on Escape key
        if (event.key === 'Escape' && modal && !modal.hidden) {
            close();
        }
    }

    /**
     * Initializes event listeners and DOM references
     */
    function setupEventListeners() {
        if (!modal || !form || !userInput || !passInput || !submitBtn) {
            console.error('Required modal elements not found');
            return;
        }

        // Setup open button event listener
        const openButton = document.getElementById('dealerLoginBtn');
        if (openButton) {
            openButton.addEventListener('click', (e) => {
                e.preventDefault();
                open();
            });
        }

        // Setup close button event listeners
        const closeButtons = modal.querySelectorAll('.bl-close, .bl-overlay');
        closeButtons.forEach(element => {
            element.addEventListener('click', close);
        });

        // Setup form submission
        form.addEventListener('submit', handleSubmit);

        // Setup keyboard event listener
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Initializes the broker login modal
     */
    function initialize() {
        try {
            // Create and embed modal HTML
            createModal();

            // Setup event listeners
            setupEventListeners();

            console.log('Broker login modal initialized successfully');
        } catch (error) {
            console.error('Failed to initialize broker login modal:', error);
        }
    }

    // Initialize the component when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Expose public API for external control
    window.BrokerLogin = {
        open,
        close
    };
})();