/* ========================================
   SCRIPT DASHBOARD ADMINISTRADOR - SmartyPay PCF1
   Archivo: dashboard-admin.js
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const headerTitle = document.getElementById('headerTitle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const logoutBtn = document.getElementById('logoutBtn');

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
    // GESTIÓN DE USUARIOS
    // ========================================

    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            alert('Funcionalidad de agregar usuario - A implementar');
            // Aquí se abriría un modal o se redirigiría a un formulario
        });
    }

    // Botones de editar usuario
    const editButtons = document.querySelectorAll('.btn-icon:not(.btn-icon-danger)');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Funcionalidad de editar - A implementar');
            // Aquí se abriría un modal de edición
        });
    });

    // Botones de eliminar usuario
    const deleteButtons = document.querySelectorAll('.btn-icon-danger');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                alert('Usuario eliminado - A implementar');
                // Aquí se implementaría la lógica de eliminación
            }
        });
    });

    // Búsqueda de usuarios
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Buscando:', searchTerm);
            // Aquí se implementaría la lógica de búsqueda
            // Filtrar la tabla de usuarios según el término de búsqueda
        });
    }

    // ========================================
    // FORMULARIO DE REPORTES
    // ========================================

    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const reportType = document.getElementById('reportType').value;
            const reportPeriod = document.getElementById('reportPeriod').value;
            const reportFormat = document.getElementById('reportFormat').value;

            console.log('Generando reporte:', {
                type: reportType,
                period: reportPeriod,
                format: reportFormat
            });

            alert(`Generando reporte de ${reportType} en formato ${reportFormat}...`);

            // Aquí se implementaría la lógica de generación del reporte
            // Podría ser una llamada a un endpoint que genere el archivo
        });
    }

    // ========================================
    // FORMULARIO DE CONFIGURACIÓN
    // ========================================

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const buildingName = document.getElementById('buildingName').value;
            const adminEmail = document.getElementById('adminEmail').value;
            const dueDate = document.getElementById('dueDate').value;

            if (!buildingName || !adminEmail) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }

            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(adminEmail)) {
                alert('Por favor ingresa un email válido');
                return;
            }

            console.log('Guardando configuración:', {
                buildingName,
                adminEmail,
                dueDate
            });

            alert('Configuración guardada exitosamente');
        });
    }

    // ========================================
    // FILTROS DE PAGOS
    // ========================================

    const filterButtons = document.querySelectorAll('.card .btn-primary:not(#addUserBtn)');
    filterButtons.forEach(btn => {
        if (btn.textContent.includes('Aplicar Filtros')) {
            btn.addEventListener('click', function() {
                const status = document.getElementById('filterStatus')?.value;
                const month = document.getElementById('filterMonth')?.value;
                const unit = document.getElementById('filterUnit')?.value;

                console.log('Aplicando filtros:', { status, month, unit });

                // Aquí se implementaría la lógica de filtrado
                alert('Filtros aplicados');
            });
        }
    });

    // ========================================
    // GESTIÓN DE UNIDADES
    // ========================================

    const unitDetailsButtons = document.querySelectorAll('.unit-actions .btn-secondary');
    unitDetailsButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const unitCard = this.closest('.unit-card');
            const unitNumber = unitCard.querySelector('.unit-number').textContent;

            console.log('Ver detalles de:', unitNumber);
            alert(`Mostrando detalles de ${unitNumber} - A implementar`);

            // Aquí se mostraría un modal con los detalles completos de la unidad
        });
    });

    // ========================================
    // NOTIFICACIONES Y CONFIGURACIÓN
    // ========================================

    const notificationCheckboxes = document.querySelectorAll('.settings-list input[type="checkbox"]');
    notificationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.parentElement.querySelector('span').textContent;
            const isChecked = this.checked;

            console.log(`${label}: ${isChecked ? 'Activado' : 'Desactivado'}`);

            // Aquí se guardaría la configuración en el backend
        });
    });

    // ========================================
    // EXPORTAR DATOS
    // ========================================

    const exportButtons = document.querySelectorAll('.section-actions .btn-secondary');
    exportButtons.forEach(btn => {
        if (btn.textContent.includes('Exportar')) {
            btn.addEventListener('click', function() {
                console.log('Exportando datos...');
                alert('Generando archivo de exportación...');

                // Aquí se implementaría la lógica de exportación
                // Podría generar un CSV o Excel con los datos filtrados
            });
        }
    });

    // ========================================
    // ACCIONES EN TABLA DE PAGOS
    // ========================================

    const viewPaymentButtons = document.querySelectorAll('#section-pagos .btn-icon');
    viewPaymentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const paymentId = row.querySelector('td:first-child').textContent;

            console.log('Ver detalles del pago:', paymentId);
            alert(`Mostrando detalles del pago ${paymentId} - A implementar`);

            // Aquí se mostraría un modal con todos los detalles del pago
        });
    });

    // ========================================
    // REGISTRAR NUEVO PAGO
    // ========================================

    const registerPaymentButtons = document.querySelectorAll('.btn-primary');
    registerPaymentButtons.forEach(btn => {
        if (btn.textContent === 'Registrar Pago') {
            btn.addEventListener('click', function() {
                alert('Formulario de registro de pago - A implementar');
                // Aquí se abriría un modal con un formulario para registrar un nuevo pago
            });
        }
    });

    // ========================================
    // UTILIDADES
    // ========================================

    // Actualizar estadísticas en tiempo real (simulado)
    function updateStats() {
        console.log('Actualizando estadísticas...');
        // En una implementación real, esto haría una llamada al backend
        // para obtener las estadísticas actualizadas
    }

    // Actualizar estadísticas cada 5 minutos
    setInterval(updateStats, 300000);

    // ========================================
    // INICIALIZACIÓN
    // ========================================

    console.log('Dashboard Administrador cargado correctamente');

    // Cargar datos iniciales
    updateStats();
});
