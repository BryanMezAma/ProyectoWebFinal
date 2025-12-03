/**
 * Auth.js - Sistema de autenticación global
 * Maneja login, registro, sesiones persistentes y verificación de acceso
 */

const API_URL = '/api';

// Clase de Autenticación
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.userData = this.getUserData();
    }

    // Obtener datos del usuario desde localStorage
    getUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    }

    // Verificar si hay sesión activa
    isLoggedIn() {
        return this.token !== null && this.userData !== null;
    }

    // Obtener token
    getToken() {
        return this.token;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.userData;
    }

    // Login
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const token = await response.text();
            localStorage.setItem('token', token);
            this.token = token;

            // Obtener datos completos del usuario
            const userResponse = await fetch(`${API_URL}/users/${email}`, {
                headers: {
                    'x-auth': token
                }
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                const user = userData[0];
                localStorage.setItem('userData', JSON.stringify(user));
                this.userData = user;
                return { success: true, user };
            }

            throw new Error('Error al obtener datos del usuario');
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Registro
    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al registrar');
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Cerrar sesión
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        this.token = null;
        this.userData = null;
    }

    // Actualizar perfil
    async updateProfile(updates) {
        if (!this.isLoggedIn()) {
            return { success: false, error: 'No hay sesión activa' };
        }

        try {
            const response = await fetch(`${API_URL}/users/${this.userData.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth': this.token
                },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                // Actualizar datos locales
                const updatedUser = { ...this.userData, ...updates };
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                this.userData = updatedUser;
                return { success: true };
            }

            throw new Error('Error al actualizar perfil');
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Verificar acceso a página protegida
    requireAuth(redirectUrl = 'login.html') {
        if (!this.isLoggedIn()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Verificar rol específico
    requireRole(role, redirectUrl = 'home.html') {
        if (!this.isLoggedIn() || this.userData.role !== role) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }
}

// Instancia global
const auth = new AuthManager();

// Función para actualizar UI de navegación según estado de sesión
function updateNavigation() {
    const navProfileBtn = document.getElementById('nav-profile-btn');
    const navLoginBtn = document.getElementById('nav-login-btn');
    const navRegisterPetBtn = document.getElementById('nav-register-pet-btn');

    if (auth.isLoggedIn()) {
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        if (navProfileBtn) {
            navProfileBtn.style.display = 'block';
            navProfileBtn.innerHTML = `<i class="fas fa-user-circle mr-1"></i>${auth.getCurrentUser().name.split(' ')[0]}`;
        }
        if (navRegisterPetBtn && auth.getCurrentUser().role === 'PET_OWNER') {
            navRegisterPetBtn.style.display = 'block';
        }
    } else {
        if (navLoginBtn) navLoginBtn.style.display = 'block';
        if (navProfileBtn) navProfileBtn.style.display = 'none';
        if (navRegisterPetBtn) navRegisterPetBtn.style.display = 'none';
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', updateNavigation);

// Exportar para uso global
window.auth = auth;
window.updateNavigation = updateNavigation;

