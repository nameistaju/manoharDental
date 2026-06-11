/* components.js - Component Specific Interactivity (Slider, Carousel, Accordion, Filters, Forms) */

document.addEventListener('DOMContentLoaded', () => {
  initBeforeAfterSlider();
  initTestimonialCarousel();
  initAccordion();
  initConsultationForm();
  initGalleryFilter();
});

/* Draggable Before & After Slider */
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.ba-slider');
  
  sliders.forEach(slider => {
    const afterImg = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let isDragging = false;

    if (!afterImg || !handle) return;

    const moveSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      let position = (x / rect.width) * 100;

      // Restrain positions within bounds [0, 100]
      if (position < 0) position = 0;
      if (position > 100) position = 100;

      afterImg.style.width = position + '%';
      handle.style.left = position + '%';
    };

    // Touch events for mobile
    slider.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      moveSlider(e.touches[0].clientX);
    }, { passive: true });

    // Mouse events for desktop
    handle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    slider.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    // Support clicking anywhere on slider to jump
    slider.addEventListener('click', (e) => {
      if (e.target.closest('.ba-handle-button')) return; // Avoid drag button conflict
      moveSlider(e.clientX);
    });
  });
}

/* Auto-sliding Testimonial Carousel with Pause on Hover */
function initTestimonialCarousel() {
  const carousel = document.querySelector('.testimonial-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.testimonial-track');
  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dotsContainer = carousel.querySelector('.testimonial-nav');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer;

  // Clear previous dots if any and create new ones
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `testimonial-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const goToSlide = (index) => {
    currentIndex = index;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots();
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const startAutoSlide = () => {
    autoSlideTimer = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideTimer);
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  // Hover events to pause
  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);

  // Initialize
  startAutoSlide();

  // Support swipe/drag gestures (simple mouse drag)
  let startX = 0;
  let isSwiping = false;

  carousel.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isSwiping = true;
  });

  carousel.addEventListener('mouseup', (e) => {
    if (!isSwiping) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
      resetAutoSlide();
    }
    isSwiping = false;
  });
}

/* FAQ Accordion mechanics with height animation */
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close all other items (accordion mode)
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.accordion-content').style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* Quick Consultation Form Validation & Pre-filled WhatsApp Redirect */
function initConsultationForm() {
  const form = document.querySelector('.consult-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('input[type="text"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const treatmentSelect = form.querySelector('select');
    
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Validate Phone
    const phonePattern = /^[0-9]{10}$/;
    if (!phoneInput.value.trim() || !phonePattern.test(phoneInput.value.replace(/[\s-+]/g, '').slice(-10))) {
      showError(phoneInput, 'Please enter a valid 10-digit mobile number');
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    if (!isValid) return;

    // Process submission: Show success animation and redirect to WhatsApp
    const formCard = form.closest('.consult-card');
    const successMsg = formCard.querySelector('.form-success-message');

    if (form && successMsg) {
      form.style.display = 'none';
      successMsg.style.display = 'flex';

      // Pre-fill WhatsApp URL and redirect after 1.5 seconds
      const name = encodeURIComponent(nameInput.value.trim());
      const phone = encodeURIComponent(phoneInput.value.trim());
      const treatment = encodeURIComponent(treatmentSelect ? treatmentSelect.value : 'General Consultation');
      
      const whatsappText = `Hello Manohar Dental Clinic, my name is ${name} (Phone: ${phone}). I would like to book a consultation for "${treatment}". Please schedule my appointment.`;
      const whatsappUrl = `https://api.whatsapp.com/send?phone=919703294358&text=${encodeURIComponent(whatsappText)}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
    }
  });

  function showError(input, msg) {
    const group = input.closest('.form-group');
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
    const errorSpan = group.querySelector('.error-message');
    if (errorSpan) {
      group.removeChild(errorSpan);
    }
    input.style.borderColor = '';
  }
}

/* Gallery Filtering & Lightbox Modal */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (filterButtons.length === 0 || galleryItems.length === 0) return;

  // Category Filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal trigger
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let activeItems = [];
    let activeIndex = 0;

    const openLightbox = (imgSrc, itemIndex, currentActiveItems) => {
      lightboxImg.src = imgSrc;
      activeIndex = itemIndex;
      activeItems = currentActiveItems;
      lightbox.style.display = 'flex';
      document.body.classList.add('no-scroll');
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        // Determine currently visible items under active filter
        const visibleItems = Array.from(galleryItems).filter(i => i.style.display !== 'none');
        const idx = visibleItems.indexOf(item);
        openLightbox(imgSrc, idx, visibleItems);
      });
    });

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.classList.remove('no-scroll');
    };

    const prevImage = () => {
      if (activeItems.length === 0) return;
      activeIndex = (activeIndex - 1 + activeItems.length) % activeItems.length;
      lightboxImg.src = activeItems[activeIndex].querySelector('img').src;
    };

    const nextImage = () => {
      if (activeItems.length === 0) return;
      activeIndex = (activeIndex + 1) % activeItems.length;
      lightboxImg.src = activeItems[activeIndex].querySelector('img').src;
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    });
  }
}
