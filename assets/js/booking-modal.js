/* ==========================================================================
   VASANTHA DENTAL CLINIC - REUSABLE WHATSAPP BOOKING MODAL
   ========================================================================== */

const BookingModal = (() => {
  let modalOverlay = null;

  // Modal HTML structure to inject
  const modalHTML = `
    <div class="booking-modal-card">
      <button class="booking-modal-close" type="button" aria-label="Close modal">&times;</button>
      
      <div class="booking-modal-header">
        <h3>Book an Appointment</h3>
        <p>Enter your details below to instantly format and send a booking request via WhatsApp.</p>
      </div>
      
      <form id="modal-booking-form">
        <div class="form-group-modal">
          <input type="text" id="modal-name" required placeholder=" ">
          <label for="modal-name">Patient Name *</label>
        </div>
        
        <div class="form-group-modal">
          <input type="tel" id="modal-phone" required placeholder=" " pattern="[0-9]{10}">
          <label for="modal-phone">Phone Number *</label>
        </div>
        
        <div class="form-group-modal">
          <select id="modal-treatment" required>
            <option value="" disabled selected hidden></option>
            <option value="Dental Implants">Dental Implants</option>
            <option value="Root Canal">Root Canal</option>
            <option value="Smile Makeover">Smile Makeover</option>
            <option value="Teeth Whitening">Teeth Whitening</option>
            <option value="Braces">Braces</option>
            <option value="Clear Aligners">Clear Aligners</option>
            <option value="Dentures">Dentures</option>
            <option value="Dental Fillings">Dental Fillings</option>
            <option value="Wisdom Tooth Removal">Wisdom Tooth Removal</option>
            <option value="Pediatric Dentistry">Pediatric Dentistry</option>
            <option value="Preventive Dentistry">Preventive Dentistry</option>
            <option value="Gum Treatment">Gum Treatment</option>
          </select>
          <label for="modal-treatment">Preferred Treatment *</label>
        </div>
        
        <div class="form-row-modal">
          <div class="form-group-modal">
            <input type="date" id="modal-date" required placeholder=" ">
            <label for="modal-date">Preferred Date *</label>
          </div>
          
          <div class="form-group-modal">
            <input type="time" id="modal-time" required placeholder=" ">
            <label for="modal-time">Preferred Time *</label>
          </div>
        </div>
        
        <div class="form-group-modal">
          <textarea id="modal-message" placeholder=" " rows="3"></textarea>
          <label for="modal-message">Additional Message / Concern</label>
        </div>
        
        <div class="modal-actions">
          <button type="button" class="btn btn-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-modal-submit">
            <span>Send via WhatsApp</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.758.459 3.475 1.332 4.992l-1.356 4.962 5.076-1.332c1.47.801 3.12 1.224 4.806 1.224h.006c5.502 0 9.984-4.482 9.984-9.988 0-2.667-1.038-5.175-2.928-7.062-1.89-1.89-4.398-2.928-7.062-2.928zm5.832 14.154c-.252.708-1.464 1.302-2.022 1.362-.516.054-1.188.084-3.414-.84-2.844-1.176-4.686-4.062-4.83-4.248-.138-.186-1.128-1.5-1.128-2.862 0-1.362.708-2.028.966-2.304.252-.276.558-.342.744-.342.186 0 .372.006.534.012.168.006.396-.066.618.474.228.558.78 1.902.846 2.034.066.132.108.288.018.468-.09.18-.132.288-.264.444-.132.15-.276.336-.396.462-.132.138-.27.288-.114.558.156.27.69 1.134 1.482 1.842.822.732 1.512.96 1.728 1.074.216.114.342.096.468-.048.126-.144.54-.63.684-.846.144-.216.288-.18.486-.108.198.072 1.254.594 1.464.702.21.108.348.162.402.252.054.09.054.528-.198 1.236z"/></svg>
          </button>
        </div>
      </form>
    </div>
  `;

  const injectModal = () => {
    if (document.getElementById('booking-modal-overlay')) {
      modalOverlay = document.getElementById('booking-modal-overlay');
      return;
    }

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'booking-modal-overlay';
    modalOverlay.className = 'booking-modal-overlay';
    modalOverlay.innerHTML = modalHTML;
    document.body.appendChild(modalOverlay);

    setupEventListeners();
  };

  const openModal = (prefilledTreatment = '', mode = 'booking') => {
    if (!modalOverlay) injectModal();
    
    // Set modal mode attribute
    modalOverlay.setAttribute('data-mode', mode);
    
    // Prefill treatment if available
    if (prefilledTreatment) {
      const treatmentSelect = modalOverlay.querySelector('#modal-treatment');
      if (treatmentSelect) {
        treatmentSelect.value = prefilledTreatment;
      }
    }

    modalOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    modalOverlay.querySelector('#modal-booking-form')?.reset();
  };

  const setupEventListeners = () => {
    const closeBtn = modalOverlay.querySelector('.booking-modal-close');
    const cancelBtn = modalOverlay.querySelector('.btn-modal-cancel');
    const form = modalOverlay.querySelector('#modal-booking-form');

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = modalOverlay.querySelector('#modal-name').value.trim();
      const phone = modalOverlay.querySelector('#modal-phone').value.trim();
      const treatment = modalOverlay.querySelector('#modal-treatment').value;
      const date = modalOverlay.querySelector('#modal-date').value;
      const time = modalOverlay.querySelector('#modal-time').value;
      const message = modalOverlay.querySelector('#modal-message').value.trim() || 'No additional message.';
      const mode = modalOverlay.getAttribute('data-mode') || 'booking';

      let waMessage = '';
      
      if (mode === 'details') {
        waMessage = 
`Hello Vasantha Dental Clinic,

I'm interested in learning more about:

🦷 Treatment:
${treatment}

Please provide me with:

• Treatment details
• Approximate treatment cost
• Available appointment timings
• EMI options (if available)

Patient Name:
${name}

Phone Number:
${phone}

Preferred Date:
${date}

Additional Message:
${message}

Thank you.`;
      } else {
        waMessage = 
`Hello Vasantha Dental Clinic,

I'd like to book an appointment.

Patient Name:
${name}

Phone Number:
${phone}

Preferred Treatment:
${treatment}

Preferred Date:
${date}

Preferred Time:
${time}

Additional Message:
${message}

Thank you.`;
      }

      const encoded = encodeURIComponent(waMessage);
      const waUrl = `https://wa.me/919703294358?text=${encoded}`;

      closeModal();
      window.open(waUrl, '_blank');
    });
  };

  const init = () => {
    injectModal();

    // Attach click triggers globally
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-booking]');
      if (trigger) {
        e.preventDefault();
        const prefill = trigger.getAttribute('data-treatment') || '';
        const mode = trigger.getAttribute('data-booking-mode') || 'booking';
        openModal(prefill, mode);
      }
    });
  };

  return {
    init,
    open: openModal,
    close: closeModal
  };
})();

// Export global initializer
window.BookingModal = BookingModal;
