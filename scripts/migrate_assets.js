const fs = require('fs');
const path = require('path');

// Root directory of the project
const ROOT_DIR = path.resolve(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT_DIR, 'wp-content', 'uploads');

// Target subdirectories for images
const IMAGE_DIRS = {
  branding: path.join(ROOT_DIR, 'assets', 'images', 'branding'),
  doctors: path.join(ROOT_DIR, 'assets', 'images', 'doctors'),
  clinic: path.join(ROOT_DIR, 'assets', 'images', 'clinic'),
  treatments: path.join(ROOT_DIR, 'assets', 'images', 'treatments'),
  results: path.join(ROOT_DIR, 'assets', 'images', 'results'),
  testimonials: path.join(ROOT_DIR, 'assets', 'images', 'testimonials'),
  technology: path.join(ROOT_DIR, 'assets', 'images', 'technology'),
  gallery: path.join(ROOT_DIR, 'assets', 'images', 'gallery'),
  icons: path.join(ROOT_DIR, 'assets', 'images', 'icons'),
};

// Source to target mappings
const ASSET_MAPPINGS = [
  // Branding
  ['2023/08/finalnewlogo.png', 'branding/logo.png'],
  ['2023/06/logo@2xx.png', 'branding/logo@2xx.png'],
  ['2023/06/cropped-cropped-dsf-2-32x32.png', 'branding/favicon-32x32.png'],
  ['2023/06/cropped-cropped-dsf-2-192x192.png', 'branding/favicon-192x192.png'],
  ['2023/06/cropped-cropped-dsf-2-180x180.png', 'branding/apple-touch-icon.png'],
  // Doctors
  ['2023/06/sri3-modified-1.png', 'doctors/srinivas-manohar.png'],
  ['2023/06/sri-modified.png', 'doctors/sirisha.png'],
  ['2023/06/sri1-modified.png', 'doctors/usha-sri.png'],
  // Clinic
  ['2023/08/IMG_1577-min-scaled-1.jpg', 'clinic/op-area.jpg'],
  ['2023/08/IMG_1577-min-scaled-1-980x1470.jpg', 'clinic/op-area-mobile.jpg'],
  ['2023/08/IMG_1623-min-scaled-1.jpg', 'clinic/chair.jpg'],
  // Treatments
  ['2023/07/smile-designing.jpg', 'treatments/smile-makeover.jpg'],
  ['2023/06/smiling-dentist-explaining-tooth-implantation.jpg', 'treatments/implants.jpg'],
  ['2023/06/best-family-dentist-near-you-in-danvers.jpg', 'treatments/general-dentistry.jpg'],
  // Testimonials
  ['2023/06/close-up-happy-client-dental-clinic.jpg', 'testimonials/happy-client.jpg'],
  // Gallery
  ['2023/06/dentist-3.jpg', 'gallery/dentist-3.jpg'],
  ['2023/06/dentist-4.jpg', 'gallery/dentist-4.jpg'],
  ['2023/06/360_F_409308152_4xrTMRNwr4kw36zahElgkosR8bauHawB.jpg', 'gallery/360_F_409308152_4xrTMRNwr4kw36zahElgkosR8bauHawB.jpg'],
  ['2023/06/wepik-export-20230605084051oobB.png', 'gallery/wepik-export-20230605084051oobB.png'],
  ['2023/06/box-1.jpg', 'gallery/box-1.jpg'],
  ['2023/08/Best-Dentist-in-Visakhapatnam.png', 'gallery/Best-Dentist-in-Visakhapatnam.png'],
  ['2023/06/shutterstock_327361349.jpg', 'gallery/shutterstock_327361349.jpg'],
  // Icons
  ['2023/06/dental.png', 'icons/dental.png'],
  ['2023/06/dentist-1.png', 'icons/dentist-1.png'],
  ['2023/06/doctor.png', 'icons/doctor.png'],
  ['2023/06/first-aid-kit.png', 'icons/first-aid-kit.png'],
  ['2023/06/phone-call-1.png', 'icons/phone-call-1.png'],
  ['2023/06/search.png', 'icons/search.png'],
];

function migrate() {
  console.log('Creating asset directories...');
  // Ensure target directories exist
  Object.values(IMAGE_DIRS).forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
  });

  // Ensure other asset directories exist
  fs.mkdirSync(path.join(ROOT_DIR, 'assets', 'videos'), { recursive: true });
  fs.mkdirSync(path.join(ROOT_DIR, 'assets', 'fonts'), { recursive: true });
  fs.mkdirSync(path.join(ROOT_DIR, 'assets', 'documents'), { recursive: true });
  fs.mkdirSync(path.join(ROOT_DIR, 'templates'), { recursive: true });
  fs.mkdirSync(path.join(ROOT_DIR, 'data'), { recursive: true });
  fs.mkdirSync(path.join(ROOT_DIR, 'scripts'), { recursive: true });

  console.log('Copying assets...');
  ASSET_MAPPINGS.forEach(([sourceRel, targetRel]) => {
    const sourcePath = path.join(UPLOADS_DIR, ...sourceRel.split('/'));
    const targetPath = path.join(ROOT_DIR, 'assets', 'images', ...targetRel.split('/'));

    if (fs.existsSync(sourcePath)) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourceRel} -> assets/images/${targetRel}`);
    } else {
      console.warn(`Warning: Source not found: ${sourcePath}`);
    }
  });

  // Copy favicon.ico to root
  const faviconSrc = path.join(UPLOADS_DIR, '2023', '06', 'cropped-cropped-dsf-2-32x32.png');
  const faviconDst = path.join(ROOT_DIR, 'favicon.ico');
  if (fs.existsSync(faviconSrc)) {
    fs.copyFileSync(faviconSrc, faviconDst);
    console.log('Created root favicon.ico');
  }

  console.log('Asset migration completed successfully.');
}

migrate();
