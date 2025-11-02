// Authentication utility functions
// Set API_BASE on window to share across scripts
if (typeof window !== 'undefined') {
    window.API_BASE = window.API_BASE || '/api';
}

// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch(`${window.API_BASE}/auth/me`, {
            credentials: 'include'
        });
        const data = await response.json();
        return data.authenticated ? data.user : null;
    } catch (error) {
        console.error('Auth check error:', error);
        return null;
    }
}

// Logout user
async function logout() {
    try {
        await fetch(`${window.API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// Update navigation based on auth status
async function updateNavigation() {
    const user = await checkAuth();
    const userInfoEl = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (user) {
        if (userInfoEl) {
            userInfoEl.textContent = `👤 ${user.username}`;
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
            logoutBtn.addEventListener('click', logout);
        }
        
        // Store in sessionStorage for quick access
        sessionStorage.setItem('user', JSON.stringify(user));
    } else {
        if (userInfoEl) {
            userInfoEl.innerHTML = '<a href="login.html" style="color: white; text-decoration: none;">Login</a>';
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
        }
        sessionStorage.removeItem('user');
    }
    
    return user;
}

// Initialize auth on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', updateNavigation);
}
