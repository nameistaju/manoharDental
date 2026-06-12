/* ==========================================================================
   MANOHAR DENTAL CLINIC - FORMS SCRIPTS
   ========================================================================== */

function initConsultationForm() {
  const forms = document.querySelectorAll('.consult-form');
  const emailConfig = window.ManoharEmailJS || {};

  if (window.emailjs && emailConfig.publicKey) {
    window.emailjs.init({ publicKey: emailConfig.publicKey });
  }
  
  forms.forEach(form => {
    if (form.dataset.consultFormBound === 'true') return;
    form.dataset.consultFormBound = 'true';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"], input[placeholder*="name"]');
      const phoneInput = form.querySelector('input[type="tel"]');
      const treatmentSelect = form.querySelector('select');
      const dateInput = form.querySelector('input[type="date"]');
      const messageInput = form.querySelector('textarea[name="message"]');
      
      let isValid = true;

      if (!nameInput || !phoneInput) return;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      // Validate Phone
      const phonePattern = /^[0-9]{10}$/;
      const digitsOnly = phoneInput.value.replace(/[\s-+]/g, '').slice(-10);
      if (!phoneInput.value.trim() || !phonePattern.test(digitsOnly)) {
        showError(phoneInput, 'Please enter a valid 10-digit mobile number');
        isValid = false;
      } else {
        clearError(phoneInput);
      }

      if (!isValid) return;

      const consultCard = form.closest('.consult-card') || form.parentElement;
      const successMsg = consultCard.querySelector('.form-success-message');
      const submitButton = form.querySelector('button[type="submit"], .form-submit-btn');
      const previousButtonText = submitButton ? submitButton.textContent : '';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      const payload = {
        subject: form.dataset.emailSubject || 'Appointment Request',
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        treatment: treatmentSelect ? treatmentSelect.value : 'General Dental Consultation',
        preferred_date: dateInput ? dateInput.value : 'Flexible',
        message: messageInput ? messageInput.value.trim() : '',
        page_url: window.location.href
      };

      const canSendEmail = window.emailjs &&
        emailConfig.publicKey &&
        emailConfig.serviceId &&
        emailConfig.templateId;
      let emailDelivered = false;

      try {
        if (canSendEmail) {
          await window.emailjs.send(emailConfig.serviceId, emailConfig.templateId, payload);
          emailDelivered = true;
        }
      } catch (error) {
        console.warn('EmailJS appointment submit failed. Falling back to WhatsApp.', error);
      }

      if (successMsg) {
        form.style.display = 'none';
        successMsg.style.display = 'flex';
      }

      if (!emailDelivered) {
        let whatsappText = `Hello Manohar Dental Clinic, my name is ${payload.name} (Phone: ${payload.phone}). I would like to book a consultation for "${payload.treatment}"`;
        if (payload.preferred_date && payload.preferred_date !== 'Flexible') {
          whatsappText += ` on preferred date: ${payload.preferred_date}`;
        }
        if (payload.message) whatsappText += `. Concern: ${payload.message}`;
        whatsappText += `. Please confirm my booking.`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=919703294358&text=${encodeURIComponent(whatsappText)}`;
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 900);
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = previousButtonText;
      }
    });
  });

  function showError(input, msg) {
    const group = input.closest('.form-group');
    if (!group) return;
    
    let errorSpan = group.querySelector('.error-message');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'error-message';
      errorSpan.style.cssText = 'color: #ef4444; font-size: 0.8rem; font-weight: 500; margin-top: 4px;';
      group.appendChild(errorSpan);
    }
    errorSpan.textContent = msg;
    input.style.borderColor = '#ef4444';
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    if (!group) return;
    
    const errorSpan = group.querySelector('.error-message');
    if (errorSpan) {
      group.removeChild(errorSpan);
    }
    input.style.borderColor = '';
  }
}

// Export initializers
window.Forms = {
  initConsultationForm
};
