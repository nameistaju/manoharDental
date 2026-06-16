const fs = require('fs');
const path = require('path');
const videoLibrary = require('../data/video-library.json');

const rootDir = path.resolve(__dirname, '..');
const youtubeUrl = videoLibrary.treatments.defaultUrl;
const treatmentFallbackPosters = {
  'dental-fillings': 'Dental Fillings.png',
  dentures: 'Denture.png',
  'gum-treatment': 'GumTreatement.png',
  'pediatric-dentistry': 'pediatric care image_about.png'
};

const dedicatedTreatmentPosters = {
  'dental-implants': 'Dental Implants_thumbnail.png',
  dentures: 'Denture Treatment_thumbnail.png',
  'teeth-whitening': 'Teeth Whitening_thumbnail.png',
  'smile-makeover': 'SmileMakeover_thumbnail.png',
  'crowns-bridges': 'Crowns & Bridges_thumbnail.png',
  'dental-fillings': 'Dental Fillings_thumbnail.png',
  'preventive-dentistry': 'Preventive Dentistry_thumbnail.png',
  'root-canal-treatment': 'Root Canal Treatment_thumbnail.png',
  'braces-treatment': 'Braces Treatment_thumbnail.png',
  braces: 'Braces Treatment_thumbnail.png',
  'clear-aligners': 'Clear Aligners_thumbnail.png',
  'wisdom-tooth-removal': 'WisdomToothRemoval_thumbnail.png',
  'gum-treatment': 'GumTreatment_thumbnail.png',
  'pediatric-dentistry': 'Pediatric Dentistry_thubnail.png'
};

const treatmentIndexPosters = {
  'Play Dental Implants video': '../assets/images/dentalImplants.png',
  'Play Denture Treatment video': '../assets/images/Denture.png',
  'Play Teeth Whitening Treatment video': '../assets/images/Teeth Whitening.png',
  'Play Smile Makeover Treatment video': '../assets/images/SmileMakeOver.png',
  'Play Crowns and Bridges video': '../assets/images/Crowns & Bridges.png',
  'Play Dental Fillings video': '../assets/images/Dental Fillings.png',
  'Play Preventive Dentistry video': '../assets/images/gallery/dentist-3.jpg',
  'Play Root Canal Treatment video': '../assets/images/Root Canal Treatment.png',
  'Play Braces Treatment video': '../assets/images/Braces Treatment.png',
  'Play Clear Aligners Treatment video': '../assets/images/Clear Aligners.png',
  'Play Wisdom Tooth Removal video': '../assets/images/Wisdom Tooth Removal.png',
  'Play Gum Treatment video': '../assets/images/GumTreatement.png'
};

const homeTreatmentPosters = {
  ...treatmentIndexPosters,
  'Play Preventive Dentistry video': '../assets/images/preventive dentistry.png'
};

function updateFile(filePath, transform) {
  const source = fs.readFileSync(filePath, 'utf8');
  const updated = transform(source);
  if (updated !== source) fs.writeFileSync(filePath, updated);
}

updateFile(path.join(rootDir, 'index.html'), (html) => {
  let updated = html.replace(
    '<div class="hero-video-wrapper-16-9" data-video-player>',
    `<div class="hero-video-wrapper-16-9" data-video-player data-youtube-video="${videoLibrary.hero.url}">`
  );

  updated = updated.replace(
    /<video class="hero-widescreen-video"[^>]*poster="([^"]+)"[^>]*><\/video>/,
    '<img class="hero-widescreen-video" src="$1" alt="Meet Your Dental Specialists video thumbnail">'
  );

  updated = updated.replace(
    /<div class="signature-video-new">\s*<video[^>]*poster="([^"]+)"[^>]*><\/video>/g,
    `<div class="signature-video-new" data-youtube-video="${youtubeUrl}">\n            <img class="signature-video-poster" src="$1" alt="" loading="lazy" decoding="async">`
  );

  Object.entries(homeTreatmentPosters).forEach(([label, source]) => {
    const homeSource = source.replace('../assets/', 'assets/');
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(<div class="signature-video-new"[^>]*>\\s*<img class="signature-video-poster" src=")[^"]+("[^>]*>\\s*<button class="video-play-button"[^>]*aria-label="${escapedLabel}")`, 'g');
    updated = updated.replace(pattern, `$1${homeSource}$2`);
  });

  return updated;
});

updateFile(path.join(rootDir, 'treatments', 'index.html'), (html) => {
  let updated = html.replace(
    /<div class="signature-video"><video[^>]*poster="[^"]+"[^>]*><\/video><button class="video-play-button" type="button" data-play-video aria-label="([^"]+)">/g,
    (match, label) => `<div class="signature-video" data-youtube-video="${youtubeUrl}"><img src="${treatmentIndexPosters[label]}" alt="" loading="lazy" decoding="async"><button class="video-play-button" type="button" data-play-video aria-label="${label}">`
  );

  Object.entries(treatmentIndexPosters).forEach(([label, source]) => {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(<div class="signature-video"[^>]*>\\s*<img src=")[^"]+("[^>]*>\\s*<button class="video-play-button"[^>]*aria-label="${escapedLabel}")`, 'g');
    updated = updated.replace(pattern, `$1${source}$2`);
  });

  return updated;
});

const treatmentRoot = path.join(rootDir, 'treatments');
fs.readdirSync(treatmentRoot, { withFileTypes: true }).forEach((entry) => {
  const candidates = entry.isDirectory()
    ? [path.join(treatmentRoot, entry.name, 'index.html')]
    : entry.name.endsWith('.html')
      ? [path.join(treatmentRoot, entry.name)]
      : [];

  candidates.forEach((filePath) => {
    if (!fs.existsSync(filePath)) return;
    updateFile(filePath, (html) => html.replace(
      /<div class="tp-video-player" data-video-player><video class="tp-hero-video"[^>]*poster="([^"]+)"[^>]*><\/video>/g,
      `<div class="tp-video-player" data-video-player data-youtube-video="${youtubeUrl}"><img class="tp-hero-video" src="$1" alt="Treatment video thumbnail">`
    ).replace(
      /<div class="tp-video-player" data-video-player><video class="tp-hero-video"[^>]*><\/video>/g,
      (match) => {
        const slug = entry.isDirectory() ? entry.name : entry.name.replace(/\.html$/, '');
        const prefix = entry.isDirectory() ? '../../assets/images/' : '../assets/images/';
        const poster = treatmentFallbackPosters[slug];
        if (!poster) return match;
        return `<div class="tp-video-player" data-video-player data-youtube-video="${youtubeUrl}"><img class="tp-hero-video" src="${prefix}${poster}" alt="Treatment video thumbnail">`;
      }
    ).replace(
      /(<div class="tp-video-player"[^>]*data-youtube-video="[^"]+"[^>]*><img class="tp-hero-video" src=")[^"]+("[^>]*>)/g,
      (match, before, after) => {
        const slug = entry.isDirectory() ? entry.name : entry.name.replace(/\.html$/, '');
        const poster = dedicatedTreatmentPosters[slug];
        if (!poster) return match;
        const prefix = entry.isDirectory() ? '../../assets/images/' : '../assets/images/';
        return `${before}${prefix}${poster}${after}`;
      }
    ).replace(
      /<img class="tp-hero-video" src="([^"]+)" alt="([^"]*)"(?: width="[^"]+")?(?: height="[^"]+")?(?: loading="[^"]+")?(?: decoding="[^"]+")?>/g,
      '<img class="tp-hero-video" src="$1" alt="$2" width="1672" height="941" loading="eager" decoding="async">'
    ));
  });
});
