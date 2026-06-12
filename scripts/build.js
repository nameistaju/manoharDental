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
    } else if (cleanPath.startsWith('blog/')) {
      const slug = cleanPath.split('/').slice(1).join('/');
      newPath = `blog/${slug}/index.html`;
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
  result = result.replace(/<!-- Premium Floating Actions -->/gi, '');
  
  // Strip <div class="floating-actions">
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

  // Strip <div class="premium-floating-actions-bar">
  let indexBar = result.indexOf('<div class="premium-floating-actions-bar"');
  while (indexBar !== -1) {
    let openDivs = 1;
    let tagEnd = result.indexOf('>', indexBar);
    if (tagEnd === -1) break;
    let pos = tagEnd + 1;
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
    result = result.substring(0, indexBar) + result.substring(pos);
    indexBar = result.indexOf('<div class="premium-floating-actions-bar"');
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
    let credentialsContent = extractSection(sourceHtml, '<div class="credentials-grid">', '<a');
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

  // FAQ Page Accordion
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

  // Private Helper: Expert Tip Card
  function renderExpertTipCard(authorName, text) {
    return `
      <div class="blog-expert-card">
        <div class="blog-expert-avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div class="blog-expert-info">
          <h4>Expert Advice From Manohar Dental</h4>
          <span class="expert-title">${authorName}</span>
          <p>${text}</p>
        </div>
      </div>
    `;
  }

  // Private Helper: Related Treatments
  function renderRelatedTreatments() {
    const treatments = [
      { name: 'Dental Implants', link: '/treatments/dental-implants/', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M12 8v14M9 13h6"/></svg>' },
      { name: 'Smile Makeover', link: '/treatments/smile-makeover/', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
      { name: 'Root Canal', link: '/treatments/root-canal-treatment/', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M5 12h14"/></svg>' },
      { name: 'Preventive Dentistry', link: '/treatments/preventive-dentistry/', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
      { name: 'Teeth Whitening', link: '/treatments/teeth-whitening/', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>' },
      { name: 'Dental Fillings', link: '/treatments/dental-fillings/', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>' }
    ];

    return `
      <div class="blog-related-section">
        <h3 class="blog-related-title">Related Treatments</h3>
        <div class="blog-related-grid">
          ${treatments.map(t => `
            <a href="${t.link}" class="blog-related-card">
              <div class="blog-related-icon">
                ${t.icon}
              </div>
              <h4>${t.name}</h4>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Private Helper: FAQ Accordion
  function renderBlogFaqs(faqs) {
    const faqItems = faqs.map((faq, idx) => `
      <div class="accordion-item">
        <div class="accordion-header" style="padding: 16px 20px;">
          <h4 style="font-size: 1rem; font-weight: 700; color: #0B1F4D; margin: 0;">${faq.q}</h4>
          <div class="accordion-icon" style="font-size: 0.8rem; color: #64748b;">▼</div>
        </div>
        <div class="accordion-content">
          <div class="accordion-content-inner" style="padding: 16px 20px; color: #475569; font-size: 0.95rem; line-height: 1.6;">
            ${faq.a}
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="blog-faq-section">
        <h3 class="blog-faq-title">Frequently Asked Questions</h3>
        <div class="accordion">
          ${faqItems}
        </div>
      </div>
    `;
  }

  // Private Helper: Blog CTA Section
  function renderBlogCta() {
    return `
      <div class="blog-cta-section-card" style="background: linear-gradient(135deg, #0B1F4D 0%, #05102a 100%); border-radius: 20px; padding: 40px; text-align: center; color: #ffffff; box-shadow: 0 15px 30px rgba(11, 31, 77, 0.15); margin: 60px 0; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
        <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(27, 168, 232, 0.1) 0%, transparent 80%); pointer-events: none;"></div>
        <h3 style="color: #ffffff; font-size: 2rem; font-weight: 800; margin-bottom: 12px; font-family: 'Outfit', sans-serif; position: relative; z-index: 1;">Need Expert Dental Advice?</h3>
        <p style="color: #94a3b8; font-size: 1.05rem; margin-bottom: 28px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6; position: relative; z-index: 1;">Our MDS specialists at Manohar Dental are ready to guide you on recovery, cosmetic options, and daily hygiene practices.</p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1;">
          <a href="/contact/index.html" class="btn" style="background-color: #ffffff !important; color: #0B1F4D !important; font-weight: 700; padding: 14px 28px; border-radius: 50px; text-decoration: none;">Book Appointment</a>
          <a href="tel:+919703294358" class="btn" style="background-color: transparent !important; color: #ffffff !important; border: 1.5px solid #ffffff !important; font-weight: 600; padding: 12px 26px; border-radius: 50px; text-decoration: none;">Call Now</a>
          <a href="https://api.whatsapp.com/send?phone=919703294358&text=Hello%20Manohar%20Dental%20Clinic,%20I%20have%20a%20question%20regarding%20my%20dental%20health." target="_blank" class="btn" style="background-color: #25D366 !important; color: #ffffff !important; font-weight: 600; padding: 14px 28px; border-radius: 50px; text-decoration: none; display: flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.729-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.988 14.113.96 11.487.96c-5.456 0-9.9 4.437-9.904 9.878-.002 2.012.52 3.98 1.513 5.707L2.1 21.8l5.547-1.455zM17.472 14.382c-.32-.16-1.89-.933-2.185-1.041-.295-.108-.51-.16-.723.16-.213.32-.82.103-1.003 1.21-.183.109-.368.125-.688-.035-.32-.16-1.349-.497-2.57-1.587-.949-.847-1.59-1.893-1.777-2.213-.187-.32-.02-.492.14-.65.143-.142.32-.373.479-.56.16-.188.213-.32.32-.533.107-.213.054-.4-.027-.56-.08-.16-.723-1.74-.99-2.392-.262-.63-.527-.545-.723-.555-.188-.01-.403-.012-.619-.012-.215 0-.567.08-.863.4-.297.32-1.135 1.109-1.135 2.701 0 1.593 1.16 3.13 1.321 3.345.162.215 2.28 3.479 5.523 4.879.772.333 1.373.53 1.843.68.775.246 1.48.211 2.037.128.621-.093 1.89-.773 2.152-1.48.262-.707.262-1.314.183-1.44-.079-.126-.295-.213-.615-.373z"/></svg>
            WhatsApp Us
          </a>
        </div>
      </div>
    `;
  }

  // Private Helper: Scrollspy ToC Script
  function renderScrollspyScript() {
    return `
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const links = document.querySelectorAll('.blog-toc-link');
          const headings = Array.from(links).map(link => document.querySelector(link.getAttribute('href')));
          
          const activeLink = () => {
            let index = headings.length;
            while(--index && window.scrollY + 160 < headings[index].offsetTop) {}
            links.forEach(link => link.classList.remove('active'));
            if (headings[index]) {
              links[index].classList.add('active');
            }
          };
          
          activeLink();
          window.addEventListener('scroll', activeLink);
        });
      </script>
    `;
  }

  // FAQs Arrays for Blog articles
  const implantsFaqs = [
    { q: "How long does pain last after dental implant surgery?", a: "Typically, you will experience mild-to-moderate discomfort for about 3 to 5 days. This is easily managed with prescribed pain relievers or standard anti-inflammatories like Ibuprofen." },
    { q: "Can I brush my teeth after implant surgery?", a: "Yes, you can brush your other teeth normally. However, avoid brushing the surgical site directly for the first 3 days to protect the healing gums and sutures. You can gently clean it by rinsing with warm salt water." },
    { q: "When can I eat solid foods again?", a: "Most patients can return to soft chewable foods after 3-4 days, and a normal diet after 7 to 10 days once gum swelling is fully gone and sutures have healed." },
    { q: "Why is using a straw prohibited after surgery?", a: "Sucking on a straw creates negative pressure in your mouth. This suction can easily dislodge the newly formed blood clot over the implant, causing fresh bleeding and delaying recovery." },
    { q: "Is swelling normal, and how long does it last?", a: "Yes, swelling is a normal part of the healing process. It usually peaks between 48 to 72 hours after surgery and starts to subside by the fifth or sixth day." },
    { q: "What should I do if my implant site starts bleeding again?", a: "Place a fresh, damp piece of sterile gauze over the site and bite down firmly to apply pressure. Sit upright and remain quiet for 30 minutes. If bleeding continues, contact our clinic." },
    { q: "Can I smoke after implant surgery?", a: "No. You must avoid smoking for at least 72 hours post-op. Nicotine constricts blood vessels and reduces oxygen flow in your gums, which significantly increases the risk of implant failure." },
    { q: "How long does the entire dental implant process take?", a: "On average, the process takes 3 to 6 months. This allows the jawbone enough time to fully fuse with the titanium post (osseointegration) before the final custom crown is attached." },
    { q: "What is osseointegration?", a: "It is the biological process where your natural bone cells grow and bond directly to the titanium surface of the dental implant, securing it permanently in place." },
    { q: "Can dental implants fail?", a: "Implant success rates are over 95%. Failures are rare and are usually caused by smoking, poor oral hygiene leading to gum infection, or certain uncontrolled medical conditions like diabetes." }
  ];

  const veneersFaqs = [
    { q: "Is the veneers procedure painful?", a: "No, the procedure is not painful as we use local anesthesia when preparing the teeth. You may experience mild tooth sensitivity to hot and cold for a few days after the temporary veneers are placed." },
    { q: "Can veneers stain like natural teeth?", a: "Porcelain and E-max veneers are non-porous glass-ceramics, meaning they are completely stain-resistant. Composite veneers, however, are porous and can absorb pigments over time, causing discoloration." },
    { q: "Can veneers be removed if I change my mind?", a: "Porcelain and E-max veneers are irreversible because a small amount of enamel must be shaved to fit them. Direct composite veneers require minimal preparation and can sometimes be removed, though teeth may still need restoration." },
    { q: "How do I care for my veneers?", a: "Brush twice daily with non-abrasive toothpaste, floss daily, avoid biting on hard objects (like ice or fingernails), and visit your dentist regularly for cleanings." },
    { q: "Do veneers look natural?", a: "Yes. High-quality porcelain and E-max veneers are customized to match your face shape and are layered to mimic the natural translucency and gloss of tooth enamel." },
    { q: "What happens if a veneer falls off or chips?", a: "If a veneer chips or debonds, contact Manohar Dental immediately. Direct composite veneers can be repaired in the chair, but porcelain and E-max veneers usually need to be replaced." },
    { q: "Do veneers ruin your natural teeth?", a: "No, veneers do not ruin teeth. While a tiny layer of enamel is removed for bonding, the underlying tooth structure remains healthy, strong, and fully protected by the veneer shell." },
    { q: "Can I get veneers if I grind my teeth?", a: "Yes, but you must wear a custom nightguard while sleeping. Teeth grinding (bruxism) exerts extreme forces that can easily fracture or debond both composite and ceramic veneers." },
    { q: "Can veneers fix crooked teeth?", a: "Veneers can mask minor misalignment, overlapping, or gaps—often called 'instant orthodontics'. However, severe crowding or malocclusion requires braces or clear aligners first." },
    { q: "How many veneers do I need?", a: "It depends on your goals. Some patients only need 1 or 2 veneers to cover chipped teeth, while others get 6, 8, or 10 veneers across their upper 'social six' teeth to perform a full cosmetic smile makeover." }
  ];

  const brushingFaqs = [
    { q: "Is an electric toothbrush better than a manual toothbrush?", a: "Both are effective if used correctly. However, electric toothbrushes are superior at plaque removal, make it easier to reach difficult spots, and have pressure sensors to prevent aggressive brushing." },
    { q: "What stiffness of toothbrush bristles should I use?", a: "Always use soft or extra-soft bristles. Medium and hard bristles are too abrasive and can wear down your enamel and push back your gum tissues." },
    { q: "Why are my teeth turning yellow near the gums?", a: "This is often due to enamel abrasion. Aggressive horizontal scrubbing wears away the thin enamel at the gum line, exposing the dark yellow dentin underneath." },
    { q: "How often should I replace my toothbrush?", a: "You should replace your toothbrush (or electric brush head) every 3 months, or sooner if the bristles become frayed or flared." },
    { q: "Does flossing really matter if I brush well?", a: "Yes. Brushing only cleans 60% of your teeth. Flossing is the only way to remove plaque and food particles from the remaining 40% of surfaces between your teeth." },
    { q: "Should I brush my tongue?", a: "Yes. The tongue acts like a sponge for bacteria, which can cause bad breath and re-deposit plaque onto your clean teeth. Brush it gently or use a tongue scraper." },
    { q: "How long should I brush my teeth?", a: "You should brush for a full 2 minutes, twice a day. Divide your mouth into four quadrants and spend 30 seconds on each." },
    { q: "Can lost enamel grow back?", a: "No, enamel cannot grow back because it contains no living cells. However, weakened enamel can be hardened and remineralized using fluoride or nano-hydroxyapatite toothpastes." },
    { q: "Should I rinse my mouth with water after brushing?", a: "No, you should spit out the excess toothpaste but avoid rinsing with water immediately. Leaving a thin layer of toothpaste on your teeth keeps the fluoride working to strengthen enamel." },
    { q: "What is tooth abrasion?", a: "Tooth abrasion is the physical wear of tooth enamel and dentin caused by friction from foreign objects, most commonly hard-bristled toothbrushes and abrasive brushing techniques." }
  ];

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
                    <h4 style="margin-bottom: 8px; font-size: 1.15rem; color: var(--secondary);">Call Channels</h4>
                    <p style="font-weight: 600; font-size: 1.15rem; color: var(--primary);">+91 9703294358</p>
                    <p style="color: var(--muted); font-size: 0.85rem; margin-top: 4px;">Mon-Sat: 9:00 AM - 8:30 PM<br>Sun: 9:30 AM - 1:30 PM</p>
                  </div>
                  
                  <div class="card" style="padding: 24px;">
                    <h4 style="margin-bottom: 8px; font-size: 1.15rem; color: var(--accent);">Clinic Location</h4>
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
                  <a href="/blog/dental-implants-recovery/" style="font-weight: 600; color: var(--secondary); font-size: 0.9rem;">Read Guide &rarr;</a>
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
                  <a href="/blog/veneers-guide/" style="font-weight: 600; color: var(--secondary); font-size: 0.9rem;">Read Guide &rarr;</a>
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
                  <a href="/blog/brushing-technique/" style="font-weight: 600; color: var(--secondary); font-size: 0.9rem;">Read Guide &rarr;</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      `
    },
    {
      dir: 'blog/dental-implants-recovery',
      isBlog: true,
      category: "Dental Implants",
      author: "Manohar Dental Team",
      readingTime: "6 min read",
      date: "June 12, 2026",
      publishDateIso: "2026-06-12",
      featuredImage: "/assets/images/treatments/implants.jpg",
      title: "Recovery Guide: What to Expect After Dental Implants Surgery | Manohar Dental",
      desc: "An expert recovery guide detailing what to expect after dental implants placement, including diet, pain control, and hygiene. Written by MDS specialists.",
      h1: "What to Expect After Dental Implants Surgery",
      expertTipAuthor: "Dr. Srinivas Manohar, MDS",
      expertTipText: "The success of your dental implant depends 50% on the surgeon's precision, and 50% on your home care during the first week. Avoid smoking or alcohol consumption for at least 72 hours, as nicotine constricts blood vessels and significantly delays tissue healing.",
      blogFaqs: implantsFaqs,
      toc: [
        { id: 'introduction', text: '1. Introduction' },
        { id: 'post-op', text: '2. Immediate Post-Op (24h)' },
        { id: 'first-week', text: '3. First Week Recovery' },
        { id: 'diet', text: '4. Diet Recommendations' },
        { id: 'pain-management', text: '5. Pain & Swelling' },
        { id: 'healing-stages', text: '6. Healing Stages' },
        { id: 'when-to-contact', text: '7. When to Call Dentist' },
        { id: 'long-term-care', text: '8. Long-Term Care' }
      ],
      body: `
        <div id="introduction">
          <p style="font-size: 1.15rem; color: #475569; line-height: 1.8; margin-bottom: 24px; font-weight: 500;">Welcome to your recovery phase. While dental implant surgery is a highly predictable and routine specialist-led procedure at Manohar Dental, the healing process is the critical foundation that determines long-term success. Understanding what to expect during this journey allows you to manage discomfort effectively and avoid complications.</p>
          <p>Over the next few days, your jawbone and gum tissues will undergo the initial stages of osseointegration—where the titanium implant post fuses with your bone structure. Proper care during this window is vital to secure the implant.</p>
          <p>This guide is prepared by our MDS surgical team to take you step-by-step through the recovery timeline, pain relief protocols, and daily hygiene rules.</p>
          <div style="font-weight: 700; color: #14C6C6; margin-top: 20px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Medically reviewed by MDS Specialists
          </div>
        </div>

        <div id="post-op">
          <h2>Immediate Post-Op (First 24 Hours)</h2>
          <p>The first 24 hours are the most critical for your healing gums. Your primary goal is to protect the surgical site and allow a stable blood clot to form over the implant post.</p>
          <ul>
            <li><strong>Bite on Gauze:</strong> Keep firm, steady pressure on the gauze pad placed over the surgery site for 30 to 45 minutes. If bleeding persists, place a fresh, damp gauze pad and bite for another 30 minutes.</li>
            <li><strong>Minimize Activity:</strong> Rest quietly with your head elevated on pillows. Avoid any strenuous physical activity, bending, or heavy lifting, as this increases blood pressure and can cause bleeding.</li>
          </ul>
          <div class="blog-warning">
            <div class="blog-warning-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Crucial Warning
            </div>
            <p>Do NOT spit, rinse forcefully, touch the wound with your tongue or fingers, or drink through a straw. The suction pressure created by these actions will dislodge the developing blood clot, leading to bleeding and delaying the healing process.</p>
          </div>
        </div>

        <div id="first-week">
          <h2>Recovery Timeline (First Week)</h2>
          <p>As you progress through the first week, your body will adapt and the initial surgical discomfort will decrease.</p>
          <ul>
            <li><strong>Days 2 to 3:</strong> Swelling and bruising typically peak during this period. This is a normal inflammatory response and not a sign of infection. Continue to rest and keep your head elevated.</li>
            <li><strong>Days 4 to 7:</strong> Swelling should begin to subside, and jaw stiffness will improve. You can start transitioning back to your normal routine, but keep workouts gentle.</li>
            <li><strong>Oral Hygiene Rules:</strong> Do not rinse your mouth on Day 1. Starting on Day 2, gently rinse with warm salt water (1/2 teaspoon of salt in a glass of warm water) 4 to 5 times a day, particularly after meals, to keep the site clean. Brush your other teeth normally, but be extremely gentle around the implant site.</li>
          </ul>
        </div>

        <div id="diet">
          <h2>Diet Recommendations</h2>
          <p>Nutrition plays a key role in cellular repair. However, eating the wrong foods can physically damage the healing gums or cause infection.</p>
          <div class="blog-callout">
            <p><strong>Rule of Thumb:</strong> If you have to chew it, avoid it for the first 48 hours. Focus on cool, soft foods and liquids.</p>
          </div>
          <h3>Recommended Foods:</h3>
          <ul>
            <li>Yogurt, smoothies, and milkshakes (remember: no straws!)</li>
            <li>Cool or lukewarm soups (broths, tomato soup, smooth pumpkin soup)</li>
            <li>Mashed potatoes, mashed avocados, and applesauce</li>
            <li>Soft foods like scrambled eggs, oatmeal, cooked pasta, and flaky fish</li>
          </ul>
          <h3>Foods to Avoid:</h3>
          <ul>
            <li>Hot liquids (tea, coffee, hot soup) which can dissolve the blood clot</li>
            <li>Spicy, acidic, or highly seasoned foods that irritate the surgical wound</li>
            <li>Hard, crunchy, or sharp foods (chips, nuts, popcorn, crusty bread) which can physically damage the gums</li>
          </ul>
        </div>

        <div id="pain-management">
          <h2>Pain & Swelling Management</h2>
          <p>Some discomfort is natural once the local anesthesia wears off. Managing it properly ensures a smoother recovery.</p>
          <ul>
            <li><strong>Pain Relief:</strong> Take your first dose of pain medication before the numbness fully fades. Over-the-counter anti-inflammatories like Ibuprofen are highly effective at controlling both pain and swelling. If our surgeons prescribed stronger pain relievers, take them strictly as directed.</li>
            <li><strong>Swelling Control:</strong> Apply an ice pack wrapped in a cloth to the side of your face where surgery was performed. Use a 20-minutes-on, 20-minutes-off cycle for the first 24 hours. After 36 hours, ice is less effective; switch to moist warm compresses to soothe jaw stiffness.</li>
          </ul>
        </div>

        <div id="healing-stages">
          <h2>Healing Stages (Osseointegration)</h2>
          <p>While your gums will heal within 1 to 2 weeks, the bone underneath requires more time. This critical bone-healing phase is called <strong>osseointegration</strong>.</p>
          <p>During osseointegration, the jawbone cells grow directly onto the textured surface of the titanium implant post. This process creates a permanent biological bond, turning the implant into a solid, immovable root for your future crown. Osseointegration typically takes 3 to 6 months. During this time, the implant is left undisturbed beneath the gums, or fitted with a temporary, non-functional crown.</p>
        </div>

        <div id="when-to-contact">
          <h2>When to Contact the Dentist</h2>
          <p>While complications are rare, you should monitor your healing closely. Contact Manohar Dental immediately if you experience:</p>
          <ul>
            <li>Continuous, heavy bleeding that doesn't stop after biting on gauze for 1 hour</li>
            <li>Severe pain that increases after 3 to 4 days or isn't relieved by medication</li>
            <li>A fever exceeding 101°F (38.3°C) starting 24 hours or more post-op</li>
            <li>Persistent numbness in your lip, chin, or tongue that lasts past the first day</li>
            <li>The feeling that the implant post or healing abutment is loose</li>
          </ul>
        </div>

        <div id="long-term-care">
          <h2>Long-Term Implant Care</h2>
          <p>Once osseointegration is complete and your final porcelain crown is attached, your dental implant functions exactly like a natural tooth. Although implants cannot get cavities, the surrounding gum tissues can still get infected (a condition called peri-implantitis) if hygiene is neglected.</p>
          <ul>
            <li><strong>Daily Hygiene:</strong> Brush twice a day with a soft-bristled brush. Floss daily, using specialized implant floss or a water flosser to clean the space where the crown meets the gum line.</li>
            <li><strong>Regular Checkups:</strong> Visit Manohar Dental every 6 months for professional cleanings and examinations. We will take digital X-rays to ensure the bone surrounding your implant remains dense and healthy.</li>
          </ul>
        </div>
      `
    },
    {
      dir: 'blog/veneers-guide',
      isBlog: true,
      category: "Cosmetic Dentistry",
      author: "Manohar Dental Team",
      readingTime: "7 min read",
      date: "June 10, 2026",
      publishDateIso: "2026-06-10",
      featuredImage: "/assets/images/treatments/smile-makeover.jpg",
      title: "Are Veneers Right for You? A Guide to Veneer Types | Manohar Dental Clinic",
      desc: "Compare composite veneers and porcelain E-max veneers to understand costs, lifespans, and smile aesthetics suitability. Written by MDS cosmetic specialists.",
      h1: "Are Veneers Right for You? A Guide to Veneer Types",
      expertTipAuthor: "Dr. Sirisha, MDS",
      expertTipText: "Many patients request E-max veneers because they require minimal enamel shaving. However, if your teeth are severely stained or dark, ultra-thin veneers might allow the dark undertones to show through. Traditional porcelain veneers are better for masking deep discoloration.",
      blogFaqs: veneersFaqs,
      toc: [
        { id: 'introduction', text: '1. Introduction' },
        { id: 'what-are-veneers', text: '2. What Are Veneers?' },
        { id: 'porcelain-veneers', text: '3. Porcelain Veneers' },
        { id: 'composite-veneers', text: '4. Composite Veneers' },
        { id: 'e-max-veneers', text: '5. E-Max Veneers' },
        { id: 'pros-cons', text: '6. Pros & Cons Comparison' },
        { id: 'cost-factors', text: '7. Cost & Budget Factors' },
        { id: 'candidate-suitability', text: '8. Candidate Suitability' }
      ],
      body: `
        <div id="introduction">
          <p style="font-size: 1.15rem; color: #475569; line-height: 1.8; margin-bottom: 24px; font-weight: 500;">A radiant smile is one of your most powerful assets, but dental flaws like severe staining, chips, gaps, or minor misalignment can hold you back. Dental veneers are a highly sought-after cosmetic solution designed to mask these imperfections and completely recreate your smile's aesthetics.</p>
          <p>However, veneers are not a one-size-fits-all treatment. Modern dentistry offers different materials, including porcelain, composite resin, and premium E-max, each with distinct benefits, lifespans, and costs.</p>
          <p>This comprehensive guide written by our MDS cosmetic specialists compares veneer types to help you make an informed decision on which solution is right for your smile goals.</p>
          <div style="font-weight: 700; color: #14C6C6; margin-top: 20px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Medically reviewed by MDS Specialists
          </div>
        </div>

        <div id="what-are-veneers">
          <h2>What Are Dental Veneers?</h2>
          <p>Dental veneers are custom-made, shell-like coverings designed to bond to the front surfaces of your teeth. Veneers are purely cosmetic restorations; they change the color, shape, size, or length of your teeth to create a harmonious, bright smile.</p>
          <p>They are widely used to treat:</p>
          <ul>
            <li>Deep discoloration that cannot be resolved with professional teeth whitening</li>
            <li>Chipped, worn down, or fractured teeth</li>
            <li>Gaps or spacing issues between teeth</li>
            <li>Mildly crooked or misaligned teeth (often called "instant orthodontics")</li>
          </ul>
        </div>

        <div id="porcelain-veneers">
          <h2>Porcelain Veneers</h2>
          <p>Porcelain veneers are the traditional standard in cosmetic dentistry. They are crafted in a dental laboratory from high-grade ceramic layers.</p>
          <ul>
            <li><strong>Procedure:</strong> The dentist removes a thin layer of enamel (about 0.5mm) from the front and sides of the teeth to create space for the veneer. The dentist takes an impression of your teeth and sends it to a lab. You receive temporary veneers while the laboratory fabricates the custom porcelain shells, which are then bonded on your next visit.</li>
            <li><strong>Appearance:</strong> Porcelain mimics the light-reflecting properties of natural enamel incredibly well, providing a highly organic look.</li>
            <li><strong>Stain Resistance:</strong> Porcelain is a non-porous glass-like material, making it highly resistant to stains from coffee, tea, red wine, and smoking.</li>
            <li><strong>Lifespan:</strong> With proper care, they last between 10 to 15 years.</li>
          </ul>
        </div>

        <div id="composite-veneers">
          <h2>Composite Veneers</h2>
          <p>Composite veneers are made from a dental-grade composite resin—the same material used for tooth-colored fillings.</p>
          <ul>
            <li><strong>Direct Composite Veneers:</strong> Applied directly by the dentist to the teeth. The dentist sculpts, shapes, and hardens the resin using a curing light in a single visit. This requires little to no enamel removal.</li>
            <li><strong>Indirect Composite Veneers:</strong> Prepared in a lab from impressions, similar to porcelain, but made of resin. They offer slightly higher durability than direct composites.</li>
            <li><strong>Benefits:</strong> They are significantly faster and more affordable than porcelain veneers. If they chip, they can be easily repaired in a single clinic visit.</li>
            <li><strong>Drawbacks:</strong> They are more porous than porcelain, meaning they stain over time and have a shorter lifespan, usually lasting 5 to 7 years.</li>
          </ul>
          <div class="blog-warning">
            <div class="blog-warning-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Staining Note
            </div>
            <p>Composite resin absorbs food pigments over time. If you drink coffee daily, expect composite veneers to show yellowing or dullness after a few years, requiring regular polishing.</p>
          </div>
        </div>

        <div id="e-max-veneers">
          <h2>E-Max Veneers</h2>
          <p>E-max is a premium lithium disilicate glass-ceramic material that has revolutionized modern cosmetic dentistry.</p>
          <ul>
            <li><strong>Unmatched Strength:</strong> E-max is incredibly strong and fracture-resistant. Because of this structural strength, the veneers can be crafted ultra-thin (down to 0.2mm to 0.3mm).</li>
            <li><strong>Minimal Preparation:</strong> Since E-max veneers are paper-thin, they require minimal enamel removal—sometimes none at all. This preserves more of your natural tooth structure.</li>
            <li><strong>Flawless Translucency:</strong> E-max has a natural shade profile and translucency, allowing it to blend seamlessly with your adjacent natural teeth.</li>
            <li><strong>Lifespan:</strong> E-max veneers are extremely durable, lasting 15 to 20 years with correct maintenance.</li>
          </ul>
        </div>

        <div id="pros-cons">
          <h2>Porcelain vs. Composite vs. E-max</h2>
          <p>Here is a summary table comparing the key performance properties of the three veneer types:</p>
          
          <div class="blog-table-container">
            <table class="blog-comparison-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Composite Veneers</th>
                  <th>Porcelain Veneers</th>
                  <th>E-max Veneers</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Material Strength</strong></td>
                  <td>Moderate</td>
                  <td>High</td>
                  <td>Extremely High</td>
                </tr>
                <tr>
                  <td><strong>Enamel Prep Required</strong></td>
                  <td>None to Minimal (0.1mm)</td>
                  <td>Moderate (0.5mm)</td>
                  <td>Minimal (0.2mm - 0.3mm)</td>
                </tr>
                <tr>
                  <td><strong>Stain Resistance</strong></td>
                  <td>Moderate (Stains over time)</td>
                  <td>Excellent (Highly resistant)</td>
                  <td>Outstanding (Completely resistant)</td>
                </tr>
                <tr>
                  <td><strong>Average Lifespan</strong></td>
                  <td>5 - 7 Years</td>
                  <td>10 - 15 Years</td>
                  <td>15 - 20 Years</td>
                </tr>
                <tr>
                  <td><strong>Procedure Visits</strong></td>
                  <td>1 Visit (Direct)</td>
                  <td>2 Visits</td>
                  <td>2 Visits</td>
                </tr>
                <tr>
                  <td><strong>Repairability</strong></td>
                  <td>Easy to repair in clinic</td>
                  <td>Must be replaced if broken</td>
                  <td>Must be replaced if broken</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div id="cost-factors">
          <h2>Cost & Budget Factors</h2>
          <p>When selecting a veneer type, budget is an important factor. Composite veneers represent the lowest initial cost, making them highly accessible. However, because they must be replaced every 5-7 years, their long-term cost can surpass that of ceramic alternatives.</p>
          <p>Porcelain and E-max veneers require a higher initial investment but offer superior longevity, aesthetic performance, and stain resistance. They rarely require repair, making them the most cost-effective and premium solution over a 15-year period.</p>
        </div>

        <div id="candidate-suitability">
          <h2>Candidate Suitability</h2>
          <p>Are veneers right for you? A thorough examination by our cosmetic team at Manohar Dental is necessary. Generally, you are a good candidate if:</p>
          <ul>
            <li>You have healthy teeth and gums, with no active decay or gum disease.</li>
            <li>You have sufficient tooth enamel to support bonding.</li>
            <li>You do not suffer from severe teeth grinding (bruxism) or clenching. Grinding puts extreme pressure on veneers, which can chip or break them. If you do grind your teeth, you must wear a custom nightguard to protect your veneers.</li>
            <li>You have minor misalignment or spacing issues. Major orthodontic crowding requires clear aligners or braces.</li>
          </ul>
        </div>
      `
    },
    {
      dir: 'blog/brushing-technique',
      isBlog: true,
      category: "Oral Hygiene",
      author: "Manohar Dental Team",
      readingTime: "5 min read",
      date: "June 8, 2026",
      publishDateIso: "2026-06-08",
      featuredImage: "/assets/images/treatments/general-dentistry.jpg",
      title: "The Right Brushing Technique: Stop Enamel Decay | Manohar Dental",
      desc: "Learn the Modified Bass brushing technique to prevent enamel decay and gum recession. Read guide by Manohar Dental MDS preventive team.",
      h1: "The Right Brushing Technique: Stop Enamel Decay",
      expertTipAuthor: "Dr. Usha Sri, MDS",
      expertTipText: "Never brush immediately after eating citrus fruits, drinking soda, or vomiting. The acid softens your enamel, and scrubbing immediately will literally brush the enamel away. Instead, rinse your mouth with water or baking soda solution, and wait 30 minutes before brushing.",
      blogFaqs: brushingFaqs,
      toc: [
        { id: 'introduction', text: '1. Introduction' },
        { id: 'why-enamel-wears-down', text: '2. Enamel Wear Causes' },
        { id: 'common-mistakes', text: '3. Common Mistakes' },
        { id: 'modified-bass-method', text: '4. Modified Bass Method' },
        { id: 'choosing-tools', text: '5. Choosing Tools' },
        { id: 'flossing-mouthrinse', text: '6. Floss & Mouthwash' },
        { id: 'morning-night-routine', text: '7. Morning vs. Night Care' }
      ],
      body: `
        <div id="introduction">
          <p style="font-size: 1.15rem; color: #475569; line-height: 1.8; margin-bottom: 24px; font-weight: 500;">You probably brush your teeth twice a day, but are you doing it correctly? Research shows that over 80% of adults use incorrect brushing techniques, such as scrubbing back-and-forth with heavy pressure. This aggressive motion doesn't clean effectively and wears down your precious tooth enamel and recedes your gums.</p>
          <p>Enamel is the hard, protective outer shell of your teeth. Once lost, enamel cannot regenerate because it has no living cells. Worn enamel exposes the yellowish dentin layer beneath, leading to tooth sensitivity and cavities.</p>
          <p>This clinical guide by our MDS preventive care team explains why enamel wears down, lists common mistakes, and outlines the correct brushing method to secure your smile.</p>
          <div style="font-weight: 700; color: #14C6C6; margin-top: 20px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; margin-bottom: 32px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Medically reviewed by MDS Specialists
          </div>
        </div>

        <div id="why-enamel-wears-down">
          <h2>Why Tooth Enamel Wears Down</h2>
          <p>Tooth enamel is the hardest substance in the human body—even harder than bone. However, it is vulnerable to chemical erosion and mechanical wear.</p>
          <ul>
            <li><strong>Acidic Foods and Drinks:</strong> Citrus fruits, sodas, sports drinks, and wine contain acids that temporarily soften enamel minerals.</li>
            <li><strong>Tooth Grinding (Bruxism):</strong> Clenching or grinding teeth at night fractures micro-layers of enamel, particularly near the gum line (abfraction).</li>
            <li><strong>Acid Reflux or Vomiting:</strong> Chronic exposure to stomach acid quickly dissolves enamel coatings.</li>
            <li><strong>Brushing Abrasion:</strong> Scrubbing teeth horizontally with medium or hard bristles physically strips the softened enamel away.</li>
          </ul>
        </div>

        <div id="common-mistakes">
          <h2>Common Brushing Mistakes</h2>
          <p>Are you guilty of these common oral hygiene errors?</p>
          <ul>
            <li><strong>Scrubbing Back-and-Forth:</strong> Moving your brush horizontally like a saw wears notches into your teeth near the gum line, exposing sensitive roots.</li>
            <li><strong>Brushing Immediately After Acidic Meals:</strong> Acids soften your enamel. If you brush immediately, you are literally brushing the enamel away. Wait 30 minutes for your saliva to naturally neutralize the acid.</li>
            <li><strong>Using a Hard Bristle Brush:</strong> Hard bristles do not clean plaque better than soft ones; they only irritate gums and wear down enamel.</li>
            <li><strong>Rushing the Process:</strong> Most people brush for under 45 seconds. Plaque requires a full 2 minutes of thorough brushing to clear.</li>
          </ul>
        </div>

        <div id="modified-bass-method">
          <h2>The Modified Bass Brushing Method</h2>
          <p>The Modified Bass method is the gold standard brushing technique recommended by dental specialists worldwide. It focuses on cleaning the vital area where your teeth meet your gums.</p>
          <div class="blog-callout">
            <p><strong>Step-by-Step Modified Bass Guide:</strong></p>
            <ol>
              <li><strong>Angle the Brush:</strong> Place your toothbrush bristles against the teeth at a 45-degree angle toward the gum line. The bristles should gently tuck slightly under the edge of the gums.</li>
              <li><strong>Vibrate the Brush:</strong> Make small, gentle circular or vibratory motions. The brush head should wiggle back and forth in a tight space. This dislodges plaque without rubbing the enamel away.</li>
              <li><strong>Sweep Away:</strong> After wiggling 5-6 times in one spot, sweep the bristles away from the gums (downward for upper teeth, upward for lower teeth). This sweeps the loose plaque out.</li>
              <li><strong>Systematic Clean:</strong> Clean the outer and inner surfaces of every tooth using this technique. For the inner surfaces of front teeth, hold the brush vertically and make gentle upward or downward strokes.</li>
              <li><strong>Chewing Surfaces:</strong> Place the bristles flat on the chewing surfaces of your molars and use light back-and-forth scrubbing strokes.</li>
            </ol>
          </div>
        </div>

        <div id="choosing-tools">
          <h2>Choosing Toothbrush & Toothpaste</h2>
          <p>Your technique is only as good as the tools you use.</p>
          <ul>
            <li><strong>Toothbrush:</strong> Always select a brush labeled "Soft" or "Extra Soft." If you struggle with manual technique, switch to an electric toothbrush. High-quality electric brushes use micro-vibrations and feature pressure sensors that light up or stop if you press too hard.</li>
            <li><strong>Toothpaste:</strong> Use a toothpaste containing fluoride to strengthen and remineralize weak enamel. If you prefer fluoride-free alternatives, look for nano-hydroxyapatite (n-HAp) toothpaste, which uses bone-building minerals to repair micro-cracks in enamel.</li>
          </ul>
          <div class="blog-warning">
            <div class="blog-warning-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Abrasive Warning
            </div>
            <p>Avoid charcoal and highly abrasive whitening toothpastes. These toothpastes contain rough silica particles that act like sandpaper, scratching and stripping away your enamel over time.</p>
          </div>
        </div>

        <div id="flossing-mouthrinse">
          <h2>Flossing & Mouthrinse Techniques</h2>
          <p>Brushing only cleans about 60% of your tooth surfaces. The remaining 40% lies between your teeth, where your brush cannot reach.</p>
          <ul>
            <li><strong>Floss Daily:</strong> Gently slide dental floss between your teeth. Curve it into a "C" shape against the side of one tooth and slide it up and down. Never snap the floss down onto your gums, as this causes tissue damage.</li>
            <li><strong>Mouthwash Rule:</strong> Use a non-alcoholic fluoride mouthwash. However, do not rinse with mouthwash immediately after brushing your teeth, as this washes away the highly concentrated fluoride from your toothpaste. Instead, spit out the excess toothpaste but do not rinse, and use mouthwash at a different time of day (e.g. after lunch).</li>
          </ul>
        </div>

        <div id="morning-night-routine">
          <h2>Morning vs. Night Care Routine</h2>
          <p>Your oral environment changes between day and night. Customize your hygiene routines to match these changes:</p>
          
          <div class="routine-cards-grid">
            <div class="routine-card morning">
              <div class="routine-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                Morning Routine
              </div>
              <ul class="routine-list">
                <li>Brush <strong>before</strong> breakfast to clear bacteria that multiplied overnight and coat teeth with protective fluoride.</li>
                <li>If brushing after breakfast, wait 30 minutes to protect acid-softened enamel.</li>
                <li>Use a metal or plastic tongue scraper to remove bacteria and freshen breath.</li>
              </ul>
            </div>
            
            <div class="routine-card night">
              <div class="routine-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                Night Routine
              </div>
              <ul class="routine-list">
                <li>The most critical cleaning of the day! Saliva flow drops at night, reducing your mouth's natural defense against acid.</li>
                <li>Floss thoroughly between all teeth to clear plaque.</li>
                <li>Brush for a full 2 minutes using the Modified Bass method.</li>
                <li>Spit out excess toothpaste but <strong>do not rinse with water</strong>. Let the fluoride sit on your teeth overnight.</li>
              </ul>
            </div>
          </div>
        </div>
      `
    }
  ];

  pagesToGenerate.forEach(page => {
    const dirPath = path.join(ROOT_DIR, page.dir);
    ensureDir(dirPath);

    // Redirect standalone pages to their homepage sections (results, testimonials, gallery)
    const redirects = {
      'results': '../index.html#results-section',
      'testimonials': '../index.html#testimonials-section',
      'gallery': '../index.html#gallery-section'
    };

    if (redirects[page.dir]) {
      const targetUrl = redirects[page.dir];
      const redirectHtml = `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${targetUrl}">
  <title>Redirecting...</title>
  <script type="text/javascript">
    window.location.href = "${targetUrl}";
  </script>
</head>
<body>
  <p>Redirecting to <a href="${targetUrl}">${page.h1}</a>...</p>
</body>
</html>`;
      fs.writeFileSync(path.join(dirPath, 'index.html'), redirectHtml);
      console.log(`Generated HTML Redirect for: /${page.dir}/ -> ${targetUrl}`);
      return;
    }

    // Determine depth: depth 2 for sub-pages like 'blog/something', depth 1 otherwise
    const depth = page.dir.includes('/') ? 2 : 1;
    const prefix = depth === 2 ? '../../' : '../';

    // Construct ToC HTML if defined
    let tocHtml = '';
    if (page.toc) {
      tocHtml = `
        <aside class="blog-sidebar">
          <div class="blog-toc-card">
            <h3>Table of Contents</h3>
            <ul class="blog-toc-list">
              ${page.toc.map(item => `
                <li class="blog-toc-item">
                  <a href="#${item.id}" class="blog-toc-link">${item.text}</a>
                </li>
              `).join('')}
            </ul>
          </div>
        </aside>
      `;
    }

    // Build the body depending on whether it is a blog detail page
    let finalBodyHtml = page.body;
    let seoSchemaHtml = '';
    let ogTagsHtml = '';
    
    if (page.isBlog) {
      // Assemble core components
      const expertTipHtml = renderExpertTipCard(page.expertTipAuthor, page.expertTipText);
      const relatedHtml = renderRelatedTreatments();
      const faqHtml = renderBlogFaqs(page.blogFaqs);
      const ctaHtml = renderBlogCta();
      const scrollspyHtml = renderScrollspyScript();

      finalBodyHtml = `
        <section class="section-padding" style="background-color: #ffffff; padding: 60px 0;">
          <div class="container">
            <div class="blog-featured-image-container" style="max-width: 900px; margin: -100px auto 48px; position: relative; z-index: 15; padding: 0 10px;">
              <div style="border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(11, 31, 77, 0.15); aspect-ratio: 16/9; background-color: #f1f5f9;">
                <img src="${page.featuredImage}" alt="${page.h1}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
              </div>
            </div>
            
            <div class="blog-detail-container">
              <div class="blog-content-area">
                ${page.body}
                ${expertTipHtml}
                ${relatedHtml}
                ${faqHtml}
                ${ctaHtml}
              </div>
              ${tocHtml}
            </div>
          </div>
        </section>
        ${scrollspyHtml}
      `;

      // Build JSON-LD Article Schema
      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": page.h1,
        "description": page.desc,
        "image": `https://manohardentalvisakhapatnam.com${page.featuredImage}`,
        "author": {
          "@type": "Organization",
          "name": page.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Manohar Dental Clinic",
          "logo": {
            "@type": "ImageObject",
            "url": "https://manohardentalvisakhapatnam.com/assets/images/branding/logo.png"
          }
        },
        "datePublished": page.publishDateIso,
        "dateModified": page.publishDateIso,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://manohardentalvisakhapatnam.com/${page.dir}/`
        }
      };

      seoSchemaHtml = `\n  <script type="application/ld+json">\n    ${JSON.stringify(schema, null, 2).replace(/\n/g, '\n    ')}\n  </script>`;

      // Build OG and Twitter metadata
      ogTagsHtml = `
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.desc}">
  <meta property="og:image" content="https://manohardentalvisakhapatnam.com${page.featuredImage}">
  <meta property="og:url" content="https://manohardentalvisakhapatnam.com/${page.dir}/">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">`;
    }

    // Render Hero Section
    let heroHtml = `
      <section class="page-hero${page.dir === 'blog' ? ' blog-landing-hero' : ''}">
        <div class="container">
          <h1>${page.h1}</h1>
          <div class="breadcrumbs">
            <a href="/index.html">Home</a> / <span>${page.breadcrumb}</span>
          </div>
        </div>
      </section>
    `;

    if (page.isBlog) {
      heroHtml = `
        <section class="page-hero blog-detail-hero" style="background-image: linear-gradient(180deg, rgba(11, 31, 77, 0.95) 0%, rgba(11, 31, 77, 0.85) 100%); padding: 140px 0 60px; margin-top: 120px;">
          <div class="container">
            <div class="blog-hero-content" style="max-width: 800px; margin: 0 auto; text-align: center;">
              <span class="blog-hero-category" style="color: #1BA8E8; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.15em; display: inline-block; margin-bottom: 16px;">${page.category}</span>
              <h1 style="color: #ffffff; font-size: 2.8rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 24px; font-family: 'Outfit', sans-serif;">${page.h1}</h1>
              
              <div class="blog-meta-row" style="display: flex; align-items: center; justify-content: center; gap: 24px; color: #94a3b8; font-size: 0.9rem; margin-bottom: 32px; flex-wrap: wrap;">
                <span style="display: flex; align-items: center; gap: 6px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ${page.author}
                </span>
                <span>•</span>
                <span style="display: flex; align-items: center; gap: 6px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  ${page.readingTime}
                </span>
                <span>•</span>
                <span style="display: flex; align-items: center; gap: 6px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  ${page.date}
                </span>
              </div>

              <div class="breadcrumbs" style="justify-content: center; margin-bottom: 40px; font-size: 0.85rem; opacity: 0.8;">
                <a href="/index.html" style="color: #94a3b8; text-decoration: none;">Home</a> / <a href="/blog/" style="color: #94a3b8; text-decoration: none;">Blog</a> / <span style="color: #ffffff;">Article</span>
              </div>
            </div>
          </div>
        </section>
      `;
    }

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
  ${ogTagsHtml}
  
  <!-- Favicons -->
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/images/branding/favicon-192x192.png" sizes="192x192">
  <link rel="apple-touch-icon" href="/assets/images/branding/apple-touch-icon.png">

  <!-- Style Sheets -->
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/pages.css">
  ${seoSchemaHtml}
</head>
<body>

  <!-- Scroll Progress Indicator -->
  <div class="scroll-progress"></div>

  <!-- HEADER_SECTION -->

  ${heroHtml}

  ${finalBodyHtml}

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

    // Rewrite links & assets using dynamic depth
    html = rewritePaths(html, depth);

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

if (require.main === module) {
  buildAll();
}

module.exports = {
  buildAll,
  buildTreatmentPages
};
