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
      button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-treatment-filter');
        buttons.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        cards.forEach((card) => {
          const categories = (card.getAttribute('data-treatment-category') || '').split(/\s+/);
          const shouldShow = filter === 'all' || categories.includes(filter);
          card.hidden = !shouldShow;
          card.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
        });
      });
    });
  });
}

function initUniversalVideoPlayers() {
  const players = document.querySelectorAll('[data-video-player]');
  if (!players.length) return;

  players.forEach((player) => {
    if (player.dataset.videoPlayerBound === 'true') return;
    player.dataset.videoPlayerBound = 'true';

    const video = player.querySelector('video');
    const button = player.querySelector('[data-play-video]');
    if (!video) return;

    video.controls = true;

    const syncState = () => {
      const isPlaying = !video.paused && !video.ended;
      player.classList.toggle('is-playing', isPlaying);
      if (button) {
        button.hidden = isPlaying;
        button.setAttribute('aria-label', isPlaying ? 'Pause video' : 'Play video');
      }
    };

    if (button) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        document.querySelectorAll('video').forEach((otherVideo) => {
          if (otherVideo !== video && !otherVideo.paused) otherVideo.pause();
        });

        if (video.paused) {
          video.play().catch(() => syncState());
        } else {
          video.pause();
        }
      });
    }

    video.addEventListener('play', syncState);
    video.addEventListener('pause', syncState);
    video.addEventListener('ended', syncState);
    syncState();
  });
}

function initDeferredTestimonialVideos() {
  const cards = document.querySelectorAll('[data-testimonial-player]');
  if (!cards.length) return;

  cards.forEach((card) => {
    if (card.dataset.testimonialBound === 'true') return;
    card.dataset.testimonialBound = 'true';

    const button = card.querySelector('[data-play-testimonial]');
    const poster = card.querySelector('.reel-poster-new');
    const source = card.dataset.videoSrc;
    if (!button || !poster || !source) return;

    const startVideo = () => {
      if (card.classList.contains('is-loading') || card.querySelector('video')) return;
      card.classList.add('is-loading');
      button.setAttribute('aria-label', 'Loading testimonial video');

      document.querySelectorAll('[data-testimonial-player] video').forEach((video) => video.pause());

      const video = document.createElement('video');
      video.className = 'reel-video-new';
      video.controls = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = source;
      video.setAttribute('aria-label', button.getAttribute('aria-label').replace('Loading ', 'Playing '));

      const showPlayer = () => {
        card.classList.remove('is-loading');
        card.classList.add('is-playing');
        button.hidden = true;
        poster.hidden = true;
      };

      video.addEventListener('playing', showPlayer, { once: true });
      video.addEventListener('error', () => {
        card.classList.remove('is-loading');
        button.setAttribute('aria-label', 'Retry testimonial video');
        button.hidden = false;
        video.remove();
      }, { once: true });
      video.addEventListener('ended', () => card.classList.remove('is-playing'));

      card.insertBefore(video, poster);
      video.play().catch(() => {
        showPlayer();
        video.controls = true;
      });
    };

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      startVideo();
    });
  });
}

function initAppointmentPopup() {
  if (document.querySelector('.appointment-popup')) return;

  document.querySelectorAll('.btn-appointment, .float-appointment-btn').forEach((trigger) => {
    trigger.setAttribute('data-open-appointment-popup', '');
    if (trigger.classList.contains('btn-appointment') && !trigger.querySelector('iconify-icon')) {
      const icon = document.createElement('iconify-icon');
      icon.setAttribute('icon', 'solar:calendar-add-bold-duotone');
      icon.setAttribute('aria-hidden', 'true');
      trigger.prepend(icon);
    }
  });

  const isTreatmentPage = document.body.classList.contains('premium-treatment-page');
  const pageHeading = document.querySelector('h1')?.textContent.trim() || '';
  const treatmentName = isTreatmentPage
    ? pageHeading.replace(/\s+in\s+Visakhapatnam.*$/i, '')
    : 'General Dental Consultation';
  const popup = document.createElement('div');
  popup.className = 'appointment-popup';
  popup.setAttribute('aria-hidden', 'true');
  popup.innerHTML = `
    <div class="appointment-popup-backdrop" data-close-appointment-popup></div>
    <section class="appointment-popup-dialog" role="dialog" aria-modal="true" aria-labelledby="appointment-popup-title">
      <button class="appointment-popup-close" type="button" data-close-appointment-popup aria-label="Close appointment form">
        <iconify-icon icon="solar:close-circle-linear" aria-hidden="true"></iconify-icon>
      </button>
      <div class="appointment-popup-intro">
        <span class="appointment-popup-icon"><iconify-icon icon="solar:calendar-mark-bold-duotone" aria-hidden="true"></iconify-icon></span>
        <div>
          <h2 id="appointment-popup-title">Book Your Appointment</h2>
          <p>Schedule a specialist dental consultation with our clinical team.</p>
        </div>
      </div>
      <div class="appointment-popup-body">
        <div class="consult-card appointment-popup-card">
          <form class="consult-form appointment-popup-form" data-email-subject="Website popup appointment request">
            <div class="form-group"><label for="popup-name">Your name</label><input id="popup-name" type="text" name="name" placeholder="Enter your full name" required></div>
            <div class="form-group"><label for="popup-phone">Phone number</label><input id="popup-phone" type="tel" name="phone" inputmode="numeric" placeholder="Enter 10-digit mobile number" required></div>
            <div class="form-group"><label for="popup-treatment">Treatment</label><select id="popup-treatment" name="service"><option>${treatmentName}</option><option>Dental Implants</option><option>Root Canal Treatment</option><option>Smile Makeover</option><option>Clear Aligners</option><option>Braces Treatment</option><option>Teeth Whitening</option><option>General Dental Consultation</option></select></div>
            <div class="form-group"><label for="popup-date">Preferred date</label><input id="popup-date" type="date" name="date"></div>
            <div class="form-group appointment-popup-message"><label for="popup-message">Brief message <span>(optional)</span></label><textarea id="popup-message" name="message" rows="3" placeholder="Tell us more about your dental concern..."></textarea></div>
            <div class="appointment-popup-actions">
              <button class="btn btn-primary appointment-popup-submit" type="submit"><iconify-icon icon="solar:calendar-add-bold-duotone" aria-hidden="true"></iconify-icon><span>Confirm Appointment</span></button>
              <button class="appointment-popup-cancel" type="button" data-close-appointment-popup>Cancel and Close</button>
              <div class="appointment-popup-security"><iconify-icon icon="solar:shield-check-bold" aria-hidden="true"></iconify-icon><span>Private and secure appointment request</span></div>
            </div>
          </form>
          <div class="form-success-message appointment-popup-success">
            <iconify-icon icon="solar:check-circle-bold-duotone" aria-hidden="true"></iconify-icon>
            <h3>Request submitted</h3><p>We will help you confirm the appointment details.</p>
          </div>
        </div>
      </div>
    </section>`;
  document.body.appendChild(popup);

  const dialog = popup.querySelector('.appointment-popup-dialog');
  const firstInput = popup.querySelector('input');
  const storageKey = `appointment-popup:${window.location.pathname}`;

  const openPopup = () => {
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('appointment-popup-open');
    window.setTimeout(() => firstInput?.focus(), 120);
  };

  const closePopup = () => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('appointment-popup-open');
    try { sessionStorage.setItem(storageKey, 'dismissed'); } catch (_) {}
  };

  document.querySelectorAll('[data-open-appointment-popup]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openPopup();
    });
  });
  popup.querySelectorAll('[data-close-appointment-popup]').forEach((trigger) => trigger.addEventListener('click', closePopup));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.classList.contains('is-open')) closePopup();
  });
  dialog.addEventListener('click', (event) => event.stopPropagation());

  if (window.Forms) window.Forms.initConsultationForm();

  let dismissed = false;
  try { dismissed = sessionStorage.getItem(storageKey) === 'dismissed'; } catch (_) {}
  if (!dismissed) window.setTimeout(openPopup, isTreatmentPage ? 5000 : 8000);
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
  initTreatmentCardFilters,
  initUniversalVideoPlayers,
  initAppointmentPopup,
  initDeferredTestimonialVideos
};
