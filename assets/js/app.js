/* app.js - Global Site Functionality & Navigation Interactions */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollProgress();
  initScrollReveal();
  initCounters();
});

/* Sticky Header on Scroll */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run on init in case page is refreshed down
}

/* Mobile Menu Toggle */
function initMobileMenu() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (!mobileBtn || !navLinks) return;

  // Create overlay for mobile drawer
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  document.body.appendChild(overlay);

  const toggleMenu = () => {
    const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
    mobileBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  mobileBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Style the mobile links and overlay dynamically
  const style = document.createElement('style');
  style.textContent = `
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      z-index: 998;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .mobile-menu-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    .no-scroll {
      overflow: hidden;
    }
    @media (max-width: 968px) {
      .nav-links {
        position: fixed;
        top: 0;
        right: -300px;
        width: 300px;
        height: 100vh;
        background-color: #ffffff;
        box-shadow: -5px 0 25px rgba(0,0,0,0.1);
        display: flex !important;
        flex-direction: column;
        padding: 100px 32px 40px;
        gap: 24px;
        z-index: 999;
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        align-items: flex-start;
      }
      .nav-links.active {
        right: 0;
      }
      .nav-item {
        height: auto;
        width: 100%;
      }
      .mega-menu {
        position: static;
        transform: none;
        width: 100%;
        opacity: 1;
        visibility: visible;
        display: none;
        box-shadow: none;
        border: none;
        padding: 16px 0 0 16px;
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .nav-item:hover .mega-menu {
        display: block;
      }
    }
  `;
  document.head.appendChild(style);
}

/* Scroll Progress Bar */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* Scroll Reveal (Fade-up/Slide-in sections) */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once only
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });
}

/* Counter Animations */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds animation
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
