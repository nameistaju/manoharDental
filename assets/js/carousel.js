/* ==========================================================================
   MANOHAR DENTAL CLINIC - CAROUSEL & ACCORDION SCRIPTS
   ========================================================================== */

function initBeforeAfterSlider() {
  const premiumCards = document.querySelectorAll('.ba-premium-card');

  premiumCards.forEach(card => {
    const container = card.querySelector('.ba-slider-container');
    const beforeImg = card.querySelector('.ba-img-before');
    const handle = card.querySelector('.ba-handle');
    const range = card.querySelector('.ba-range-input');

    if (!container || !beforeImg || !handle || !range) return;

    let currentPosition = 50;
    let ticking = false;

    const updateSlider = () => {
      beforeImg.style.clipPath = `inset(0 ${100 - currentPosition}% 0 0)`;
      handle.style.left = '0';
      const containerWidth = container.clientWidth;
      const x = (currentPosition / 100) * containerWidth;
      handle.style.transform = `translate3d(${x}px, 0, 0)`;
      range.value = currentPosition;
      ticking = false;
    };

    const requestUpdate = (pos) => {
      currentPosition = Math.max(0, Math.min(100, pos));
      if (!ticking) {
        requestAnimationFrame(updateSlider);
        ticking = true;
      }
    };

    range.addEventListener('input', () => requestUpdate(range.value));
    
    // Initial render
    requestUpdate(Number(range.value) || 50);

    // Update on resize
    window.addEventListener('resize', () => requestUpdate(currentPosition));
  });

  const premiumGrid = document.querySelector('.ba-cards-grid');
  const premiumDots = document.querySelectorAll('#ba-mobile-dots .ba-dot');
  if (premiumGrid && premiumCards.length && premiumDots.length) {
    const cardWidth = () => premiumCards[0].getBoundingClientRect().width + 14;

    premiumGrid.addEventListener('scroll', () => {
      const activeIndex = Math.round(premiumGrid.scrollLeft / cardWidth());
      premiumDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    }, { passive: true });

    premiumDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        premiumGrid.scrollTo({ left: index * cardWidth(), behavior: 'smooth' });
      });
    });
  }

  const sliders = document.querySelectorAll('.ba-slider');
  
  sliders.forEach(slider => {
    const afterImg = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');

    if (!afterImg || !handle) return;

    // Ensure .ba-after container is full width so clip-path works perfectly without squishing
    afterImg.style.width = '100%';

    let currentPosition = 50;
    let ticking = false;
    let isDragging = false;

    const updateSlider = () => {
      afterImg.style.clipPath = `inset(0 ${100 - currentPosition}% 0 0)`;
      handle.style.left = '0';
      const containerWidth = slider.clientWidth;
      const x = (currentPosition / 100) * containerWidth;
      handle.style.transform = `translate3d(${x}px, 0, 0)`;
      slider.setAttribute('aria-valuenow', String(Math.round(currentPosition)));
      ticking = false;
    };

    const requestUpdate = (pos) => {
      currentPosition = Math.max(0, Math.min(100, pos));
      if (!ticking) {
        requestAnimationFrame(updateSlider);
        ticking = true;
      }
    };

    const moveSlider = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      const position = (x / rect.width) * 100;
      requestUpdate(position);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    };

    const onMouseUp = () => {
      isDragging = false;
      slider.classList.remove('ba-dragging');
      document.body.classList.remove('ba-grabbing-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    const startMouseDrag = (e) => {
      e.preventDefault();
      isDragging = true;
      slider.classList.add('ba-dragging');
      document.body.classList.add('ba-grabbing-active');
      moveSlider(e.clientX);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    slider.addEventListener('mousedown', startMouseDrag);

    const onTouchMove = (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches[0]) {
        e.preventDefault();
        moveSlider(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
      slider.classList.remove('ba-dragging');
      document.body.classList.remove('ba-grabbing-active');
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    slider.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches[0]) return;
      isDragging = true;
      slider.classList.add('ba-dragging');
      document.body.classList.add('ba-grabbing-active');
      moveSlider(e.touches[0].clientX);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }, { passive: true });

    slider.addEventListener('keydown', (e) => {
      const keyPositions = { Home: 0, End: 100 };
      let nextPosition = keyPositions[e.key];

      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') nextPosition = currentPosition - 5;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') nextPosition = currentPosition + 5;
      if (nextPosition === undefined) return;

      e.preventDefault();
      requestUpdate(nextPosition);
    });

    // Initialize to 50%
    requestUpdate(50);

    // Update on resize
    window.addEventListener('resize', () => requestUpdate(currentPosition));
  });
}

function initTestimonialCarousel() {
  const carousel = document.querySelector('.testimonial-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.testimonial-track');
  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dotsContainer = carousel.querySelector('.testimonial-nav');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer;

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
    autoSlideTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideTimer);
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();

  // Drag swipes
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

function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header, .faq-accordion-header');

  accordionHeaders.forEach(header => {
    const itemSelector = header.classList.contains('faq-accordion-header')
      ? '.faq-accordion-item'
      : '.accordion-item';
    const contentSelector = header.classList.contains('faq-accordion-header')
      ? '.faq-accordion-content'
      : '.accordion-content';
    const item = header.closest(itemSelector);
    const content = item?.querySelector(contentSelector);
    if (!item || !content) return;

    header.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
    content.style.maxHeight = item.classList.contains('active') ? `${content.scrollHeight}px` : null;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      const accordion = item.parentElement;

      accordion.querySelectorAll(itemSelector).forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector(contentSelector);
          const otherHeader = otherItem.querySelector('.accordion-header, .faq-accordion-header');
          if (otherContent) otherContent.style.maxHeight = null;
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initHeroDoctorSlider() {
  const slider = document.querySelector('.hero-doctor-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-doctor-slide');
  const prevBtn = slider.querySelector('.hero-prev');
  const nextBtn = slider.querySelector('.hero-next');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer;

  const goToSlide = (index) => {
    slides[currentIndex].classList.remove('active');
    currentIndex = index;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;
    slides[currentIndex].classList.add('active');
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const startAutoSlide = () => {
    autoTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoSlide = () => {
    clearInterval(autoTimer);
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    });
  }

  startAutoSlide();
}

function initTestimonialPremiumSlider() {
  const card = document.querySelector('.testimonial-premium-card');
  const navContainer = document.querySelector('.testimonial-premium-nav');
  if (!card) return;

  const images = card.querySelectorAll('.testimonial-premium-img');
  const slides = card.querySelectorAll('.testimonial-premium-slide');
  const prevBtn = navContainer ? navContainer.querySelector('.testimonial-prev') : null;
  const nextBtn = navContainer ? navContainer.querySelector('.testimonial-next') : null;

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoTimer;

  const goToSlide = (index) => {
    // Hide current
    if (images[currentIndex]) images[currentIndex].classList.remove('active');
    slides[currentIndex].classList.remove('active');

    currentIndex = index;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;

    // Show new
    if (images[currentIndex]) images[currentIndex].classList.add('active');
    slides[currentIndex].classList.add('active');
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const startAutoSlide = () => {
    autoTimer = setInterval(nextSlide, 6000);
  };

  const stopAutoSlide = () => {
    clearInterval(autoTimer);
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    });
  }

  card.addEventListener('mouseenter', stopAutoSlide);
  card.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();
}

// Export initializers
window.Carousel = {
  initBeforeAfterSlider,
  initTestimonialCarousel,
  initHeroDoctorSlider,
  initTestimonialPremiumSlider,
  initAccordion
};
