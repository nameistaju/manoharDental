const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BASE_URL = 'https://manohardentalvisakhapatnam.com';

// Standard static pages
const STATIC_PAGES = [
  '',
  'about/',
  'contact/',
  'blog/',
  'faqs/',
];

function generateSitemap() {
  console.log('Generating sitemap.xml and robots.txt...');
  
  const urls = [];
  const currentDate = new Date().toISOString().split('T')[0];

  // 1. Add standard pages
  STATIC_PAGES.forEach(page => {
    urls.push({
      loc: `${BASE_URL}/${page}`,
      lastmod: currentDate,
      priority: page === '' ? '1.0' : '0.8',
      changefreq: 'monthly'
    });
  });

  // 2. Add treatment pages from data/treatments.json
  const treatmentsPath = path.join(ROOT_DIR, 'data', 'treatments.json');
  if (fs.existsSync(treatmentsPath)) {
    const treatments = JSON.parse(fs.readFileSync(treatmentsPath, 'utf-8'));
    treatments.forEach(treatment => {
      urls.push({
        loc: `${BASE_URL}/treatments/${treatment.slug}/`,
        lastmod: currentDate,
        priority: '0.9',
        changefreq: 'monthly'
      });
    });
  }

  // 3. Add doctor pages from data/doctors.json
  const doctorsPath = path.join(ROOT_DIR, 'data', 'doctors.json');
  if (fs.existsSync(doctorsPath)) {
    const doctors = JSON.parse(fs.readFileSync(doctorsPath, 'utf-8'));
    doctors.forEach(doctor => {
      urls.push({
        loc: `${BASE_URL}/doctors/${doctor.slug}/`,
        lastmod: currentDate,
        priority: '0.7',
        changefreq: 'monthly'
      });
    });
  }

  // Generate XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>\n';

  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), xml);
  console.log('Saved sitemap.xml');

  // Generate robots.txt
  let robots = 'User-agent: *\n';
  robots += 'Allow: /\n';
  robots += '\n';
  robots += `Sitemap: ${BASE_URL}/sitemap.xml\n`;

  fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robots);
  console.log('Saved robots.txt');

  // Generate manifest.json
  const manifest = {
    name: "Manohar Dental Clinic",
    short_name: "Manohar Dental",
    description: "Premium Dental Clinic in Visakhapatnam. Experience The Excellence.",
    start_url: "/index.html",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F172A",
    icons: [
      {
        src: "/assets/images/branding/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      }
    ]
  };
  fs.writeFileSync(path.join(ROOT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Saved manifest.json');
  
  console.log('Sitemap and metadata generation completed.');
}

generateSitemap();
