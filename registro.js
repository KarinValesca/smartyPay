/* ========================================
   LÓGICA PANTALLA REGISTRO - SmartyPay PCF1
   Archivo: registro.js
   Versión: 1.0.0
   ======================================== */

/**
 * Clase para gestionar el registro de nuevos usuarios
 */
class RegistroManager {
    constructor() {
        // Elementos del formulario
        this.form = document.getElementById('registroForm');
        this.nombreCompletoInput = document.getElementById('nombreCompleto');
        this.emailInput = document.getElementById('email');
        this.confirmarEmailInput = document.getElementById('confirmarEmail');
        this.passwordInput = document.getElementById('password');
        this.confirmarPasswordInput = document.getElementById('confirmarPassword');
        this.tipoUsuarioSelect = document.getElementById('tipoUsuario');
        this.numeroUnidadInput = document.getElementById('numeroUnidad');
        this.telefonoInput = document.getElementById('telefono');
        this.aceptarTerminosCheckbox = document.getElementById('aceptarTerminos');
        this.recibirNotificacionesCheckbox = document.getElementById('recibirNotificaciones');
        this.registroButton = document.getElementById('registroButton');
        this.alertContainer = document.getElementById('alertContainer');

        // Botones de toggle password
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.toggleConfirmarPasswordBtn = document.getElementById('toggleConfirmarPassword');

        // Indicador de fortaleza de contraseña
        this.passwordStrengthIndicator = document.getElementById('passwordStrengthIndicator');
        this.passwordStrengthText = document.getElementById('passwordStrengthText');

        this.init();
    }

    /**
     * Inicializa los event listeners
     */
    init() {
        // Event listener para el envío del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Event listeners para mostrar/ocultar contraseñas
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility('password'));
        this.toggleConfirmarPasswordBtn.addEventListener('click', () => this.togglePasswordVisibility('confirmarPassword'));

        // Validación en tiempo real
        this.nombreCompletoInput.addEventListener('blur', () => this.validateNombreCompleto());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.confirmarEmailInput.addEventListener('blur', () => this.validateConfirmarEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.passwordInput.addEventListener('input', () => this.updatePasswordStrength());
        this.confirmarPasswordInput.addEventListener('blur', () => this.validateConfirmarPassword());
        this.tipoUsuarioSelect.addEventListener('change', () => this.validateTipoUsuario());
        this.numeroUnidadInput.addEventListener('blur', () => this.validateNumeroUnidad());
        this.telefonoInput.addEventListener('blur', () => this.validateTelefono());
        this.aceptarTerminosCheckbox.addEventListener('change', () => this.validateAceptarTerminos());

        // Limpiar errores al escribir
        this.nombreCompletoInput.addEventListener('input', () => this.clearError('nombreCompleto'));
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.confirmarEmailInput.addEventListener('input', () => this.clearError('confirmarEmail'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        this.confirmarPasswordInput.addEventListener('input', () => this.clearError('confirmarPassword'));
        this.tipoUsuarioSelect.addEventListener('change', () => this.clearError('tipoUsuario'));
        this.numeroUnidadInput.addEventListener('input', () => this.clearError('numeroUnidad'));
        this.telefonoInput.addEventListener('input', () => this.clearError('telefono'));
    }

    /**
     * Maneja el envío del formulario
     * @param {Event} e - Evento del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Validar todos los campos
        const isNombreValid = this.validateNombreCompleto();
        const isEmailValid = this.validateEmail();
        const isConfirmarEmailValid = this.validateConfirmarEmail();
        const isPasswordValid = this.validatePassword();
        const isConfirmarPasswordValid = this.validateConfirmarPassword();
        const isTipoUsuarioValid = this.validateTipoUsuario();
        const isNumeroUnidadValid = this.validateNumeroUnidad();
        const isTelefonoValid = this.validateTelefono();
        const isTerminosValid = this.validateAceptarTerminos();

        // Si alguna validación falla, detener el proceso
        if (!isNombreValid || !isEmailValid || !isConfirmarEmailValid ||
            !isPasswordValid || !isConfirmarPasswordValid || !isTipoUsuarioValid ||
            !isNumeroUnidadValid || !isTelefonoValid || !isTerminosValid) {
            this.showAlert('Por favor, corrige los errores en el formulario.', 'error');
            // Hacer scroll al primer error
            this.scrollToFirstError();
            return;
        }

        // Mostrar estado de carga
        this.setLoadingState(true);

        try {
            // Preparar datos del usuario
            const userData = {
                nombreCompleto: this.nombreCompletoInput.value.trim(),
                email: this.emailInput.value.trim(),
                password: this.passwordInput.value,
                tipoUsuario: this.tipoUsuarioSelect.value,
                numeroUnidad: this.numeroUnidadInput.value.trim(),
                telefono: this.telefonoInput.value.trim(),
                recibirNotificaciones: this.recibirNotificacionesCheckbox.checked
            };

            // Intentar registrar al usuario
            const response = await this.registerUser(userData);

            if (response.success) {
                this.handleSuccessfulRegistration(response);
            } else {
                this.handleFailedRegistration(response.message);
            }
        } catch (error) {
            this.showAlert('Error de conexión. Por favor, intenta nuevamente.', 'error');
            console.error('Registration error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Valida el nombre completo
     * @returns {boolean} - True si es válido
     */
    validateNombreCompleto() {
        const nombre = this.nombreCompletoInput.value.trim();

        if (!nombre) {
            this.showFieldError('nombreCompleto', 'El nombre completo es requerido.');
            return false;
        }

        if (nombre.length < 3) {
            this.showFieldError('nombreCompleto', 'El nombre debe tener al menos 3 caracteres.');
            return false;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            this.showFieldError('nombreCompleto', 'El nombre solo debe contener letras.');
            return false;
        }

        this.clearError('nombreCompleto');
        return true;
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
     * Valida que la confirmación del email coincida
     * @returns {boolean} - True si es válido
     */
    validateConfirmarEmail() {
        const email = this.emailInput.value.trim();
        const confirmarEmail = this.confirmarEmailInput.value.trim();

        if (!confirmarEmail) {
            this.showFieldError('confirmarEmail', 'Debes confirmar tu correo electrónico.');
            return false;
        }

        if (email !== confirmarEmail) {
            this.showFieldError('confirmarEmail', 'Los correos electrónicos no coinciden.');
            return false;
        }

        this.clearError('confirmarEmail');
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

        // Validar que contenga al menos una mayúscula
        if (!/[A-Z]/.test(password)) {
            this.showFieldError('password', 'La contraseña debe contener al menos una mayúscula.');
            return false;
        }

        // Validar que contenga al menos una minúscula
        if (!/[a-z]/.test(password)) {
            this.showFieldError('password', 'La contraseña debe contener al menos una minúscula.');
            return false;
        }

        // Validar que contenga al menos un número
        if (!/[0-9]/.test(password)) {
            this.showFieldError('password', 'La contraseña debe contener al menos un número.');
            return false;
        }

        // Validar que contenga al menos un símbolo
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            this.showFieldError('password', 'La contraseña debe contener al menos un símbolo especial.');
            return false;
        }

        this.clearError('password');
        return true;
    }

    /**
     * Valida que la confirmación de contraseña coincida
     * @returns {boolean} - True si es válida
     */
    validateConfirmarPassword() {
        const password = this.passwordInput.value;
        const confirmarPassword = this.confirmarPasswordInput.value;

        if (!confirmarPassword) {
            this.showFieldError('confirmarPassword', 'Debes confirmar tu contraseña.');
            return false;
        }

        if (password !== confirmarPassword) {
            this.showFieldError('confirmarPassword', 'Las contraseñas no coinciden.');
            return false;
        }

        this.clearError('confirmarPassword');
        return true;
    }

    /**
     * Valida el tipo de usuario
     * @returns {boolean} - True si es válido
     */
    validateTipoUsuario() {
        const tipoUsuario = this.tipoUsuarioSelect.value;

        if (!tipoUsuario) {
            this.showFieldError('tipoUsuario', 'Debes seleccionar un tipo de usuario.');
            return false;
        }

        this.clearError('tipoUsuario');
        return true;
    }

    /**
     * Valida el número de unidad
     * @returns {boolean} - True si es válido
     */
    validateNumeroUnidad() {
        const numeroUnidad = this.numeroUnidadInput.value.trim();

        if (!numeroUnidad) {
            this.showFieldError('numeroUnidad', 'El número de unidad es requerido.');
            return false;
        }

        if (numeroUnidad.length < 1 || numeroUnidad.length > 10) {
            this.showFieldError('numeroUnidad', 'El número de unidad debe tener entre 1 y 10 caracteres.');
            return false;
        }

        this.clearError('numeroUnidad');
        return true;
    }

    /**
     * Valida el teléfono
     * @returns {boolean} - True si es válido
     */
    validateTelefono() {
        const telefono = this.telefonoInput.value.trim();
        // Expresión regular para teléfono chileno (+56 9 1234 5678 o variaciones)
        const telefonoRegex = /^(\+?56)?[\s-]?[9]\s?[0-9]{4}\s?[0-9]{4}$/;

        if (!telefono) {
            this.showFieldError('telefono', 'El teléfono es requerido.');
            return false;
        }

        if (!telefonoRegex.test(telefono)) {
            this.showFieldError('telefono', 'Ingresa un teléfono válido (Ej: +56 9 1234 5678).');
            return false;
        }

        this.clearError('telefono');
        return true;
    }

    /**
     * Valida que se hayan aceptado los términos
     * @returns {boolean} - True si es válido
     */
    validateAceptarTerminos() {
        if (!this.aceptarTerminosCheckbox.checked) {
            this.showFieldError('aceptarTerminos', 'Debes aceptar los términos y condiciones.');
            return false;
        }

        this.clearError('aceptarTerminos');
        return true;
    }

    /**
     * Actualiza el indicador de fortaleza de la contraseña
     */
    updatePasswordStrength() {
        const password = this.passwordInput.value;
        let strength = 0;
        let strengthText = '';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        // Resetear clases
        this.passwordStrengthIndicator.className = 'password-strength-fill';
        this.passwordStrengthText.className = 'password-strength-text';

        if (strength === 0) {
            strengthText = '';
        } else if (strength <= 2) {
            this.passwordStrengthIndicator.classList.add('weak');
            this.passwordStrengthText.classList.add('weak');
            strengthText = 'Débil';
        } else if (strength <= 4) {
            this.passwordStrengthIndicator.classList.add('medium');
            this.passwordStrengthText.classList.add('medium');
            strengthText = 'Media';
        } else {
            this.passwordStrengthIndicator.classList.add('strong');
            this.passwordStrengthText.classList.add('strong');
            strengthText = 'Fuerte';
        }

        this.passwordStrengthText.textContent = strengthText;
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
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    /**
     * Limpia el error de un campo
     * @param {string} fieldName - Nombre del campo
     */
    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorSpan = document.getElementById(`${fieldName}Error`);

        input.classList.remove('error');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    }

    /**
     * Alterna la visibilidad de la contraseña
     * @param {string} fieldId - ID del campo de contraseña
     */
    togglePasswordVisibility(fieldId) {
        const input = document.getElementById(fieldId);
        const button = document.getElementById(`toggle${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}`);

        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;

        const ariaLabel = type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña';
        button.setAttribute('aria-label', ariaLabel);
    }

    /**
     * Establece el estado de carga del formulario
     * @param {boolean} loading - Estado de carga
     */
    setLoadingState(loading) {
        if (loading) {
            this.registroButton.disabled = true;
            this.registroButton.classList.add('btn-loading');
            // Deshabilitar todos los inputs
            Array.from(this.form.elements).forEach(element => {
                element.disabled = true;
            });
        } else {
            this.registroButton.disabled = false;
            this.registroButton.classList.remove('btn-loading');
            // Habilitar todos los inputs
            Array.from(this.form.elements).forEach(element => {
                element.disabled = false;
            });
        }
    }

    /**
     * Simula registro de usuario (reemplazar con API real)
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object>} - Respuesta del registro
     */
    async registerUser(userData) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));

        // IMPORTANTE: Esta es una simulación. En producción, esto debe llamar a la API REST
        // Ejemplo: const response = await fetch('/api/auth/register', {...})

        // Simular validación de email único
        const existingEmails = ['admin@smartypay.com', 'residente@smartypay.com'];

        if (existingEmails.includes(userData.email)) {
            return {
                success: false,
                message: 'Este correo electrónico ya está registrado. Intenta con otro o inicia sesión.'
            };
        }

        // Simular validación de unidad única
        const existingUnits = ['101', '102', 'A-201'];

        if (existingUnits.includes(userData.numeroUnidad)) {
            return {
                success: false,
                message: 'Esta unidad ya está registrada. Verifica tu número de unidad.'
            };
        }

        // Registro exitoso
        return {
            success: true,
            message: 'Cuenta creada exitosamente',
            user: {
                id: Date.now(),
                nombreCompleto: userData.nombreCompleto,
                email: userData.email,
                tipoUsuario: userData.tipoUsuario,
                numeroUnidad: userData.numeroUnidad,
                telefono: userData.telefono
            }
        };
    }

    /**
     * Maneja el registro exitoso
     * @param {Object} response - Respuesta del servidor
     */
    handleSuccessfulRegistration(response) {
        this.showAlert('¡Registro exitoso! Redirigiendo a inicio de sesión...', 'success');

        // En una aplicación real, aquí podríamos:
        // 1. Enviar un email de verificación
        // 2. Redirigir a una página de confirmación
        // 3. Auto-login del usuario

        // Por ahora, redirigir al login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    /**
     * Maneja el registro fallido
     * @param {string} message - Mensaje de error
     */
    handleFailedRegistration(message) {
        this.showAlert(message, 'error');
    }

    /**
     * Hace scroll al primer error visible
     */
    scrollToFirstError() {
        const firstError = this.form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
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

        // Hacer scroll a la alerta
        this.alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

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
    new RegistroManager();
});
