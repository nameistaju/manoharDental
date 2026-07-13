/* ==========================================================================
   VASANTHA DENTAL CLINIC - UTILITY SCRIPTS
   ========================================================================== */

// 1. Scroll Progress Bar
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight > 0) {
      const scrollPct = (window.scrollY / scrollHeight) * 100;
      progressBar.style.width = `${scrollPct}%`;
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
}


// 3. Gallery Lightbox Modal
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImg || galleryItems.length === 0) return;

  galleryItems.forEach(item => {
    // Inject hover overlay dynamically
    const img = item.querySelector('img');
    const title = img ? img.getAttribute('alt') : 'Clinic Gallery';
    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
      <h4 class="gallery-overlay-title">📷 ${title}</h4>
      <span class="gallery-overlay-text">Click to View</span>
    `;
    item.appendChild(overlay);

    item.addEventListener('click', () => {
      const imgSrc = item.getAttribute('data-src');
      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// Export initializers
window.Utilities = {
  initScrollProgress,
  initLightbox
};
