/* ==========================================================================
   MANOHAR DENTAL CLINIC - UTILITIES & GALLERY SCRIPTS
   ========================================================================== */

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

function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('#main-nav .nav-link, #main-nav .mega-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && (currentPath === href || currentPath.endsWith(href))) {
      link.classList.add('active');
      // Highlight parent trigger if in mega menu
      const parentTrigger = link.closest('.mega-menu-trigger');
      if (parentTrigger) {
        parentTrigger.querySelector('.nav-link').classList.add('active');
      }
    }
  });
}

function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (filterButtons.length === 0 || galleryItems.length === 0) return;

  // Category Filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
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

  // Lightbox Modal
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

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    window.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    });
  }
}

function initDoctorBioModal() {
  const bioModal = document.getElementById('doctor-bio-modal');
  const bioButtons = document.querySelectorAll('.show-bio-btn');
  const closeBtn = document.getElementById('bio-modal-close');

  if (!bioModal) return;

  const modalImg = document.getElementById('bio-modal-img');
  const modalName = document.getElementById('bio-modal-name');
  const modalTagline = document.getElementById('bio-modal-tagline');
  const modalBio = document.getElementById('bio-modal-bio');

  bioButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.getAttribute('data-name');
      const tagline = btn.getAttribute('data-tagline');
      const bio = btn.getAttribute('data-bio');
      const image = btn.getAttribute('data-image');

      if (modalImg) modalImg.src = image;
      if (modalImg) modalImg.alt = name;
      if (modalName) modalName.textContent = name;
      if (modalTagline) modalTagline.textContent = tagline;
      if (modalBio) modalBio.textContent = bio;

      bioModal.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  });

  const closeModal = () => {
    bioModal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  bioModal.addEventListener('click', (e) => {
    if (e.target === bioModal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bioModal.classList.contains('active')) {
      closeModal();
    }
  });
}

function initHeroVideoPlayer() {
  const trigger = document.getElementById('hero-play-trigger');
  const videoEl = document.getElementById('hero-video-el');
  const card = trigger ? trigger.closest('.hero-video-card') : null;

  if (!trigger || !videoEl || !card) return;

  trigger.addEventListener('click', () => {
    card.classList.add('playing');
    videoEl.style.display = 'block';
    videoEl.muted = false;
    videoEl.controls = true;
    videoEl.play();
  });
}

function initVideoReels() {
  const videos = document.querySelectorAll('.reel-video');
  videos.forEach(video => {
    // Optional click behavior
    video.addEventListener('click', () => {
      if (video.paused) {
        // Pause all other reels first
        videos.forEach(v => {
          if (v !== video) v.pause();
        });
        video.play();
      } else {
        video.pause();
      }
    });
  });
}

function initTreatmentVideoPreviews() {
  const cards = document.querySelectorAll('.treatment-card');
  cards.forEach(card => {
    const video = card.querySelector('.treatment-preview-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(err => {
        console.log("Treatment video autoplay blocked or failed:", err);
      });
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
}

function initTreatmentExplorer() {
  const explorer = document.querySelector('.treatments-explorer');
  if (!explorer) return;

  const items = explorer.querySelectorAll('.explorer-item');
  const video = explorer.querySelector('.explorer-video');
  const badge = explorer.querySelector('.explorer-badge');
  const title = explorer.querySelector('.explorer-title');
  const desc = explorer.querySelector('.explorer-desc');
  const learnLink = explorer.querySelector('.explorer-btn');
  const progressFill = explorer.querySelector('.explorer-progress-fill');

  if (items.length === 0) return;

  let currentIndex = 0;
  let rotationTimer = null;
  let progressTimer = null;
  let isHovered = false;
  const rotationDuration = 7000; // 7 seconds
  let startTime = 0;
  let elapsedBeforePause = 0;

  const updateShowcase = (item) => {
    // Highlight active item
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Read attributes
    const targetTitle = item.getAttribute('data-title');
    const targetCategory = item.getAttribute('data-category');
    const targetDesc = item.getAttribute('data-desc');
    const targetVideo = item.getAttribute('data-video');
    const targetLink = item.getAttribute('data-link');

    // Fade content out/in
    const contentBox = explorer.querySelector('.explorer-content');
    if (contentBox) {
      contentBox.style.opacity = '0.3';
      contentBox.style.transition = 'opacity 0.2s ease';
    }

    setTimeout(() => {
      if (video) {
        video.src = targetVideo;
        video.play().catch(e => console.log("Explorer video autoplay blocked:", e));
      }
      if (badge) badge.textContent = targetCategory;
      if (title) title.textContent = targetTitle;
      if (desc) desc.textContent = targetDesc;
      if (learnLink) learnLink.setAttribute('href', targetLink);

      if (contentBox) {
        contentBox.style.opacity = '1';
      }
    }, 200);

    // Reset progress fill
    resetProgressBar();
  };

  const resetProgressBar = () => {
    clearInterval(progressTimer);
    if (progressFill) progressFill.style.width = '0%';
    if (isHovered) return;

    startTime = Date.now();
    elapsedBeforePause = 0;
    
    progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime + elapsedBeforePause;
      const percent = Math.min((elapsed / rotationDuration) * 100, 100);
      if (progressFill) progressFill.style.width = percent + '%';
      if (percent >= 100) {
        clearInterval(progressTimer);
        advanceRotation();
      }
    }, 100);
  };

  const startRotation = () => {
    resetProgressBar();
  };

  const stopRotation = () => {
    clearInterval(progressTimer);
    elapsedBeforePause += Date.now() - startTime;
  };

  const advanceRotation = () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateShowcase(items[currentIndex]);
  };

  // Click handler
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentIndex = index;
      updateShowcase(item);
    });
  });

  // Hover handlers
  explorer.addEventListener('mouseenter', () => {
    isHovered = true;
    stopRotation();
  });

  explorer.addEventListener('mouseleave', () => {
    isHovered = false;
    startTime = Date.now();
    resetProgressBar();
  });

  // Init first item
  updateShowcase(items[0]);
  startRotation();
}

function initVideoTestimonialSwitcher() {
  const container = document.querySelector('.testimonials-video-funnel');
  if (!container) return;

  const thumbs = container.querySelectorAll('.testimonial-thumb');
  const mainVideo = container.querySelector('#testimonial-main-video');
  const titleEl = container.querySelector('.testimonial-player-text');
  const authorEl = container.querySelector('.testimonial-player-author');
  const playBtn = container.querySelector('.testimonial-player-play-btn');
  const overlay = container.querySelector('.testimonial-player-overlay');

  if (thumbs.length === 0 || !mainVideo) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const videoSrc = thumb.getAttribute('data-video');
      const reviewText = thumb.getAttribute('data-review');
      const author = thumb.getAttribute('data-author');

      // Swap main video source
      mainVideo.src = videoSrc;
      mainVideo.load();
      
      // Update text
      if (titleEl) titleEl.textContent = reviewText;
      if (authorEl) authorEl.textContent = author;

      // Show overlay and play button again
      if (overlay) overlay.classList.remove('hide');
      if (playBtn) playBtn.style.display = 'flex';
    });
  });

  const startPlayback = () => {
    if (mainVideo.paused) {
      mainVideo.play();
      if (playBtn) playBtn.style.display = 'none';
      if (overlay) overlay.classList.add('hide');
    } else {
      mainVideo.pause();
      if (playBtn) playBtn.style.display = 'flex';
      if (overlay) overlay.classList.remove('hide');
    }
  };

  if (playBtn) {
    playBtn.addEventListener('click', startPlayback);
  }

  mainVideo.addEventListener('click', startPlayback);
}

function initTreatmentCardFilters() {
  const filterGroups = document.querySelectorAll('.treatment-filter');
  if (!filterGroups.length) return;

  filterGroups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-treatment-filter]');
    const section = group.closest('section') || document;
    const cards = section.querySelectorAll('[data-treatment-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-treatment-filter');
        buttons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');

        cards.forEach((card) => {
          const categories = (card.getAttribute('data-treatment-category') || '').split(/\s+/);
          const shouldShow = filter === 'all' || categories.includes(filter);
          card.hidden = !shouldShow;
        });
      });
    });
  });
}

// Export initializers
window.Utilities = {
  initScrollProgress,
  initActiveNavLink,
  initGalleryFilter,
  initDoctorBioModal,
  initHeroVideoPlayer,
  initVideoReels,
  initTreatmentVideoPreviews,
  initTreatmentExplorer,
  initVideoTestimonialSwitcher,
  initTreatmentCardFilters
};
