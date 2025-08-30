// authState.js
// Simple authentication state manager for brokers
// Uses localStorage to persist state between page loads

(function(global) {
    const STORAGE_KEY = 'authState';

    // ---- Internal helpers ----
    const saveState = (state) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('authState save failed', e);
        }
    };

    const loadState = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {
                loggedIn: false
            };
        } catch (e) {
            console.error('authState load failed', e);
            return {
                loggedIn: false
            };
        }
    };

    // ---- State object ----
    let state = loadState();

    // ---- Public API ----
    const AuthState = {
        login(user) {
            state = {
                loggedIn: true,
                user: {
                    username: user.username,
                    role: user.role || 'broker'
                }
            };
            saveState(state);
        },
        logout() {
            state = {
                loggedIn: false
            };
            saveState(state);
        },
        isLoggedIn() {
            return !!state.loggedIn;
        },
        getUser() {
            return state.user || null;
        },
        clear() {
            localStorage.removeItem(STORAGE_KEY);
            state = {
                loggedIn: false
            };
        }
    };

    // Expose globally
    global.AuthState = AuthState;

})(window);