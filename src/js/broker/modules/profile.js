// Profile Module - Broker Dashboard

class ProfileManager {
    constructor() {
        this.profile = null;
        this.init();
    }

    init() {
        this.loadProfile();
        this.bindEvents();
    }

    bindEvents() {
        // Edit Profile button
        const editProfileBtn = document.querySelector('#profile-content .btn-secondary');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.showEditProfileModal());
        }

        // Logout button
        const logoutBtn = document.querySelector('#profile-content .btn-primary');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    loadProfile() {
        // Load profile from auth state or localStorage
        const authState = localStorage.getItem('authState');
        if (authState) {
            try {
                const user = JSON.parse(authState);
                if (user.loggedIn && user.user) {
                    this.profile = {
                        username: user.user.username || 'Broker User',
                        email: user.user.email || 'broker@eastleighturf.com',
                        role: user.user.role || 'Authorized Broker',
                        lastLogin: user.user.lastLogin || new Date().toISOString()
                    };
                }
            } catch (e) {
                console.error('Error parsing auth state:', e);
            }
        }

        // If no profile from auth, use default
        if (!this.profile) {
            this.profile = {
                username: 'Broker User',
                email: 'broker@eastleighturf.com',
                role: 'Authorized Broker',
                lastLogin: new Date().toISOString()
            };
        }

        this.renderProfile();
    }

    showEditProfileModal() {
        // Create and show edit profile modal
        const modal = this.createEditProfileModal();
        document.body.appendChild(modal);

        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    createEditProfileModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Edit Profile</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="edit-profile-form">
                        <div class="form-group">
                            <label for="edit-username">Username</label>
                            <input type="text" id="edit-username" value="${this.profile.username}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-email">Email</label>
                            <input type="email" id="edit-email" value="${this.profile.email}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-phone">Phone Number</label>
                            <input type="tel" id="edit-phone" value="${this.profile.phone || ''}" placeholder="Enter phone number">
                        </div>
                        <div class="form-group">
                            <label for="edit-company">Company</label>
                            <input type="text" id="edit-company" value="${this.profile.company || ''}" placeholder="Enter company name">
                        </div>
                        <div class="form-group">
                            <label for="edit-address">Address</label>
                            <textarea id="edit-address" rows="3" placeholder="Enter address">${this.profile.address || ''}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Handle form submission
        const form = modal.querySelector('#edit-profile-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
            modal.remove();
        });

        return modal;
    }

    updateProfile() {
        const username = document.getElementById('edit-username').value;
        const email = document.getElementById('edit-email').value;
        const phone = document.getElementById('edit-phone').value;
        const company = document.getElementById('edit-company').value;
        const address = document.getElementById('edit-address').value;

        if (!username || !email) {
            this.showToast('Username and email are required', 'error');
            return;
        }

        // Update profile
        this.profile = {
            ...this.profile,
            username,
            email,
            phone,
            company,
            address,
            lastUpdated: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('brokerProfile', JSON.stringify(this.profile));

        // Update auth state if available
        const authState = localStorage.getItem('authState');
        if (authState) {
            try {
                const user = JSON.parse(authState);
                if (user.loggedIn && user.user) {
                    user.user.username = username;
                    user.user.email = email;
                    localStorage.setItem('authState', JSON.stringify(user));
                }
            } catch (e) {
                console.error('Error updating auth state:', e);
            }
        }

        this.renderProfile();
        this.showToast('Profile updated successfully', 'success');
    }

    renderProfile() {
        const contentBody = document.querySelector('#profile-content');
        if (!contentBody) return;

        contentBody.innerHTML = `
            <div class="profile-form">
                <div class="form-group">
                    <label for="broker-name">Full Name</label>
                    <input type="text" id="broker-name" value="${this.profile.username}" readonly>
                </div>
                <div class="form-group">
                    <label for="broker-email">Email</label>
                    <input type="email" id="broker-email" value="${this.profile.email}" readonly>
                </div>
                <div class="form-group">
                    <label for="broker-role">Role</label>
                    <input type="text" id="broker-role" value="${this.profile.role}" readonly>
                </div>
                ${this.profile.phone ? `
                <div class="form-group">
                    <label for="broker-phone">Phone</label>
                    <input type="tel" id="broker-phone" value="${this.profile.phone}" readonly>
                </div>
                ` : ''}
                ${this.profile.company ? `
                <div class="form-group">
                    <label for="broker-company">Company</label>
                    <input type="text" id="broker-company" value="${this.profile.company}" readonly>
                </div>
                ` : ''}
                ${this.profile.address ? `
                <div class="form-group">
                    <label for="broker-address">Address</label>
                    <textarea id="broker-address" rows="3" readonly>${this.profile.address}</textarea>
                </div>
                ` : ''}
                <div class="form-group">
                    <label for="broker-last-login">Last Login</label>
                    <input type="text" id="broker-last-login" value="${new Date(this.profile.lastLogin).toLocaleString()}" readonly>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-secondary">
                        <i class="fas fa-edit"></i>
                        Edit Profile
                    </button>
                    <button class="btn btn-primary">
                        <i class="fas fa-sign-out-alt"></i>
                        Logout
                    </button>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    handleLogout() {
        if (!confirm('Are you sure you want to logout?')) return;

        // Clear authentication state
        localStorage.removeItem('authState');
        localStorage.removeItem('brokerProfile');

        // Show logout message
        this.showToast('Logging out...', 'success');

        // Redirect to home page
        window.location.href = '/index.html';
    }

    showToast(message, type = 'success') {
        if (window.BrokerDashboard && window.BrokerDashboard.showToast) {
            window.BrokerDashboard.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize profile manager when module loads
let profileManager;
document.addEventListener('DOMContentLoaded', () => {
    profileManager = new ProfileManager();
});

// Export for external use
window.profileManager = profileManager;