/**
 * Mil Sonrisas — Centro Odontológico
 * Lógica Interactiva, Horarios en Vivo, Validación y Agendamiento
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initClinicSchedule();
  initContactForm();
  initScrollSpy();
});

/* ==========================================================================
   1. Navbar & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerClose = document.getElementById('drawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  // Sticky header background
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu open / close
  const openMenu = () => {
    mobileDrawer.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileDrawer.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (drawerClose) drawerClose.addEventListener('click', closeMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Global helper for mobile drawer
window.closeMobileMenu = function() {
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileDrawer) {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }
};

/* ==========================================================================
   2. Cálculo Dinámico de Horarios (Lunes-Viernes 09:00-20:00, Sábados 09:00-13:00)
   ========================================================================== */
function initClinicSchedule() {
  const topDot = document.getElementById('topStatusDot');
  const topText = document.getElementById('topStatusText');
  const liveCard = document.getElementById('liveStatusCard');
  const liveTitle = document.getElementById('liveStatusTitle');
  const liveDetail = document.getElementById('liveStatusDetail');

  const now = new Date();
  const day = now.getDay(); // 0: Domingo, 1: Lunes ... 6: Sábado
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour + minute / 60;

  let isOpen = false;
  let statusSummary = '';
  let statusDetail = '';

  // Resaltar fila del día de hoy
  const rowWeekday = document.getElementById('row-weekday');
  const rowSaturday = document.getElementById('row-saturday');
  const rowSunday = document.getElementById('row-sunday');

  if (day >= 1 && day <= 5) {
    rowWeekday?.classList.add('is-today');
    if (currentTime >= 9 && currentTime < 20) {
      isOpen = true;
      statusSummary = 'Abierto ahora';
      statusDetail = 'Atendiendo hoy hasta las 20:00 hrs.';
    } else if (currentTime < 9) {
      isOpen = false;
      statusSummary = 'Cerrado ahora';
      statusDetail = 'Abrimos hoy a las 09:00 hrs.';
    } else {
      isOpen = false;
      statusSummary = 'Cerrado por hoy';
      statusDetail = day === 5 ? 'Abrimos mañana sábado a las 09:00 hrs.' : 'Abrimos mañana a las 09:00 hrs.';
    }
  } else if (day === 6) { // Sábado
    rowSaturday?.classList.add('is-today');
    if (currentTime >= 9 && currentTime < 13) {
      isOpen = true;
      statusSummary = 'Abierto ahora';
      statusDetail = 'Atendiendo hoy sábado hasta las 13:00 hrs.';
    } else if (currentTime < 9) {
      isOpen = false;
      statusSummary = 'Cerrado ahora';
      statusDetail = 'Abrimos hoy sábado a las 09:00 hrs.';
    } else {
      isOpen = false;
      statusSummary = 'Cerrado por hoy';
      statusDetail = 'Abrimos el lunes a las 09:00 hrs.';
    }
  } else { // Domingo
    rowSunday?.classList.add('is-today');
    isOpen = false;
    statusSummary = 'Cerrado hoy Domingo';
    statusDetail = 'Abrimos el lunes a las 09:00 hrs. Déjanos tu mensaje por WhatsApp.';
  }

  // Actualizar top bar
  if (topDot && topText) {
    if (isOpen) {
      topDot.classList.remove('closed');
      topText.textContent = `${statusSummary} (Hasta ${day === 6 ? '13:00' : '20:00'})`;
    } else {
      topDot.classList.add('closed');
      topText.textContent = `${statusSummary} • Citas vía WhatsApp`;
    }
  }

  // Actualizar tarjeta de horario en sección
  if (liveCard && liveTitle && liveDetail) {
    if (isOpen) {
      liveCard.classList.remove('is-closed');
      liveTitle.textContent = `🟢 ${statusSummary}`;
      liveDetail.textContent = statusDetail;
    } else {
      liveCard.classList.add('is-closed');
      liveTitle.textContent = `🔴 ${statusSummary}`;
      liveDetail.textContent = statusDetail;
    }
  }
}

/* ==========================================================================
   3. Modal de Agendamiento
   ========================================================================== */
window.openAppointmentModal = function(preselectedService = '') {
  const modal = document.getElementById('appointmentModal');
  const serviceSelect = document.getElementById('modalServicio');
  
  if (preselectedService && serviceSelect) {
    // Si coincide el valor, seleccionarlo
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].value === preselectedService) {
        serviceSelect.selectedIndex = i;
        break;
      }
    }
  }

  // Set default minimum date to today
  const dateInput = document.getElementById('modalFecha');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
  }

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAppointmentModal = function() {
  const modal = document.getElementById('appointmentModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAppointmentModal();
  }
});

// Agendar desde tarjeta de servicio
window.selectServiceAndBook = function(serviceName) {
  openAppointmentModal(serviceName);
};

// Enviar formulario modal directo a WhatsApp
window.handleAppointmentSubmit = function(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('modalNombre')?.value.trim() || '';
  const telefono = document.getElementById('modalTelefono')?.value.trim() || '';
  const servicio = document.getElementById('modalServicio')?.value || 'Consulta General';
  const fecha = document.getElementById('modalFecha')?.value || 'A coordinar';
  const horario = document.getElementById('modalHorario')?.value || 'Por definir';

  if (!nombre || !telefono) {
    alert('Por favor completa tu nombre y teléfono.');
    return;
  }

  const mensajeWA = 
    `👋 *Hola Centro Odontológico Mil Sonrisas!*\n` +
    `Deseo agendar una cita odontológica:\n\n` +
    `👤 *Paciente:* ${nombre}\n` +
    `📞 *Teléfono:* ${telefono}\n` +
    `🦷 *Tratamiento / Servicio:* ${servicio}\n` +
    `📅 *Fecha solicitada:* ${fecha}\n` +
    `⏰ *Horario sugerido:* ${horario}\n\n` +
    `_Enviado desde el sitio web oficial de Mil Sonrisas_`;

  const waUrl = `https://wa.me/59164759021?text=${encodeURIComponent(mensajeWA)}`;
  
  // Abrir WhatsApp en nueva pestaña
  window.open(waUrl, '_blank');
  
  // Cerrar modal
  closeAppointmentModal();
};

/* ==========================================================================
   4. Formulario de Contacto Principal
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccessMessage');
  const waForwardBtn = document.getElementById('waForwardBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('formNombre');
    const telefono = document.getElementById('formTelefono');
    const servicio = document.getElementById('formServicio');
    const mensaje = document.getElementById('formMensaje');

    const errNombre = document.getElementById('errorNombre');
    const errTelefono = document.getElementById('errorTelefono');
    const errMensaje = document.getElementById('errorMensaje');

    let isValid = true;

    // Validación Nombre
    if (!nombre.value.trim() || nombre.value.trim().length < 2) {
      nombre.classList.add('invalid');
      errNombre.classList.add('visible');
      isValid = false;
    } else {
      nombre.classList.remove('invalid');
      errNombre.classList.remove('visible');
    }

    // Validación Teléfono
    const telDigits = telefono.value.replace(/\D/g, '');
    if (!telefono.value.trim() || telDigits.length < 6) {
      telefono.classList.add('invalid');
      errTelefono.classList.add('visible');
      isValid = false;
    } else {
      telefono.classList.remove('invalid');
      errTelefono.classList.remove('visible');
    }

    // Validación Mensaje
    if (!mensaje.value.trim() || mensaje.value.trim().length < 5) {
      mensaje.classList.add('invalid');
      errMensaje.classList.add('visible');
      isValid = false;
    } else {
      mensaje.classList.remove('invalid');
      errMensaje.classList.remove('visible');
    }

    if (!isValid) return;

    // Crear enlace para continuar en WhatsApp
    const textoWA = 
      `👋 *Hola Centro Odontológico Mil Sonrisas!*\n` +
      `Te contacto desde su sitio web:\n\n` +
      `👤 *Nombre:* ${nombre.value.trim()}\n` +
      `📞 *Teléfono:* ${telefono.value.trim()}\n` +
      (servicio.value ? `🦷 *Interés:* ${servicio.value}\n` : '') +
      `💬 *Mensaje:* ${mensaje.value.trim()}`;

    const waLink = `https://wa.me/59164759021?text=${encodeURIComponent(textoWA)}`;
    
    if (waForwardBtn) {
      waForwardBtn.href = waLink;
    }

    // Ocultar formulario y mostrar mensaje de confirmación
    form.style.display = 'none';
    if (successBox) {
      successBox.classList.add('show');
    }
  });
}

window.resetContactForm = function() {
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccessMessage');
  if (form) {
    form.reset();
    form.style.display = 'block';
  }
  if (successBox) {
    successBox.classList.remove('show');
  }
};

/* ==========================================================================
   5. ScrollSpy para Enlaces Activos
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}
/**
 * Cambia dinámicamente el estilo tipográfico de la página en tiempo de ejecución.
 * @param {string} styleType - 'modern' (Outfit + Plus Jakarta Sans) o 'elegant' (Playfair + Montserrat)
 */
function switchTypographyStyle(styleType = 'modern') {
  const root = document.documentElement;
  
  if (styleType === 'elegant') {
    root.style.setProperty('--font-heading', "'Playfair Display', Georgia, serif");
    root.style.setProperty('--font-body', "'Montserrat', system-ui, sans-serif");
  } else {
    root.style.setProperty('--font-heading', "'Outfit', -apple-system, sans-serif");
    root.style.setProperty('--font-body', "'Plus Jakarta Sans', -apple-system, sans-serif");
  }
}