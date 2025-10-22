/* ========================================
   LÓGICA PANTALLA LOGIN - SmartyPay PCF1
   Archivo: login.js
   Versión: 1.0.0
   ======================================== */

/**
 * Clase para gestionar la autenticación de usuarios
 */
class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.loginButton = document.getElementById('loginButton');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.alertContainer = document.getElementById('alertContainer');
        
        // Contador de intentos fallidos
        this.failedAttempts = 0;
        this.maxAttempts = 3;
        this.isBlocked = false;
        
        this.init();
    }
    
    /**
     * Inicializa los event listeners
     */
    init() {
        // Event listener para el envío del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Event listener para mostrar/ocultar contraseña
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
        
        // Validación en tiempo real
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        
        // Limpiar errores al escribir
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        
        // Verificar si hay cuenta bloqueada
        this.checkBlockedAccount();
    }
    
    /**
     * Maneja el envío del formulario
     * @param {Event} e - Evento del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validar si la cuenta está bloqueada
        if (this.isBlocked) {
            this.showAlert('Tu cuenta está bloqueada temporalmente por seguridad. Intenta más tarde o recupera tu contraseña.', 'error');
            return;
        }
        
        // Validar campos
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            this.showAlert('Por favor, corrige los errores en el formulario.', 'error');
            return;
        }
        
        // Mostrar estado de carga
        this.setLoadingState(true);
        
        try {
            // Simular llamada a API (reemplazar con llamada real)
            const loginData = {
                email: this.emailInput.value.trim(),
                password: this.passwordInput.value
            };
            
            const response = await this.authenticateUser(loginData);
            
            if (response.success) {
                this.handleSuccessfulLogin(response);
            } else {
                this.handleFailedLogin(response.message);
            }
        } catch (error) {
            this.showAlert('Error de conexión. Por favor, intenta nuevamente.', 'error');
            console.error('Login error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    /**
     * Valida el formato del correo electrónico
     * @returns {boolean} - True si es válido
     */
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError('email', 'El correo electrónico es requerido.');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError('email', 'Ingresa un correo electrónico válido.');
            return false;
        }
        
        this.clearError('email');
        return true;
    }
    
    /**
     * Valida la contraseña
     * @returns {boolean} - True si es válida
     */
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showFieldError('password', 'La contraseña es requerida.');
            return false;
        }
        
        if (password.length < 8) {
            this.showFieldError('password', 'La contraseña debe tener al menos 8 caracteres.');
            return false;
        }
        
        this.clearError('password');
        return true;
    }
    
    /**
     * Muestra error en un campo específico
     * @param {string} fieldName - Nombre del campo
     * @param {string} message - Mensaje de error
     */
    showFieldError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorSpan = document.getElementById(`${fieldName}Error`);
        
        input.classList.add('error');
        errorSpan.textContent = message;
    }
    
    /**
     * Limpia el error de un campo
     * @param {string} fieldName - Nombre del campo
     */
    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorSpan = document.getElementById(`${fieldName}Error`);
        
        input.classList.remove('error');
        errorSpan.textContent = '';
    }
    
    /**
     * Alterna la visibilidad de la contraseña
     */
    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        const ariaLabel = type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
        this.togglePasswordBtn.setAttribute('aria-label', ariaLabel);
    }
    
    /**
     * Establece el estado de carga del botón
     * @param {boolean} loading - Estado de carga
     */
    setLoadingState(loading) {
        if (loading) {
            this.loginButton.disabled = true;
            this.loginButton.classList.add('btn-loading');
            this.emailInput.disabled = true;
            this.passwordInput.disabled = true;
        } else {
            this.loginButton.disabled = false;
            this.loginButton.classList.remove('btn-loading');
            this.emailInput.disabled = false;
            this.passwordInput.disabled = false;
        }
    }
    
    /**
     * Simula autenticación de usuario (reemplazar con API real)
     * @param {Object} credentials - Credenciales del usuario
     * @returns {Promise<Object>} - Respuesta de autenticación
     */
    async authenticateUser(credentials) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // IMPORTANTE: Esta es una simulación. En producción, esto debe llamar a la API REST
        // Ejemplo: const response = await fetch('/api/auth/login', {...})
        
        // Usuarios de ejemplo para testing
        const validUsers = [
            { email: 'admin@smartypay.com', password: 'Admin123!', role: 'admin', name: 'Administrador' },
            { email: 'residente@smartypay.com', password: 'Residente123!', role: 'residente', name: 'Juan Pérez' }
        ];
        
        const user = validUsers.find(u => 
            u.email === credentials.email && u.password === credentials.password
        );
        
        if (user) {
            return {
                success: true,
                user: {
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                token: 'jwt_token_example_' + Date.now()
            };
        }
        
        return {
            success: false,
            message: 'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.'
        };
    }
    
    /**
     * Maneja el login exitoso
     * @param {Object} response - Respuesta del servidor
     */
    handleSuccessfulLogin(response) {
        // Resetear intentos fallidos
        this.failedAttempts = 0;
        localStorage.removeItem('loginFailedAttempts');
        
        // Guardar información del usuario (en producción usar tokens seguros)
        sessionStorage.setItem('userToken', response.token);
        sessionStorage.setItem('userEmail', response.user.email);
        sessionStorage.setItem('userName', response.user.name);
        sessionStorage.setItem('userRole', response.user.role);
        
        this.showAlert('Inicio de sesión exitoso. Redirigiendo...', 'success');
        
        // Redireccionar según el rol
        setTimeout(() => {
            if (response.user.role === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else {
                window.location.href = 'dashboard-residente.html';
            }
        }, 1500);
    }
    
    /**
     * Maneja el login fallido
     * @param {string} message - Mensaje de error
     */
    handleFailedLogin(message) {
        this.failedAttempts++;
        
        // Guardar intentos fallidos
        localStorage.setItem('loginFailedAttempts', this.failedAttempts.toString());
        
        if (this.failedAttempts >= this.maxAttempts) {
            this.blockAccount();
            this.showAlert(
                `Cuenta bloqueada por seguridad después de ${this.maxAttempts} intentos fallidos. Intenta recuperar tu contraseña.`,
                'error'
            );
        } else {
            const remainingAttempts = this.maxAttempts - this.failedAttempts;
            this.showAlert(
                `${message} Te quedan ${remainingAttempts} intento(s).`,
                'error'
            );
        }
    }
    
    /**
     * Bloquea la cuenta temporalmente
     */
    blockAccount() {
        this.isBlocked = true;
        const blockExpiry = Date.now() + (15 * 60 * 1000); // 15 minutos
        localStorage.setItem('accountBlockedUntil', blockExpiry.toString());
        this.emailInput.disabled = true;
        this.passwordInput.disabled = true;
        this.loginButton.disabled = true;
    }
    
    /**
     * Verifica si la cuenta está bloqueada
     */
    checkBlockedAccount() {
        const blockExpiry = localStorage.getItem('accountBlockedUntil');
        const failedAttempts = localStorage.getItem('loginFailedAttempts');
        
        if (failedAttempts) {
            this.failedAttempts = parseInt(failedAttempts);
        }
        
        if (blockExpiry) {
            const expiryTime = parseInt(blockExpiry);
            
            if (Date.now() < expiryTime) {
                this.isBlocked = true;
                const minutesRemaining = Math.ceil((expiryTime - Date.now()) / 60000);
                this.showAlert(
                    `Tu cuenta está bloqueada temporalmente. Intenta nuevamente en ${minutesRemaining} minuto(s).`,
                    'warning'
                );
                this.emailInput.disabled = true;
                this.passwordInput.disabled = true;
                this.loginButton.disabled = true;
            } else {
                // Desbloquear cuenta
                localStorage.removeItem('accountBlockedUntil');
                localStorage.removeItem('loginFailedAttempts');
                this.failedAttempts = 0;
            }
        }
    }
    
    /**
     * Muestra alerta en la interfaz
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de alerta (success, error, warning, info)
     */
    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.setAttribute('role', 'alert');
        
        this.alertContainer.innerHTML = '';
        this.alertContainer.appendChild(alert);
        
        // Auto-ocultar después de 5 segundos (excepto errores)
        if (type !== 'error') {
            setTimeout(() => {
                alert.style.transition = 'opacity 0.3s ease';
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }, 5000);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});