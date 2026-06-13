const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const guides = {
  braces: {
    symptoms: ['Crooked or rotated teeth', 'Crowding that makes cleaning difficult', 'Gaps between teeth', 'Overbite, underbite, or crossbite', 'Uneven tooth wear or jaw strain'],
    journey: ['Consultation and bite assessment', 'Digital scans, photographs, and X-rays', 'Personalized movement plan', 'Braces placement and scheduled adjustments', 'Removal, retention, and follow-up'],
    recovery: [['First 2-3 days', 'Pressure or tenderness is common after placement.'], ['First week', 'Soft foods and orthodontic wax improve comfort.'], ['After adjustments', 'Brief tenderness may return for one or two days.'], ['Final stage', 'Retainers protect the corrected tooth positions.']],
    results: ['Straighter, more balanced smile', 'Improved bite and chewing', 'Easier brushing and flossing', 'Better long-term tooth positioning'],
    contact: 'Contact the clinic if a wire is sharply poking, a bracket becomes loose, or swelling and pain do not settle.'
  },
  aligners: {
    symptoms: ['Crooked or overlapping teeth', 'Crowded teeth', 'Gaps between teeth', 'Mild to moderate bite problems', 'Difficulty cleaning between misaligned teeth'],
    journey: ['Smile and bite consultation', 'Digital scan and suitability assessment', '3D movement preview and treatment plan', 'Sequential aligner wear with progress checks', 'Retainers and long-term review'],
    recovery: [['First 1-2 days', 'New trays can create mild pressure.'], ['First week', 'Speech and tray removal usually become easier.'], ['Every tray change', 'Temporary tightness is expected.'], ['Final stage', 'Retainers maintain the new alignment.']],
    results: ['Straighter, more even smile', 'Improved bite relationship', 'Easier oral hygiene', 'Discreet treatment experience', 'Better smile confidence'],
    contact: 'Contact the clinic if an aligner cracks, stops fitting fully, causes a sharp injury, or significant pain persists.'
  },
  crowns: {
    symptoms: ['Cracked, weak, or heavily filled teeth', 'Missing one or more teeth', 'Pain while biting', 'A worn or broken restoration', 'Changes in tooth shape or appearance'],
    journey: ['Clinical examination and X-rays', 'Tooth and bite assessment', 'Preparation, scan, and shade selection', 'Temporary restoration if required', 'Final crown or bridge fitting'],
    recovery: [['First day', 'Numbness fades and mild gum tenderness may occur.'], ['Days 2-5', 'Sensitivity usually reduces steadily.'], ['First week', 'Chewing feels increasingly natural.'], ['Ongoing', 'Good hygiene protects the supporting teeth and gums.']],
    results: ['Stronger protection for weakened teeth', 'Restored chewing function', 'Natural-looking tooth shape', 'Stable replacement of missing teeth', 'Improved smile continuity'],
    contact: 'Contact the clinic if the bite feels high, the temporary loosens, or pain and swelling increase instead of improving.'
  },
  fillings: {
    symptoms: ['Visible cavity or dark spot', 'Sensitivity to sweet, hot, or cold foods', 'Food repeatedly trapping in one area', 'A chipped or rough tooth surface', 'Mild pain while biting'],
    journey: ['Cavity examination and diagnosis', 'Decay depth assessment', 'Comfort-focused removal of damaged tissue', 'Tooth-colored filling placement', 'Bite polishing and prevention advice'],
    recovery: [['First few hours', 'Wait for numbness to wear off before chewing.'], ['Days 1-3', 'Mild temperature sensitivity can occur.'], ['First week', 'The tooth should feel increasingly normal.'], ['Ongoing', 'Daily cleaning and reviews help prevent new decay.']],
    results: ['Decay removed and sealed', 'Natural tooth color and contour', 'Comfortable chewing restored', 'Conservative preservation of tooth structure'],
    contact: 'Contact the clinic if the filling feels high, chewing remains painful, or sensitivity becomes stronger after several days.'
  },
  implants: {
    symptoms: ['One or more missing teeth', 'Difficulty chewing firmly', 'Loose or uncomfortable dentures', 'Jawbone loss around a missing tooth', 'Smile gaps affecting confidence'],
    journey: ['Consultation and medical review', 'CBCT scan and digital implant planning', 'Implant placement procedure', 'Healing and bone integration', 'Final crown, bridge, or fixed teeth'],
    recovery: [['Day 1-3', 'Minor swelling, tenderness, or bruising may occur.'], ['Week 1', 'Soft tissue healing progresses and daily comfort improves.'], ['Month 2-4', 'The implant integrates with the jawbone.'], ['Final stage', 'The permanent restoration is fitted after stability checks.']],
    results: ['Natural-looking tooth replacement', 'Stable chewing function', 'Long-term fixed solution', 'Improved smile confidence', 'Support for jawbone preservation'],
    contact: 'Contact the clinic for persistent bleeding, increasing swelling after three days, fever, or unexpected implant movement.'
  },
  dentures: {
    symptoms: ['Several or all teeth are missing', 'Difficulty chewing a varied diet', 'Loose older dentures', 'Reduced facial or lip support', 'Speech changes from missing teeth'],
    journey: ['Oral examination and expectations review', 'Impressions or digital records', 'Bite and tooth-position planning', 'Trial fitting and adjustments', 'Final delivery and review visits'],
    recovery: [['First few days', 'Fullness, saliva changes, and pressure spots are common.'], ['Week 1-2', 'Speech and chewing gradually adapt.'], ['First month', 'Small fit adjustments may improve comfort.'], ['Ongoing', 'Regular reviews monitor fit, gums, and jaw changes.']],
    results: ['Improved chewing and speech', 'Restored facial support', 'Natural smile appearance', 'Better everyday confidence', 'A removable solution tailored to fit'],
    contact: 'Contact the clinic if sore spots develop, the denture fractures, or looseness prevents comfortable eating or speaking.'
  },
  gums: {
    symptoms: ['Bleeding while brushing or flossing', 'Red, swollen, or tender gums', 'Persistent bad breath', 'Gum recession or longer-looking teeth', 'Loose teeth or changes in bite'],
    journey: ['Gum and bone assessment', 'Measurements and dental imaging', 'Professional deep cleaning or periodontal therapy', 'Home-care coaching', 'Maintenance and healing reviews'],
    recovery: [['Day 1-2', 'Mild tenderness or sensitivity may follow deep cleaning.'], ['First week', 'Bleeding and swelling should begin to reduce.'], ['Weeks 2-4', 'Gum tissues continue to tighten and heal.'], ['Ongoing', 'Periodic maintenance helps control recurrence.']],
    results: ['Reduced bleeding and inflammation', 'Healthier gum attachment', 'Fresher breath', 'Better support around teeth', 'Lower risk of future tooth loss'],
    contact: 'Contact the clinic if swelling rapidly increases, pus appears, a tooth becomes suddenly loose, or fever develops.'
  },
  pediatric: {
    symptoms: ['Tooth pain or sensitivity in a child', 'Visible cavities or broken teeth', 'Delayed or unusual tooth eruption', 'Bleeding gums or persistent bad breath', 'Fear that prevents routine dental care'],
    journey: ['Friendly introduction and parent discussion', 'Age-appropriate examination', 'Digital diagnosis only when needed', 'Gentle preventive or restorative care', 'Growth and recall monitoring'],
    recovery: [['Same day', 'Most preventive visits need no recovery time.'], ['First 24 hours', 'Numbness or mild tenderness may follow treatment.'], ['Days 2-3', 'The child should return to usual comfort.'], ['Ongoing', 'Regular reviews support healthy growth and habits.']],
    results: ['Comfortable, healthy teeth', 'Early control of decay', 'Positive dental confidence', 'Better brushing and diet habits', 'Guided development of the growing smile'],
    contact: 'Contact the clinic for facial swelling, fever, dental trauma, uncontrolled bleeding, or pain that interrupts sleep.'
  },
  preventive: {
    symptoms: ['Plaque or tartar buildup', 'Occasional gum bleeding', 'Persistent bad breath', 'Early sensitivity or enamel wear', 'A history of frequent cavities'],
    journey: ['Oral health risk assessment', 'Professional cleaning and examination', 'Digital checks when indicated', 'Fluoride, sealants, or hygiene coaching', 'Personalized recall schedule'],
    recovery: [['Same day', 'Normal activity can usually resume immediately.'], ['First 24 hours', 'Mild gum sensitivity can follow cleaning.'], ['Following days', 'Teeth should feel smoother and gums calmer.'], ['Ongoing', 'Daily care and recalls maintain prevention.']],
    results: ['Cleaner teeth and healthier gums', 'Earlier detection of dental problems', 'Lower cavity and gum-disease risk', 'Fresher breath', 'Reduced need for complex treatment'],
    contact: 'Contact the clinic if bleeding is heavy, sensitivity persists, or new pain or swelling appears after your visit.'
  },
  rootcanal: {
    symptoms: ['Persistent or throbbing tooth pain', 'Sensitivity to hot or cold that lingers', 'Swollen or tender gums', 'Pain while chewing or biting', 'Darkening of the affected tooth'],
    journey: ['Examination and diagnostic X-ray', 'Local anesthesia and tooth isolation', 'Cleaning and shaping of infected canals', 'Sealing and temporary or permanent filling', 'Protective crown and follow-up when advised'],
    recovery: [['Day 1', 'Mild sensitivity or tenderness is common.'], ['Day 2-5', 'Discomfort should reduce steadily.'], ['Week 1', 'Normal chewing usually resumes after review.'], ['Final stage', 'A crown may protect the treated tooth long term.']],
    results: ['Relief from infection-related pain', 'Preservation of the natural tooth', 'Restored chewing comfort', 'Prevention of infection spread', 'Long-term function with proper restoration'],
    contact: 'Contact the clinic if swelling increases, fever develops, the temporary filling breaks, or severe pain does not improve.'
  },
  makeover: {
    symptoms: ['Multiple cosmetic concerns in one smile', 'Discolored, chipped, or worn teeth', 'Uneven tooth shapes or spacing', 'Old restorations affecting appearance', 'A smile that feels out of balance'],
    journey: ['Smile goals and facial assessment', 'Digital photographs, scans, and diagnosis', 'Smile design and treatment sequencing', 'Staged cosmetic and restorative procedures', 'Final refinement and maintenance plan'],
    recovery: [['After planning', 'No recovery is required for digital design.'], ['After each procedure', 'Sensitivity depends on the treatments selected.'], ['First 1-2 weeks', 'Gums and bite adapt to new restorations.'], ['Ongoing', 'Reviews and hygiene protect the finished smile.']],
    results: ['More harmonious smile proportions', 'Improved color, shape, and alignment', 'Natural facial integration', 'Better smile confidence', 'A coordinated long-term treatment result'],
    contact: 'Contact the clinic if a temporary restoration loosens, the bite feels uneven, or sensitivity and gum irritation persist.'
  },
  whitening: {
    symptoms: ['Yellow or dull tooth shade', 'Coffee, tea, tobacco, or food stains', 'Uneven tooth color', 'A darker smile in photographs', 'Healthy teeth that need cosmetic brightening'],
    journey: ['Shade and enamel assessment', 'Cleaning or preparation if needed', 'Gum protection and whitening application', 'Shade review and sensitivity guidance', 'Maintenance advice and touch-ups'],
    recovery: [['Same day', 'Temporary tooth sensitivity may occur.'], ['First 24-48 hours', 'Avoid strongly colored foods and drinks.'], ['Days 2-3', 'Sensitivity usually settles.'], ['Ongoing', 'Good habits and touch-ups help maintain brightness.']],
    results: ['Brighter overall tooth shade', 'Reduced surface staining', 'More even smile color', 'Enamel-conscious clinical treatment', 'Improved confidence in photographs'],
    contact: 'Contact the clinic if sensitivity is severe, gum irritation persists, or whitening produces unexpected patches or pain.'
  },
  wisdom: {
    symptoms: ['Pain behind the last molar', 'Swelling or redness around a wisdom tooth', 'Difficulty opening the mouth', 'Food trapping beneath a gum flap', 'Repeated infection or unpleasant taste'],
    journey: ['Clinical examination and X-ray', 'Position and nerve-risk assessment', 'Personalized removal plan', 'Comfort-focused extraction procedure', 'Healing review and aftercare'],
    recovery: [['Day 1-3', 'Swelling and soreness usually peak, then begin to settle.'], ['Days 4-7', 'Jaw movement and eating become easier.'], ['Week 1-2', 'Soft tissue healing progresses.'], ['Following weeks', 'The socket gradually fills and remodels.']],
    results: ['Relief from recurring pain or infection', 'Protection of nearby teeth', 'Improved cleaning access', 'Reduced food trapping', 'Healthier tissue behind the molars'],
    contact: 'Contact the clinic for uncontrolled bleeding, fever, worsening swelling after day three, breathing difficulty, or severe pain.'
  }
};

function treatmentKey(heading) {
  const value = heading.toLowerCase();
  if (value.includes('clear align')) return 'aligners';
  if (value.includes('braces')) return 'braces';
  if (value.includes('crowns')) return 'crowns';
  if (value.includes('filling')) return 'fillings';
  if (value.includes('implant')) return 'implants';
  if (value.includes('denture')) return 'dentures';
  if (value.includes('gum')) return 'gums';
  if (value.includes('pediatric')) return 'pediatric';
  if (value.includes('preventive')) return 'preventive';
  if (value.includes('root canal')) return 'rootcanal';
  if (value.includes('smile makeover')) return 'makeover';
  if (value.includes('whitening')) return 'whitening';
  if (value.includes('wisdom')) return 'wisdom';
  return null;
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const treatmentMeta = {
  braces: { label: 'Braces', slug: 'braces', title: 'Braces Treatment in Visakhapatnam', statement: 'Correct crowding and bite problems with specialist-led orthodontic care.', description: 'Specialist braces for healthier alignment, bite function, and lasting smile confidence.' },
  aligners: { label: 'Clear Aligners', slug: 'clear-aligners', title: 'Clear Aligners in Visakhapatnam', statement: 'Straighten your smile with nearly invisible, removable aligners.', description: 'Discreet custom aligners for easier eating, cleaning, and everyday confidence.' },
  crowns: { label: 'Crowns & Bridges', slug: 'crowns-bridges', title: 'Dental Crowns & Bridges', statement: 'Restore damaged or missing teeth with fixed, natural-looking restorations.', description: 'Fixed restorations that strengthen teeth and restore comfortable, natural-looking smiles.' },
  fillings: { label: 'Dental Fillings', slug: 'dental-fillings', title: 'Dental Fillings in Visakhapatnam', statement: 'Repair cavities early with durable, tooth-colored fillings.', description: 'Tooth-colored fillings that repair decay while preserving healthy natural structure.' },
  implants: { label: 'Dental Implants', slug: 'dental-implants', title: 'Dental Implants in Visakhapatnam', statement: 'Replace missing teeth with strong, natural-looking implants.', description: 'Fixed dental implants for strong chewing and natural-looking smiles.' },
  dentures: { label: 'Dentures', slug: 'dentures', title: 'Dentures in Visakhapatnam', statement: 'Restore everyday eating, speech, and confidence with custom dentures.', description: 'Custom removable teeth for comfortable eating, clearer speech, and facial support.' },
  gums: { label: 'Gum Treatment', slug: 'gum-treatment', title: 'Gum Treatment in Visakhapatnam', statement: 'Control bleeding gums and protect the foundation of your teeth.', description: 'Focused periodontal care for healthier gums, fresher breath, and stable teeth.' },
  pediatric: { label: 'Pediatric Dentistry', slug: 'pediatric-dentistry', title: 'Pediatric Dentistry', statement: 'Gentle dental care for healthy, confident growing smiles.', description: 'Child-friendly prevention and treatment for healthy teeth and positive dental habits.' },
  preventive: { label: 'Preventive Care', slug: 'preventive-dentistry', title: 'Preventive Dentistry', statement: 'Prevent dental problems before they become painful or complex.', description: 'Regular checkups and cleaning that protect long-term teeth and gum health.' },
  rootcanal: { label: 'Root Canal', slug: 'root-canal-treatment', title: 'Root Canal Treatment in Visakhapatnam', statement: 'Save infected teeth and relieve dental pain.', description: 'Precision root canal care that removes infection and preserves natural teeth.' },
  makeover: { label: 'Smile Makeover', slug: 'smile-makeover', title: 'Smile Makeover in Visakhapatnam', statement: 'Improve tooth color, shape, balance, and smile confidence.', description: 'Personalized cosmetic planning for a balanced, natural-looking smile.' },
  whitening: { label: 'Teeth Whitening', slug: 'teeth-whitening', title: 'Teeth Whitening in Visakhapatnam', statement: 'Brighten stained teeth safely with professional whitening.', description: 'Dentist-supervised whitening for a brighter smile with managed sensitivity.' },
  wisdom: { label: 'Wisdom Tooth Removal', slug: 'wisdom-tooth-removal', title: 'Wisdom Tooth Removal', statement: 'Relieve pain and infection from impacted wisdom teeth.', description: 'Careful surgical planning for safe removal and a smoother recovery.' }
};

const navigationOrder = ['implants', 'rootcanal', 'aligners', 'makeover', 'crowns', 'braces', 'gums', 'wisdom', 'whitening', 'fillings', 'dentures', 'pediatric', 'preventive'];

function relativeHref(fromFile, target) {
  const value = path.relative(path.dirname(fromFile), path.join(root, target)).replace(/\\/g, '/');
  return value || './';
}

function checklist(items) {
  return `<ul class="tp-fit-list">${items.slice(0, 5).map((item) => `<li><iconify-icon icon="solar:check-circle-bold" aria-hidden="true"></iconify-icon><span>${escapeHtml(item)}</span></li>`).join('')}</ul>`;
}

function breadcrumb(file, meta) {
  return `<nav class="tp-breadcrumb" aria-label="Breadcrumb"><a href="${relativeHref(file, 'index.html')}">Home</a><span>/</span><a href="${relativeHref(file, 'treatments/index.html')}">Treatments</a><span>/</span><span aria-current="page">${escapeHtml(meta.label)}</span></nav>`;
}

function treatmentNavigation(file, activeKey) {
  const links = navigationOrder.map((key) => {
    const meta = treatmentMeta[key];
    const active = key === activeKey;
    return `<a href="${relativeHref(file, `treatments/${meta.slug}/index.html`)}" class="tp-treatment-chip${active ? ' active' : ''}"${active ? ' aria-current="page"' : ''}>${escapeHtml(meta.label)}</a>`;
  }).join('');
  return `<section class="tp-treatment-nav" aria-label="Explore other treatments"><div class="container"><span class="tp-treatment-nav-label">Explore Other Treatments</span><div class="tp-treatment-chip-row">${links}</div></div></section>`;
}

function heroCopy(file, key) {
  const meta = treatmentMeta[key];
  return `<div class="premium-treatment-hero-copy">${breadcrumb(file, meta)}<h1>${escapeHtml(meta.title)}</h1><h2>${escapeHtml(meta.statement)}</h2><p>${escapeHtml(meta.description)}</p><div class="premium-hero-actions"><a class="btn btn-primary" href="#book-appointment" data-open-appointment-popup><iconify-icon icon="solar:calendar-add-bold-duotone" aria-hidden="true"></iconify-icon><span>Book Consultation</span></a><a class="btn btn-outline" href="tel:+919703294358"><iconify-icon icon="solar:phone-calling-rounded-bold-duotone" aria-hidden="true"></iconify-icon><span>+91 9703294358</span></a></div></div>`;
}

function guideSection(data) {
  const timeline = data.journey.slice(0, 5).map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(item)}</strong></li>`).join('');
  return `<section class="premium-section tp-editorial-guide reveal">
  <div class="container">
    <div class="tp-editorial-heading"><div class="premium-kicker">Patient Guide</div><h2>Is This Treatment Right For You?</h2><p>Understand whether this treatment matches your symptoms and goals.</p></div>
    <div class="tp-fit-grid">
      <article class="tp-fit-panel"><span class="tp-fit-label">Who Benefits Most?</span>${checklist(data.symptoms.slice(0, 4))}</article>
      <article class="tp-fit-panel tp-fit-panel-expect"><span class="tp-fit-label">What To Expect</span>${checklist(data.journey.slice(0, 5))}</article>
    </div>
    <div class="tp-editorial-journey"><div class="tp-journey-heading"><span>Your Treatment Journey</span><p>A clear path from assessment to ongoing care.</p></div><ol class="tp-horizontal-timeline">${timeline}</ol></div>
  </div>
</section>`;
}

const guidePattern = /<section class="premium-section tp-patient-guide reveal">[\s\S]*?<\/section>/;
const editorialGuidePattern = /<section class="premium-section tp-editorial-guide reveal">[\s\S]*?<\/section>/;
const heroPattern = /<section class="premium-treatment-hero tp-hero">[\s\S]*?<\/section>/;
const navPattern = /\s*<section class="tp-treatment-nav"[\s\S]*?<\/section>/;
const treatmentRoot = path.join(root, 'treatments');
const files = [];

function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(target);
    else if (entry.name.endsWith('.html')) files.push(target);
  }
}

collect(treatmentRoot);

let updated = 0;
for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  if (!source.includes('premium-treatment-hero')) continue;

  const heading = source.match(/<h1>(.*?)<\/h1>/i)?.[1] || '';
  const key = treatmentKey(heading);
  if (!key || !guides[key] || !treatmentMeta[key]) throw new Error(`No treatment data for ${path.relative(root, file)} (${heading})`);

  const currentHero = source.match(heroPattern)?.[0];
  if (!currentHero) throw new Error(`Hero not found in ${path.relative(root, file)}`);
  const media = currentHero.match(/<div class="premium-hero-media">[\s\S]*$/)?.[0];
  if (!media) throw new Error(`Hero media not found in ${path.relative(root, file)}`);
  const rebuiltHero = `<section class="premium-treatment-hero tp-hero"><div class="container premium-treatment-hero-grid">${heroCopy(file, key)}${media}`;
  source = source.replace(heroPattern, rebuiltHero);

  source = source.replace(navPattern, '');
  source = source.replace(rebuiltHero, `${rebuiltHero}\n\n  ${treatmentNavigation(file, key)}`);

  if (guidePattern.test(source)) source = source.replace(guidePattern, guideSection(guides[key]));
  else if (editorialGuidePattern.test(source)) source = source.replace(editorialGuidePattern, guideSection(guides[key]));
  else throw new Error(`Patient guide not found in ${path.relative(root, file)}`);

  fs.writeFileSync(file, source, 'utf8');
  updated += 1;
}

console.log(`Updated ${updated} treatment pages.`);
