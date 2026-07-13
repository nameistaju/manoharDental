/* ==========================================================================
   VASANTHA DENTAL CLINIC - SLIDERS, CAROUSELS, AND ACCORDION SCRIPTS
   ========================================================================== */

// 1. Before / After Sliders
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
    requestUpdate(Number(range.value) || 50);
    window.addEventListener('resize', () => requestUpdate(currentPosition));
  });
}

// 2. Fullscreen Hero Slider
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (!slider || slides.length === 0) return;

  let currentIndex = 0;
  let progressInterval;

  const goToSlide = (index) => {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex]?.classList.remove('active');
    currentIndex = ((index % slides.length) + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    dots[currentIndex]?.classList.add('active');
  };

  const startAuto = () => {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => goToSlide(currentIndex + 1), 6000);
  };

  const stopAuto = () => clearInterval(progressInterval);

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      stopAuto();
      startAuto();
    });
  });

  prevBtn?.addEventListener('click', () => { goToSlide(currentIndex - 1); stopAuto(); startAuto(); });
  nextBtn?.addEventListener('click', () => { goToSlide(currentIndex + 1); stopAuto(); startAuto(); });

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  // Touch support
  let startX = 0;
  slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    stopAuto(); startAuto();
  }, { passive: true });

  startAuto();
}

// 3. Testimonials Carousel
function initTestimonialCarousel() {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('testimonial-dots');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;

  let currentIndex = 0;
  let autoTimer;
  let cardsPerView = 1;

  const getCardsPerView = () => {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const getMaxIndex = () => Math.max(0, cards.length - getCardsPerView());

  const buildDots = () => {
    if (!dotsContainer) return;
    const max = getMaxIndex();
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= max; i++) {
      const btn = document.createElement('button');
      btn.className = 'testimonial-dot-btn' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => { goToSlide(i); resetAuto(); });
      dotsContainer.appendChild(btn);
    }
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.testimonial-dot-btn').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const goToSlide = (index) => {
    const max = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, max));
    const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap || '24');
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    updateDots();
  };

  const startAuto = () => { autoTimer = setInterval(() => goToSlide(currentIndex + 1 > getMaxIndex() ? 0 : currentIndex + 1), 5000); };
  const stopAuto = () => clearInterval(autoTimer);
  const resetAuto = () => { stopAuto(); startAuto(); };

  prevBtn?.addEventListener('click', () => { goToSlide(currentIndex - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goToSlide(currentIndex + 1); resetAuto(); });

  track.parentElement.addEventListener('mouseenter', stopAuto);
  track.parentElement.addEventListener('mouseleave', startAuto);

  // Touch
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    resetAuto();
  }, { passive: true });

  window.addEventListener('resize', () => {
    buildDots();
    goToSlide(Math.min(currentIndex, getMaxIndex()));
  });

  buildDots();
  startAuto();
}

// 4. FAQ Accordion
function initAccordion() {
  const accordionItems = document.querySelectorAll('.faq-accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    const content = item.querySelector('.faq-accordion-content');
    const icon = item.querySelector('.faq-accordion-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      accordionItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const c = other.querySelector('.faq-accordion-content');
          const ic = other.querySelector('.faq-accordion-icon');
          if (c) c.style.maxHeight = null;
          if (ic) ic.textContent = '+';
          other.querySelector('.faq-accordion-header')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        if (icon) icon.textContent = '+';
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.textContent = '−';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Export
window.Carousel = {
  initBeforeAfterSlider,
  initHeroSlider,
  initTestimonialCarousel,
  initAccordion
};
