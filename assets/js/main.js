/* ==========================================================================
   MANOHAR DENTAL CLINIC - MAIN ENTRY SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Init
  if (window.Navigation) {
    window.Navigation.initStickyHeader();
    window.Navigation.initMobileMenu();
    window.Navigation.initSmoothScroll();
  }

  // Animations Init
  if (window.Animations) {
    window.Animations.initScrollReveal();
    window.Animations.initCounters();
  }

  // Carousel & Accordion Init
  if (window.Carousel) {
    window.Carousel.initBeforeAfterSlider();
    window.Carousel.initTestimonialCarousel();
    window.Carousel.initHeroDoctorSlider();
    window.Carousel.initTestimonialPremiumSlider();
    window.Carousel.initAccordion();
  }

  // Forms Init
  if (window.Forms) {
    window.Forms.initConsultationForm();
  }

  // Utilities Init
  if (window.Utilities) {
    window.Utilities.initScrollProgress();
    window.Utilities.initActiveNavLink();
    window.Utilities.initGalleryFilter();
    window.Utilities.initDoctorBioModal();
    window.Utilities.initHeroVideoPlayer();
    window.Utilities.initVideoReels();
    window.Utilities.initTreatmentVideoPreviews();
    window.Utilities.initTreatmentExplorer();
    window.Utilities.initVideoTestimonialSwitcher();
    window.Utilities.initTreatmentCardFilters();
    window.Utilities.initUniversalVideoPlayers();
    window.Utilities.initAppointmentPopup();
    window.Utilities.initDeferredTestimonialVideos();
  }
  
  console.log('Manohar Dental Clinic app initialized successfully.');
});
