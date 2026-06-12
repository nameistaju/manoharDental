const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(filePath);
    if (entry.name.endsWith('.html') && !filePath.includes(`${path.sep}templates${path.sep}`)) {
      return [filePath];
    }
    return [];
  });
}

function rebuildResultsSection() {
  const homeFile = path.join(root, 'index.html');
  const resultsFile = path.join(root, 'results', 'index.html');
  let homeHtml = fs.readFileSync(homeFile, 'utf8');

  const sectionStart = homeHtml.indexOf('<section class="ba-premium-section" id="before-after-results">');
  const sectionEnd = homeHtml.indexOf('</section>', sectionStart) + '</section>'.length;
  if (sectionStart < 0 || sectionEnd < '</section>'.length) {
    throw new Error('Premium results section was not found in index.html');
  }

  let premiumSection = homeHtml.slice(sectionStart, sectionEnd);
  premiumSection = premiumSection
    .replaceAll('src="assets/', 'src="../assets/')
    .replaceAll('../assets/images/smile_makeover_after.png', '../assets/images/SmileMakeOver.png');

  let resultsHtml = fs.readFileSync(resultsFile, 'utf8');
  resultsHtml = resultsHtml.replace(
    /\s*<section class="section-padding results-page-slider-section reveal">[\s\S]*?<\/section>/,
    `\n\n  ${premiumSection}`
  );
  fs.writeFileSync(resultsFile, resultsHtml, 'utf8');

  homeHtml = homeHtml.replaceAll(
    'assets/images/smile_makeover_after.png',
    'assets/images/SmileMakeOver.png'
  );
  fs.writeFileSync(homeFile, homeHtml, 'utf8');
}

function normalizeFooterTail(file) {
  const html = fs.readFileSync(file, 'utf8');
  const footerEnd = html.lastIndexOf('</footer>');
  if (footerEnd < 0) return false;

  const head = html.slice(0, footerEnd + '</footer>'.length);
  const oldTail = html.slice(footerEnd + '</footer>'.length);
  const scripts = [...oldTail.matchAll(/<script\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>\s*<\/script>/gi)]
    .map((match) => match[0].trim());
  const uniqueScripts = [...new Set(scripts)];
  const relativeRoot = path.relative(path.dirname(file), root).replaceAll('\\', '/');
  const prefix = relativeRoot ? `${relativeRoot}/` : '';

  const floatingActions = `
  <!-- Premium Floating Actions -->
  <div class="premium-floating-actions-bar" aria-label="Quick contact actions">
    <a href="${prefix}contact/index.html" class="premium-float-btn float-appointment-btn" aria-label="Book Appointment">
      <span class="premium-float-label">Book Appointment</span>
      <span class="premium-float-icon-wrapper">
        <img src="${prefix}assets/images/appointment.png" alt="" class="premium-float-png-icon">
      </span>
    </a>
    <a href="https://api.whatsapp.com/send?phone=919703294358&amp;text=Hello%20Manohar%20Dental%20Clinic,%20I%20would%20like%20to%20book%20a%20consultation." target="_blank" rel="noopener" class="premium-float-btn float-whatsapp-btn" aria-label="Consult on WhatsApp">
      <span class="premium-float-label">Chat with Us</span>
      <span class="premium-float-icon-wrapper">
        <img src="${prefix}assets/images/whatsapp.png" alt="" class="premium-float-png-icon">
      </span>
    </a>
    <a href="tel:+919703294358" class="premium-float-btn float-call-btn" aria-label="Call Clinic">
      <span class="premium-float-label">Call Us</span>
      <span class="premium-float-icon-wrapper">
        <img src="${prefix}assets/images/telephone.png" alt="" class="premium-float-png-icon">
      </span>
    </a>
  </div>`;

  const scriptBlock = uniqueScripts.length
    ? `\n\n  <!-- Scripts -->\n  ${uniqueScripts.join('\n  ')}`
    : '';
  fs.writeFileSync(
    file,
    `${head}\n\n${floatingActions}${scriptBlock}\n</body>\n</html>\n`,
    'utf8'
  );
  return true;
}

rebuildResultsSection();
const changed = walk(root).filter(normalizeFooterTail);
console.log(`Normalized ${changed.length} HTML pages.`);
