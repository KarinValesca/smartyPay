/* ========================================
   SCRIPT DASHBOARD RESIDENTE - SmartyPay PCF1
   Archivo: dashboard-residente.js
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const headerTitle = document.getElementById('headerTitle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const logoutBtn = document.getElementById('logoutBtn');
    const paymentForm = document.getElementById('paymentForm');
    const paymentAmount = document.getElementById('paymentAmount');
    const summaryAmount = document.getElementById('summaryAmount');
    const newBalance = document.getElementById('newBalance');

    // ========================================
    // NAVEGACIÓN
    // ========================================

    // Cambiar entre secciones
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remover clase active de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Agregar clase active al item clickeado
            this.classList.add('active');

            // Obtener la sección a mostrar
            const sectionName = this.getAttribute('data-section');

            // Ocultar todas las secciones
            contentSections.forEach(section => section.classList.remove('active'));

            // Mostrar la sección seleccionada
            const targetSection = document.getElementById(`section-${sectionName}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Actualizar título del header
            const navText = this.querySelector('.nav-text').textContent;
            headerTitle.textContent = navText;

            // Cerrar sidebar en móvil
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                removeOverlay();
            }
        });
    });

    // ========================================
    // MENÚ MÓVIL
    // ========================================

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');

            if (sidebar.classList.contains('active')) {
                createOverlay();
            } else {
                removeOverlay();
            }
        });
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay active';
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            removeOverlay();
        });
        document.body.appendChild(overlay);
    }

    function removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // ========================================
    // LOGOUT
    // ========================================

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                // Aquí se implementaría la lógica de logout
                console.log('Cerrando sesión...');
                window.location.href = 'login.html';
            }
        });
    }

    // ========================================
    // FORMULARIO DE PAGO
    // ========================================

    if (paymentAmount && summaryAmount && newBalance) {
        paymentAmount.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            const currentBalance = 45000; // Este valor vendría de la base de datos
            const calculatedBalance = currentBalance - amount;

            summaryAmount.textContent = `$${amount.toLocaleString('es-CL')}`;
            newBalance.textContent = `$${calculatedBalance.toLocaleString('es-CL')}`;
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const paymentType = document.getElementById('paymentType').value;
            const amount = document.getElementById('paymentAmount').value;
            const method = document.getElementById('paymentMethod').value;
            const note = document.getElementById('paymentNote').value;

            // Validaciones
            if (!paymentType || !amount || !method) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }

            if (parseFloat(amount) <= 0) {
                alert('El monto debe ser mayor a cero');
                return;
            }

            // Aquí se implementaría la lógica de procesamiento del pago
            console.log('Procesando pago:', {
                type: paymentType,
                amount: amount,
                method: method,
                note: note
            });

            // Simulación de éxito
            alert('Pago procesado exitosamente. Recibirás un comprobante por email.');
            paymentForm.reset();
            summaryAmount.textContent = '$0';
            newBalance.textContent = '$45,000';
        });
    }

    // ========================================
    // FORMULARIO DE PERFIL
    // ========================================

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('profileName').value;
            const email = document.getElementById('profileEmail').value;
            const phone = document.getElementById('profilePhone').value;

            if (!name || !email || !phone) {
                alert('Por favor completa todos los campos');
                return;
            }

            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingresa un email válido');
                return;
            }

            // Aquí se implementaría la lógica de actualización del perfil
            console.log('Actualizando perfil:', { name, email, phone });

            alert('Perfil actualizado exitosamente');
        });
    }

    // ========================================
    // FORMULARIO DE CAMBIO DE CONTRASEÑA
    // ========================================

    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                alert('Por favor completa todos los campos');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            if (newPassword.length < 8) {
                alert('La contraseña debe tener al menos 8 caracteres');
                return;
            }

            // Aquí se implementaría la lógica de cambio de contraseña
            console.log('Cambiando contraseña...');

            alert('Contraseña actualizada exitosamente');
            passwordForm.reset();
        });
    }

    // ========================================
    // UTILIDADES
    // ========================================

    // Formatear montos en las tablas
    function formatCurrency(amount) {
        return `$${amount.toLocaleString('es-CL')}`;
    }

    // Marcar notificaciones como leídas
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.remove('unread');
            updateNotificationBadge();
        });
    });

    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // Botón para marcar todas las notificaciones como leídas
    const markAllReadBtn = document.querySelector('#section-notificaciones .btn-secondary');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            notificationItems.forEach(item => item.classList.remove('unread'));
            updateNotificationBadge();
        });
    }

    // ========================================
    // INICIALIZACIÓN
    // ========================================

    console.log('Dashboard Residente cargado correctamente');
    updateNotificationBadge();
});
