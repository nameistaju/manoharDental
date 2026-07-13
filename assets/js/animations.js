/* ==========================================================================
   VASANTHA DENTAL CLINIC - ANIMATIONS SCRIPTS
   ========================================================================== */

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .stagger-parent');
  if (reveals.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

function initCountUp() {
  const elements = document.querySelectorAll('.count-up');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute('data-target'), 10);
        let startVal = 0;
        const duration = 1500;
        const stepTime = Math.max(15, Math.floor(duration / targetVal));

        const timer = setInterval(() => {
          startVal += 1;
          el.textContent = startVal;
          if (startVal >= targetVal) {
            el.textContent = targetVal;
            clearInterval(timer);
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

// Export initializers
window.Animations = {
  initScrollReveal,
  initCountUp
};
