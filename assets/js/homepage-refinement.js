/* ==========================================================================
   MANOHAR DENTAL CLINIC - HOMEPAGE REFINEMENT INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Before/After Sliders
  initBeforeAfterSliders();

  // Initialize FAQ Accordion
  initFAQAccordion();

  // Initialize Video Play Triggers inside Video Testimonial Reels
  initReelVideoPlayers();

  // Initialize Before/After Swipe Carousel dots tracking
  initBeforeAfterSwipeCarousel();
});

/**
 * Interactive Before/After Sliders using HTML5 Range Input
 */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('[data-ba-slider]');
  sliders.forEach(slider => {
    const rangeInput = slider.querySelector('.ba-range');
    const afterImage = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');

    if (!rangeInput || !afterImage || !handle) return;

    const updateSlider = (value) => {
      afterImage.style.width = `${value}%`;
      handle.style.left = `${value}%`;
    };

    // Synchronize initial layout
    updateSlider(rangeInput.value);

    // Event listeners for dragging
    rangeInput.addEventListener('input', (e) => {
      updateSlider(e.target.value);
    });

    rangeInput.addEventListener('change', (e) => {
      updateSlider(e.target.value);
    });
  });
}

/**
 * FAQ Split Accordion with Smooth Max-Height Transitions
 */
function initFAQAccordion() {
  const accordionItems = document.querySelectorAll('.faq-accordion-item');
  if (accordionItems.length === 0) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    const content = item.querySelector('.faq-accordion-content');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items first
      accordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.faq-accordion-content');
        if (otherContent) {
          otherContent.style.maxHeight = null;
        }
        const otherHeader = otherItem.querySelector('.faq-accordion-header');
        if (otherHeader) {
          otherHeader.setAttribute('aria-expanded', 'false');
        }
      });

      // Open clicked item if it wasn't already active
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = `${content.scrollHeight}px`;
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Calculate and set initial state for active accordion on load
  const activeItem = document.querySelector('.faq-accordion-item.active');
  if (activeItem) {
    const content = activeItem.querySelector('.faq-accordion-content');
    const header = activeItem.querySelector('.faq-accordion-header');
    if (content && header) {
      content.style.maxHeight = `${content.scrollHeight}px`;
      header.setAttribute('aria-expanded', 'true');
    }
  }
}

/**
 * Simple play/pause toggles for video reels and clinic tour
 */
function initReelVideoPlayers() {
  // Support play triggers for any video containing [data-play-video] sibling/parent
  const playButtons = document.querySelectorAll('[data-play-video]');
  playButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = button.closest('div') || button.parentElement;
      const video = container.querySelector('video');
      if (!video) return;

      if (video.paused) {
        // Pause all other video elements on the page (like other reels)
        document.querySelectorAll('video').forEach(v => {
          if (v !== video) {
            v.pause();
            const otherContainer = v.closest('div') || v.parentElement;
            otherContainer.classList.remove('playing');
          }
        });
        video.play();
        container.classList.add('playing');
        button.style.display = 'none'; // hide overlay button when playing
      } else {
        video.pause();
        container.classList.remove('playing');
        button.style.display = 'flex';
      }
    });
  });

  // Re-display play button if user pauses via native controls
  const allVideos = document.querySelectorAll('video');
  allVideos.forEach(video => {
    video.addEventListener('pause', () => {
      const container = video.closest('div') || video.parentElement;
      container.classList.remove('playing');
      const playBtn = container.querySelector('[data-play-video]');
      if (playBtn) {
        playBtn.style.display = 'flex';
      }
    });

    video.addEventListener('play', () => {
      const container = video.closest('div') || video.parentElement;
      container.classList.add('playing');
      const playBtn = container.querySelector('[data-play-video]');
      if (playBtn) {
        playBtn.style.display = 'none';
      }
    });
  });
}

/**
 * Sync active dot state on Before/After results mobile carousel swipe
 */
function initBeforeAfterSwipeCarousel() {
  const grid = document.querySelector('#before-after-results .grid-4');
  const dots = document.querySelectorAll('.ba-dot');
  
  if (!grid || dots.length === 0) return;
  
  const updateActiveDot = () => {
    const scrollLeft = grid.scrollLeft;
    const card = grid.querySelector('.before-after-card-simple');
    if (!card) return;
    const cardWidth = card.offsetWidth + 16; // width + gap
    const activeIndex = Math.round(scrollLeft / cardWidth);
    
    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };
  
  // Attach scroll listener
  grid.addEventListener('scroll', updateActiveDot);
  
  // Attach click listener to dots for navigation
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const card = grid.querySelector('.before-after-card-simple');
      if (!card) return;
      const cardWidth = card.offsetWidth + 16; // width + gap
      grid.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth'
      });
    });
  });
}
