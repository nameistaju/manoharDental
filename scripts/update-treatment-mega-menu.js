const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [];

const treatments = [
  ['dental-implants', 'Dental Implants', 'Permanent tooth replacement', 'DentalImplants_icon.png'],
  ['root-canal-treatment', 'Root Canal', 'Save infected teeth', 'Root Canal_icon.png'],
  ['smile-makeover', 'Smile Makeover', 'Cosmetic smile enhancement', 'Smile Makeover_icon.png'],
  ['clear-aligners', 'Clear Aligners', 'Discreet teeth straightening', 'Clear Aligners_icon.png'],
  ['wisdom-tooth-removal', 'Wisdom Tooth', 'Comfortable wisdom tooth removal', 'Wisdom Tooth_icon.png'],
  ['braces', 'Braces Treatment', 'Specialist bite correction', 'Braces Treatment_icon.png'],
  ['teeth-whitening', 'Teeth Whitening', 'Professional smile brightening', 'Teeth Whitening_icon.png'],
  ['gum-treatment', 'Gum Treatment', 'Healthier gums and support', 'Gum Treatment_icon.png'],
  ['dental-fillings', 'Dental Fillings', 'Natural-looking cavity repair', 'Dental Fillings_icon.png'],
  ['dentures', 'Dentures', 'Comfortable removable teeth', 'Dentures_icon.png'],
  ['pediatric-dentistry', 'Pediatric Dentistry', 'Gentle dental care for children', 'Pediatric Dentistry_icon.png'],
  ['preventive-dentistry', 'Preventive Dentistry', 'Checkups that prevent problems', 'Preventive Dentistry_icon.png']
];

function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory() && !['.git', 'node_modules'].includes(entry.name)) collect(target);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(target);
  }
}

function relativeHref(file, target) {
  return path.relative(path.dirname(file), path.join(root, target)).replace(/\\/g, '/');
}

function card(href, title, description, iconHref) {
  return `
                <a href="${href}" class="mega-menu-card">
                  <div class="mega-card-icon">
                    <img src="${iconHref}" alt="" width="52" height="52" decoding="async">
                  </div>
                  <div class="mega-card-info">
                    <span class="mega-card-title">${title}</span>
                    <p class="mega-card-desc">${description}</p>
                  </div>
                </a>`;
}

collect(root);

let updated = 0;
for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  if (!source.includes('class="mega-menu-grid"')) continue;

  const isTemplate = path.relative(root, file).startsWith(`templates${path.sep}`);
  const treatmentHref = (slug) => isTemplate
    ? `/treatments/${slug}/index.html`
    : relativeHref(file, `treatments/${slug}/index.html`);
  const iconHref = (name) => isTemplate
    ? `/assets/images/icons/treatments/${name}`
    : relativeHref(file, `assets/images/icons/treatments/${name}`);

  const cards = treatments.map(([slug, title, description, icon]) => (
    card(treatmentHref(slug), title, description, iconHref(icon))
  )).join('\n');

  const gridPattern = /(<div class="mega-menu-grid">)[\s\S]*?(?=\s*<\/div>\s*<\/div>\s*<\/div>\s*<a href=["'][^"']*(?:results|#results-section))/i;
  if (!gridPattern.test(source)) {
    throw new Error(`Mega menu grid boundary not found in ${path.relative(root, file)}`);
  }

  source = source.replace(gridPattern, `$1${cards}`);
  fs.writeFileSync(file, source, 'utf8');
  updated += 1;
}

console.log(`Rendered ${updated} treatment mega menus.`);
