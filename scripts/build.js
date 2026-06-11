const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Load templates
const TEMPLATE_DIR = path.join(ROOT_DIR, 'templates');
const headerTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'header.template.html'), 'utf-8');
const footerTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'footer.template.html'), 'utf-8');
const treatmentTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'treatment.template.html'), 'utf-8');
const doctorTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'doctor.template.html'), 'utf-8');
const formTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'appointment-form.template.html'), 'utf-8');

// Load JSON data
const treatmentsData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'treatments.json'), 'utf-8'));
const doctorsData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'doctors.json'), 'utf-8'));
const testimonialsData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'testimonials.json'), 'utf-8'));
const faqData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'faq.json'), 'utf-8'));
const { buildPremiumTreatmentPages } = require('./premium_treatment_pages');

// Helper to extract section content
function extractSection(html, startIndicator, endIndicator) {
  let startIndex = html.indexOf(startIndicator);
  if (startIndex === -1) return '';
  startIndex += startIndicator.length;
  const endIndex = html.indexOf(endIndicator, startIndex);
  if (endIndex === -1) return '';
  return html.substring(startIndex, endIndex).trim();
}

// Global path rewriter
function rewritePaths(html, depth = 0) {
  let rewritten = html;

  let prefix = '';
  if (depth === 1) prefix = '../';
  if (depth === 2) prefix = '../../';

  // 1. Clean up any existing style sheets and js references to prevent duplication
  rewritten = rewritten.replace(/<link[^>]+variables\.css[^>]*>/gi, '');
  rewritten = rewritten.replace(/<link[^>]+components\.css[^>]*>/gi, '');
  rewritten = rewritten.replace(/<link[^>]+pages\.css[^>]*>/gi, '');
  rewritten = rewritten.replace(/<link[^>]+main\.css[^>]*>/gi, `<link rel="stylesheet" href="${prefix}assets/css/main.css">\n  <link rel="stylesheet" href="${prefix}assets/css/pages.css">`);
  
  rewritten = rewritten.replace(/<script[^>]+app\.js[^>]*><\/script>/gi, '');
  rewritten = rewritten.replace(/<script[^>]+components\.js[^>]*><\/script>/gi, '');
  rewritten = rewritten.replace(/<script[^>]+main\.js[^>]*><\/script>/gi, '');
  rewritten = rewritten.replace(/<script[^>]+navigation\.js[^>]*><\/script>/gi, '');
  rewritten = rewritten.replace(/<script[^>]+animations\.js[^>]*><\/script>/gi, '');
  rewritten = rewritten.replace(/<script[^>]+carousel\.js[^>]*><\/script>/gi, '');
  rewritten = rewritten.replace(/<script[^>]+forms\.js[^>]*><\/script>/gi, '');
  rewritten = rewritten.replace(/<script[^>]+utilities\.js[^>]*><\/script>/gi, '');

  const scriptsBlock = `<!-- Scripts -->
  <script src="${prefix}assets/js/main.js"></script>
  <script src="${prefix}assets/js/navigation.js"></script>
  <script src="${prefix}assets/js/animations.js"></script>
  <script src="${prefix}assets/js/carousel.js"></script>
  <script src="${prefix}assets/js/forms.js"></script>
  <script src="${prefix}assets/js/utilities.js"></script>`;

  if (rewritten.includes('<!-- Scripts -->')) {
    rewritten = rewritten.replace(/<!-- Scripts -->[\s\S]*?(?=<\/body>)/i, scriptsBlock + '\n  ');
  } else {
    rewritten = rewritten.replace(/<\/body>/i, `${scriptsBlock}\n</body>`);
  }

  // 2. Map old WordPress paths to absolute paths
  // Branding
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/08\/finalnewlogo\.png/gi, '/assets/images/branding/logo.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/logo@2xx\.png/gi, '/assets/images/branding/logo@2xx.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/cropped-cropped-dsf-2-32x32\.png/gi, '/favicon.ico');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/cropped-cropped-dsf-2-192x192\.png/gi, '/assets/images/branding/favicon-192x192.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/cropped-cropped-dsf-2-180x180\.png/gi, '/assets/images/branding/apple-touch-icon.png');
  
  // Doctors
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/sri3-modified-1\.png/gi, '/assets/images/doctors/srinivas-manohar.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/sri-modified\.png/gi, '/assets/images/doctors/sirisha.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/sri1-modified\.png/gi, '/assets/images/doctors/usha-sri.png');
  
  // Clinic
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/08\/IMG_1577-min-scaled-1\.jpg/gi, '/assets/images/clinic/op-area.jpg');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/08\/IMG_1577-min-scaled-1-980x1470\.jpg/gi, '/assets/images/clinic/op-area-mobile.jpg');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/08\/IMG_1623-min-scaled-1\.jpg/gi, '/assets/images/clinic/chair.jpg');
  
  // Treatments
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/07\/smile-designing\.jpg/gi, '/assets/images/treatments/smile-makeover.jpg');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/smiling-dentist-explaining-tooth-implantation\.jpg/gi, '/assets/images/treatments/implants.jpg');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/best-family-dentist-near-you-in-danvers\.jpg/gi, '/assets/images/treatments/general-dentistry.jpg');
  
  // Testimonials
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/close-up-happy-client-dental-clinic\.jpg/gi, '/assets/images/testimonials/happy-client.jpg');
  
  // Gallery
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/dentist-3\.jpg/gi, '/assets/images/gallery/dentist-3.jpg');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/dentist-4\.jpg/gi, '/assets/images/gallery/dentist-4.jpg');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/360_F_409308152_4xrTMRNwr4kw36zahElgkosR8bauHawB\.jpg/gi, '/assets/images/gallery/360_F_409308152_4xrTMRNwr4kw36zahElgkosR8bauHawB.jpg');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/wepik-export-20230605084051oobB\.png/gi, '/assets/images/gallery/wepik-export-20230605084051oobB.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/box-1\.jpg/gi, '/assets/images/gallery/box-1.jpg');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/08\/Best-Dentist-in-Visakhapatnam\.png/gi, '/assets/images/gallery/Best-Dentist-in-Visakhapatnam.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/shutterstock_327361349\.jpg/gi, '/assets/images/gallery/shutterstock_327361349.jpg');
  
  // Icons
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/dental\.png/gi, '/assets/images/icons/dental.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/dentist-1\.png/gi, '/assets/images/icons/dentist-1.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/doctor\.png/gi, '/assets/images/icons/doctor.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/first-aid-kit\.png/gi, '/assets/images/icons/first-aid-kit.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/phone-call-1\.png/gi, '/assets/images/icons/phone-call-1.png');
  rewritten = rewritten.replace(/\/wp-content\/uploads\/2023\/06\/search\.png/gi, '/assets/images/icons/search.png');

  // Also map old URLs (fallback mapping) to new absolute URLs
  rewritten = rewritten.replace(/href=["']\/dental-implants-in-visakhapatnam\/["']/gi, 'href="/treatments/dental-implants/"');
  rewritten = rewritten.replace(/href=["']\/root-canal-treatment-in-visakhapatnam\/["']/gi, 'href="/treatments/root-canal-treatment/"');
  rewritten = rewritten.replace(/href=["']\/clear-aligners-treatment-in-visakhapatnam\/["']/gi, 'href="/treatments/clear-aligners/"');
  rewritten = rewritten.replace(/href=["']\/braces-treatment-in-visakhapatnam\/["']/gi, 'href="/treatments/braces/"');
  rewritten = rewritten.replace(/href=["']\/smile-makeover-treatment-in-visakhapatnam\/["']/gi, 'href="/treatments/smile-makeover/"');
  rewritten = rewritten.replace(/href=["']\/teeth-whitening-treatment-in-visakhapatnam\/["']/gi, 'href="/treatments/teeth-whitening/"');
  rewritten = rewritten.replace(/href=["']\/wisdom-teeth-removal-in-visakhapatnam\/["']/gi, 'href="/treatments/wisdom-tooth-removal/"');
  rewritten = rewritten.replace(/href=["']\/gum-treatment-in-visakhapatnam\/["']/gi, 'href="/treatments/gum-treatment/"');
  rewritten = rewritten.replace(/href=["']\/denture-treatment-in-visakhapatnam\/["']/gi, 'href="/treatments/dentures/"');
  rewritten = rewritten.replace(/href=["']\/pediatric-dentists-in-visakhapatnam\/["']/gi, 'href="/treatments/pediatric-dentistry/"');
  rewritten = rewritten.replace(/href=["']\/dental-clinic-in-vizag\/["']/gi, 'href="/about/"');
  rewritten = rewritten.replace(/href=["']\/doctor-srinivas-manohar\/["']/gi, 'href="/doctors/doctor-srinivas-manohar/"');
  rewritten = rewritten.replace(/href=["']\/doctor-sirisha\/["']/gi, 'href="/doctors/doctor-sirisha/"');
  rewritten = rewritten.replace(/href=["']\/doctor-usha-sri\/["']/gi, 'href="/doctors/doctor-usha-sri/"');
  rewritten = rewritten.replace(/href=["']\/testimonial\/["']/gi, 'href="/testimonials/"');

  // 3. Translate all root-relative paths starting with /
  rewritten = rewritten.replace(/(href|src|action|poster)=["']\/([^"']*)["']/gi, (match, attr, pathVal) => {
    if (pathVal.startsWith('/')) {
      return match;
    }
    let newPath = pathVal;
    
    const supportPages = ['about', 'contact', 'gallery', 'testimonials', 'results', 'blog', 'faqs'];
    
    // Trim trailing slash
    let cleanPath = pathVal;
    if (cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }
    
    if (cleanPath === 'index.html' || cleanPath === '') {
      newPath = 'index.html';
    } else if (supportPages.includes(cleanPath)) {
      newPath = `${cleanPath}/index.html`;
    } else if (cleanPath.startsWith('treatments/')) {
      const slug = cleanPath.split('/')[1];
      newPath = `treatments/${slug}/index.html`;
    } else if (cleanPath.startsWith('doctors/')) {
      const slug = cleanPath.split('/')[1];
      newPath = `doctors/${slug}/index.html`;
    }
    
    return `${attr}="${prefix}${newPath}"`;
  });

  // 4. Translate background-image url('/...') references
  rewritten = rewritten.replace(/url\(["']?\/([^"')\s]*)["']?\)/gi, (match, pathVal) => {
    return `url('${prefix}${pathVal}')`;
  });

  return rewritten;
}

function stripFloatingActions(html) {
  let result = html;
  
  // Remove comment labels
  result = result.replace(/<!-- Floating Actions -->/gi, '');
  result = result.replace(/<!-- Floating Call & WhatsApp Buttons -->/gi, '');
  
  let index = result.indexOf('<div class="floating-actions">');
  while (index !== -1) {
    let openDivs = 1;
    let pos = index + '<div class="floating-actions">'.length;
    while (openDivs > 0 && pos < result.length) {
      if (result.substring(pos, pos + 4) === '<div') {
        openDivs++;
        pos += 4;
      } else if (result.substring(pos, pos + 6) === '</div>') {
        openDivs--;
        pos += 6;
      } else {
        pos++;
      }
    }
    result = result.substring(0, index) + result.substring(pos);
    index = result.indexOf('<div class="floating-actions">');
  }
  return result;
}

function compilePageLayout(html, pageTitle = '', depth = 0) {
  let compiled = html;
  
  // Find where header goes and replace it
  const headerRegex = /<!-- Header Section -->[\s\S]*?<\/header>/i;
  if (headerRegex.test(compiled)) {
    compiled = compiled.replace(headerRegex, '<!-- HEADER_PLACEHOLDER -->');
  } else {
    compiled = compiled.replace(/<header class="header">[\s\S]*?<\/header>/i, '<!-- HEADER_PLACEHOLDER -->');
  }

  // Find where footer goes and replace it
  const footerRegex = /<!-- Footer Section -->[\s\S]*?<\/footer>/i;
  if (footerRegex.test(compiled)) {
    compiled = compiled.replace(footerRegex, '<!-- FOOTER_PLACEHOLDER -->');
  } else {
    compiled = compiled.replace(/<footer class="footer">[\s\S]*?<\/footer>/i, '<!-- FOOTER_PLACEHOLDER -->');
  }

  // Remove any existing floating actions blocks to prevent duplication
  compiled = stripFloatingActions(compiled);

  // Replace placeholders with template text
  compiled = compiled.replace('<!-- HEADER_PLACEHOLDER -->', headerTemplate);
  compiled = compiled.replace('<!-- FOOTER_PLACEHOLDER -->', footerTemplate);

  // Apply path rewriting
  compiled = rewritePaths(compiled, depth);

  return compiled;
}

// --------------------------------------------------------------------------
// 1. Compile Homepage (index.html)
// --------------------------------------------------------------------------
function buildHomepage() {
  console.log('Compiling Homepage...');
  const indexSrcPath = path.join(ROOT_DIR, 'index.html');
  let indexHtml = fs.readFileSync(indexSrcPath, 'utf-8');
  
  // Replace the inline header and footer with templates
  indexHtml = compilePageLayout(indexHtml, 'Home', 0);
  
  // Update appointment form block if it exists
  const formRegex = /<div class="consult-card">[\s\S]*?<\/div>\s*<\/div>/i; // captures consult card
  if (indexHtml.includes('class="consult-card"')) {
    indexHtml = indexHtml.replace(/<div class="consult-card">[\s\S]*?<\/form>\s*<div class="form-success-message"[\s\S]*?<\/div>\s*<\/div>/i, formTemplate);
  }

  // Apply root rewriting again just in case there are other loose fields
  indexHtml = rewritePaths(indexHtml, 0);

  fs.writeFileSync(indexSrcPath, indexHtml);
  console.log('Homepage index.html compiled.');
}

// --------------------------------------------------------------------------
// 2. Compile About Page (about/index.html)
// --------------------------------------------------------------------------
function buildAboutPage() {
  console.log('Compiling About Page...');
  const oldAboutPath = path.join(ROOT_DIR, 'dental-clinic-in-vizag', 'index.html');
  const backupAboutPath = path.join(ROOT_DIR, 'about', 'index.html');
  const sourcePath = fs.existsSync(oldAboutPath) ? oldAboutPath : backupAboutPath;
  
  if (!fs.existsSync(sourcePath)) {
    console.error('About Page source not found!');
    return;
  }

  let aboutHtml = fs.readFileSync(sourcePath, 'utf-8');
  aboutHtml = compilePageLayout(aboutHtml, 'About Us', 1);

  const newAboutDir = path.join(ROOT_DIR, 'about');
  ensureDir(newAboutDir);
  fs.writeFileSync(path.join(newAboutDir, 'index.html'), aboutHtml);
  console.log('About Us page compiled to /about/index.html');
}

// --------------------------------------------------------------------------
// 3. Compile Treatment Pages (treatments/{slug}/index.html)
// --------------------------------------------------------------------------
function buildTreatmentPages() {
  console.log('Compiling Premium Treatment Pages...');
  buildPremiumTreatmentPages({
    rootDir: ROOT_DIR,
    headerTemplate,
    footerTemplate,
    ensureDir,
    rewritePaths
  });
}

// --------------------------------------------------------------------------
// 4. Compile Doctor Bio Pages (doctors/{slug}/index.html)
// --------------------------------------------------------------------------
function buildDoctorPages() {
  console.log('Compiling Doctor Pages...');
  
  doctorsData.forEach(doctor => {
    const slug = doctor.slug;
    const oldDirName = doctor.old_url.replace(/\//g, '');
    const oldFilePath = path.join(ROOT_DIR, oldDirName, 'index.html');
    const backupFilePath = path.join(ROOT_DIR, 'doctors', slug, 'index.html');
    
    let sourceHtml = '';
    if (fs.existsSync(oldFilePath)) {
      sourceHtml = fs.readFileSync(oldFilePath, 'utf-8');
    } else if (fs.existsSync(backupFilePath)) {
      sourceHtml = fs.readFileSync(backupFilePath, 'utf-8');
    } else {
      console.warn(`Source page for doctor ${slug} not found.`);
      return;
    }

    // Extract credentials grid
    let credentialsContent = extractSection(sourceHtml, '<div class="credentials-grid">', '<a href="/contact/"');
    if (credentialsContent) {
      const lastDivIndex = credentialsContent.lastIndexOf('</div>');
      if (lastDivIndex !== -1) {
        credentialsContent = credentialsContent.substring(0, lastDivIndex).trim();
      }
    } else {
      const gridStart = sourceHtml.indexOf('<div class="credentials-grid">');
      const gridEnd = sourceHtml.indexOf('</div>', sourceHtml.lastIndexOf('</ul>')) + 12;
      if (gridStart > 0) {
        credentialsContent = sourceHtml.substring(gridStart, gridEnd);
        credentialsContent = credentialsContent.replace('<div class="credentials-grid">', '').replace(/<\/div>\s*$/, '');
      }
    }

    let finalHtml = doctorTemplate
      .replace(/{{META_TITLE}}/g, doctor.meta_title)
      .replace(/{{META_DESCRIPTION}}/g, doctor.meta_description)
      .replace(/{{SLUG}}/g, doctor.slug)
      .replace(/{{DOCTOR_NAME}}/g, doctor.name)
      .replace(/{{DOCTOR_TAGLINE}}/g, doctor.tagline)
      .replace(/{{DOCTOR_BIO}}/g, doctor.bio)
      .replace(/{{DOCTOR_IMAGE}}/g, doctor.image)
      .replace(/{{CREDENTIALS_CONTENT}}/g, credentialsContent);

    finalHtml = finalHtml.replace('<!-- HEADER_SECTION -->', headerTemplate);
    finalHtml = finalHtml.replace('<!-- FOOTER_SECTION -->', footerTemplate);
    
    finalHtml = rewritePaths(finalHtml, 2);

    const doctorDir = path.join(ROOT_DIR, 'doctors', slug);
    ensureDir(doctorDir);
    fs.writeFileSync(path.join(doctorDir, 'index.html'), finalHtml);
    console.log(`Generated doctor bio page: /doctors/${slug}/index.html`);
  });
}

// --------------------------------------------------------------------------
// 5. Compile Support & Conversion Pages
// --------------------------------------------------------------------------
function buildSupportPages() {
  console.log('Generating support pages (contact, gallery, testimonials, results, blog, faqs)...');

  // FAQ Page
  const faqAccordionHtml = faqData.map(faq => `
    <div class="accordion-item">
      <div class="accordion-header">
        <h4>${faq.question}</h4>
        <div class="accordion-icon">▼</div>
      </div>
      <div class="accordion-content">
        <div class="accordion-content-inner">
          ${faq.answer}
        </div>
      </div>
    </div>
  `).join('');

  const pagesToGenerate = [
    {
      dir: 'faqs',
      title: "Frequently Asked Questions | Manohar Dental Clinic",
      desc: "Find answers to questions about implants cost, root canal pain, clear aligners duration, and emergency appointments at Manohar Dental Clinic Visakhapatnam.",
      h1: "Frequently Asked Questions",
      breadcrumb: "FAQ",
      body: `
        <section class="section-padding reveal">
          <div class="container" style="max-width: 800px;">
            <div class="text-center" style="margin-bottom: 48px;">
              <h2>Find Answers to Your Queries</h2>
              <p style="color: var(--muted); margin-top: 10px;">Everything you need to know about our dental procedures, scheduling, and clinic policies.</p>
            </div>
            <div class="accordion">
              ${faqAccordionHtml}
            </div>
          </div>
        </section>
      `
    },
    {
      dir: 'testimonials',
      title: "Patient Testimonials & Reviews | Manohar Dental Clinic Visakhapatnam",
      desc: "Read verified patient success stories and Google Reviews for Manohar Dental Clinic, Visakhapatnam. 466+ reviews rating us 5.0 stars.",
      h1: "Patient Testimonials",
      breadcrumb: "Testimonials",
      body: `
        <section class="section-padding reveal">
          <div class="container">
            <div class="text-center" style="margin-bottom: 48px;">
              <h2>What Our Patients Say About Us</h2>
              <p style="color: var(--muted); margin-top: 10px;">Real experiences from 466+ verified patients rated 5.0 on Google.</p>
            </div>
            
            <div class="grid grid-3" style="margin-bottom: 60px;">
              ${testimonialsData.map(t => `
                <div class="card" style="padding: 24px;">
                  <div class="testimonial-stars" style="margin-bottom: 12px; color: #fbbf24;">★★★★★</div>
                  <p style="color: var(--primary); font-style: italic; margin-bottom: 24px; font-size: 0.95rem;">"${t.review}"</p>
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background-color: var(--secondary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem;">${t.name.charAt(0)}</div>
                    <div>
                      <h4 style="font-size: 0.95rem; font-weight: 600;">${t.name}</h4>
                      <p style="font-size: 0.8rem; color: var(--muted);">${t.source} • ${t.date}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Video Testimonials Promo -->
            <div class="card" style="background-color: var(--light-bg); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; padding: 40px;">
              <div>
                <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Watch Video Success Stories</h3>
                <p style="color: var(--muted);">Watch our patients share their life-changing smile transformation journeys on our YouTube channel.</p>
              </div>
              <a href="https://www.youtube.com/channel/UCFClSQeVpChWB6eMMZcFUvQ" target="_blank" class="btn btn-primary">Visit YouTube Channel</a>
            </div>
          </div>
        </section>
      `
    },
    {
      dir: 'results',
      title: "Smile Transformations Before & After | Manohar Dental Clinic Vizag",
      desc: "View proven smile makeover results, orthodontic alignments, and implant transformations by Dr. Srinivas Manohar in Visakhapatnam.",
      h1: "Treatment Results",
      breadcrumb: "Transformations",
      body: `
        <section class="section-padding reveal">
          <div class="container">
            <div class="text-center" style="margin-bottom: 48px;">
              <h2>Proven Smile Transformations</h2>
              <p style="color: var(--muted); margin-top: 10px;">Drag the slider handles to see the before and after dental treatment outcomes.</p>
            </div>
            
            <div class="grid grid-2" style="margin-bottom: 48px;">
              <div class="card" style="padding: 0;">
                <div class="ba-slider">
                  <div class="ba-image ba-before" style="background-image: url('/assets/images/Dental_Implant_Befor.png');"></div>
                  <div class="ba-image ba-after" style="background-image: url('/assets/images/Dental_Implant_after.png');"></div>
                  <span class="ba-label ba-label-before">BEFORE</span>
                  <span class="ba-label ba-label-after">AFTER</span>
                  <div class="ba-handle">
                    <div class="ba-handle-line"></div>
                    <div class="ba-handle-button">↔</div>
                  </div>
                </div>
                <div style="padding: 24px;">
                  <h4 style="margin-bottom: 8px;">Full Mouth Dental Implants</h4>
                  <p style="color: var(--muted); font-size: 0.9rem;">Replaced missing arches with fixed immediate-load implants.</p>
                </div>
              </div>

              <div class="card" style="padding: 0;">
                <div class="ba-slider">
                  <div class="ba-image ba-before" style="background-image: url('/assets/images/alinerBefore.png');"></div>
                  <div class="ba-image ba-after" style="background-image: url('/assets/images/alinersAfter.png');"></div>
                  <span class="ba-label ba-label-before">BEFORE</span>
                  <span class="ba-label ba-label-after">AFTER</span>
                  <div class="ba-handle">
                    <div class="ba-handle-line"></div>
                    <div class="ba-handle-button">↔</div>
                  </div>
                </div>
                <div style="padding: 24px;">
                  <h4 style="margin-bottom: 8px;">Clear Aligners Transformation</h4>
                  <p style="color: var(--muted); font-size: 0.9rem;">Corrected misaligned arches using premium invisible custom aligners.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      dir: 'gallery',
      title: "Clinic Gallery & Diagnostic Infrastructure | Manohar Dental Clinic",
      desc: "Tour the modern facilities of Manohar Dental Clinic Visakhapatnam. View our advanced sterilization setups, surgical chairs, and diagnostics.",
      h1: "Clinic Infrastructure Gallery",
      breadcrumb: "Gallery",
      body: `
        <section class="section-padding reveal">
          <div class="container">
            <div class="text-center" style="margin-bottom: 48px;">
              <h2>Tour Our Modern Dental Facility</h2>
              <p style="color: var(--muted); margin-top: 10px;">We follow international sterilization standards and utilize cutting-edge dental tech.</p>
            </div>
            
            <div class="filter-nav">
              <button class="filter-btn active" data-filter="all">All Photos</button>
              <button class="filter-btn" data-filter="clinic">Clinic Interiors</button>
              <button class="filter-btn" data-filter="technology">Technology</button>
              <button class="filter-btn" data-filter="patients">Happy Patients</button>
            </div>

            <div class="gallery-grid">
              <div class="gallery-item" data-category="clinic">
                <img src="/assets/images/clinic/op-area.jpg" alt="Clinic OP Area">
                <div class="gallery-item-hover">
                  <h4>OP Consultation Chamber</h4>
                  <p>Clean, open consultation rooms</p>
                </div>
              </div>
              <div class="gallery-item" data-category="clinic">
                <img src="/assets/images/clinic/chair.jpg" alt="Dental Treatment Chair">
                <div class="gallery-item-hover">
                  <h4>Advanced Patient Chair</h4>
                  <p>Fully adjustable ergonomic medical setups</p>
                </div>
              </div>
              <div class="gallery-item" data-category="technology">
                <img src="/assets/images/gallery/dentist-3.jpg" alt="Surgical Dental Scanner">
                <div class="gallery-item-hover">
                  <h4>Intraoral Scanner</h4>
                  <p>3D digital diagnostic systems</p>
                </div>
              </div>
              <div class="gallery-item" data-category="technology">
                <img src="/assets/images/gallery/dentist-4.jpg" alt="Digital Dental X-Rays">
                <div class="gallery-item-hover">
                  <h4>Digital X-Ray Station</h4>
                  <p>High-resolution low-radiation X-rays</p>
                </div>
              </div>
              <div class="gallery-item" data-category="patients">
                <img src="/assets/images/testimonials/happy-client.jpg" alt="Happy Patient at Clinic">
                <div class="gallery-item-hover">
                  <h4>Patient Success Smile</h4>
                  <p>Restoring tooth health with care</p>
                </div>
              </div>
              <div class="gallery-item" data-category="patients">
                <img src="/assets/images/treatments/general-dentistry.jpg" alt="Family Smile">
                <div class="gallery-item-hover">
                  <h4>Family Dental Care</h4>
                  <p>Delivering happy oral smiles</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Lightbox Modal -->
        <div class="lightbox">
          <span class="lightbox-close">&times;</span>
          <span class="lightbox-nav lightbox-prev">&#10094;</span>
          <img class="lightbox-content" src="" alt="Enlarged gallery view">
          <span class="lightbox-nav lightbox-next">&#10095;</span>
        </div>
      `
    },
    {
      dir: 'contact',
      title: "Contact Us & Book Appointment | Manohar Dental Clinic Visakhapatnam",
      desc: "Contact Manohar Dental Clinic Visakhapatnam. Check address, phone numbers, working hours, and book a free call-back slot.",
      h1: "Contact Our Clinic",
      breadcrumb: "Contact Us",
      body: `
        <section class="section-padding reveal">
          <div class="container">
            <div class="service-split">
              <!-- Contact Details -->
              <div>
                <h2 style="font-size: 2rem; margin-bottom: 16px;">We'd Love to Hear From You</h2>
                <p style="color: var(--muted); margin-bottom: 32px; font-size: 1.05rem;">Get in touch with us to schedule your appointment, resolve billing queries, or inquire about emergency dental care.</p>
                
                <div class="grid grid-2" style="gap: 32px; margin-bottom: 40px;">
                  <div class="card" style="padding: 24px;">
                    <h4 style="margin-bottom: 8px; font-size: 1.1rem; color: var(--secondary);">Call Channels</h4>
                    <p style="font-weight: 600; font-size: 1.15rem; color: var(--primary);">+91 9703294358</p>
                    <p style="color: var(--muted); font-size: 0.85rem; margin-top: 4px;">Mon-Sat: 9:00 AM - 8:30 PM<br>Sun: 9:30 AM - 1:30 PM</p>
                  </div>
                  
                  <div class="card" style="padding: 24px;">
                    <h4 style="margin-bottom: 8px; font-size: 1.1rem; color: var(--accent);">Clinic Location</h4>
                    <p style="font-size: 0.95rem; color: var(--primary); line-height: 1.5;">50-94-27/A, Next to SBI, Near Gurudwara Road, Santhipuram, Dwaraka Nagar, Visakhapatnam - 530016</p>
                  </div>
                </div>

                <div class="card" style="background-color: var(--light-bg); padding: 32px;">
                  <h4 style="margin-bottom: 12px; font-size: 1.2rem;">Quick Consultation</h4>
                  <p style="color: var(--muted); margin-bottom: 20px; font-size: 0.95rem;">You can consult directly with our doctors on WhatsApp. Receive instant consultation guidance.</p>
                  <a href="https://api.whatsapp.com/send?phone=919703294358&text=Hello%20Manohar%20Dental%20Clinic,%20I%20have%20a%20question%20regarding%20my%20dental%20health." target="_blank" class="btn btn-whatsapp">Message on WhatsApp</a>
                </div>
              </div>

              <!-- Form Widget -->
              <div class="sidebar-card" style="position: static; padding:0;">
                <!-- APPOINTMENT_FORM_PLACEHOLDER -->
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      dir: 'blog',
      title: "Dental Health Blogs & Patient Guides | Manohar Dental Clinic Vizag",
      desc: "Read professional guides on dental implants recovery, root canal aftercare, braces guidelines, and oral hygiene tips from Manohar Dental Clinic.",
      h1: "Blogs & Patient Guides",
      breadcrumb: "Blog",
      body: `
        <section class="section-padding reveal">
          <div class="container">
            <div class="text-center" style="margin-bottom: 48px;">
              <h2>Expert Oral Health Information</h2>
              <p style="color: var(--muted); margin-top: 10px;">Read articles and quick guides written by our clinical specialists.</p>
            </div>
            
            <div class="grid grid-3">
              <div class="card" style="padding: 0; display: flex; flex-direction: column;">
                <div style="height: 200px; overflow: hidden; background-color: var(--light-bg);">
                  <img src="/assets/images/treatments/implants.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1;">
                  <span style="font-size: 0.75rem; color: var(--secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Dental Implants</span>
                  <h4 style="margin-bottom: 12px; font-size: 1.15rem;">What to Expect After Dental Implants Surgery</h4>
                  <p style="color: var(--muted); font-size: 0.85rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">A comprehensive recovery guide detailing pain management, diet restrictions, and hygiene rules after your implant placement.</p>
                  <a href="#" style="font-weight: 600; color: var(--secondary); font-size: 0.9rem;">Read Guide &rarr;</a>
                </div>
              </div>

              <div class="card" style="padding: 0; display: flex; flex-direction: column;">
                <div style="height: 200px; overflow: hidden; background-color: var(--light-bg);">
                  <img src="/assets/images/treatments/smile-makeover.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1;">
                  <span style="font-size: 0.75rem; color: var(--accent); font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Cosmetic Dentistry</span>
                  <h4 style="margin-bottom: 12px; font-size: 1.15rem;">Are Veneers Right for You? A Guide to Veneer Types</h4>
                  <p style="color: var(--muted); font-size: 0.85rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">Compare composite veneers and porcelain E-max veneers to understand costs, lifespans, and smile aesthetics suitability.</p>
                  <a href="#" style="font-weight: 600; color: var(--secondary); font-size: 0.9rem;">Read Guide &rarr;</a>
                </div>
              </div>

              <div class="card" style="padding: 0; display: flex; flex-direction: column;">
                <div style="height: 200px; overflow: hidden; background-color: var(--light-bg);">
                  <img src="/assets/images/treatments/general-dentistry.jpg" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1;">
                  <span style="font-size: 0.75rem; color: var(--muted); font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Oral Hygiene</span>
                  <h4 style="margin-bottom: 12px; font-size: 1.15rem;">The Right Brushing Technique: Stop Enamel Decay</h4>
                  <p style="color: var(--muted); font-size: 0.85rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">Most cavities are caused by wrong brushing. Learn the modified Bass method to preserve enamel coatings and secure gums.</p>
                  <a href="#" style="font-weight: 600; color: var(--secondary); font-size: 0.9rem;">Read Guide &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    }
  ];

  pagesToGenerate.forEach(page => {
    const dirPath = path.join(ROOT_DIR, page.dir);
    ensureDir(dirPath);
    
    // Construct page layout using standard structure
    let html = `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${page.title}</title>
  <meta name="description" content="${page.desc}">
  <link rel="canonical" href="https://manohardentalvisakhapatnam.com/${page.dir}/">
  
  <!-- Favicons -->
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/images/branding/favicon-192x192.png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/images/branding/apple-touch-icon.png">

  <!-- Style Sheets -->
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/pages.css">
</head>
<body>

  <!-- Scroll Progress Indicator -->
  <div class="scroll-progress"></div>

  <!-- HEADER_SECTION -->

  <!-- Page Hero -->
  <section class="page-hero">
    <div class="container">
      <h1>${page.h1}</h1>
      <div class="breadcrumbs">
        <a href="/index.html">Home</a> / <span>${page.breadcrumb}</span>
      </div>
    </div>
  </section>

  ${page.body}

  <!-- FOOTER_SECTION -->

  <!-- Scripts -->
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/navigation.js"></script>
  <script src="/assets/js/animations.js"></script>
  <script src="/assets/js/carousel.js"></script>
  <script src="/assets/js/forms.js"></script>
  <script src="/assets/js/utilities.js"></script>
</body>
</html>`;

    // Inject header and footer
    html = html.replace('<!-- HEADER_SECTION -->', headerTemplate);
    html = html.replace('<!-- FOOTER_SECTION -->', footerTemplate);
    
    // Inject appointment form
    html = html.replace('<!-- APPOINTMENT_FORM_PLACEHOLDER -->', formTemplate);

    // Rewrite links & assets
    html = rewritePaths(html, 1);

    fs.writeFileSync(path.join(dirPath, 'index.html'), html);
    console.log(`Generated support page: /${page.dir}/index.html`);
  });
}

// --------------------------------------------------------------------------
// Core build orchestrator
// --------------------------------------------------------------------------
function buildAll() {
  console.log('--- STARTING BUILD COMPILATION PROCESS ---');
  buildHomepage();
  buildAboutPage();
  buildTreatmentPages();
  buildDoctorPages();
  buildSupportPages();
  console.log('--- BUILD COMPILATION COMPLETED SUCCESSFULLY ---');
}

buildAll();
