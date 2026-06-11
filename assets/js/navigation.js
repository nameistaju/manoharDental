/* ==========================================================================
   MANOHAR DENTAL CLINIC - NAVIGATION SCRIPTS
   ========================================================================== */

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
  checkScroll(); // Run immediately in case of page refresh
}

function initMobileMenu() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const accordionTriggers = document.querySelectorAll('.mega-menu-trigger > .nav-link, .dropdown-trigger > .nav-link');
  
  if (!mobileBtn || !navLinks) return;

  // Create overlay for mobile drawer if it doesn't exist yet
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  const closeMenu = () => {
    mobileBtn.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    accordionTriggers.forEach(trigger => {
      trigger.parentElement.classList.remove('mobile-open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const openMenu = () => {
    mobileBtn.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll');
  };

  const toggleMenu = () => {
    const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  mobileBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  accordionTriggers.forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (event) => {
      if (window.innerWidth > 767) return;
      event.preventDefault();
      const item = trigger.parentElement;
      const isOpen = item.classList.contains('mobile-open');
      accordionTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.parentElement.classList.remove('mobile-open');
          otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('mobile-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  navLinks.querySelectorAll('a[href]:not([href="#"])').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 767) closeMenu();
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

// Export initializers
window.Navigation = {
  initStickyHeader,
  initMobileMenu
};
