const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGE_ROOT = path.join(ROOT_DIR, 'assets', 'images');
const TARGET_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);
const MIN_FILE_SIZE_BYTES = 120 * 1024;
const MAX_DIMENSION = 1800;

function walk(dirPath) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
      continue;
    }
    results.push(fullPath);
  }
  return results;
}

async function optimizeImage(sourcePath) {
  const extension = path.extname(sourcePath).toLowerCase();
  if (!TARGET_EXTENSIONS.has(extension)) return null;

  const stats = fs.statSync(sourcePath);
  if (stats.size < MIN_FILE_SIZE_BYTES) return null;

  const webpPath = sourcePath.replace(/\.(png|jpe?g)$/i, '.webp');
  const tempWebpPath = `${webpPath}.tmp`;
  const transformer = sharp(sourcePath, { animated: false }).rotate();
  const metadata = await transformer.metadata();

  const resizeOptions = {};
  if ((metadata.width || 0) > MAX_DIMENSION || (metadata.height || 0) > MAX_DIMENSION) {
    resizeOptions.width = MAX_DIMENSION;
    resizeOptions.height = MAX_DIMENSION;
    resizeOptions.fit = 'inside';
    resizeOptions.withoutEnlargement = true;
  }

  let pipeline = sharp(sourcePath, { animated: false }).rotate();
  if (Object.keys(resizeOptions).length > 0) {
    pipeline = pipeline.resize(resizeOptions);
  }

  await pipeline
    .webp({
      quality: 82,
      alphaQuality: 92,
      effort: 6
    })
    .toFile(tempWebpPath);

  const tempStats = fs.statSync(tempWebpPath);
  const existingWebpSize = fs.existsSync(webpPath) ? fs.statSync(webpPath).size : Number.POSITIVE_INFINITY;

  if (existingWebpSize <= tempStats.size) {
    fs.unlinkSync(tempWebpPath);
    return {
      sourcePath,
      webpPath,
      sourceSize: stats.size,
      webpSize: existingWebpSize,
      reusedExisting: true
    };
  }

  fs.renameSync(tempWebpPath, webpPath);
  const webpStats = fs.statSync(webpPath);
  return {
    sourcePath,
    webpPath,
    sourceSize: stats.size,
    webpSize: webpStats.size,
    reusedExisting: false
  };
}

function updateReferences(filePath, webpRelativePaths) {
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;

  for (const relativePath of webpRelativePaths) {
    const normalized = relativePath.replace(/\\/g, '/');
    const webpPath = normalized.replace(/\.(png|jpe?g)$/i, '.webp');
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    updated = updated.replace(new RegExp(escaped, 'g'), webpPath);
  }

  // Keep a single Iconify loader per page and defer it.
  const iconifyRegex = /(?:\s*<!-- Script for Iconify \(Only used for floating action icons\) -->\s*)?<script[^>]+src=["']https:\/\/code\.iconify\.design\/iconify-icon\/1\.0\.7\/iconify-icon\.min\.js["'][^>]*><\/script>/gi;
  const iconifyMatches = updated.match(iconifyRegex) || [];
  updated = updated.replace(iconifyRegex, '');
  if (iconifyMatches.length > 0) {
    const deferredLoader = '  <!-- Iconify -->\n  <script defer src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>\n';
    updated = updated.replace(/(<\/footer>\s*)/i, `$1\n${deferredLoader}`);
  }

  updated = updated.replace(
    /<script((?:(?!\bdefer\b)[^>])*)\s+src=["']((?:\.\.\/)*assets\/js\/[^"']+)["']><\/script>/gi,
    '<script$1 src="$2" defer></script>'
  );

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    return true;
  }

  return false;
}

async function main() {
  const allImages = walk(IMAGE_ROOT);
  const optimized = [];

  for (const imagePath of allImages) {
    const result = await optimizeImage(imagePath);
    if (result && result.webpSize < result.sourceSize) {
      optimized.push(result);
    } else if (result && !result.reusedExisting) {
      fs.unlinkSync(result.webpPath);
    }
  }

  const webpRelativePaths = optimized.map((item) => path.relative(ROOT_DIR, item.sourcePath));
  const contentFiles = walk(ROOT_DIR).filter((filePath) => {
    if (filePath.includes(`${path.sep}node_modules${path.sep}`)) return false;
    const ext = path.extname(filePath).toLowerCase();
    return ext === '.html' || ext === '.css';
  });

  let updatedFiles = 0;
  for (const filePath of contentFiles) {
    if (updateReferences(filePath, webpRelativePaths)) {
      updatedFiles += 1;
    }
  }

  const totalSavedBytes = optimized.reduce((sum, item) => sum + (item.sourceSize - item.webpSize), 0);
  console.log(`Optimized ${optimized.length} images.`);
  console.log(`Updated ${updatedFiles} files.`);
  console.log(`Saved ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
