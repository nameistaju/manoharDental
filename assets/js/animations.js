/* ==========================================================================
   MANOHAR DENTAL CLINIC - ANIMATIONS SCRIPTS
   ========================================================================== */

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  // Keep page content available when observers are unsupported or interrupted.
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(reveal => reveal.classList.add('active'));
    return;
  }

  document.documentElement.classList.add('reveal-ready');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    // Large mobile sections can never occupy 15% of the viewport/section ratio.
    // A small threshold reveals them as soon as their leading edge arrives.
    threshold: 0.01,
    rootMargin: '0px 0px 80px 0px'
  });

  reveals.forEach(reveal => {
    if (reveal.getBoundingClientRect().top < window.innerHeight + 80) {
      reveal.classList.add('active');
    }
    revealObserver.observe(reveal);
  });

  // Fail open if a browser extension or runtime error prevents observer delivery.
  window.setTimeout(() => {
    document.querySelectorAll('.reveal:not(.active)').forEach(reveal => {
      if (reveal.getBoundingClientRect().top < window.innerHeight * 1.5) {
        reveal.classList.add('active');
      }
    });
  }, 1200);

  window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal:not(.active)').forEach(reveal => {
      if (reveal.getBoundingClientRect().top < window.innerHeight + 100) {
        reveal.classList.add('active');
      }
    });
  }, { passive: true });
}

function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * target);

      counter.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// Export initializers
window.Animations = {
  initScrollReveal,
  initCounters
};
