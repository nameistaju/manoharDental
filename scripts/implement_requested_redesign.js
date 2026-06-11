const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const write = (file, text) => fs.writeFileSync(path.join(ROOT, file), text);
const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let index = read('index.html');

const hero = `  <!-- ===========================
       HERO SECTION
       =========================== -->
  <section class="hero-section" id="home">
    <div class="container">
      <div class="hero-split hero-video-layout">
        <div class="hero-left">
          <div class="hero-badge"><div class="hero-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><span class="hero-badge-text">466+ Google Reviews | 4.9 Rating</span></div>
          <h1 class="hero-title">Visakhapatnam's Most<br><span>Trusted Dental Clinic</span></h1>
          <p class="hero-subtitle">Advanced implantology, laser dentistry, and cosmetic smile design by MDS specialists with 15+ years of clinical excellence.</p>
          <div class="hero-trust-indicators">
            <div class="trust-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><span>15+ Years Experience</span></div>
            <div class="trust-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><span>MDS Specialists</span></div>
            <div class="trust-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><span>Pain-Free Treatments</span></div>
            <div class="trust-item"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg><span>10,000+ Happy Patients</span></div>
          </div>
          <div class="hero-booking-card">
            <div class="hero-booking-card-title"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>Book a Free Consultation</div>
            <div class="hero-booking-form-grid">
              <div class="form-group"><label class="form-label">Your Name</label><input type="text" class="form-control" placeholder="Full Name" id="hero-name"></div>
              <div class="form-group"><label class="form-label">Phone Number</label><input type="tel" class="form-control" placeholder="+91 XXXXX XXXXX" id="hero-phone"></div>
              <div class="form-group"><label class="form-label">Treatment</label><select class="form-control" id="hero-treatment"><option value="">Select Treatment</option><option>Dental Implants</option><option>Root Canal</option><option>Smile Makeover</option><option>Clear Aligners</option><option>Braces</option><option>Teeth Whitening</option><option>Wisdom Tooth</option><option>General Checkup</option></select></div>
              <div class="form-group"><label class="form-label">Preferred Date</label><input type="date" class="form-control" id="hero-date"></div>
              <button class="hero-booking-btn" id="hero-submit-btn" onclick="submitHeroForm()">Confirm Appointment &rarr;</button>
            </div>
          </div>
        </div>
        <div class="hero-right hero-video-panel">
          <div class="hero-video-card" data-video-card>
            <video class="hero-video" src="assets/videos/video-placeholder.mp4" poster="assets/images/clinic/op-area.jpg" preload="metadata" playsinline></video>
            <button class="video-play-button hero-video-play" type="button" aria-label="Play clinic tour" data-play-video><span></span></button>
            <div class="hero-video-caption"><div><span class="video-kicker">Clinic Tour</span><h3>Modern dental care, calmly explained</h3></div><span class="video-duration">0:39</span></div>
          </div>
          <div class="hero-video-stats"><div><strong>4.9</strong><span>Google rating</span></div><div><strong>466+</strong><span>Reviews</span></div><div><strong>MDS</strong><span>Specialists</span></div></div>
        </div>
      </div>
    </div>
  </section>`;

const treatmentCards = [
  ['dental_implant_testimonial.mp4', 'assets/images/treatments/implants.jpg', 'Teeth Replacement', 'Dental Implants', 'Permanent, natural-looking replacements planned with digital scans and specialist prosthodontic care.', 'dental-implants'],
  ['root_canal_testimonial.mp4', 'assets/images/gallery/box-1.jpg', 'Endodontics', 'Root Canal Treatment', 'Comfort-first tooth-saving care using precise cleaning, shaping, sealing, and long-lasting restorations.', 'root-canal-treatment'],
  ['clinic_tour_testimonial.mp4', 'assets/images/treatments/smile-makeover.jpg', 'Cosmetic Dentistry', 'Smile Makeover', 'Balanced smile design with whitening, veneers, bonding, crowns, and gum contouring where needed.', 'smile-makeover'],
  ['general_dental_review.mp4', 'assets/images/clinic/op-area.jpg', 'Orthodontics', 'Clear Aligners', 'Discreet removable aligners for crowding, spacing, and bite improvements with predictable planning.', 'clear-aligners'],
  ['video-placeholder.mp4', 'assets/images/clinic/chair.jpg', 'Oral Surgery', 'Wisdom Tooth Removal', 'Gentle assessment and removal of painful or impacted third molars with clear aftercare guidance.', 'wisdom-tooth-removal'],
  ['clinic_tour_testimonial.mp4', 'assets/images/treatments/general-dentistry.jpg', 'Alignment', 'Braces Treatment', 'Metal, ceramic, and corrective orthodontic options for children, teens, and adults.', 'braces']
];

const treatments = `  <!-- ===========================
       FEATURED TREATMENTS
       =========================== -->
  <section class="section-padding signature-section" id="treatments">
    <div class="container">
      <div class="section-heading clean-heading"><p>Expert Care</p><h2>Our Signature Treatments</h2><span>Focused dental care for implants, root canals, cosmetic smiles, orthodontics, and everyday oral health.</span></div>
      <div class="signature-grid">
        ${treatmentCards.map(([video, poster, tag, title, desc, slug]) => `<article class="signature-card"><div class="signature-video"><video src="assets/videos/${video}" poster="${poster}" preload="metadata" muted playsinline></video><button class="video-play-button" type="button" data-play-video aria-label="Play ${esc(title)} video"><span></span></button><small>${tag}</small></div><div class="signature-content"><h3>${title}</h3><p>${desc}</p><a href="treatments/${slug}/index.html">Explore treatment &rarr;</a></div></article>`).join('\n        ')}
      </div>
      <div class="text-center signature-action"><a href="treatments/index.html" class="btn btn-outline">View All Treatments</a></div>
    </div>
  </section>`;

const beforeAfterVideos = `  <!-- ===========================
       BEFORE AFTER RESULTS
       =========================== -->
  <section class="section-padding before-after-home" id="before-after-results">
    <div class="container">
      <div class="section-heading clean-heading"><p>Before / After</p><h2>Real Smile Transformations</h2><span>Simple visual proof from implant, aligner, and smile makeover cases treated at the clinic.</span></div>
      <div class="before-after-strip">
        ${[
          ['Dental_Implant_Befor.png', 'Dental_Implant_after.png', 'Dental Implants', 'Fixed replacement for missing teeth with restored bite support.'],
          ['alinerBefore.png', 'alinersAfter.png', 'Clear Aligners', 'Improved arch alignment with removable transparent trays.'],
          ['smile_makeover_before.png', 'smile_makeover_after.png', 'Smile Makeover', 'Natural-looking cosmetic improvement for a brighter smile line.'],
          ['root_canal_before.png', 'root_canal_after.png', 'Root Canal', 'Saved tooth structure restored with clean, stable function.']
        ].map(([before, after, title, desc]) => `<article class="before-after-card"><div class="before-after-images"><div><img src="assets/images/${before}" alt="${title} before result"><span>Before</span></div><div><img src="assets/images/${after}" alt="${title} after result"><span>After</span></div></div><h3>${title}</h3><p>${desc}</p></article>`).join('\n        ')}
      </div>
      <div class="text-center signature-action"><a href="results/index.html" class="btn btn-primary">See More Results</a></div>
    </div>
  </section>

  <!-- ===========================
       TESTIMONIAL VIDEOS
       =========================== -->
  <section class="section-padding video-testimonials-section" id="testimonial-videos">
    <div class="container">
      <div class="section-heading clean-heading"><p>Video Testimonials</p><h2>Patients In Their Own Words</h2><span>Four short patient videos displayed as clean reel-style cards.</span></div>
      <div class="reels-row">
        ${[
          ['dental_implant_testimonial.mp4', 'assets/images/testimonials/happy-client.jpg', 'Implant Story', 'Dental Implants'],
          ['root_canal_testimonial.mp4', 'assets/images/clinic/chair.jpg', 'Pain-Free Care', 'Root Canal'],
          ['clinic_tour_testimonial.mp4', 'assets/images/clinic/op-area.jpg', 'Clinic Experience', 'Comfort & Care'],
          ['general_dental_review.mp4', 'assets/images/treatments/general-dentistry.jpg', 'Family Review', 'General Dentistry']
        ].map(([video, poster, title, sub]) => `<article class="reel-card"><video src="assets/videos/${video}" poster="${poster}" preload="metadata" playsinline></video><button class="video-play-button" type="button" data-play-video aria-label="Play ${esc(title)} testimonial"><span></span></button><div class="reel-label"><strong>${title}</strong><span>${sub}</span></div></article>`).join('\n        ')}
      </div>
    </div>
  </section>`;

const heroStart = index.indexOf('  <!-- ===========================\n       HERO SECTION');
const heroEnd = index.indexOf('<!-- ===========================\n     PREMIUM TRUST BAR');
if (heroStart !== -1 && heroEnd !== -1 && heroEnd > heroStart) {
  index = `${index.slice(0, heroStart)}${hero}\n\n${index.slice(heroEnd)}`;
}
index = index.replace(/  <!-- ===========================\r?\n       FEATURED TREATMENTS[\s\S]*?  <!-- ===========================\r?\n       DENTAL CARE PROCESS/, `${treatments}\n\n  <!-- ===========================\n       DENTAL CARE PROCESS`);
const baStart = index.search(/  <!-- ===========================\r?\n       BEFORE AFTER RESULTS/);
const testimonialsStart = index.search(/  <!-- ===========================\r?\n       TESTIMONIALS/);
if (baStart !== -1 && testimonialsStart !== -1 && testimonialsStart > baStart) {
  index = index.slice(0, baStart) + index.slice(testimonialsStart);
}
index = index.replace(/  <!-- ===========================\r?\n       TESTIMONIALS/, `${beforeAfterVideos}\n\n  <!-- ===========================\n       TESTIMONIALS`);

const videoScript = `
    document.querySelectorAll('[data-play-video]').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('[data-video-card], .signature-video, .reel-card');
        const video = card ? card.querySelector('video') : null;
        if (!video) return;
        document.querySelectorAll('video').forEach((other) => {
          if (other !== video) {
            other.pause();
            const otherCard = other.closest('[data-video-card], .signature-video, .reel-card');
            if (otherCard) otherCard.classList.remove('is-playing');
          }
        });
        if (video.paused) {
          video.controls = true;
          video.play();
          card.classList.add('is-playing');
        } else {
          video.pause();
          card.classList.remove('is-playing');
        }
      });
    });`;

if (!index.includes("document.querySelectorAll('[data-play-video]')")) {
  index = index.replace(/\n\s*\/\/ Hero form submit/, `\n${videoScript}\n\n    // Hero form submit`);
}
index = index.replace(
  'setInterval(() => slideDoctor(1), 5000);',
  'if (slides.length) setInterval(() => slideDoctor(1), 5000);'
);

write('index.html', index);

const cssPath = 'assets/css/pages.css';
let css = read(cssPath);
const redesignCss = `

/* ==========================================================================
   Homepage video, treatments, reels and before/after refinements
   ========================================================================== */
.hero-video-layout { grid-template-columns: minmax(0, 1fr) minmax(420px, 0.82fr); }
.hero-video-panel { display: flex; flex-direction: column; gap: 18px; align-items: stretch; }
.hero-video-card { position: relative; min-height: 430px; border-radius: 18px; overflow: hidden; background: #0f172a; box-shadow: 0 28px 60px rgba(15, 23, 42, 0.22); border: 1px solid rgba(255,255,255,0.4); }
.hero-video-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.56)); pointer-events: none; }
.hero-video { width: 100%; height: 100%; min-height: 430px; object-fit: cover; display: block; }
.hero-video-caption { position: absolute; left: 22px; right: 22px; bottom: 20px; z-index: 4; display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; color: #fff; text-align: left; }
.hero-video-caption h3 { color: #fff; font-size: 1.1rem; margin: 4px 0 0; max-width: 310px; }
.video-kicker { display: inline-flex; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #bae6fd; }
.video-duration { background: rgba(15,23,42,0.8); color: #fff; border-radius: 6px; padding: 5px 8px; font-size: 0.78rem; font-weight: 700; }
.video-play-button { position: absolute; inset: 0; margin: auto; z-index: 5; width: 58px; height: 58px; border-radius: 50%; background: #ffffff; box-shadow: 0 16px 40px rgba(15,23,42,0.28); display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease, opacity 0.2s ease; }
.video-play-button span { width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 15px solid var(--secondary); margin-left: 4px; }
.video-play-button:hover { transform: scale(1.06); }
.is-playing .video-play-button { opacity: 0; pointer-events: none; }
.hero-video-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.hero-video-stats div { background: #fff; border: 1px solid var(--border-light); border-radius: 12px; padding: 16px; box-shadow: var(--shadow-sm); }
.hero-video-stats strong { display: block; color: var(--primary); font-size: 1.35rem; line-height: 1; margin-bottom: 4px; }
.hero-video-stats span { color: var(--muted); font-size: 0.78rem; font-weight: 700; }
.clean-heading { max-width: 720px; margin: 0 auto 46px; text-align: center; }
.clean-heading p { color: var(--secondary); font-weight: 800; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 10px; }
.clean-heading h2 { font-size: clamp(2rem, 4vw, 2.65rem); margin-bottom: 12px; letter-spacing: 0; }
.clean-heading span { color: var(--muted); font-size: 1.02rem; line-height: 1.7; }
.signature-section { background: #f8fafc; }
.signature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.signature-card { background: #fff; border: 1px solid var(--border-light); border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px rgba(15,23,42,0.06); transition: transform 0.25s ease, box-shadow 0.25s ease; }
.signature-card:hover { transform: translateY(-5px); box-shadow: 0 18px 44px rgba(15,23,42,0.10); }
.signature-video { position: relative; height: 290px; overflow: hidden; background: #0f172a; }
.signature-video video { width: 100%; height: 100%; object-fit: cover; display: block; }
.signature-video::after, .reel-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,23,42,0.04), rgba(15,23,42,0.48)); pointer-events: none; }
.signature-video small { position: absolute; top: 14px; left: 14px; z-index: 4; background: rgba(255,255,255,0.92); color: var(--primary); border-radius: 999px; padding: 6px 10px; font-size: 0.72rem; font-weight: 800; }
.signature-content { padding: 22px; text-align: left; }
.signature-content h3 { font-size: 1.18rem; margin-bottom: 8px; }
.signature-content p { color: var(--muted); font-size: 0.92rem; line-height: 1.65; margin-bottom: 18px; }
.signature-content a { color: var(--secondary); font-weight: 800; font-size: 0.9rem; }
.signature-action { margin-top: 38px; }
.before-after-home { background: #fff; }
.before-after-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.before-after-card { background: #fff; border: 1px solid var(--border-light); border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-sm); text-align: left; }
.before-after-images { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: var(--border-light); }
.before-after-images div { position: relative; height: 180px; overflow: hidden; background: #e2e8f0; }
.before-after-images img { width: 100%; height: 100%; object-fit: cover; }
.before-after-images span { position: absolute; left: 8px; bottom: 8px; background: rgba(15,23,42,0.82); color: #fff; border-radius: 5px; padding: 3px 7px; font-size: 0.68rem; font-weight: 800; }
.before-after-card h3 { padding: 16px 16px 4px; font-size: 1rem; }
.before-after-card p { padding: 0 16px 18px; color: var(--muted); font-size: 0.85rem; line-height: 1.55; margin: 0; }
.video-testimonials-section { background: #f8fafc; }
.reels-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.reel-card { position: relative; aspect-ratio: 9 / 16; min-height: 390px; border-radius: 18px; overflow: hidden; background: #0f172a; box-shadow: 0 16px 42px rgba(15,23,42,0.14); border: 1px solid rgba(15,23,42,0.08); }
.reel-card video { width: 100%; height: 100%; object-fit: cover; display: block; }
.reel-label { position: absolute; left: 16px; right: 16px; bottom: 16px; z-index: 4; color: #fff; text-align: left; }
.reel-label strong { display: block; font-size: 0.98rem; margin-bottom: 2px; }
.reel-label span { font-size: 0.78rem; color: #dbeafe; font-weight: 700; }
.treatment-hero { padding: 160px 0 78px; background: linear-gradient(135deg, #0f172a 0%, #10304f 100%); color: #fff; }
.treatment-hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, 0.65fr); gap: 56px; align-items: center; }
.treatment-hero h1 { color: #fff; font-size: clamp(2.2rem, 5vw, 3.4rem); margin: 12px 0 18px; letter-spacing: 0; }
.treatment-hero p { color: #cbd5e1; font-size: 1.08rem; line-height: 1.75; max-width: 720px; }
.treatment-eyebrow { color: #7dd3fc; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.14em; }
.treatment-hero-media { border-radius: 18px; overflow: hidden; box-shadow: 0 28px 70px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.14); }
.treatment-hero-media img { width: 100%; height: 390px; object-fit: cover; }
.treatment-detail-wrap { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 44px; align-items: start; }
.treatment-content-block { background: #fff; border: 1px solid var(--border-light); border-radius: 16px; padding: 34px; box-shadow: var(--shadow-sm); margin-bottom: 24px; text-align: left; }
.treatment-content-block h2, .treatment-content-block h3 { margin-bottom: 16px; }
.treatment-content-block p { color: var(--muted); line-height: 1.75; margin-bottom: 16px; }
.treatment-feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.treatment-feature, .process-card, .faq-card { border: 1px solid var(--border-light); border-radius: 12px; padding: 18px; background: #fff; }
.treatment-feature strong, .process-card strong { display: block; color: var(--primary); margin-bottom: 6px; }
.treatment-feature span, .process-card span, .faq-card p { color: var(--muted); font-size: 0.92rem; line-height: 1.6; }
.process-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; counter-reset: process; }
.process-card { counter-increment: process; position: relative; padding-top: 46px; }
.process-card::before { content: counter(process, decimal-leading-zero); position: absolute; top: 16px; left: 18px; color: var(--secondary); font-weight: 900; font-size: 0.82rem; }
.suitable-list { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
.suitable-list li { padding: 14px 16px; border: 1px solid var(--border-light); border-radius: 10px; color: var(--primary); background: #f8fafc; font-weight: 650; }
.treatment-sidebar { position: sticky; top: 98px; display: grid; gap: 18px; }
.treatment-side-card { background: #fff; border: 1px solid var(--border-light); border-radius: 16px; padding: 24px; box-shadow: var(--shadow-md); }
.treatment-side-card h3 { font-size: 1.25rem; margin-bottom: 12px; }
.treatment-side-card p { color: var(--muted); font-size: 0.92rem; line-height: 1.65; margin-bottom: 16px; }
.treatment-side-list { display: grid; gap: 10px; margin: 18px 0; padding: 0; list-style: none; }
.treatment-side-list li { color: var(--primary); font-weight: 700; font-size: 0.9rem; }
.treatment-index-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 1080px) { .signature-grid, .treatment-index-grid { grid-template-columns: repeat(2, 1fr); } .before-after-strip { grid-template-columns: repeat(2, 1fr); } .reels-row { overflow-x: auto; display: flex; padding-bottom: 12px; scroll-snap-type: x mandatory; } .reel-card { flex: 0 0 245px; scroll-snap-align: start; } .treatment-detail-wrap, .treatment-hero-grid { grid-template-columns: 1fr; } .treatment-sidebar { position: static; } }
@media (max-width: 968px) { .hero-video-layout { grid-template-columns: 1fr; } .hero-video-card, .hero-video, .hero-video-card video { min-height: 320px; } }
@media (max-width: 640px) { .signature-grid, .before-after-strip, .treatment-feature-grid, .process-grid, .treatment-index-grid { grid-template-columns: 1fr; } .signature-video { height: 250px; } .hero-video-stats { grid-template-columns: 1fr; } .treatment-content-block { padding: 24px; } .before-after-images div { height: 150px; } }
`;
if (!css.includes('Homepage video, treatments, reels and before/after refinements')) write(cssPath, css + redesignCss);

const header = read('templates/header.template.html');
const footer = read('templates/footer.template.html');
const treatmentData = JSON.parse(read('data/treatments.json'));
const fallbackImages = {
  'dental-implants': 'assets/images/treatments/implants.jpg',
  'root-canal-treatment': 'assets/images/gallery/box-1.jpg',
  'clear-aligners': 'assets/images/clinic/op-area.jpg',
  braces: 'assets/images/treatments/general-dentistry.jpg',
  'smile-makeover': 'assets/images/treatments/smile-makeover.jpg',
  'teeth-whitening': 'assets/images/treatments/smile-makeover.jpg',
  'wisdom-tooth-removal': 'assets/images/clinic/chair.jpg',
  'gum-treatment': 'assets/images/treatments/general-dentistry.jpg',
  dentures: 'assets/images/treatments/implants.jpg',
  'pediatric-dentistry': 'assets/images/gallery/dentist-4.jpg'
};
const baseDetails = {
  benefits: ['Specialist-led planning', 'Clear diagnosis before treatment', 'Comfort-first clinical steps', 'Long-term aftercare guidance'],
  steps: ['Consultation and examination', 'Digital diagnosis and treatment plan', 'Treatment with comfort control', 'Review and maintenance guidance'],
  suitable: ['Patients with active dental concerns', 'Patients seeking a second opinion', 'Patients planning preventive care', 'Patients wanting specialist-led care'],
  faqs: [['How do I know if this treatment is right for me?', 'The dentist confirms suitability after examining your teeth, gums, bite, and diagnostic records.'], ['Can I book directly on WhatsApp?', 'Yes. The clinic team can help you choose the right consultation slot on WhatsApp.']]
};
const details = {
  'dental-implants': { benefits: ['Fixed teeth that look and feel natural', 'Helps preserve jawbone support', 'Improves chewing strength and speech', 'No trimming of nearby healthy teeth'], steps: ['Digital scan and implant planning', 'Comfort-focused implant placement', 'Healing and crown measurements', 'Final crown or bridge fixation'], suitable: ['Single missing tooth', 'Multiple missing teeth', 'Loose dentures', 'Full-mouth rehabilitation'], faqs: [['Is implant treatment painful?', 'The placement is done under local anesthesia with careful planning, so most patients report pressure rather than pain.'], ['How long do implants last?', 'With good oral hygiene and review visits, implants can last many years and often decades.']] },
  'root-canal-treatment': { benefits: ['Saves the natural tooth', 'Relieves deep tooth pain', 'Stops infection from spreading', 'Restores chewing comfort'], steps: ['Diagnosis and digital X-ray', 'Pulp cleaning and shaping', 'Canal disinfection and sealing', 'Final filling or crown protection'], suitable: ['Severe toothache', 'Deep cavity', 'Swelling near a tooth', 'Cracked or infected tooth'], faqs: [['Can a root canal be done in one visit?', 'Many cases can be completed in one visit, while infected or complex teeth may need staged care.'], ['Do I need a crown after RCT?', 'Back teeth and weakened teeth usually need crowns to prevent fracture after treatment.']] },
  'clear-aligners': { benefits: ['Nearly invisible appearance', 'Removable for food and brushing', 'Smooth trays with fewer ulcers', 'Planned tooth movement digitally'], steps: ['Smile scan and bite assessment', 'Digital movement plan', 'Custom aligner delivery', 'Progress reviews and refinements'], suitable: ['Mild to moderate crowding', 'Spacing between teeth', 'Relapse after braces', 'Adults wanting discreet correction'], faqs: [['How many hours should I wear aligners?', 'Most plans require 20 to 22 hours of daily wear for predictable movement.'], ['Can I eat with aligners?', 'Aligners should be removed while eating and cleaned before wearing again.']] },
  braces: { benefits: ['Corrects complex tooth positions', 'Improves bite function', 'Suitable for children and adults', 'Reliable for detailed tooth control'], steps: ['Orthodontic records and planning', 'Bracket bonding', 'Monthly wire adjustments', 'Retainers after completion'], suitable: ['Crowded teeth', 'Gaps between teeth', 'Forwardly placed teeth', 'Bite correction needs'], faqs: [['How long do braces take?', 'Most cases take 12 to 24 months depending on complexity and patient cooperation.'], ['Are ceramic braces available?', 'Yes, aesthetic ceramic options are available for patients who want a subtler look.']] },
  'smile-makeover': { benefits: ['Improves smile shape and brightness', 'Balances teeth with face and lips', 'Can combine multiple cosmetic treatments', 'Personalized natural-looking result'], steps: ['Smile analysis and photographs', 'Shade, shape, and gum planning', 'Whitening, veneers, crowns, or bonding'], suitable: ['Stained teeth', 'Chipped or worn teeth', 'Uneven smile line', 'Gaps or cosmetic concerns'], faqs: [['Is smile makeover only veneers?', 'No. It may include whitening, bonding, veneers, crowns, gum shaping, or aligners based on your smile.'], ['Will it look artificial?', 'The goal is a balanced, natural smile that suits your face, not a one-shade-fits-all result.']] }
};
const rel = (html, depth) => {
  const prefix = depth === 2 ? '../../' : '../';
  return html.replace(/(href|src)="\/(?!\/)([^"]*)"/g, `$1="${prefix}$2"`).replace(/url\('\/([^']*)'\)/g, `url('${prefix}$1')`);
};
function makeTreatmentPage(t) {
  const d = { ...baseDetails, ...(details[t.slug] || {}) };
  const img = fallbackImages[t.slug] || 'assets/images/clinic/op-area.jpg';
  const label = t.title.replace(/ Treatment$/i, '');
  const html = `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(t.meta_title || t.title)}</title><meta name="description" content="${esc(t.meta_description || t.description)}"><link rel="canonical" href="https://manohardentalvisakhapatnam.com/treatments/${t.slug}/">
  <link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="icon" href="/assets/images/branding/favicon-192x192.png" sizes="192x192"><link rel="apple-touch-icon" href="/assets/images/branding/apple-touch-icon.png">
  <link rel="stylesheet" href="/assets/css/main.css"><link rel="stylesheet" href="/assets/css/pages.css">
</head>
<body>
  <div class="scroll-progress"></div>
  ${header}
  <section class="treatment-hero"><div class="container treatment-hero-grid"><div><span class="treatment-eyebrow">Manohar Dental Clinic</span><h1>${esc(t.title)}</h1><p>${esc(t.description)}</p></div><div class="treatment-hero-media"><img src="/${img}" alt="${esc(t.title)} at Manohar Dental Clinic"></div></div></section>
  <section class="section-padding" style="background:#f8fafc;"><div class="container treatment-detail-wrap"><main>
    <section class="treatment-content-block"><h2>Overview</h2><p>${esc(t.description)}</p><p>Every case begins with a proper diagnosis, a clear explanation of treatment choices, and a practical plan that suits your dental health, comfort, timeline, and budget.</p></section>
    <section class="treatment-content-block"><h2>Benefits</h2><div class="treatment-feature-grid">${d.benefits.map((b) => `<div class="treatment-feature"><strong>${esc(b)}</strong><span>Planned with clinical precision and explained before treatment begins.</span></div>`).join('')}</div></section>
    <section class="treatment-content-block"><h2>Procedure</h2><div class="process-grid">${d.steps.map((s) => `<div class="process-card"><strong>${esc(s)}</strong><span>Our doctors keep you informed at every stage so the experience stays calm and predictable.</span></div>`).join('')}</div></section>
    <section class="treatment-content-block"><h2>Who It Is Suitable For</h2><ul class="suitable-list">${d.suitable.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></section>
    <section class="treatment-content-block"><h2>FAQs</h2>${d.faqs.map(([q, a]) => `<div class="faq-card" style="margin-bottom:12px;"><h3 style="font-size:1rem;margin-bottom:8px;">${esc(q)}</h3><p>${esc(a)}</p></div>`).join('')}</section>
  </main><aside class="treatment-sidebar"><div class="treatment-side-card"><h3>Book ${esc(label)} Consultation</h3><p>Share your concern and our team will help you confirm the right appointment slot.</p><ul class="treatment-side-list"><li>Same-day slots when available</li><li>WhatsApp appointment support</li><li>Specialist consultation</li></ul><a class="btn btn-primary" style="width:100%;" href="https://api.whatsapp.com/send?phone=919703294358&text=${encodeURIComponent(`Hello Manohar Dental Clinic, I want to book a consultation for ${label}`)}">Book on WhatsApp</a></div><div class="treatment-side-card"><h3>Need help choosing?</h3><p>Not sure whether this is the right treatment? Start with a general dental consultation and we will guide you clearly.</p><a class="btn btn-outline" style="width:100%;" href="../../contact/index.html">Contact Clinic</a></div></aside></div></section>
  ${footer}
  <script src="/assets/js/main.js"></script><script src="/assets/js/navigation.js"></script><script src="/assets/js/animations.js"></script><script src="/assets/js/forms.js"></script><script src="/assets/js/utilities.js"></script>
</body></html>`;
  return rel(html, 2);
}
for (const t of treatmentData) {
  const dir = path.join(ROOT, 'treatments', t.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), makeTreatmentPage(t));
}
const indexCards = treatmentData.map((t) => {
  const img = fallbackImages[t.slug] || 'assets/images/clinic/op-area.jpg';
  return `<article class="signature-card"><div class="signature-video"><img src="../${img}" alt="${esc(t.title)}" style="width:100%;height:100%;object-fit:cover;"><small>${esc(t.title.replace(/ Treatment$/i, ''))}</small></div><div class="signature-content"><h3>${esc(t.title)}</h3><p>${esc(t.description).slice(0, 165)}...</p><a href="${t.slug}/index.html">View details &rarr;</a></div></article>`;
}).join('\n');
const treatmentsIndex = `<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Dental Treatments in Visakhapatnam | Manohar Dental Clinic</title><meta name="description" content="Explore dental implants, root canal treatment, clear aligners, braces, smile makeover, gum care, dentures, pediatric dentistry and more."><link rel="stylesheet" href="../assets/css/main.css"><link rel="stylesheet" href="../assets/css/pages.css"><link rel="icon" href="../favicon.ico"></head><body><div class="scroll-progress"></div>${rel(header, 1)}<section class="page-hero"><div class="container"><h1>Dental Treatments</h1><div class="breadcrumbs"><a href="../index.html">Home</a> / <span>Treatments</span></div></div></section><section class="section-padding" style="background:#f8fafc;"><div class="container"><div class="section-heading clean-heading"><p>Complete Care</p><h2>Treatment Options</h2><span>Explore detailed treatment pages and choose the right consultation for your smile.</span></div><div class="treatment-index-grid">${indexCards}</div></div></section>${rel(footer, 1)}<script src="../assets/js/main.js"></script><script src="../assets/js/navigation.js"></script><script src="../assets/js/animations.js"></script><script src="../assets/js/forms.js"></script><script src="../assets/js/utilities.js"></script></body></html>`;
write('treatments/index.html', treatmentsIndex);

console.log('Implemented requested homepage redesign and treatment pages.');
