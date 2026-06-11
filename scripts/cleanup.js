const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const DIRECTORIES_TO_REMOVE = [
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
  'wisdom-teeth-removal-in-visakhapatnam',
  'wp-content',
  'wp-includes'
];

function cleanup() {
  console.log('--- PURGING LEGACY FILES & WORDPRESS REMNANTS ---');
  
  DIRECTORIES_TO_REMOVE.forEach(dirName => {
    const dirPath = path.join(ROOT_DIR, dirName);
    
    if (fs.existsSync(dirPath)) {
      console.log(`Deleting legacy directory: ${dirName}`);
      fs.rmSync(dirPath, { recursive: true, force: true });
    } else {
      console.log(`Directory already removed: ${dirName}`);
    }
  });

  // Remove python migration script if it exists
  const pyMigration = path.join(ROOT_DIR, 'scripts', 'migrate_assets.py');
  if (fs.existsSync(pyMigration)) {
    fs.unlinkSync(pyMigration);
    console.log('Removed obsolete python script.');
  }

  console.log('Cleanup completed successfully.');
}

cleanup();
