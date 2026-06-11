const fs = require('fs');
const path = require('path');

const clinic = {
  phone: '+91 9703294358',
  phoneHref: 'tel:+919703294358',
  whatsapp: 'https://api.whatsapp.com/send?phone=919703294358&text=Hello%20Manohar%20Dental%20Clinic,%20I%20would%20like%20to%20book%20a%20treatment%20consultation.',
  timings: 'Mon-Sat: 9:00 AM - 8:30 PM, Sun: 9:30 AM - 1:30 PM',
  address: '50-94-27/A, Next to SBI, Near Gurudwara Road, Santhipuram, Dwaraka Nagar, Visakhapatnam - 530016'
};

const commonWhy = [
  ['MDS Specialists', 'Complex cases are planned by experienced postgraduate dental specialists.'],
  ['Advanced Technology', 'Digital scans, RVG imaging, magnification, and modern chairside systems support precise care.'],
  ['Pain-Free Procedures', 'Comfort-first protocols, careful anesthesia, and calming chairside communication.'],
  ['Digital Diagnostics', 'Clear diagnosis before treatment so patients understand the why, not only the procedure.'],
  ['High Success Rate', 'Evidence-led protocols, quality materials, and careful follow-up improve long-term outcomes.'],
  ['Personalized Care', 'Treatment choices are matched to your bite, smile goals, medical history, and budget.'],
  ['Follow-Up Support', 'Recovery checks and maintenance guidance are built into the patient journey.']
];

const technologies = [
  ['Dental Microscope', 'Enhanced visibility for fine finishing, root canal precision, and conservative dentistry.'],
  ['CBCT Scan', 'Three-dimensional planning for implants, wisdom teeth, bone position, and complex anatomy.'],
  ['RVG Digital X-Ray', 'Low-radiation digital imaging for quick diagnosis and progress checks.'],
  ['Intraoral Scanner', 'Comfortable digital impressions for aligners, crowns, bridges, and smile planning.'],
  ['Laser Dentistry', 'Soft-tissue care with improved comfort, precision, and healing in selected cases.']
];

const treatmentPages = [
  {
    slug: 'dental-implants',
    alias: 'dental-implants.html',
    title: 'Dental Implants',
    metaTitle: 'Dental Implants in Visakhapatnam | Manohar Dental Clinic',
    metaDescription: 'Premium dental implant treatment in Visakhapatnam with digital planning, fixed teeth options, recovery guidance, and MDS specialist care.',
    image: '/assets/images/Dental Implants.png',
    before: '/assets/images/Dental_Implant_Befor.png',
    after: '/assets/images/Dental_Implant_after.png',
    headline: 'Replace missing teeth with fixed, natural-looking teeth that feel stable when you chew.',
    intro: 'Dental implants are titanium tooth roots placed inside the jawbone to support a crown, bridge, or full-arch fixed teeth. They are planned around bone volume, gum health, bite forces, and smile position so the replacement tooth does more than fill a gap.',
    trust: ['Digital implant planning', 'Fixed teeth options', 'Bone-preserving solution', 'MDS specialist-led care'],
    what: ['An implant is a biocompatible post that integrates with bone and acts as a foundation for a new tooth.', 'The process begins with scans and bite evaluation, followed by implant placement and final tooth design after healing.', 'It is performed to replace missing teeth without trimming healthy neighboring teeth.', 'Ideal candidates have one or more missing teeth, healthy gums, and enough bone support or are suitable for grafting.'],
    causes: [['Missing teeth', 'Teeth lost because of decay, gum disease, or extraction leave empty spaces that need stable replacement.'], ['Trauma', 'Accidents can fracture teeth beyond repair and create sudden gaps.'], ['Advanced gum disease', 'Weak tooth support can lead to mobility and tooth loss.'], ['Failed teeth', 'Repeatedly infected or cracked teeth may need replacement when saving them is no longer predictable.']],
    symptoms: [['Difficulty chewing', 'Food avoidance or chewing on one side often follows missing molars.'], ['Visible gaps', 'Smile gaps can affect confidence and speech clarity.'], ['Shifting teeth', 'Neighboring teeth drift into empty spaces and alter the bite.'], ['Facial hollowing', 'Long-term tooth loss can reduce jaw support and change facial fullness.']],
    risks: [['Bone loss', 'The jawbone shrinks when tooth roots are missing for too long.'], ['Bite imbalance', 'Remaining teeth take excess pressure and may wear faster.'], ['More complex treatment later', 'Delayed replacement can require grafting, orthodontics, or larger prosthetic work.'], ['Confidence impact', 'Eating, smiling, and speaking may become increasingly guarded.']],
    benefits: [['Fixed chewing strength', 'Implants are anchored in bone, giving strong support for everyday foods.'], ['Protects nearby teeth', 'Single implants usually avoid cutting adjacent natural teeth.'], ['Natural appearance', 'Crowns are shaped and shaded to blend with your smile.'], ['Bone stimulation', 'Implants help maintain jawbone volume after tooth loss.'], ['Long-term value', 'With maintenance, implants can serve for many years.'], ['Better speech comfort', 'Fixed replacement reduces movement compared with removable options.']],
    process: ['Digital consultation, gum check, CBCT review, and smile-zone evaluation.', 'Bone volume, sinus position, bite load, and medical history are assessed.', 'The implant position, crown design, timeline, and cost options are explained.', 'Implant placement is completed under local anesthesia with sterile protocols.', 'The implant heals while diet and hygiene instructions protect the site.', 'Final crown or bridge checks confirm bite comfort and cleaning access.'],
    aftercare: [['Day 1-3', 'Soft foods, cold compresses if advised, and prescribed medicines.'], ['Week 1', 'Gentle cleaning and review of healing around the implant site.'], ['Month 2-4', 'Bone integration continues before final tooth loading in most cases.'], ['Long term', 'Professional maintenance and daily cleaning protect the implant.']],
    foodsEat: ['Curd rice', 'Soft idli', 'Soups', 'Paneer bhurji', 'Smoothies without seeds'],
    foodsAvoid: ['Hard nuts', 'Sticky sweets', 'Smoking', 'Very spicy foods initially', 'Chewing directly on the surgical side'],
    faqs: ['Is dental implant surgery painful?', 'How long do dental implants last?', 'Can I get implants if I have bone loss?', 'How many visits are needed for implants?', 'Are implants better than bridges?', 'Can diabetics get dental implants?', 'What is immediate loading?', 'How do I clean around an implant?', 'Will the implant tooth look natural?', 'What happens if I delay replacing a missing tooth?'],
    price: 'Single tooth implant, implant bridge, and full-mouth fixed teeth packages are planned after CBCT evaluation.'
  },
  {
    slug: 'dentures',
    alias: 'dentures.html',
    title: 'Denture Treatment',
    metaTitle: 'Denture Treatment in Visakhapatnam | Comfortable Dentures',
    metaDescription: 'Custom complete, partial, flexible, and implant-supported dentures in Visakhapatnam with bite planning and adjustment support.',
    image: '/assets/images/treatments/general-dentistry.jpg',
    before: '/assets/images/Dental_Implant_Befor.png',
    after: '/assets/images/Dental_Implant_after.png',
    headline: 'Restore your smile, speech, and facial support with dentures designed for comfort.',
    intro: 'Dentures are custom-made removable teeth that replace multiple missing teeth or a full arch. Modern dentures are designed around jaw shape, lip support, bite height, and speech comfort so they look natural and feel easier to adapt to.',
    trust: ['Complete and partial dentures', 'Flexible denture options', 'Bite-balanced design', 'Adjustment visits included'],
    what: ['Dentures replace missing teeth and gum contours with a removable appliance.', 'Impressions and bite records guide the tooth setup before final processing.', 'They are performed to restore chewing, speech, appearance, and facial support.', 'Candidates include patients missing several teeth, full arches, or those waiting for implant treatment.'],
    causes: [['Multiple missing teeth', 'Loss of several teeth can make fixed bridges unsuitable.'], ['Gum disease history', 'Advanced periodontal breakdown may lead to full or partial tooth loss.'], ['Age-related wear', 'Long-term wear and breakdown can reduce chewing efficiency.'], ['Medical limitations', 'Some patients need non-surgical replacement options.']],
    symptoms: [['Loose old denture', 'Movement while talking or eating suggests poor fit.'], ['Sunken cheeks', 'Loss of teeth reduces support for lips and cheeks.'], ['Speech changes', 'Missing front teeth or unstable dentures can affect pronunciation.'], ['Sore spots', 'Pressure marks indicate the denture base needs correction.']],
    risks: [['Poor nutrition', 'Avoiding firm foods can reduce dietary variety.'], ['Jaw ridge shrinkage', 'Long-term tooth loss changes gum ridge shape.'], ['Digestive strain', 'Incomplete chewing makes meals harder to manage.'], ['Oral sores', 'Ill-fitting dentures can create ulcers and inflammation.']],
    benefits: [['Facial support', 'Restores lip and cheek fullness after tooth loss.'], ['Improved speech', 'Replaces missing front tooth support for clearer words.'], ['Affordable replacement', 'A practical solution for multiple missing teeth.'], ['Non-surgical option', 'Useful when surgery is not preferred or suitable.'], ['Easy repairability', 'Selected denture types can be adjusted or relined.'], ['Better daily confidence', 'Smiling and eating in social settings becomes easier.']],
    process: ['Consultation includes gum ridge, bite, and smile-line review.', 'Impressions and jaw measurements are recorded accurately.', 'Tooth shade, size, and arrangement are selected with the patient.', 'Trial denture checks appearance, bite, and speech before finalization.', 'Final denture is delivered with wearing and cleaning guidance.', 'Adjustment visits fine-tune sore spots and chewing comfort.'],
    aftercare: [['First week', 'Wear as advised and return for pressure adjustments.'], ['Daily', 'Clean the denture outside the mouth with a soft brush.'], ['Night', 'Remove unless instructed otherwise to rest the tissues.'], ['Every year', 'Check fit as gum ridges naturally change.']],
    foodsEat: ['Soft rice', 'Boiled vegetables', 'Eggs', 'Banana', 'Tender cooked dal'],
    foodsAvoid: ['Very sticky foods', 'Hard chikki', 'Biting whole apples initially', 'Using toothpicks under dentures', 'Sleeping with unclean dentures'],
    faqs: ['How long does it take to get used to new dentures?', 'Will dentures look artificial?', 'Can dentures be fixed with implants?', 'Why do dentures become loose over time?', 'How should I clean dentures?', 'Can I eat normally with dentures?', 'Do dentures affect speech?', 'What is the difference between complete and partial dentures?', 'How often should dentures be replaced?', 'Are flexible dentures better for me?'],
    price: 'Packages vary for complete, partial, flexible, cast partial, and implant-supported dentures.'
  },
  {
    slug: 'teeth-whitening',
    alias: 'teeth-whitening.html',
    title: 'Teeth Whitening Treatment',
    metaTitle: 'Teeth Whitening in Visakhapatnam | Professional Smile Brightening',
    metaDescription: 'Professional teeth whitening in Visakhapatnam for stains, yellow teeth, shade correction, and safer cosmetic brightening.',
    image: '/assets/images/Smile Makeover.png',
    before: '/assets/images/smile_makeover_before.png',
    after: '/assets/images/smile_makeover_after.png',
    headline: 'Lift stains safely and brighten your smile without damaging enamel.',
    intro: 'Professional whitening uses controlled dental-grade gels to lighten stains within enamel and dentin. Before whitening, the dentist checks cavities, sensitivity, gum health, and existing caps or fillings so the result is safe and realistic.',
    trust: ['Shade assessment', 'Sensitivity control', 'Quick cosmetic visit', 'Dentist-supervised whitening'],
    what: ['Whitening lightens natural teeth using professionally controlled bleaching agents.', 'The gums are protected before gel activation and shade progress is monitored.', 'It is performed for stains caused by tea, coffee, tobacco, aging, or lifestyle discoloration.', 'Candidates have healthy teeth and gums without untreated cavities or severe sensitivity.'],
    causes: [['Tea and coffee stains', 'Chromogens from beverages settle into enamel pores.'], ['Tobacco use', 'Nicotine and tar create stubborn yellow-brown discoloration.'], ['Aging enamel', 'Thinner enamel reveals warmer dentin underneath.'], ['Certain foods', 'Colored sauces and cola can dull the smile over time.']],
    symptoms: [['Yellow shade', 'Teeth appear warmer or duller in photos and daylight.'], ['Patchy stains', 'Uneven color after plaque buildup or habits.'], ['Low smile confidence', 'Patients may hide their teeth while laughing.'], ['Event concern', 'Upcoming weddings, interviews, or photos often trigger whitening goals.']],
    risks: [['Stains deepen', 'Surface stains become harder to lift when ignored.'], ['Wrong home products', 'Overuse of abrasive powders can scratch enamel.'], ['Uneven cosmetic work', 'Existing fillings and crowns do not whiten like natural teeth.'], ['Missed decay', 'Whitening over cavities can worsen sensitivity.']],
    benefits: [['Brighter smile fast', 'Visible shade improvement can happen in a short appointment.'], ['Professional safety', 'Gum protection and controlled gel strength reduce avoidable irritation.'], ['Personalized shade goal', 'The dentist sets a natural target instead of an over-white look.'], ['Confidence boost', 'A brighter smile can make photos and conversations easier.'], ['Non-invasive', 'No drilling or reshaping is needed for suitable patients.'], ['Maintenance guidance', 'Diet and touch-up advice help the result last longer.']],
    process: ['Consultation checks stains, restorations, sensitivity, and gum health.', 'Current shade is recorded and realistic shade goals are discussed.', 'Cleaning may be recommended before whitening for better gel contact.', 'Gums are isolated and whitening gel is applied in controlled cycles.', 'Sensitivity response is monitored before finishing the appointment.', 'Post-whitening diet and maintenance are explained.'],
    aftercare: [['First 24 hours', 'Avoid strong-colored foods and drinks.'], ['First week', 'Use desensitizing toothpaste if advised.'], ['Ongoing', 'Rinse after tea or coffee and maintain cleanings.'], ['Touch-up', 'Schedule refresh treatment only when clinically suitable.']],
    foodsEat: ['Plain rice', 'Curd', 'Milk', 'White sauce pasta', 'Banana'],
    foodsAvoid: ['Coffee', 'Tea', 'Beetroot', 'Red sauces', 'Tobacco'],
    faqs: ['Is professional teeth whitening safe?', 'How many shades lighter can teeth become?', 'Will whitening cause sensitivity?', 'Do crowns or fillings whiten too?', 'How long does whitening last?', 'Can I whiten teeth before a wedding?', 'Is scaling needed before whitening?', 'Can yellow teeth become white?', 'How often can whitening be repeated?', 'What should I avoid after whitening?'],
    price: 'Whitening packages include shade assessment, gum protection, whitening cycles, and maintenance advice.'
  },
  {
    slug: 'smile-makeover',
    alias: 'smile-makeover.html',
    title: 'Smile Makeover Treatment',
    metaTitle: 'Smile Makeover in Visakhapatnam | Cosmetic Dental Design',
    metaDescription: 'Smile makeover treatment in Visakhapatnam with veneers, whitening, bonding, gum contouring, implants, and digital smile planning.',
    image: '/assets/images/Smile Makeover.png',
    before: '/assets/images/smile_makeover_before.png',
    after: '/assets/images/smile_makeover_after.png',
    headline: 'Design a confident smile that matches your face, lips, and personality.',
    intro: 'A smile makeover combines cosmetic and restorative treatments to improve tooth color, shape, alignment, gum display, and smile harmony. It may include whitening, bonding, veneers, crowns, implants, gum contouring, or aligners based on the patient.',
    trust: ['Digital smile planning', 'Veneer and bonding options', 'Face-led aesthetics', 'Trial smile discussions'],
    what: ['A smile makeover is a customized plan to improve the visible smile zone.', 'Photos, shade analysis, bite checks, and tooth proportions guide treatment choices.', 'It is performed when teeth look stained, worn, chipped, uneven, spaced, or disproportionate.', 'Candidates want aesthetic improvement and have treatable gum, bite, and enamel conditions.'],
    causes: [['Chipped teeth', 'Small fractures disturb smile symmetry.'], ['Stained enamel', 'Deep discoloration may need more than whitening.'], ['Gaps or uneven teeth', 'Spacing and shape differences affect smile balance.'], ['Worn edges', 'Grinding and aging shorten teeth and flatten the smile.']],
    symptoms: [['Avoiding photos', 'Patients often smile with lips closed.'], ['Uneven tooth display', 'Some teeth look too short, long, or tilted.'], ['Dull smile color', 'Natural shade no longer matches the desired appearance.'], ['Gummy smile concern', 'Excess gum display changes perceived tooth proportions.']],
    risks: [['More tooth wear', 'Uncorrected bite forces can continue damaging edges.'], ['Patchwork dentistry', 'Treating one tooth at a time may create mismatched color and shape.'], ['Lower confidence', 'Smile hesitation can affect personal and professional interactions.'], ['Missed functional issues', 'Cosmetic work without bite assessment may not last well.']],
    benefits: [['Face-matched design', 'Tooth shape and shade are selected to suit your features.'], ['Multiple options', 'Plans can combine conservative and premium treatments.'], ['Balanced symmetry', 'Edges, widths, and visible gum levels are refined.'], ['Better photo confidence', 'Patients feel more comfortable smiling naturally.'], ['Functional awareness', 'Bite and tooth health are considered with aesthetics.'], ['Natural finish', 'The goal is attractive, not artificial.']],
    process: ['Consultation covers smile goals, photos, dental history, and budget range.', 'Diagnosis checks gums, bite, enamel, old fillings, and missing teeth.', 'A phased cosmetic plan is prepared with treatment combinations.', 'Whitening, bonding, veneers, crowns, or gum shaping are performed as planned.', 'Final polishing, bite checks, and shade harmony are reviewed.', 'Maintenance visits protect veneers, bonding, and gum health.'],
    aftercare: [['First week', 'Adapt to the new bite and report any high points.'], ['Daily', 'Brush gently and floss around cosmetic margins.'], ['Lifestyle', 'Limit stain-heavy habits after whitening or bonding.'], ['Long term', 'Night guard may be advised for grinding patients.']],
    foodsEat: ['Soft meals initially', 'Non-staining foods after whitening', 'Plenty of water', 'Protein-rich foods', 'Fresh fruits cut into pieces'],
    foodsAvoid: ['Biting pens', 'Opening packets with teeth', 'Hard ice', 'Frequent tobacco', 'Heavy coffee immediately after whitening'],
    faqs: ['What treatments are included in a smile makeover?', 'Are veneers always necessary?', 'Can a smile makeover be done without drilling?', 'How long does a smile makeover take?', 'Will my smile look natural?', 'Can crooked teeth be corrected cosmetically?', 'Is whitening part of smile design?', 'How long do veneers or bonding last?', 'Can old crowns be replaced for a makeover?', 'How is the final smile shade chosen?'],
    price: 'Packages depend on whitening, bonding, veneer count, gum correction, aligners, or restorative work included.'
  },
  {
    slug: 'crowns-bridges',
    alias: 'crowns-bridges.html',
    title: 'Crowns & Bridges',
    metaTitle: 'Crowns and Bridges in Visakhapatnam | Fixed Teeth Restoration',
    metaDescription: 'Natural-looking dental crowns and bridges in Visakhapatnam for damaged teeth, root canal teeth, missing teeth, and bite restoration.',
    image: '/assets/images/clinic/chair.jpg',
    before: '/assets/images/root_canal_before.png',
    after: '/assets/images/root_canal_after.png',
    headline: 'Protect weak teeth and replace missing teeth with fixed, lifelike restorations.',
    intro: 'Crowns cover and protect damaged teeth, while bridges replace missing teeth by anchoring to nearby support teeth or implants. Good crown and bridge work depends on tooth preparation, material choice, bite accuracy, and margin fit.',
    trust: ['Zirconia and ceramic options', 'Digital impressions', 'Bite-balanced restorations', 'Natural shade matching'],
    what: ['A crown is a cap that covers a weakened tooth; a bridge is a fixed replacement for missing teeth.', 'The tooth is shaped, scanned or impressed, and restored with a lab-made ceramic or metal-ceramic unit.', 'It is performed after root canal treatment, fractures, large cavities, heavy wear, or tooth loss.', 'Candidates need a strong foundation tooth, healthy gums, and stable bite support.'],
    causes: [['Root canal-treated teeth', 'Teeth often need full coverage after large internal treatment.'], ['Large cavities', 'When a filling is too big, a crown protects remaining tooth walls.'], ['Cracked teeth', 'A crown can hold weakened cusps together.'], ['Missing single teeth', 'A bridge can close a gap when implant treatment is not chosen.']],
    symptoms: [['Food lodgement', 'Gaps or broken edges trap food around teeth.'], ['Biting pain', 'Cracks and weak cusps hurt under chewing force.'], ['Discolored old crowns', 'Aged crowns may show dark margins or shade mismatch.'], ['Missing tooth gap', 'Chewing efficiency drops and adjacent teeth drift.']],
    risks: [['Tooth fracture', 'Weak teeth can break below gum level if left uncovered.'], ['Decay spread', 'Open margins or gaps collect plaque.'], ['Bite collapse', 'Missing teeth can change chewing balance.'], ['More expensive repair later', 'A small protective restoration may become extraction if delayed.']],
    benefits: [['Protects weak teeth', 'Crowns distribute chewing force around the tooth.'], ['Fixed replacement', 'Bridges do not come in and out like removable dentures.'], ['Natural aesthetics', 'Ceramics can be shade-matched to nearby teeth.'], ['Restores chewing', 'Back teeth regain stronger food grinding ability.'], ['Improves shape', 'Crowns rebuild worn, short, or broken teeth.'], ['Predictable finish', 'Digital planning improves fit and bite comfort.']],
    process: ['Consultation checks tooth strength, gum level, bite, and X-rays.', 'Diagnosis decides between filling, crown, post, bridge, or implant support.', 'Material selection and shade matching are discussed before preparation.', 'Tooth preparation and temporary crown protect the tooth while lab work is made.', 'Final crown or bridge is bonded or cemented after fit checks.', 'Follow-up confirms comfort, cleaning access, and bite balance.'],
    aftercare: [['First 24 hours', 'Avoid chewing hard foods on a newly cemented crown if advised.'], ['Daily', 'Floss around crown margins and under bridge pontics.'], ['Every 6 months', 'Professional cleaning checks margins and gum response.'], ['Long term', 'Protect crowns with a night guard if grinding is present.']],
    foodsEat: ['Soft meals first day', 'Cooked vegetables', 'Rice', 'Dal', 'Cut fruits'],
    foodsAvoid: ['Hard candies', 'Chewing ice', 'Sticky caramel', 'Biting bones', 'Using teeth as tools'],
    faqs: ['When does a tooth need a crown?', 'Is zirconia better than metal ceramic?', 'How long do crowns last?', 'Does crown preparation hurt?', 'Can a bridge replace one missing tooth?', 'How do I clean under a bridge?', 'Why is a crown needed after root canal?', 'Can old crowns be replaced?', 'Will crowns look like natural teeth?', 'What happens if I delay a crown?'],
    price: 'Packages vary by ceramic, zirconia, metal-ceramic, bridge span, and whether post-core support is needed.'
  },
  {
    slug: 'dental-fillings',
    alias: 'dental-fillings.html',
    title: 'Dental Fillings',
    metaTitle: 'Dental Fillings in Visakhapatnam | Tooth-Colored Cavity Repair',
    metaDescription: 'Tooth-colored dental fillings in Visakhapatnam for cavities, chips, worn teeth, sensitivity, and conservative tooth repair.',
    image: '/assets/images/treatments/general-dentistry.jpg',
    before: '/assets/images/root_canal_before.png',
    after: '/assets/images/root_canal_after.png',
    headline: 'Repair cavities early with tooth-colored fillings that protect natural tooth structure.',
    intro: 'Dental fillings remove decayed or weakened tooth material and seal the tooth with restorative material. Modern tooth-colored fillings bond to enamel and dentin, restore shape, and help prevent bacteria from re-entering the cavity.',
    trust: ['Tooth-colored materials', 'Conservative cavity care', 'Sensitivity-focused technique', 'Same-day repair'],
    what: ['A filling is a restoration used to repair small to moderate tooth damage.', 'Decay is cleaned, the tooth is shaped minimally, and bonded material is layered and polished.', 'It is performed for cavities, small chips, worn edges, and sensitivity from exposed tooth areas.', 'Candidates have repairable tooth structure without deep pulp infection.'],
    causes: [['Plaque acids', 'Bacteria convert sugars into acids that dissolve enamel.'], ['Frequent snacking', 'Repeated acid attacks increase cavity risk.'], ['Deep pits', 'Molars with narrow grooves trap food and plaque.'], ['Old filling leakage', 'Aged restorations can allow new decay at the edges.']],
    symptoms: [['Food sticking', 'Cavities often trap food in grooves or between teeth.'], ['Cold sensitivity', 'Enamel loss can expose sensitive dentin.'], ['Dark spots', 'Brown or black areas may indicate decay.'], ['Rough tooth edge', 'Chipped enamel can feel sharp to the tongue.']],
    risks: [['Deep decay', 'Untreated cavities can reach the nerve and need root canal treatment.'], ['Tooth fracture', 'Weakened walls may break under chewing.'], ['Pain episodes', 'Mild sensitivity can become spontaneous pain.'], ['Larger restoration later', 'Delay often means more tooth removal.']],
    benefits: [['Preserves tooth', 'Early fillings save natural structure.'], ['Stops decay spread', 'Cleaning and sealing blocks cavity progression.'], ['Natural color', 'Composite blends with surrounding tooth shade.'], ['Improves comfort', 'Sealing exposed dentin reduces sensitivity.'], ['Fast appointment', 'Most fillings are completed in a single visit.'], ['Smooth finish', 'Polishing improves tongue comfort and plaque control.']],
    process: ['Consultation identifies cavities, chips, or sensitivity triggers.', 'Diagnosis uses visual checks and digital X-rays when needed.', 'Material shade and cavity depth are discussed.', 'Decay is removed and the tooth is bonded with filling material.', 'Bite adjustment and polishing make the restoration comfortable.', 'Follow-up is advised if sensitivity persists or bite feels high.'],
    aftercare: [['First hours', 'Avoid chewing until numbness wears off.'], ['First day', 'Report any high bite or sharp edge.'], ['Daily', 'Brush with fluoride toothpaste and clean between teeth.'], ['Ongoing', 'Regular checkups catch new cavities early.']],
    foodsEat: ['Soft food after numbness', 'Normal meals once comfortable', 'Water', 'Low-sugar snacks', 'Dairy foods'],
    foodsAvoid: ['Sugary sipping', 'Hard biting on numb side', 'Sticky candy', 'Frequent cola', 'Chewing ice'],
    faqs: ['Do dental fillings hurt?', 'How long do tooth-colored fillings last?', 'Can a cavity heal without filling?', 'Why is my tooth sensitive after a filling?', 'Are composite fillings safe?', 'How do I know if an old filling is leaking?', 'Can front tooth chips be filled?', 'How soon can I eat after a filling?', 'What happens if a cavity is not filled?', 'Are fillings visible when I smile?'],
    price: 'Packages depend on cavity size, tooth location, material choice, and whether X-rays are needed.'
  },
  {
    slug: 'preventive-dentistry',
    alias: 'preventive-dentistry.html',
    title: 'Preventive Dentistry',
    metaTitle: 'Preventive Dentistry in Visakhapatnam | Dental Checkups and Cleaning',
    metaDescription: 'Preventive dentistry in Visakhapatnam with checkups, scaling, polishing, fluoride support, sealants, gum screening, and hygiene coaching.',
    image: '/assets/images/gallery/dentist-3.jpg',
    before: '/assets/images/root_canal_before.png',
    after: '/assets/images/root_canal_after.png',
    headline: 'Prevent pain, infection, and expensive treatment with proactive dental care.',
    intro: 'Preventive dentistry focuses on finding risk early and keeping teeth healthy through checkups, scaling, polishing, fluoride guidance, sealants, gum screening, and home-care coaching. It is the easiest way to avoid emergency dental visits.',
    trust: ['Routine dental checkups', 'Scaling and polishing', 'Cavity risk mapping', 'Personal hygiene coaching'],
    what: ['Preventive dentistry is regular care that stops dental problems before they become serious.', 'The dentist screens teeth, gums, bite, plaque, diet habits, and home-care technique.', 'It is performed to reduce cavities, gum disease, bad breath, and sudden pain.', 'Everyone is a candidate, especially children, braces patients, diabetics, smokers, and patients with past dental work.'],
    causes: [['Plaque buildup', 'Daily plaque hardens into tartar when not removed properly.'], ['Irregular checkups', 'Small cavities are missed until pain starts.'], ['Diet habits', 'Frequent sugar and acidic drinks raise cavity risk.'], ['Medical factors', 'Diabetes, dry mouth, and medicines can affect oral health.']],
    symptoms: [['Bleeding while brushing', 'Early gum inflammation often appears before pain.'], ['Bad breath', 'Plaque, tartar, and tongue coating can create odor.'], ['Sensitivity', 'Early enamel wear or gum recession may cause cold response.'], ['Tartar deposits', 'Hard yellow or brown deposits need professional cleaning.']],
    risks: [['Cavities progress silently', 'Decay can reach the nerve before obvious pain.'], ['Gum disease advances', 'Untreated tartar can damage tooth support.'], ['Higher costs later', 'Prevention is usually simpler than emergency care.'], ['Treatment surprises', 'Delayed checks can reveal multiple problems at once.']],
    benefits: [['Early detection', 'Small issues are treated before they become painful.'], ['Fresh breath', 'Cleaning removes odor-causing buildup.'], ['Healthier gums', 'Scaling reduces inflammation and bleeding.'], ['Lower treatment burden', 'Prevention reduces complex dental procedures.'], ['Personal guidance', 'Brushing and flossing advice is tailored to your mouth.'], ['Family-friendly care', 'Children learn dental visits as normal wellness care.']],
    process: ['Consultation reviews dental history, diet, brushing, and risk factors.', 'Diagnosis checks teeth, gums, bite, and X-rays if needed.', 'A prevention plan sets cleaning frequency and home-care targets.', 'Scaling, polishing, fluoride, or sealants are completed as suitable.', 'Home instructions are demonstrated in simple steps.', 'Follow-up recalls monitor changes before symptoms appear.'],
    aftercare: [['Same day', 'Mild gum tenderness after scaling settles quickly.'], ['Daily', 'Use the recommended brush, paste, and interdental cleaning method.'], ['Every 6 months', 'Most patients benefit from regular checkups.'], ['High risk', 'Some patients need shorter recall intervals.']],
    foodsEat: ['Fiber-rich fruits', 'Vegetables', 'Dairy', 'Nuts in moderation', 'Water'],
    foodsAvoid: ['Frequent sugar', 'Sticky sweets', 'Cola sipping', 'Excess acidic drinks', 'Late-night snacking without brushing'],
    faqs: ['How often should I get a dental checkup?', 'Is scaling bad for teeth?', 'Why do gums bleed after cleaning?', 'Can preventive dentistry stop cavities?', 'Are sealants useful for children?', 'Do adults need fluoride?', 'How often should braces patients get cleaning?', 'Can bad breath be treated with cleaning?', 'What is a cavity risk assessment?', 'Why visit a dentist if nothing hurts?'],
    price: 'Preventive packages include checkup, scaling-polishing options, child sealants, fluoride support, and recall planning.'
  },
  {
    slug: 'root-canal-treatment',
    alias: 'root-canal-treatment.html',
    title: 'Root Canal Treatment',
    metaTitle: 'Root Canal Treatment in Visakhapatnam | Pain-Free RCT',
    metaDescription: 'Pain-free root canal treatment in Visakhapatnam with digital X-rays, rotary endodontics, infection control, crown planning, and aftercare.',
    image: '/assets/images/Root Canal Treatment.png',
    before: '/assets/images/root_canal_before.png',
    after: '/assets/images/root_canal_after.png',
    headline: 'Save an infected tooth and stop dental pain with precision root canal care.',
    intro: 'Root canal treatment removes infected or inflamed pulp from inside the tooth, disinfects the canals, and seals them. The goal is to save the natural tooth instead of extracting it, especially when decay or cracks have reached the nerve.',
    trust: ['Pain-control anesthesia', 'Rotary endodontics', 'Digital X-ray checks', 'Crown planning support'],
    what: ['RCT cleans the infected nerve space inside a tooth.', 'The canals are shaped, disinfected, filled, and later protected with a restoration or crown.', 'It is performed for deep decay, cracked teeth, abscesses, and severe sensitivity.', 'Candidates have a restorable tooth with infection or nerve inflammation.'],
    causes: [['Deep decay', 'Cavities that reach the pulp cause infection and pain.'], ['Cracked teeth', 'Cracks allow bacteria to enter the inner tooth.'], ['Repeated dental work', 'Large or repeated restorations can irritate the pulp.'], ['Trauma', 'A blow to the tooth can damage the nerve even without visible fracture.']],
    symptoms: [['Tooth pain', 'Throbbing or lingering pain often signals pulp involvement.'], ['Swelling', 'Gum swelling or facial swelling may indicate infection.'], ['Sensitivity to heat', 'Heat pain can be a warning sign of nerve inflammation.'], ['Pimple on gum', 'A draining sinus can form near an infected root.']],
    risks: [['Infection spread', 'Bacteria can move into bone and soft tissues.'], ['Abscess formation', 'Pus pockets may develop around root tips.'], ['Tooth loss', 'A restorable tooth may become unsavable if delayed.'], ['Emergency pain', 'Night pain and swelling can escalate suddenly.']],
    benefits: [['Saves natural tooth', 'RCT keeps your own tooth in the mouth.'], ['Relieves pain', 'Removing infected pulp stops the source of pain.'], ['Restores chewing', 'The tooth can function again after final restoration.'], ['Prevents spread', 'Disinfection reduces infection around the root.'], ['Maintains alignment', 'Saving the tooth prevents neighboring tooth drift.'], ['Predictable protection', 'A crown can reinforce heavily damaged teeth.']],
    process: ['Consultation records symptoms, pain triggers, and tooth history.', 'Digital X-rays identify depth of decay, roots, and infection area.', 'Treatment plan explains visits, restoration, and crown need.', 'Canals are cleaned, shaped, disinfected, and sealed under anesthesia.', 'Tenderness settles as the tissues heal after infection control.', 'Follow-up restoration or crown protects the treated tooth.'],
    aftercare: [['First 24-48 hours', 'Mild tenderness while biting is common.'], ['Until crown', 'Avoid heavy chewing on the treated tooth if structure is weak.'], ['Medication', 'Take medicines only as prescribed.'], ['Review', 'Return if swelling, high bite, or persistent pain occurs.']],
    foodsEat: ['Soft rice', 'Dal', 'Curd', 'Soft chapati', 'Warm soups'],
    foodsAvoid: ['Hard nuts', 'Chewing on the treated side early', 'Sticky sweets', 'Very hot foods immediately', 'Skipping crown when advised'],
    faqs: ['Is root canal treatment painful?', 'How many sittings are needed for RCT?', 'Do I need a crown after root canal?', 'Can antibiotics cure tooth infection without RCT?', 'Why does a root canal tooth hurt when biting?', 'How long does an RCT tooth last?', 'Can a failed root canal be retreated?', 'Is extraction better than root canal?', 'What happens if RCT is delayed?', 'Can swelling go away after root canal?'],
    price: 'Packages include consultation, X-rays, single or multi-root canal care, restoration, and crown options when needed.'
  },
  {
    slug: 'braces-treatment',
    legacySlug: 'braces',
    alias: 'braces-treatment.html',
    title: 'Braces Treatment',
    metaTitle: 'Braces Treatment in Visakhapatnam | Metal and Ceramic Braces',
    metaDescription: 'Braces treatment in Visakhapatnam for crowding, gaps, protrusion, bite correction, teen orthodontics, and adult smile alignment.',
    image: '/assets/images/Braces Treatment.png',
    before: '/assets/images/alinerBefore.png',
    after: '/assets/images/alinersAfter.png',
    headline: 'Straighten teeth and correct bite problems with specialist orthodontic braces.',
    intro: 'Braces use brackets and wires to move teeth gradually into healthier positions. They can correct crowding, gaps, rotated teeth, protrusion, deep bite, open bite, and crossbite while improving both smile appearance and chewing function.',
    trust: ['Metal and ceramic braces', 'Teen and adult orthodontics', 'Bite correction planning', 'Monthly progress reviews'],
    what: ['Braces are fixed orthodontic appliances attached to teeth during active alignment.', 'Wires apply controlled forces that guide teeth and roots over time.', 'They are performed when tooth position affects appearance, cleaning, speech, bite, or jaw comfort.', 'Candidates include children, teens, and adults with healthy gums and commitment to appointments.'],
    causes: [['Crowding', 'Insufficient arch space causes teeth to overlap.'], ['Protruding teeth', 'Jaw or tooth position can push front teeth forward.'], ['Jaw growth imbalance', 'Upper and lower jaws may not meet correctly.'], ['Early tooth loss', 'Lost baby teeth can allow drifting and blocked eruption.']],
    symptoms: [['Crooked teeth', 'Visible misalignment makes cleaning harder.'], ['Food lodgement', 'Crowded contacts trap plaque and food.'], ['Bite discomfort', 'Uneven tooth contact can strain chewing.'], ['Smile hesitation', 'Patients may feel conscious about tooth position.']],
    risks: [['Cavity risk', 'Crowded teeth are harder to clean thoroughly.'], ['Gum inflammation', 'Plaque retention increases bleeding and swelling.'], ['Tooth wear', 'Bad bites can chip or flatten enamel.'], ['Worsening alignment', 'Some orthodontic problems become more complex with growth.']],
    benefits: [['Reliable tooth movement', 'Fixed braces work continuously and handle complex movements.'], ['Better bite function', 'Correct alignment improves chewing contacts.'], ['Cleaner teeth', 'Straighter teeth are easier to brush and floss.'], ['Teen-friendly durability', 'Braces do not depend on removable tray wear time.'], ['Ceramic option', 'Tooth-colored brackets are available for a subtler look.'], ['Long-term stability planning', 'Retainers maintain results after treatment.']],
    process: ['Consultation examines teeth, bite, jaw relation, and smile goals.', 'Photos, X-rays, scans, and measurements guide diagnosis.', 'Treatment plan covers braces type, duration, extractions if needed, and retention.', 'Brackets are bonded and wires are placed with comfort instructions.', 'Monthly adjustments guide staged tooth movement.', 'Debonding, polishing, and retainers protect the final result.'],
    aftercare: [['First week', 'Soft foods help while teeth feel tender.'], ['Every day', 'Clean around brackets carefully after meals.'], ['Monthly', 'Attend adjustment visits on schedule.'], ['After braces', 'Wear retainers exactly as advised.']],
    foodsEat: ['Soft idli', 'Curd rice', 'Pasta', 'Soft vegetables', 'Cut fruits'],
    foodsAvoid: ['Hard popcorn kernels', 'Sticky chewing gum', 'Biting corn directly', 'Hard candy', 'Nail biting'],
    faqs: ['What age is best for braces?', 'Are braces painful?', 'How long does braces treatment take?', 'Are ceramic braces effective?', 'Do I need tooth extraction for braces?', 'How often are braces tightened?', 'Can adults get braces?', 'What foods should I avoid with braces?', 'Why are retainers needed after braces?', 'Can braces fix bite problems?'],
    price: 'Packages vary for metal braces, ceramic braces, complexity, duration, and retainer type.'
  },
  {
    slug: 'clear-aligners',
    alias: 'clear-aligners.html',
    title: 'Clear Aligners Treatment',
    metaTitle: 'Clear Aligners in Visakhapatnam | Invisible Teeth Alignment',
    metaDescription: 'Clear aligners in Visakhapatnam for crowding, gaps, mild bite correction, digital planning, removable trays, and discreet orthodontic care.',
    image: '/assets/images/Clear Aligners.png',
    before: '/assets/images/alinerBefore.png',
    after: '/assets/images/alinersAfter.png',
    headline: 'Straighten your smile discreetly with removable, transparent aligner trays.',
    intro: 'Clear aligners are custom transparent trays that move teeth in planned stages. They are removable for eating and brushing, making them a popular option for adults and teens who want orthodontic improvement with a low-visibility appliance.',
    trust: ['Digital 3D planning', 'Nearly invisible trays', 'Removable convenience', 'Progress tracking visits'],
    what: ['Aligners are sequential trays made to fit your teeth and guide movement.', 'A digital scan is used to plan tooth movement and fabricate tray sets.', 'They are performed for crowding, spacing, relapse after braces, and selected bite issues.', 'Candidates can wear trays 20-22 hours daily and have suitable tooth movement needs.'],
    causes: [['Crowding', 'Teeth overlap because the arch lacks space.'], ['Gaps', 'Spacing can come from tooth size, habits, or missing teeth.'], ['Bite issues', 'Mild overbite, deep bite, or crossbite may be aligner-suitable.'], ['Relapse', 'Teeth can shift years after braces if retainers were stopped.']],
    symptoms: [['Rotated teeth', 'Teeth turn out of line and affect smile symmetry.'], ['Visible spacing', 'Small gaps collect food and affect appearance.'], ['Difficult flossing', 'Tight overlaps make cleaning frustrating.'], ['Retainer no longer fits', 'Past orthodontic results may have shifted.']],
    risks: [['More crowding', 'Untreated alignment can make cleaning harder over time.'], ['Gum stress', 'Bad tooth position can contribute to recession in some areas.'], ['Uneven wear', 'Misaligned contacts may wear enamel edges.'], ['Longer correction later', 'Small relapse can become a larger orthodontic problem.']],
    benefits: [['Discreet appearance', 'Clear trays are less noticeable in daily life.'], ['Removable eating', 'No bracket food restrictions during meals.'], ['Easier hygiene', 'Brush and floss without wires blocking access.'], ['Digital preview', 'Planned movements can be reviewed before starting.'], ['Comfortable edges', 'Smooth trays reduce bracket-related ulcers.'], ['Lifestyle fit', 'Useful for working adults and college students.']],
    process: ['Consultation checks alignment goals, bite, gums, and enamel health.', 'Digital scan and records identify whether aligners are suitable.', 'A staged movement plan and expected duration are reviewed.', 'Trays are delivered with wear, cleaning, and attachment guidance.', 'Progress visits check tracking and provide next aligner sets.', 'Retainers maintain the corrected position after treatment.'],
    aftercare: [['Daily', 'Wear aligners 20-22 hours unless told otherwise.'], ['Meals', 'Remove trays before eating or colored drinks.'], ['Cleaning', 'Rinse and brush trays gently, never with hot water.'], ['Retention', 'Use retainers after aligner treatment to prevent relapse.']],
    foodsEat: ['No restriction while trays are removed', 'Water with trays in', 'Balanced meals', 'Low-sugar snacks', 'Protein-rich foods'],
    foodsAvoid: ['Eating with trays in', 'Hot beverages with trays', 'Sugary drinks while wearing trays', 'Skipping wear time', 'Leaving trays uncovered'],
    faqs: ['Are clear aligners really invisible?', 'How many hours should aligners be worn?', 'Can aligners fix crowding?', 'Are aligners painful?', 'How long does aligner treatment take?', 'Can I eat with aligners?', 'What are attachments?', 'What if an aligner tray is lost?', 'Are aligners better than braces?', 'Will teeth shift back after aligners?'],
    price: 'Packages depend on case complexity, number of aligners, refinements, and retainer needs.'
  },
  {
    slug: 'wisdom-tooth-removal',
    alias: 'wisdom-tooth-removal.html',
    title: 'Wisdom Tooth Removal',
    metaTitle: 'Wisdom Tooth Removal in Visakhapatnam | Safe Third Molar Surgery',
    metaDescription: 'Wisdom tooth removal in Visakhapatnam for impacted teeth, jaw pain, swelling, food lodgement, infection, and surgical extraction care.',
    image: '/assets/images/Wisdom Tooth Removal.png',
    before: '/assets/images/root_canal_before.png',
    after: '/assets/images/root_canal_after.png',
    headline: 'Remove painful or impacted wisdom teeth with safe surgical planning and clear recovery guidance.',
    intro: 'Wisdom teeth are third molars that often lack enough space to erupt correctly. When impacted, tilted, infected, or decayed, they can cause pain, swelling, gum infections, food lodgement, and damage to the tooth in front.',
    trust: ['Impaction diagnosis', 'CBCT when needed', 'Sterile surgical care', 'Recovery follow-up'],
    what: ['Wisdom tooth removal extracts a problematic third molar from the jaw or gum.', 'The dentist evaluates position, roots, nerve proximity, and infection before removal.', 'It is performed for pain, swelling, decay, repeated infection, or orthodontic concerns.', 'Candidates have symptomatic or risky wisdom teeth confirmed on examination and imaging.'],
    causes: [['Lack of space', 'The jaw may not have enough room for third molars.'], ['Angled eruption', 'Wisdom teeth can tilt into the second molar.'], ['Partial eruption', 'A gum flap traps food and bacteria around the tooth.'], ['Deep decay', 'Hard-to-clean wisdom teeth decay quickly.']],
    symptoms: [['Jaw pain', 'Pain near the back of the mouth can radiate to the ear.'], ['Swelling', 'Inflamed gum or cheek swelling suggests infection.'], ['Difficulty chewing', 'Tenderness makes back-tooth chewing uncomfortable.'], ['Bad taste', 'Food trapping around a gum flap can cause odor and discharge.']],
    risks: [['Infection spread', 'Untreated pericoronitis can worsen into facial swelling.'], ['Second molar damage', 'Impacted wisdom teeth can decay or resorb the tooth ahead.'], ['Cyst formation', 'Long-standing impacted teeth can rarely develop cystic changes.'], ['Emergency surgery', 'Ignoring warning signs can lead to urgent painful treatment.']],
    benefits: [['Pain relief', 'Removing the source reduces repeated back-jaw pain.'], ['Prevents recurrent infection', 'Eliminates food-trapping gum pockets around impacted teeth.'], ['Protects second molars', 'Early action can prevent damage to important chewing teeth.'], ['Improves cleaning', 'The back of the mouth becomes easier to maintain.'], ['Planned recovery', 'Elective timing is easier than emergency removal.'], ['Clear instructions', 'Aftercare reduces dry socket and healing complications.']],
    process: ['Consultation records pain, swelling, mouth opening, and past episodes.', 'X-rays or CBCT assess tooth angle, roots, bone, and nerve position.', 'Treatment plan explains simple versus surgical extraction and recovery time.', 'Removal is performed under local anesthesia with careful tissue handling.', 'Healing instructions cover bleeding control, diet, and cleaning. ', 'Follow-up checks socket healing and suture removal if needed.'],
    aftercare: [['First 24 hours', 'Bite on gauze, avoid spitting, and rest.'], ['Day 2-3', 'Soft diet and gentle rinsing as advised.'], ['Week 1', 'Swelling and tenderness should steadily reduce.'], ['Review', 'Return for suture check or if severe pain develops.']],
    foodsEat: ['Cold curd', 'Soft rice', 'Smooth soups', 'Mashed potatoes', 'Tender paneer'],
    foodsAvoid: ['Straws', 'Smoking', 'Spitting forcefully', 'Crunchy chips', 'Hot spicy food initially'],
    faqs: ['When should a wisdom tooth be removed?', 'Is wisdom tooth removal painful?', 'What is an impacted wisdom tooth?', 'How long does swelling last?', 'Can I go to work after extraction?', 'What is dry socket?', 'Do all wisdom teeth need removal?', 'Is CBCT needed before wisdom tooth surgery?', 'What can I eat after removal?', 'Can wisdom teeth damage other teeth?'],
    price: 'Packages depend on simple extraction, surgical extraction, impaction angle, imaging, and follow-up needs.'
  },
  {
    slug: 'gum-treatment',
    alias: 'gum-treatment.html',
    title: 'Gum Treatment',
    metaTitle: 'Gum Treatment in Visakhapatnam | Bleeding Gums and Periodontal Care',
    metaDescription: 'Gum treatment in Visakhapatnam for bleeding gums, bad breath, tartar, receding gums, loose teeth, deep cleaning, and periodontal care.',
    image: '/assets/images/treatments/general-dentistry.jpg',
    before: '/assets/images/root_canal_before.png',
    after: '/assets/images/root_canal_after.png',
    headline: 'Stop bleeding gums early and protect the foundation of your teeth.',
    intro: 'Gum treatment manages gingivitis and periodontal disease by removing plaque and tartar, reducing inflammation, and controlling infection around tooth-supporting tissues. Healthy gums are essential for keeping teeth stable long term.',
    trust: ['Scaling and root planing', 'Periodontal screening', 'Bad breath management', 'Maintenance recalls'],
    what: ['Gum treatment ranges from scaling to deep cleaning and advanced periodontal care.', 'The dentist measures gum pockets, removes tartar, and guides home cleaning.', 'It is performed for bleeding gums, gum swelling, bad breath, recession, and loose teeth.', 'Candidates include patients with tartar, bleeding, diabetes risk, smoking history, or gum pocketing.'],
    causes: [['Plaque and tartar', 'Bacterial deposits irritate gums and harden below the gumline.'], ['Poor interdental cleaning', 'Missed areas between teeth inflame first.'], ['Smoking', 'Tobacco reduces gum healing response and masks bleeding.'], ['Diabetes', 'Blood sugar changes increase gum infection risk.']],
    symptoms: [['Bleeding gums', 'Bleeding while brushing is a common early sign.'], ['Receding gums', 'Teeth may appear longer as gum support shrinks.'], ['Bad breath', 'Bacterial pockets can create persistent odor.'], ['Loose teeth', 'Advanced disease weakens bone support.']],
    risks: [['Tooth mobility', 'Bone loss reduces tooth stability.'], ['Tooth loss', 'Untreated periodontal disease is a major cause of adult tooth loss.'], ['Abscesses', 'Deep pockets can develop painful gum infections.'], ['Implant risk', 'Poor gum health can affect future implant success.']],
    benefits: [['Reduces bleeding', 'Cleaning and inflammation control help gums recover.'], ['Fresher breath', 'Removing bacterial deposits improves odor.'], ['Protects bone support', 'Periodontal maintenance slows destructive disease.'], ['Improves smile health', 'Healthy gums frame teeth better.'], ['Supports other treatments', 'Crowns, braces, and implants need stable gums.'], ['Personal home-care plan', 'Cleaning tools are matched to pocketing and spacing.']],
    process: ['Consultation checks bleeding, recession, mobility, and medical risk factors.', 'Diagnosis includes gum pocket measurements and X-rays when needed.', 'Treatment plan decides routine scaling, deep cleaning, or referral-level care.', 'Plaque and tartar are removed above and below the gumline as indicated.', 'Healing is monitored and home-care technique is corrected.', 'Maintenance recall interval is set to prevent relapse.'],
    aftercare: [['First days', 'Mild tenderness or bleeding after deep cleaning can settle.'], ['Daily', 'Use interdental brushes or floss as demonstrated.'], ['Risk control', 'Smoking and blood sugar control strongly affect gum healing.'], ['Maintenance', 'Return on schedule to prevent tartar re-accumulation.']],
    foodsEat: ['Soft balanced meals', 'Vitamin C foods', 'Curd', 'Leafy vegetables', 'Water'],
    foodsAvoid: ['Smoking', 'Sugary snacking', 'Very hard foods during tenderness', 'Skipping brushing near gums', 'Alcohol mouthwash overuse'],
    faqs: ['Why do my gums bleed while brushing?', 'Is gum treatment painful?', 'Can loose teeth become firm again?', 'What is deep cleaning?', 'How often should scaling be done?', 'Can gum disease cause bad breath?', 'Do receding gums grow back?', 'Is gum disease linked with diabetes?', 'What happens if gum disease is untreated?', 'How can I maintain gums after treatment?'],
    price: 'Packages include periodontal screening, scaling, deep cleaning options, medication guidance, and recall maintenance.'
  }
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function cardList(items, className = 'premium-treatment-card') {
  return items.map(([title, desc], index) => `
    <article class="${className}">
      <div class="premium-icon">${index + 1}</div>
      <h3>${esc(title)}</h3>
      <p>${esc(desc)}</p>
    </article>
  `).join('');
}

function bulletChips(items) {
  return items.map(item => `<span>${esc(item)}</span>`).join('');
}

function videoCard(title, image, modifier = '') {
  return `
    <div class="premium-video-card ${modifier}">
      <img src="${image}" alt="${esc(title)} visual">
      <div class="premium-video-overlay">
        <span class="premium-play">▶</span>
        <strong>${esc(title)}</strong>
      </div>
    </div>
  `;
}

function beforeAfterCard(page, label, time, summary) {
  return `
    <article class="premium-result-card">
      <div class="ba-slider">
        <div class="ba-image ba-before" style="background-image: url('${page.before}');"></div>
        <div class="ba-image ba-after" style="background-image: url('${page.after}');"></div>
        <span class="ba-label ba-label-before">Before</span>
        <span class="ba-label ba-label-after">After</span>
        <div class="ba-handle">
          <div class="ba-handle-line"></div>
          <div class="ba-handle-button">↔</div>
        </div>
      </div>
      <div class="premium-result-copy">
        <span>${esc(time)}</span>
        <h3>${esc(label)}</h3>
        <p>${esc(summary)}</p>
      </div>
    </article>
  `;
}

function faqHtml(page) {
  return page.faqs.map((question, index) => `
    <div class="accordion-item">
      <button class="accordion-header" type="button">
        <h4>${esc(question)}</h4>
        <div class="accordion-icon">▼</div>
      </button>
      <div class="accordion-content">
        <div class="accordion-content-inner">
          ${esc(answerFor(page.title, question, index))}
        </div>
      </div>
    </div>
  `).join('');
}

function answerFor(title, question, index) {
  const answers = [
    `${title} is recommended only after a clinical examination because symptoms, X-rays, bite forces, and gum health change the best plan for each patient.`,
    `Most patients are comfortable when the procedure is planned properly and local anesthesia or sensitivity-control steps are used where required.`,
    `The timeline depends on severity, healing response, appointment discipline, and whether supporting procedures are needed before the final result.`,
    `Delaying care can allow the underlying problem to become larger, more painful, and more expensive to correct later.`,
    `The dentist will explain alternatives, expected maintenance, and realistic outcomes before you decide on treatment.`,
    `Cost is confirmed after diagnosis because material choice, complexity, imaging, and follow-up needs differ from case to case.`,
    `Good home care after treatment is essential. Brushing technique, cleaning between teeth, and review visits protect the result.`,
    `Existing medical conditions or medicines should be shared during consultation so the plan can be adjusted safely.`,
    `Results are planned to look natural and function well, not simply to create an over-treated appearance.`,
    `A review visit is advised if pain, swelling, high bite, looseness, or unusual sensitivity continues after treatment.`
  ];
  return answers[index % answers.length].replace(title, `${title} at Manohar Dental Clinic`);
}

function renderPremiumTreatmentPage(page, headerTemplate, footerTemplate, depthPrefix = '../../') {
  const appointmentOptions = treatmentPages.map(t => `<option${t.title === page.title ? ' selected' : ''}>${esc(t.title)}</option>`).join('');
  const processLabels = ['Consultation', 'Diagnosis', 'Treatment Planning', 'Procedure', 'Recovery', 'Follow-Up'];

  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.metaTitle)}</title>
  <meta name="description" content="${esc(page.metaDescription)}">
  <link rel="canonical" href="https://manohardentalvisakhapatnam.com/treatments/${page.slug}/">
  <link rel="icon" href="${depthPrefix}favicon.ico" sizes="32x32">
  <link rel="icon" href="${depthPrefix}assets/images/branding/favicon-192x192.png" sizes="192x192">
  <link rel="apple-touch-icon" href="${depthPrefix}assets/images/branding/apple-touch-icon.png">
  <link rel="stylesheet" href="${depthPrefix}assets/css/main.css">
  <link rel="stylesheet" href="${depthPrefix}assets/css/pages.css">
</head>
<body class="premium-treatment-page">
  <div class="scroll-progress"></div>
  ${headerTemplate}

  <main>
    <section class="premium-treatment-hero">
      <div class="container premium-treatment-hero-grid">
        <div class="premium-treatment-hero-copy">
          <div class="premium-kicker">Premium treatment guide</div>
          <h1>${esc(page.title)} in Visakhapatnam</h1>
          <h2>${esc(page.headline)}</h2>
          <p>${esc(page.intro)}</p>
          <div class="premium-trust-row">${bulletChips(page.trust)}</div>
          <div class="premium-hero-actions">
            <a class="btn btn-primary" href="${clinic.phoneHref}">Call Now</a>
            <a class="btn btn-outline" href="#book-appointment">Book Appointment</a>
          </div>
        </div>
        <div class="premium-hero-media">
          ${videoCard(`${page.title} explained by doctor`, page.image, 'premium-hero-video')}
        </div>
      </div>
    </section>

    <section class="premium-section premium-what-section reveal">
      <div class="container premium-two-col">
        <div>
          <div class="premium-kicker">What is this treatment?</div>
          <h2>Clear answers before you sit in the dental chair.</h2>
          <div class="premium-explainer-grid">
            ${[['What it is', page.what[0]], ['How it works', page.what[1]], ['Why it is performed', page.what[2]], ['Who needs it', page.what[3]]].map(([label, text]) => `
              <article class="premium-mini-panel">
                <span>${esc(label)}</span>
                <p>${esc(text)}</p>
              </article>
            `).join('')}
          </div>
        </div>
        ${videoCard(`Doctor explanation: ${page.title}`, page.image)}
      </div>
    </section>

    <section class="premium-section reveal">
      <div class="container">
        <div class="premium-section-heading">
          <div class="premium-kicker">Causes and risk factors</div>
          <h2>Why this problem usually starts.</h2>
        </div>
        <div class="premium-card-grid">${cardList(page.causes)}</div>
      </div>
    </section>

    <section class="premium-section premium-soft-band reveal">
      <div class="container">
        <div class="premium-section-heading">
          <div class="premium-kicker">Symptoms and warning signs</div>
          <h2>Signals patients should not ignore.</h2>
        </div>
        <div class="premium-card-grid">${cardList(page.symptoms, 'premium-treatment-card warning-card')}</div>
      </div>
    </section>

    <section class="premium-section reveal">
      <div class="container">
        <div class="premium-section-heading">
          <div class="premium-kicker">Why treatment is important</div>
          <h2>What can happen when care is delayed.</h2>
        </div>
        <div class="premium-risk-grid">${cardList(page.risks, 'premium-risk-card')}</div>
      </div>
    </section>

    <section class="premium-section premium-benefits-section reveal">
      <div class="container">
        <div class="premium-section-heading">
          <div class="premium-kicker">Benefits</div>
          <h2>Designed to protect health, comfort, and confidence.</h2>
        </div>
        <div class="premium-benefit-grid">${cardList(page.benefits, 'premium-benefit-card')}</div>
      </div>
    </section>

    <section class="premium-section premium-soft-band reveal">
      <div class="container">
        <div class="premium-section-heading">
          <div class="premium-kicker">Treatment process</div>
          <h2>A guided journey from diagnosis to follow-up.</h2>
        </div>
        <div class="premium-process-timeline">
          ${processLabels.map((label, index) => `
            <article class="premium-process-step">
              <span>Step ${index + 1}</span>
              <h3>${esc(label)}</h3>
              <p>${esc(page.process[index])}</p>
              ${videoCard(`${label} preview`, page.image, 'premium-step-video')}
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="premium-section reveal">
      <div class="container">
        <div class="premium-section-heading">
          <div class="premium-kicker">Before and after results</div>
          <h2>Swipe the comparison to understand expected change.</h2>
        </div>
        <div class="premium-results-grid">
          ${beforeAfterCard(page, `${page.title} case 01`, 'Planned timeline', `A focused ${page.title.toLowerCase()} plan improved comfort, appearance, and daily function.`)}
          ${beforeAfterCard(page, `${page.title} case 02`, 'Review-based progress', `Treatment was customized after diagnosis so the result stayed natural and maintainable.`)}
        </div>
      </div>
    </section>

    <section class="premium-section premium-why-clinic reveal">
      <div class="container premium-two-col">
        <div class="premium-clinic-collage">
          <img src="${depthPrefix}assets/images/facility-section-clinic.png" alt="Manohar Dental Clinic facility">
          <img src="${depthPrefix}assets/images/doctors/srinivas-manohar.png" alt="Dr Srinivas Manohar">
          <img src="${depthPrefix}assets/images/clinic/chair.jpg" alt="Advanced dental chair">
        </div>
        <div>
          <div class="premium-kicker">Why choose Manohar Dental</div>
          <h2>Specialist dentistry with a calm, transparent patient experience.</h2>
          <div class="premium-check-grid">${commonWhy.map(([title, desc]) => `<div><strong>${esc(title)}</strong><span>${esc(desc)}</span></div>`).join('')}</div>
        </div>
      </div>
    </section>

    <section class="premium-section reveal">
      <div class="container">
        <div class="premium-section-heading">
          <div class="premium-kicker">Technology used</div>
          <h2>Modern diagnostics for better decisions.</h2>
        </div>
        <div class="premium-tech-grid">
          ${technologies.map(([title, desc]) => `
            <article class="premium-tech-card">
              <div class="premium-tech-media">${videoCard(title, page.image, 'premium-tech-video')}</div>
              <h3>${esc(title)}</h3>
              <p>${esc(desc)}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="premium-section premium-soft-band reveal">
      <div class="container premium-aftercare-grid">
        <div>
          <div class="premium-kicker">Recovery and aftercare</div>
          <h2>Healing is easier when patients know what to expect.</h2>
          <div class="premium-recovery-timeline">
            ${page.aftercare.map(([label, desc]) => `<div><strong>${esc(label)}</strong><p>${esc(desc)}</p></div>`).join('')}
          </div>
        </div>
        <div class="premium-food-grid">
          <article>
            <h3>Foods to eat</h3>
            <div class="premium-chip-list">${bulletChips(page.foodsEat)}</div>
          </article>
          <article>
            <h3>Foods to avoid</h3>
            <div class="premium-chip-list">${bulletChips(page.foodsAvoid)}</div>
          </article>
          <article>
            <h3>Follow-up recommendation</h3>
            <p>Book the review visit advised by the doctor so healing, bite comfort, and hygiene can be checked at the right time.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="premium-section reveal">
      <div class="container premium-faq-wrap">
        <div class="premium-section-heading">
          <div class="premium-kicker">FAQs</div>
          <h2>Questions patients ask before ${esc(page.title.toLowerCase())}.</h2>
        </div>
        <div class="accordion premium-faq-accordion">${faqHtml(page)}</div>
      </div>
    </section>

    <section class="premium-section premium-testimonial-band reveal">
      <div class="container">
        <div class="premium-section-heading">
          <div class="premium-kicker">Patient testimonials</div>
          <h2>Video-first stories from patients who chose careful dental care.</h2>
        </div>
        <div class="premium-reel-grid">
          ${[
            ['Dental implant story', '/assets/images/Implant Story-test1-thumb1.png'],
            ['Pain-free care review', '/assets/images/Pain-Free Care-test2-thumb2.png'],
            ['Family dental review', '/assets/images/familyreview_test4-thum4.png']
          ].map(([title, img]) => `
            <article class="premium-reel-card">
              <img src="${depthPrefix}${img.replace(/^\//, '')}" alt="${esc(title)}">
              <span class="premium-play">▶</span>
              <div><strong>${esc(title)}</strong><p>"The team explained every step and made the visit feel comfortable."</p></div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <section class="premium-section reveal">
      <div class="container">
        <div class="premium-pricing-panel">
          <div>
            <div class="premium-kicker">Pricing and packages</div>
            <h2>Transparent treatment planning after diagnosis.</h2>
            <p>${esc(page.price)}</p>
          </div>
          <div class="premium-package-grid">
            <div><strong>Included</strong><span>Doctor consultation, diagnosis, treatment plan, and estimate explanation.</span></div>
            <div><strong>Follow-ups</strong><span>Review visits are recommended according to the treatment and healing stage.</span></div>
            <div><strong>Warranty</strong><span>Warranty or maintenance guidance is explained where applicable to the chosen material.</span></div>
          </div>
        </div>
      </div>
    </section>

    <section id="book-appointment" class="premium-section premium-booking-section reveal">
      <div class="container premium-booking-grid">
        <div>
          <div class="premium-kicker">Appointment booking</div>
          <h2>Book a ${esc(page.title)} consultation.</h2>
          <p>Share your details and the clinic team will call you to confirm the right consultation slot.</p>
          <div class="premium-how-it-works">
            ${['Submit Form', 'Doctor Calls', 'Consultation', 'Treatment Begins'].map((step, index) => `<div><span>${index + 1}</span><strong>${esc(step)}</strong></div>`).join('')}
          </div>
          <div class="premium-clinic-hours">
            <strong>Clinic timings</strong>
            <span>${esc(clinic.timings)}</span>
            <span>${esc(clinic.address)}</span>
          </div>
        </div>
        <form class="premium-appointment-form consult-form">
          <label>Your Name<input type="text" name="name" placeholder="Enter your full name" required></label>
          <label>Phone Number<input type="tel" name="phone" placeholder="Enter 10-digit mobile number" required></label>
          <label>Preferred Date<input type="date" name="date" required></label>
          <label>Treatment Selection<select name="service">${appointmentOptions}</select></label>
          <label class="premium-form-wide">Message<textarea name="message" rows="4" placeholder="Tell us what you are experiencing"></textarea></label>
          <button class="btn btn-primary premium-form-wide" type="submit">Request Appointment</button>
          <a class="premium-whatsapp-link premium-form-wide" href="${clinic.whatsapp}" target="_blank" rel="noopener">Prefer WhatsApp? Message the clinic</a>
        </form>
      </div>
    </section>
  </main>

  ${footerTemplate}
  <script src="${depthPrefix}assets/js/main.js"></script>
  <script src="${depthPrefix}assets/js/navigation.js"></script>
  <script src="${depthPrefix}assets/js/animations.js"></script>
  <script src="${depthPrefix}assets/js/carousel.js"></script>
  <script src="${depthPrefix}assets/js/forms.js"></script>
  <script src="${depthPrefix}assets/js/utilities.js"></script>
</body>
</html>`;
}

function buildPremiumTreatmentPages({ rootDir, headerTemplate, footerTemplate, ensureDir, rewritePaths }) {
  treatmentPages.forEach(page => {
    const html = rewritePaths(renderPremiumTreatmentPage(page, headerTemplate, footerTemplate, '../../'), 2);
    const aliasHtml = rewritePaths(renderPremiumTreatmentPage(page, headerTemplate, footerTemplate, '../'), 1);
    const dir = path.join(rootDir, 'treatments', page.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    fs.writeFileSync(path.join(rootDir, 'treatments', page.alias), aliasHtml);

    if (page.legacySlug) {
      const legacyDir = path.join(rootDir, 'treatments', page.legacySlug);
      ensureDir(legacyDir);
      fs.writeFileSync(path.join(legacyDir, 'index.html'), html);
    }

    console.log(`Generated premium treatment page: /treatments/${page.slug}/index.html and /treatments/${page.alias}`);
  });
}

module.exports = {
  buildPremiumTreatmentPages,
  treatmentPages
};
