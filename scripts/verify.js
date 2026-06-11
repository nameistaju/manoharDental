const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to recursively find HTML files
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  const oldDirectories = [
    'braces-treatment-in-visakhapatnam',
    'clear-aligners-treatment-in-visakhapatnam',
    'dental-clinic-in-vizag',
    'dental-implants-in-visakhapatnam',
    'denture-treatment-in-visakhapatnam',
    'doctor-sirisha',
    'doctor-srinivas-manohar',
    'doctor-usha-sri',
    'gum-treatment-in-visakhapatnam',
    'pediatric-dentists-in-visakhapatnam',
    'root-canal-treatment-in-visakhapatnam',
    'smile-makeover-treatment-in-visakhapatnam',
    'teeth-whitening-treatment-in-visakhapatnam',
    'wisdom-teeth-removal-in-visakhapatnam'
  ];

  files.forEach(file => {
    // Ignore node_modules, wp-content, wp-includes, .git and old pages directories
    if (['node_modules', 'wp-content', 'wp-includes', '.git', 'assets', 'templates', 'scripts'].includes(file) || oldDirectories.includes(file)) return;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function verifyLinks() {
  console.log('--- STARTING ARCHITECTURE INTEGRITY VERIFICATION ---');
  
  const htmlFiles = findHtmlFiles(ROOT_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to verify.`);
  
  let errorsCount = 0;
  let warningsCount = 0;

  htmlFiles.forEach(htmlFile => {
    const relativeHtmlPath = path.relative(ROOT_DIR, htmlFile);
    console.log(`Verifying: ${relativeHtmlPath}`);
    
    const content = fs.readFileSync(htmlFile, 'utf-8');
    
    // Find all links: href="..."
    const hrefMatches = content.matchAll(/href="([^"]+)"/gi);
    for (const match of hrefMatches) {
      const href = match[1];
      
      // Ignore external, telephone, email, and anchor-only links
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        continue;
      }

      // Check internal path
      const cleanHref = decodeURIComponent(href.split('#')[0].split('?')[0]);
      if (!cleanHref) {
        continue;
      }

      let targetPath = '';
      if (cleanHref.startsWith('/')) {
        // Root relative
        targetPath = path.join(ROOT_DIR, cleanHref.substring(1));
      } else {
        // File relative
        targetPath = path.join(path.dirname(htmlFile), cleanHref);
      }

      // If it points to a directory (e.g. /about/), look for index.html inside it
      if (fs.existsSync(targetPath)) {
        const stat = fs.statSync(targetPath);
        if (stat.isDirectory()) {
          const indexCheck = path.join(targetPath, 'index.html');
          if (!fs.existsSync(indexCheck)) {
            console.error(`  [ERROR] Link to directory has no index.html: ${href} in ${relativeHtmlPath}`);
            errorsCount++;
          }
        }
      } else {
        // Check if there is an index.html at that path if it doesn't end with a filename
        if (!path.basename(targetPath).includes('.')) {
          const indexCheck = path.join(targetPath, 'index.html');
          if (!fs.existsSync(indexCheck)) {
            console.error(`  [ERROR] Broken Link: ${href} in ${relativeHtmlPath} (Resolved to: ${targetPath})`);
            errorsCount++;
          }
        } else {
          console.error(`  [ERROR] Broken Link: ${href} in ${relativeHtmlPath}`);
          errorsCount++;
        }
      }
    }

    // Find all resources: src="..."
    const srcMatches = content.matchAll(/src="([^"]+)"/gi);
    for (const match of srcMatches) {
      const src = match[1];
      
      // Ignore external links
      if (src.startsWith('http') || src.startsWith('//')) {
        continue;
      }

      const decodedSrc = decodeURIComponent(src);
      let targetPath = '';
      if (decodedSrc.startsWith('/')) {
        targetPath = path.join(ROOT_DIR, decodedSrc.substring(1));
      } else {
        targetPath = path.join(path.dirname(htmlFile), decodedSrc);
      }

      if (!fs.existsSync(targetPath)) {
        console.error(`  [ERROR] Missing Resource: ${src} in ${relativeHtmlPath}`);
        errorsCount++;
      }
    }
  });

  console.log('\n--- VERIFICATION REPORT ---');
  console.log(`Total Errors: ${errorsCount}`);
  console.log(`Total Warnings: ${warningsCount}`);
  
  if (errorsCount > 0) {
    console.error('Integrity check failed. Please resolve the broken paths.');
    process.exit(1);
  } else {
    console.log('Integrity check passed! No broken links or missing resources found.');
  }
}

verifyLinks();
