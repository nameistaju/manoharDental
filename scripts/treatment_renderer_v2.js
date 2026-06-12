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
  return `<div class="tp-video-player"><div class="tp-video-poster">${imageOrPlaceholder(rootDir, page.image, page.title, 'tp-video-image')}<div class="tp-video-shade"></div><span class="tp-play-button" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg></span><div class="tp-video-caption"><span>Doctor Explains</span><strong>${esc(page.title)}</strong><small>2 min overview</small></div></div></div>`;
}

function resultMedia(rootDir, asset, label) {
  if (assetExists(rootDir, asset)) {
    return `<div class="ba-image" style="background-image:url('${asset}')"></div>`;
  }
  return `<div class="ba-image tp-result-placeholder"><span class="tp-placeholder-icon" aria-hidden="true">+</span><strong>${esc(label)} Image Coming Soon</strong></div>`;
}

function resultCard(rootDir, page) {
  return `<article class="premium-result-card tp-featured-result"><div class="ba-slider" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-label="Before and after ${esc(page.title)} comparison"><div class="ba-before">${resultMedia(rootDir, page.before, 'Before')}</div><div class="ba-after">${resultMedia(rootDir, page.after, 'After')}</div><span class="ba-label ba-label-before">Before</span><span class="ba-label ba-label-after">After</span><div class="ba-handle"><div class="ba-handle-line"></div><div class="ba-handle-button" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 3 12 9 6"></polyline><polyline points="15 6 21 12 15 18"></polyline></svg></div></div></div><div class="tp-result-details"><div><span>Treatment Done</span><strong>${esc(page.title)}</strong></div><div><span>Duration</span><strong>${esc(durations[page.slug] || 'Confirmed after diagnosis')}</strong></div><div><span>Patient Outcome</span><strong>Improved comfort, function, and a natural-looking smile</strong></div></div></article>`;
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

function floatingActions(depthPrefix, clinic) {
  return `<div class="premium-floating-actions-bar" aria-label="Quick contact actions"><a href="${depthPrefix}contact/index.html" class="premium-float-btn float-appointment-btn" aria-label="Book Appointment"><span class="premium-float-label">Book Appointment</span><span class="premium-float-icon-wrapper"><img src="${depthPrefix}assets/images/appointment.png" alt="" class="premium-float-png-icon"></span></a><a href="${clinic.whatsapp}" target="_blank" rel="noopener" class="premium-float-btn float-whatsapp-btn" aria-label="Consult on WhatsApp"><span class="premium-float-label">Chat with Us</span><span class="premium-float-icon-wrapper"><img src="${depthPrefix}assets/images/whatsapp.png" alt="" class="premium-float-png-icon"></span></a><a href="${clinic.phoneHref}" class="premium-float-btn float-call-btn" aria-label="Call Clinic"><span class="premium-float-label">Call Us</span><span class="premium-float-icon-wrapper"><img src="${depthPrefix}assets/images/telephone.png" alt="" class="premium-float-png-icon"></span></a></div>`;
}

function renderTreatmentPageV2({ page, treatmentPages, clinic, commonWhy, headerTemplate, footerTemplate, depthPrefix, rootDir }) {
  const cleanFooter = footerTemplate.replace(/\s*<!-- Floating Actions -->[\s\S]*?<div class="floating-actions">[\s\S]*?<\/div>\s*$/i, '');
  const treatmentLabel = /\btreatment$/i.test(page.title) ? page.title : `${page.title} Treatment`;
  const options = treatmentPages.map((t) => `<option${t.title === page.title ? ' selected' : ''}>${esc(t.title)}</option>`).join('');
  const knowledge = [
    ['What It Is', page.what[0], '01'], ['How It Works', page.what[1], '02'],
    ['Who Needs It', page.what[3], '03'], ['Expected Results', page.benefits[0]?.[1] || page.what[2], '04']
  ];
  const journey = [
    ['Consultation', page.process[0]], ['Diagnosis', page.process[1]], ['Planning', page.process[2]],
    ['Treatment', [page.process[3], page.process[4]].filter(Boolean).join(' ')],
    ['Follow-Up', page.process[5] || 'Review visits confirm healing, comfort, and maintenance.']
  ];

  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.metaTitle)}</title><meta name="description" content="${esc(page.metaDescription)}"><link rel="canonical" href="https://manohardentalvisakhapatnam.com/treatments/${page.slug}/">
  <link rel="icon" href="${depthPrefix}favicon.ico" sizes="32x32"><link rel="stylesheet" href="${depthPrefix}assets/css/main.css"><link rel="stylesheet" href="${depthPrefix}assets/css/pages.css"><link rel="stylesheet" href="${depthPrefix}assets/css/treatment-redesign.css">
</head>
<body class="premium-treatment-page tp-redesign"><div class="scroll-progress"></div>${headerTemplate}
<main>
  <section class="premium-treatment-hero tp-hero"><div class="container premium-treatment-hero-grid"><div class="premium-treatment-hero-copy"><div class="premium-kicker">${esc(treatmentLabel)}</div><h1>${esc(page.title)} in Visakhapatnam</h1><h2>${esc(page.headline)}</h2><p>${esc(page.intro)}</p><div class="premium-trust-row">${page.trust.slice(0, 4).map((item) => `<span>${esc(item)}</span>`).join('')}</div><div class="premium-hero-actions"><a class="btn btn-primary" href="#book-appointment">Book Consultation</a><a class="btn btn-outline" href="${clinic.phoneHref}">Call Now</a></div></div><div class="premium-hero-media">${videoCard(rootDir, page)}</div></div></section>

  <section class="premium-section tp-knowledge reveal"><div class="container"><div class="premium-section-heading tp-centered-heading"><div class="premium-kicker">Everything You Need To Know</div><h2>Clear answers. Confident decisions.</h2><p>A concise guide to understanding the treatment before your consultation.</p></div><div class="tp-knowledge-grid">${knowledge.map(([title, text, icon]) => `<article class="tp-knowledge-card"><span class="tp-card-icon">${icon}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></div></section>

  <section class="premium-section premium-soft-band tp-journey reveal"><div class="container"><div class="premium-section-heading"><div class="premium-kicker">Treatment Journey</div><h2>Five clear steps from consultation to follow-up.</h2></div><div class="tp-journey-track">${journey.map(([title, text], index) => `<article class="tp-journey-card"><span class="tp-step-number">0${index + 1}</span><div class="tp-step-icon" aria-hidden="true">${['C', 'D', 'P', 'T', 'F'][index]}</div><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></div></section>

  <section class="premium-section tp-results reveal"><div class="container"><div class="premium-section-heading tp-centered-heading"><div class="premium-kicker">Before &amp; After Results</div><h2>See the difference thoughtful treatment can make.</h2><p>Drag the handle to compare the treatment result. Individual outcomes vary after clinical diagnosis.</p></div>${resultCard(rootDir, page)}</div></section>

  <section class="premium-section premium-soft-band tp-why reveal"><div class="container"><div class="premium-section-heading tp-centered-heading"><div class="premium-kicker">Why Choose Manohar Dental</div><h2>Specialist care with precision and empathy.</h2></div><div class="tp-feature-grid">${commonWhy.map(([title, desc], index) => `<article class="tp-feature-card"><span class="tp-feature-icon" aria-hidden="true">${index + 1}</span><h3>${esc(title)}</h3><p>${esc(desc)}</p></article>`).join('')}</div></div></section>

  <section class="premium-section tp-faq reveal"><div class="container premium-faq-wrap"><div class="premium-section-heading"><div class="premium-kicker">Frequently Asked Questions</div><h2>Questions patients ask before ${esc(page.title.toLowerCase())}.</h2></div><div class="accordion premium-faq-accordion">${faqs(page)}</div></div></section>

  <section id="book-appointment" class="premium-section premium-booking-section tp-booking reveal"><div class="container premium-booking-grid"><div class="tp-booking-copy"><div class="premium-kicker">Book Consultation</div><h2>Take the next step toward a healthier smile.</h2><p>Meet an MDS specialist, understand your options clearly, and receive a personalized treatment plan.</p><ul class="tp-booking-benefits"><li>Specialist clinical evaluation</li><li>Digital diagnosis when required</li><li>Clear treatment and follow-up guidance</li></ul><div class="premium-clinic-hours"><strong>Call ${esc(clinic.phone)}</strong><span>${esc(clinic.timings)}</span></div><div class="tp-direct-actions"><a href="${clinic.phoneHref}" class="btn btn-outline">Call Clinic</a><a href="${clinic.whatsapp}" target="_blank" rel="noopener" class="btn tp-whatsapp-btn">WhatsApp</a></div></div><form class="premium-appointment-form consult-form"><label>Your Name<input type="text" name="name" placeholder="Enter your full name" required></label><label>Phone Number<input type="tel" name="phone" placeholder="Enter 10-digit mobile number" required></label><label>Preferred Date<input type="date" name="date" required></label><label>Treatment Selection<select name="service">${options}</select></label><label class="premium-form-wide">Message<textarea name="message" rows="3" placeholder="Tell us what you are experiencing"></textarea></label><button class="btn btn-primary premium-form-wide" type="submit">Book Consultation</button></form></div></section>
</main>
${cleanFooter}${floatingActions(depthPrefix, clinic)}
<script src="${depthPrefix}assets/js/main.js"></script><script src="${depthPrefix}assets/js/navigation.js"></script><script src="${depthPrefix}assets/js/animations.js"></script><script src="${depthPrefix}assets/js/carousel.js"></script><script src="${depthPrefix}assets/js/forms.js"></script><script src="${depthPrefix}assets/js/utilities.js"></script>
</body></html>`;
}

module.exports = { renderTreatmentPageV2 };
