// Admin authentication functionality
// Admin Authentication Module
class AdminAuth {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.init();
    }

    init() {
        this.checkSession();
        this.bindAuthEvents();
    }

    bindAuthEvents() {
        // Bind login form events
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin(e.target);
            }
        });

        // Bind logout events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
                e.preventDefault();
                this.logout();
            }
        });
    }

    checkSession() {
        const token = localStorage.getItem('adminToken');
        const userData = localStorage.getItem('adminUser');
        const lastActivity = localStorage.getItem('adminLastActivity');

        if (token && userData && lastActivity) {
            const now = Date.now();
            const timeSinceLastActivity = now - parseInt(lastActivity);

            if (timeSinceLastActivity < this.sessionTimeout) {
                // Session is still valid
                this.currentUser = JSON.parse(userData);
                this.isLoggedIn = true;
                this.updateLastActivity();
                this.startSessionTimer();
            } else {
                // Session expired
                this.clearSession();
                this.showLoginForm();
            }
        } else {
            this.showLoginForm();
        }
    }

    updateLastActivity() {
        localStorage.setItem('adminLastActivity', Date.now().toString());
    }

    startSessionTimer() {
        // Update activity on user interaction
        const updateActivity = () => {
            this.updateLastActivity();
        };

        // Update activity on various user interactions
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, updateActivity, true);
        });

        // Check session every minute
        setInterval(() => {
            this.checkSession();
        }, 60000);
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            // Simulate API call
            const success = await this.authenticateUser(username, password);

            if (success) {
                this.loginSuccess();
            } else {
                this.showLoginError('Invalid username or password');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError('Login failed. Please try again.');
        } finally {
            // Reset button state
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async authenticateUser(username, password) {
        // Simulate API authentication
        // In a real app, this would make an API call to your backend

        // Check for specific admin credentials
        if (username === 'admin' && password === 'admin123') {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user data
            this.currentUser = {
                id: 1,
                username: username,
                name: 'Admin User',
                role: 'super_admin',
                email: 'admin@eastleighturfgrass.com',
                permissions: ['read', 'write', 'delete', 'admin']
            };

            return true;
        }

        return false;
    }

    loginSuccess() {
        // Store session data
        const token = this.generateToken();
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(this.currentUser));
        this.updateLastActivity();

        this.isLoggedIn = true;
        this.startSessionTimer();

        // Hide login form and show dashboard
        this.hideLoginForm();

        // Initialize dashboard after successful login
        setTimeout(() => {
            this.showDashboard();
        }, 100);

        // Show success message
        if (window.showToast) {
            window.showToast('success', 'Login Successful', `Welcome back, ${this.currentUser.name}!`);
        }
    }

    generateToken() {
        // Generate a simple token (in real app, this would come from the server)
        return 'admin_token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    logout() {
        this.clearSession();
        this.showLoginForm();

        if (window.showToast) {
            window.showToast('info', 'Logged Out', 'You have been successfully logged out.');
        }
    }

    clearSession() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminLastActivity');

        this.isLoggedIn = false;
        this.currentUser = null;
    }

    showLoginForm() {
        // Hide the main admin container
        const adminContainer = document.querySelector('.admin-container');
        if (adminContainer) {
            adminContainer.style.display = 'none';
        }

        // Create or show login form
        let loginContainer = document.getElementById('loginContainer');
        if (!loginContainer) {
            loginContainer = this.createLoginForm();
            document.body.appendChild(loginContainer);
        } else {
            loginContainer.style.display = 'flex';
        }
    }

    hideLoginForm() {
        // Hide login form
        const loginContainer = document.getElementById('loginContainer');
        if (loginContainer) {
            loginContainer.style.display = 'none';
        }

        // Show the main admin container
        const adminContainer = document.querySelector('.admin-container');
        if (adminContainer) {
            adminContainer.style.display = 'flex';
        }
    }

    createLoginForm() {
        const loginContainer = document.createElement('div');
        loginContainer.id = 'loginContainer';
        loginContainer.className = 'login-container';
        loginContainer.innerHTML = `
            <div class="login-card">
                <div class="login-header">
                    <div class="login-logo">
                        <img src="../../assets/images/icons/mainLogo.png" alt="Eastleigh Turf Grass" class="logo-img">
                        <h1>Admin Login</h1>
                    </div>
                    <p>Enter your credentials to access the admin panel</p>
                </div>
                
                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="rememberMe" name="rememberMe">
                            <span class="checkmark"></span>
                            Remember me
                        </label>
                    </div>
                    
                    <button type="submit" class="btn-login">
                        <i class="fas fa-sign-in-alt"></i>
                        Login
                    </button>
                </form>
                
                <div class="login-footer">
                    <p>Forgot your password? <a href="#" id="forgotPassword">Contact administrator</a></p>
                </div>
            </div>
        `;

        // Add login form styles
        this.addLoginStyles();

        return loginContainer;
    }

    addLoginStyles() {
        if (document.getElementById('loginStyles')) return;

        const style = document.createElement('style');
        style.id = 'loginStyles';
        style.textContent = `
            .login-container {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #2D6A4F 0%, #40916C 100%);
                padding: 2rem;
            }
            
            .login-card {
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                padding: 3rem;
                width: 100%;
                max-width: 400px;
            }
            
            .login-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .login-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .login-logo img {
                width: 50px;
                height: 50px;
                object-fit: contain;
            }
            
            .login-logo h1 {
                font-size: 1.5rem;
                font-weight: 600;
                color: #2D6A4F;
                margin: 0;
            }
            
            .login-header p {
                color: #6C757D;
                font-size: 0.875rem;
                margin: 0;
            }
            
            .login-form {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .login-form .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .login-form label {
                font-weight: 500;
                color: #495057;
                font-size: 0.875rem;
            }
            
            .login-form input {
                padding: 0.75rem;
                border: 1px solid #DEE2E6;
                border-radius: 8px;
                font-size: 0.875rem;
                transition: all 0.3s ease;
            }
            
            .login-form input:focus {
                outline: none;
                border-color: #2D6A4F;
                box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.1);
            }
            
            .btn-login {
                background: linear-gradient(135deg, #2D6A4F, #40916C);
                color: white;
                border: none;
                padding: 0.875rem;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .btn-login:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(45, 106, 79, 0.3);
            }
            
            .btn-login:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none;
            }
            
            .login-footer {
                text-align: center;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #E9ECEF;
            }
            
            .login-footer p {
                color: #6C757D;
                font-size: 0.875rem;
                margin: 0;
            }
            
            .login-footer a {
                color: #2D6A4F;
                text-decoration: none;
                font-weight: 500;
            }
            
            .login-footer a:hover {
                text-decoration: underline;
            }
            
            .checkbox-group {
                flex-direction: row;
                align-items: center;
            }
            
            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
                font-size: 0.875rem;
            }
            
            .checkbox-label input[type="checkbox"] {
                width: 16px;
                height: 16px;
            }
            
            .login-error {
                background: #F8D7DA;
                color: #721C24;
                padding: 0.75rem;
                border-radius: 8px;
                font-size: 0.875rem;
                margin-bottom: 1rem;
                display: none;
            }
            
            @media (max-width: 480px) {
                .login-container {
                    padding: 1rem;
                }
                
                .login-card {
                    padding: 2rem;
                }
            }
        `;

        document.head.appendChild(style);
    }

    showLoginError(message) {
        let errorDiv = document.querySelector('.login-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'login-error';
            const form = document.getElementById('loginForm');
            form.insertBefore(errorDiv, form.firstChild);
        }

        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        // Hide error after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    showDashboard() {
        // Initialize the main dashboard after successful login
        if (window.adminDashboard) {
            window.adminDashboard.reInit();
        }
    }

    isAuthenticated() {
        return this.isLoggedIn && this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasPermission(permission) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        return this.currentUser.permissions.includes(permission) ||
            this.currentUser.permissions.includes('admin');
    }

    // Password reset functionality (placeholder)
    forgotPassword() {
        if (window.showToast) {
            window.showToast('info', 'Password Reset', 'Please contact the system administrator to reset your password.');
        }
    }
}

export {
    AdminAuth
};