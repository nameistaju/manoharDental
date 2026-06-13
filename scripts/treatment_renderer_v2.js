const fs = require('fs');
const path = require('path');

const durations = {
  'dental-implants': '2-4 months in most staged cases',
  dentures: '2-4 appointments',
  'teeth-whitening': 'One clinical visit',
  'smile-makeover': '1-4 weeks depending on the plan',
  'dental-fillings': 'Usually one visit',
  'preventive-dentistry': '30-60 minutes',
  'root-canal-treatment': '1-2 visits in most cases',
  'clear-aligners': 'Typically 6-18 months',
  braces: 'Typically 12-24 months',
  'wisdom-tooth-removal': 'One surgical visit',
  'gum-treatment': 'Phased according to gum health',
  'pediatric-dentistry': 'Planned around the child\'s needs'
};

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function assetExists(rootDir, assetPath) {
  return Boolean(assetPath) && fs.existsSync(path.join(rootDir, assetPath.replace(/^\//, '')));
}

function imageOrPlaceholder(rootDir, image, alt, className = '') {
  if (assetExists(rootDir, image)) {
    return `<img src="${image}" alt="${esc(alt)}" class="${className}">`;
  }
  return `<div class="tp-image-placeholder ${className}" role="img" aria-label="${esc(alt)} coming soon"><span class="tp-placeholder-icon" aria-hidden="true">+</span><strong>Image Coming Soon</strong><small>${esc(alt)}</small></div>`;
}

function videoCard(rootDir, page) {
  const poster = assetExists(rootDir, page.image) ? ` poster="${page.image}"` : '';
  return `<div class="tp-video-player" data-video-player><video class="tp-hero-video" src="/assets/videos/video-placeholder.mp4"${poster} preload="metadata" playsinline controls></video><div class="tp-video-shade"></div><button class="tp-play-button" type="button" data-play-video aria-label="Play ${esc(page.title)} video"><iconify-icon icon="solar:play-bold" aria-hidden="true"></iconify-icon></button><div class="tp-video-caption"><span>Doctor Explains</span><strong>${esc(page.title)}</strong><small>Video overview</small></div></div>`;
}

function resultMedia(rootDir, asset, label, depthPrefix) {
  if (assetExists(rootDir, asset)) {
    const relativeAsset = `${depthPrefix}${asset.replace(/^\//, '')}`;
    return `<div class="ba-image" style="background-image:url('${relativeAsset}')"></div>`;
  }
  return `<div class="ba-image tp-result-placeholder"><span class="tp-placeholder-icon" aria-hidden="true">+</span><strong>${esc(label)} Image Coming Soon</strong></div>`;
}

function resultCard(rootDir, page, depthPrefix) {
  return `<article class="premium-result-card tp-featured-result"><div class="ba-slider tp-standard-slider" data-treatment-comparison tabindex="0" role="slider" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-label="Before and after ${esc(page.title)} comparison"><div class="ba-before">${resultMedia(rootDir, page.before, 'Before', depthPrefix)}</div><div class="ba-after">${resultMedia(rootDir, page.after, 'After', depthPrefix)}</div><span class="ba-label ba-label-before">Before</span><span class="ba-label ba-label-after">After</span><div class="ba-handle"><div class="ba-handle-line"></div><div class="ba-handle-button" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 3 12 9 6"></polyline><polyline points="15 6 21 12 15 18"></polyline></svg></div></div></div><div class="tp-result-details"><div><span>Treatment Done</span><strong>${esc(page.title)}</strong></div><div><span>Duration</span><strong>${esc(durations[page.slug] || 'Confirmed after diagnosis')}</strong></div><div><span>Patient Outcome</span><strong>Improved comfort, function, and a natural-looking smile</strong></div></div></article>`;
}

function faqAnswer(title, index) {
  const answers = [
    `${title} is recommended after a clinical examination because symptoms, imaging, bite forces, and gum health affect the right plan.`,
    'Most patients remain comfortable when treatment is carefully planned and appropriate anesthesia or sensitivity control is used.',
    'The timeline depends on complexity, healing, appointment discipline, and whether supporting procedures are needed.',
    'The dentist explains suitable alternatives, realistic outcomes, and maintenance before treatment begins.',
    'Good brushing, cleaning between teeth, and review visits are important for protecting the result.',
    'Share existing medical conditions and medicines during consultation so care can be planned safely.',
    'Results are designed to look natural and function comfortably rather than appear over-treated.',
    'Contact the clinic if pain, swelling, bite discomfort, looseness, or unusual sensitivity continues.'
  ];
  return answers[index % answers.length];
}

function faqs(page) {
  return page.faqs.slice(0, 8).map((question, index) => `<div class="accordion-item"><button class="accordion-header" type="button"><h4>${esc(question)}</h4><div class="accordion-icon">+</div></button><div class="accordion-content"><div class="accordion-content-inner">${esc(faqAnswer(page.title, index))}</div></div></div>`).join('');
}

function renderNavChips(currentPageSlug, treatmentPages) {
  return treatmentPages.map((t) => {
    const isActive = t.slug === currentPageSlug;
    let label = t.title;
    if (t.slug === 'root-canal-treatment') label = 'Root Canal';
    if (t.slug === 'braces-treatment') label = 'Braces';
    if (t.slug === 'dentures') label = 'Dentures';
    if (t.slug === 'teeth-whitening') label = 'Teeth Whitening';
    if (t.slug === 'wisdom-tooth-removal') label = 'Wisdom Tooth';
    if (t.slug === 'pediatric-dentistry') label = 'Pediatric Care';
    if (t.slug === 'preventive-dentistry') label = 'Preventive Care';
    if (t.slug === 'smile-makeover') label = 'Smile Makeover';
    
    return `<a href="/treatments/${t.slug}/" class="tp-nav-chip${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  }).join('');
}

function patientSymptoms(page) {
  const candidates = [
    ...(page.symptoms || []).map((item) => Array.isArray(item) ? item[0] : item),
    ...(page.risks || []).map((item) => Array.isArray(item) ? item[0] : item),
    ...(page.whoBenefits || [])
  ];
  const unique = [];

  candidates.forEach((item) => {
    const value = String(item || '').trim();
    if (value && !unique.some((entry) => entry.toLowerCase() === value.toLowerCase())) {
      unique.push(value);
    }
  });

  return unique.slice(0, 5);
}

function recoveryRoadmap(page) {
  const firstAftercare = page.aftercare && page.aftercare[0];
  const recovery = Array.isArray(firstAftercare) ? firstAftercare[1] : firstAftercare;

  return [
    ['Consultation', page.process[0], 'solar:chat-round-check-bold-duotone'],
    ['Diagnosis / Scan', page.process[1], 'solar:scanner-bold-duotone'],
    ['Treatment', page.process[3] || page.process[2], 'solar:medical-kit-bold-duotone'],
    ['Recovery', recovery || page.process[4] || 'Personalized aftercare supports comfortable healing.', 'solar:heart-pulse-2-bold-duotone'],
    ['Results', page.process[5] || page.process[4] || 'Review visits confirm comfort, function, and maintenance.', 'solar:stars-minimalistic-bold-duotone']
  ];
}

function renderTreatmentPageV2({ page, treatmentPages, clinic, commonWhy, headerTemplate, footerTemplate, depthPrefix, rootDir }) {
  const options = treatmentPages.map((t) => `<option${t.title === page.title ? ' selected' : ''}>${esc(t.title)}</option>`).join('');

  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.metaTitle)}</title><meta name="description" content="${esc(page.metaDescription)}"><link rel="canonical" href="https://manohardentalvisakhapatnam.com/treatments/${page.slug}/">
  <link rel="icon" href="${depthPrefix}favicon.ico" sizes="32x32"><link rel="stylesheet" href="${depthPrefix}assets/css/main.css"><link rel="stylesheet" href="${depthPrefix}assets/css/pages.css"><link rel="stylesheet" href="${depthPrefix}assets/css/treatment-redesign.css">
</head>
<body class="premium-treatment-page tp-redesign"><div class="scroll-progress"></div>${headerTemplate}
<main>
  <section class="premium-treatment-hero tp-hero">
    <div class="container premium-treatment-hero-grid">
      <div class="premium-treatment-hero-copy">
        <div class="tp-breadcrumbs" aria-label="Breadcrumb">
          <a href="/index.html">Home</a> / <a href="/treatments">Treatments</a> / <span>${esc(page.title)}</span>
        </div>
        <h1>${esc(page.heroHeadline)}</h1>
        <h2>${esc(page.heroSupporting)}</h2>
        <p>${esc(page.heroIntro)}</p>
        
        <div class="premium-hero-actions">
          <a class="btn btn-primary" href="#book-appointment" data-open-appointment-popup>
            <iconify-icon icon="solar:calendar-add-bold-duotone" aria-hidden="true"></iconify-icon>
            <span>Book Consultation</span>
          </a>
          <a class="btn btn-outline" href="${clinic.phoneHref}">
            <iconify-icon icon="solar:phone-calling-rounded-bold-duotone" aria-hidden="true"></iconify-icon>
            <span>${esc(clinic.phone)}</span>
          </a>
        </div>

        <!-- Large Screen Optimization: Benefits Checklist -->
        <div class="premium-hero-checklist">
          <div class="checklist-item">
            <span class="checklist-icon">✓</span>
            <span class="checklist-text">Minimally Invasive Procedure</span>
          </div>
          <div class="checklist-item">
            <span class="checklist-icon">✓</span>
            <span class="checklist-text">Faster Recovery Time</span>
          </div>
          <div class="checklist-item">
            <span class="checklist-icon">✓</span>
            <span class="checklist-text">Experienced Specialists</span>
          </div>
          <div class="checklist-item">
            <span class="checklist-icon">✓</span>
            <span class="checklist-text">Advanced Technology</span>
          </div>
        </div>
      </div>
      <div class="premium-hero-media">
        ${videoCard(rootDir, page)}
      </div>
    </div>
  </section>

  <!-- EXPLORE OTHER TREATMENTS Navigation chips bar -->
  <section class="tp-nav-section">
    <div class="container">
      <span class="tp-nav-label">Explore Other Treatments</span>
      <div class="tp-nav-chips-container">
        <div class="tp-nav-chips">
          ${renderNavChips(page.slug, treatmentPages)}
        </div>
      </div>
    </div>
  </section>

  <!-- PATIENT GUIDE: Symptoms and Recovery Roadmap -->
  <section class="premium-section tp-patient-guide reveal">
    <div class="container">
      <div class="tp-guide-heading">
        <div class="premium-kicker">Patient Guide</div>
        <h2>Is This Treatment Right For You?</h2>
        <p class="tp-guide-subtext">Recognize common warning signs and understand the care path from consultation to results.</p>
      </div>
      <div class="tp-patient-experience">
        <div class="tp-symptom-panel">
          <div class="tp-guide-panel-heading">
            <span class="tp-guide-icon"><iconify-icon icon="solar:health-bold-duotone" aria-hidden="true"></iconify-icon></span>
            <div><small>Common Symptoms</small><h3>Signals worth discussing</h3></div>
          </div>
          <ul class="tp-symptom-list">
            ${patientSymptoms(page).map((item) => `<li><span class="tp-symptom-check" aria-hidden="true"><iconify-icon icon="solar:check-circle-bold"></iconify-icon></span><strong>${esc(item)}</strong></li>`).join('')}
          </ul>
          <p class="tp-guide-note"><iconify-icon icon="solar:info-circle-linear" aria-hidden="true"></iconify-icon> A clinical examination confirms whether this treatment is appropriate for you.</p>
        </div>
        <div class="tp-roadmap-panel">
          <div class="tp-guide-panel-heading">
            <span class="tp-guide-icon"><iconify-icon icon="solar:map-arrow-up-bold-duotone" aria-hidden="true"></iconify-icon></span>
            <div><small>Recovery Roadmap</small><h3>Your path through care</h3></div>
          </div>
          <ol class="tp-recovery-roadmap">
            ${recoveryRoadmap(page).map(([title, desc, icon]) => `<li><span class="tp-roadmap-node"><iconify-icon icon="${icon}" aria-hidden="true"></iconify-icon></span><div><strong>${esc(title)}</strong><p>${esc(desc)}</p></div></li>`).join('')}
          </ol>
        </div>
      </div>
    </div>
  </section>

  <!-- Before & After Results -->
  <section class="premium-section tp-results reveal"><div class="container"><div class="premium-section-heading tp-centered-heading"><div class="premium-kicker">Before &amp; After Results</div><h2>See the difference thoughtful treatment can make.</h2><p>Drag the handle to compare the treatment result. Individual outcomes vary after clinical diagnosis.</p></div>${resultCard(rootDir, page, depthPrefix)}</div></section>

  <!-- Why Choose Manohar Dental -->
  <section class="premium-section tp-why tp-trust-section reveal">
    <div class="container tp-trust-layout">
      <div class="tp-trust-visual">
        <img src="${depthPrefix}assets/images/why-choose-us-treatment1.jpg" alt="Dr. Srinivas Manohar providing specialist dental care at Manohar Dental" width="1920" height="1080" loading="lazy" decoding="async">
        <div class="tp-trust-photo-label"><span>Specialist-led care</span><strong>Manohar Dental</strong></div>
      </div>
      <div class="tp-trust-content">
        <div class="premium-kicker">Specialist-Led Dentistry</div>
        <h2>Why Choose Manohar Dental?</h2>
        <p class="tp-trust-intro">Combining specialist expertise, advanced technology, and personalized care to deliver comfortable, predictable, and long-lasting dental outcomes.</p>
        <div class="tp-trust-points">
          ${commonWhy.map(([title, desc]) => `<article class="tp-trust-point"><span class="tp-trust-check" aria-hidden="true"><iconify-icon icon="solar:check-circle-bold"></iconify-icon></span><div><h3>${esc(title)}</h3><p>${esc(desc)}</p></div></article>`).join('')}
        </div>
      </div>
    </div>
  </section>

  <!-- FAQs -->
  <section class="premium-section tp-faq reveal"><div class="container premium-faq-wrap"><div class="premium-section-heading"><div class="premium-kicker">Frequently Asked Questions</div><h2>Questions patients ask before ${esc(page.title.toLowerCase())}.</h2></div><div class="accordion premium-faq-accordion">${faqs(page)}</div></div></section>

  <!-- Booking Section -->
  <section id="book-appointment" class="premium-section premium-booking-section tp-booking reveal"><div class="container premium-booking-grid"><div class="tp-booking-copy"><div class="premium-kicker">Book Consultation</div><h2>Take the next step toward a healthier smile.</h2><p>Meet an MDS specialist, understand your options clearly, and receive a personalized treatment plan.</p><ul class="tp-booking-benefits"><li>Specialist clinical evaluation</li><li>Digital diagnosis when required</li><li>Clear treatment and follow-up guidance</li></ul><div class="premium-clinic-hours"><strong>Call ${esc(clinic.phone)}</strong><span>${esc(clinic.timings)}</span></div><div class="tp-direct-actions"><a href="${clinic.phoneHref}" class="btn btn-outline">Call Clinic</a><a href="${clinic.whatsapp}" target="_blank" rel="noopener" class="btn tp-whatsapp-btn">WhatsApp</a></div></div><form class="premium-appointment-form consult-form"><label>Your Name<input type="text" name="name" placeholder="Enter your full name" required></label><label>Phone Number<input type="tel" name="phone" placeholder="Enter 10-digit mobile number" required></label><label>Preferred Date<input type="date" name="date" required></label><label>Treatment Selection<select name="service">${options}</select></label><label class="premium-form-wide">Message<textarea name="message" rows="3" placeholder="Tell us what you are experiencing"></textarea></label><button class="btn btn-primary premium-form-wide" type="submit">Book Consultation</button></form></div></section>
</main>
${footerTemplate}
<script src="${depthPrefix}assets/js/main.js"></script><script src="${depthPrefix}assets/js/navigation.js"></script><script src="${depthPrefix}assets/js/animations.js"></script><script src="${depthPrefix}assets/js/carousel.js"></script><script src="${depthPrefix}assets/js/forms.js"></script><script src="${depthPrefix}assets/js/utilities.js"></script>
</body></html>`;
}

module.exports = { renderTreatmentPageV2 };
