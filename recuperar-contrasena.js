/* ========================================
   LÓGICA PANTALLA RECUPERAR CONTRASEÑA - SmartyPay PCF1
   Archivo: recuperar-contrasena.js
   Versión: 1.0.0
   ======================================== */

/**
 * Clase para gestionar la recuperación de contraseña
 */
class RecuperarContrasenaManager {
    constructor() {
        this.form = document.getElementById('recuperarForm');
        this.emailInput = document.getElementById('email');
        this.recuperarButton = document.getElementById('recuperarButton');
        this.alertContainer = document.getElementById('alertContainer');

        // Control de solicitudes
        this.requestSent = false;
        this.cooldownTime = 60000; // 1 minuto entre solicitudes
        this.lastRequestTime = 0;

        this.init();
    }

    /**
     * Inicializa los event listeners
     */
    init() {
        // Event listener para el envío del formulario
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Validación en tiempo real
        this.emailInput.addEventListener('blur', () => this.validateEmail());

        // Limpiar errores al escribir
        this.emailInput.addEventListener('input', () => this.clearError('email'));

        // Verificar cooldown de solicitudes previas
        this.checkRequestCooldown();
    }

    /**
     * Maneja el envío del formulario
     * @param {Event} e - Evento del formulario
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Verificar cooldown
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        if (timeSinceLastRequest < this.cooldownTime) {
            const secondsRemaining = Math.ceil((this.cooldownTime - timeSinceLastRequest) / 1000);
            this.showAlert(
                `Por favor, espera ${secondsRemaining} segundos antes de solicitar otro enlace.`,
                'warning'
            );
            return;
        }

        // Validar email
        const isEmailValid = this.validateEmail();

        if (!isEmailValid) {
            this.showAlert('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }

        // Mostrar estado de carga
        this.setLoadingState(true);

        try {
            const email = this.emailInput.value.trim();
            const response = await this.sendResetRequest(email);

            if (response.success) {
                this.handleSuccessfulRequest(email);
            } else {
                this.handleFailedRequest(response.message);
            }
        } catch (error) {
            this.showAlert('Error de conexión. Por favor, intenta nuevamente.', 'error');
            console.error('Password reset error:', error);
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
     * Establece el estado de carga del botón
     * @param {boolean} loading - Estado de carga
     */
    setLoadingState(loading) {
        if (loading) {
            this.recuperarButton.disabled = true;
            this.recuperarButton.classList.add('btn-loading');
            this.emailInput.disabled = true;
        } else {
            this.recuperarButton.disabled = false;
            this.recuperarButton.classList.remove('btn-loading');
            this.emailInput.disabled = false;
        }
    }

    /**
     * Simula envío de solicitud de reseteo (reemplazar con API real)
     * @param {string} email - Email del usuario
     * @returns {Promise<Object>} - Respuesta del servidor
     */
    async sendResetRequest(email) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 2000));

        // IMPORTANTE: Esta es una simulación. En producción, esto debe llamar a la API REST
        // Ejemplo: const response = await fetch('/api/auth/reset-password', {...})

        // Lista de emails registrados para testing
        const registeredEmails = [
            'admin@smartypay.com',
            'residente@smartypay.com',
            'usuario@smartypay.com'
        ];

        // Por seguridad, siempre retornar éxito (no revelar si el email existe)
        // En producción, esto debe implementarse de forma segura en el backend
        return {
            success: true,
            message: 'Enlace de recuperación enviado correctamente.'
        };

        // Nota: En una aplicación real, el servidor debe:
        // 1. Verificar si el email existe en la base de datos
        // 2. Generar un token único y seguro
        // 3. Guardar el token con timestamp de expiración
        // 4. Enviar email con enlace que incluya el token
        // 5. Retornar éxito sin revelar si el email existe (por seguridad)
    }

    /**
     * Maneja la solicitud exitosa
     * @param {string} email - Email del usuario
     */
    handleSuccessfulRequest(email) {
        // Guardar timestamp de última solicitud
        this.lastRequestTime = Date.now();
        localStorage.setItem('lastPasswordResetRequest', this.lastRequestTime.toString());

        this.requestSent = true;

        // Limpiar el formulario
        this.emailInput.value = '';

        // Mostrar mensaje de éxito
        this.showSuccessView(email);
    }

    /**
     * Maneja la solicitud fallida
     * @param {string} message - Mensaje de error
     */
    handleFailedRequest(message) {
        this.showAlert(message, 'error');
    }

    /**
     * Muestra la vista de éxito
     * @param {string} email - Email del usuario
     */
    showSuccessView(email) {
        const card = document.querySelector('.recuperar-card');

        // Ocultar el formulario
        this.form.style.display = 'none';

        // Crear y mostrar mensaje de éxito
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <svg class="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 12l2 2 4-4"></path>
            </svg>
            <h3 class="success-title">Correo Enviado</h3>
            <p class="success-text">
                Hemos enviado las instrucciones de recuperación a <strong>${this.maskEmail(email)}</strong>.
                <br><br>
                Por favor, revisa tu bandeja de entrada y también la carpeta de spam.
                El enlace será válido por 24 horas.
            </p>
            <div class="form-actions">
                <a href="login.html" class="btn btn-primary btn-block">Volver al Inicio de Sesión</a>
                <button id="resendButton" class="btn btn-secondary btn-block" style="margin-top: var(--spacing-md);">
                    Reenviar Correo
                </button>
            </div>
        `;

        // Insertar mensaje después del header
        const header = document.querySelector('.recuperar-header');
        header.after(successMessage);

        // Event listener para reenviar
        const resendButton = document.getElementById('resendButton');
        resendButton.addEventListener('click', () => {
            this.handleResend(email);
        });
    }

    /**
     * Maneja el reenvío del correo
     * @param {string} email - Email del usuario
     */
    async handleResend(email) {
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;

        if (timeSinceLastRequest < this.cooldownTime) {
            const secondsRemaining = Math.ceil((this.cooldownTime - timeSinceLastRequest) / 1000);
            this.showAlert(
                `Por favor, espera ${secondsRemaining} segundos antes de solicitar otro enlace.`,
                'warning'
            );
            return;
        }

        try {
            const resendButton = document.getElementById('resendButton');
            resendButton.disabled = true;
            resendButton.classList.add('btn-loading');

            await this.sendResetRequest(email);

            this.lastRequestTime = Date.now();
            localStorage.setItem('lastPasswordResetRequest', this.lastRequestTime.toString());

            this.showAlert('Correo reenviado exitosamente.', 'success');

            resendButton.disabled = false;
            resendButton.classList.remove('btn-loading');
        } catch (error) {
            this.showAlert('Error al reenviar el correo. Intenta nuevamente.', 'error');
            console.error('Resend error:', error);
        }
    }

    /**
     * Enmascara el email para privacidad
     * @param {string} email - Email a enmascarar
     * @returns {string} - Email enmascarado
     */
    maskEmail(email) {
        const [localPart, domain] = email.split('@');

        if (localPart.length <= 3) {
            return `${localPart[0]}***@${domain}`;
        }

        const visibleChars = 2;
        const maskedLocal = localPart.substring(0, visibleChars) +
                           '***' +
                           localPart.substring(localPart.length - 1);

        return `${maskedLocal}@${domain}`;
    }

    /**
     * Verifica el cooldown de solicitudes previas
     */
    checkRequestCooldown() {
        const lastRequestTime = localStorage.getItem('lastPasswordResetRequest');

        if (lastRequestTime) {
            this.lastRequestTime = parseInt(lastRequestTime);
            const timeSinceLastRequest = Date.now() - this.lastRequestTime;

            if (timeSinceLastRequest < this.cooldownTime) {
                const secondsRemaining = Math.ceil((this.cooldownTime - timeSinceLastRequest) / 1000);
                this.showAlert(
                    `Recientemente se envió un correo de recuperación. Espera ${secondsRemaining} segundos para enviar otro.`,
                    'info'
                );
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
    new RecuperarContrasenaManager();
});
