const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Treatment mapping from old path to new slug
const TREATMENT_MAPPING = {
  'dental-implants-in-visakhapatnam': 'dental-implants',
  'root-canal-treatment-in-visakhapatnam': 'root-canal-treatment',
  'clear-aligners-treatment-in-visakhapatnam': 'clear-aligners',
  'braces-treatment-in-visakhapatnam': 'braces',
  'smile-makeover-treatment-in-visakhapatnam': 'smile-makeover',
  'teeth-whitening-treatment-in-visakhapatnam': 'teeth-whitening',
  'wisdom-teeth-removal-in-visakhapatnam': 'wisdom-tooth-removal',
  'gum-treatment-in-visakhapatnam': 'gum-treatment',
  'denture-treatment-in-visakhapatnam': 'dentures',
  'pediatric-dentists-in-visakhapatnam': 'pediatric-dentistry',
};

// Doctor mapping
const DOCTOR_MAPPING = {
  'doctor-srinivas-manohar': 'doctor-srinivas-manohar',
  'doctor-sirisha': 'doctor-sirisha',
  'doctor-usha-sri': 'doctor-usha-sri',
};

function extractTreatments() {
  const treatments = [];
  
  Object.entries(TREATMENT_MAPPING).forEach(([oldDir, newSlug]) => {
    const filePath = path.join(ROOT_DIR, oldDir, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return;
    }
    
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const metaTitle = titleMatch ? titleMatch[1].trim() : '';
    
    // Extract description
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || 
                      html.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
    const metaDesc = descMatch ? descMatch[1].trim() : '';
    
    // Extract H1 title (page header)
    const h1Match = html.match(/<h1>([^<]+)<\/h1>/i);
    const pageTitle = h1Match ? h1Match[1].trim() : oldDir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Extract intro paragraph (overview)
    // Find the first paragraph in the first section
    let overview = '';
    const overviewMatch = html.match(/<section[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    if (overviewMatch) {
      overview = overviewMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    }

    // Map images
    let image = `/assets/images/treatments/${newSlug}.jpg`;
    
    treatments.push({
      title: pageTitle,
      slug: newSlug,
      description: overview || `Advanced ${pageTitle} treatments at Manohar Dental Clinic Visakhapatnam.`,
      image: image,
      meta_title: metaTitle,
      meta_description: metaDesc,
      old_url: `/${oldDir}/`
    });
  });

  fs.writeFileSync(path.join(ROOT_DIR, 'data', 'treatments.json'), JSON.stringify(treatments, null, 2));
  console.log('Extracted treatments.json');
}

function extractDoctors() {
  const doctors = [];
  
  Object.entries(DOCTOR_MAPPING).forEach(([oldDir, slug]) => {
    const filePath = path.join(ROOT_DIR, oldDir, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return;
    }
    
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Extract meta tags
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const metaTitle = titleMatch ? titleMatch[1].trim() : '';
    
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const metaDesc = descMatch ? descMatch[1].trim() : '';
    
    const nameMatch = html.match(/<h2>([^<]+)<\/h2>/i);
    const name = nameMatch ? nameMatch[1].trim() : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const taglineMatch = html.match(/<div class="doctor-tagline">([^<]+)<\/div>/i);
    const tagline = taglineMatch ? taglineMatch[1].trim() : '';

    const bioMatch = html.match(/<p class="bio-text">([\s\S]*?)<\/p>/i);
    const bio = bioMatch ? bioMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : '';

    doctors.push({
      name: name,
      slug: slug,
      tagline: tagline,
      bio: bio,
      image: `/assets/images/doctors/${slug === 'doctor-srinivas-manohar' ? 'srinivas-manohar.png' : slug === 'doctor-sirisha' ? 'sirisha.png' : 'usha-sri.png'}`,
      meta_title: metaTitle,
      meta_description: metaDesc,
      old_url: `/${oldDir}/`
    });
  });

  fs.writeFileSync(path.join(ROOT_DIR, 'data', 'doctors.json'), JSON.stringify(doctors, null, 2));
  console.log('Extracted doctors.json');
}

function extractTestimonials() {
  // We can write a default testimonials.json since we know the reviews from the carousel
  const testimonials = [
    {
      name: "Ravi Teja",
      rating: 5,
      review: "Excellent treatment by Dr. Srinivas Manohar. I got my dental implant done here. The process was entirely painless and the doctor explains everything very clearly. The staff is also very polite and clean environment.",
      source: "Google Review",
      date: "2 weeks ago"
    },
    {
      name: "Sujatha K.",
      rating: 5,
      review: "Very professional and friendly doctor. Visited for root canal treatment for my mother. She was very scared but doctor made her comfortable. Highly recommend Manohar Dental Clinic.",
      source: "Google Review",
      date: "1 month ago"
    },
    {
      name: "N. Prasad",
      rating: 5,
      review: "Clean aligners treatment has been amazing. The results are visible within 3 months itself. Best dental clinic in Vizag for orthodontic treatments.",
      source: "Google Review",
      date: "3 months ago"
    },
    {
      name: "Sireesha Murthy",
      rating: 5,
      review: "Amazing pediatric dental service. My daughter was not scared at all. The doctor handled her very gently. The clinic is very neat and clean.",
      source: "Google Review",
      date: "2 months ago"
    }
  ];
  fs.writeFileSync(path.join(ROOT_DIR, 'data', 'testimonials.json'), JSON.stringify(testimonials, null, 2));
  console.log('Created testimonials.json');
}

function extractFAQs() {
  const faqs = [
    {
      question: "How much do dental implants cost?",
      answer: "The cost of dental implants varies depending on the number of implants, the material used, and the patient's individual jaw bone conditions. We offer premium implant options starting at affordable prices. Please book a consultation for a personalized treatment plan."
    },
    {
      question: "Is root canal treatment painful?",
      answer: "No, root canal treatment is not painful at Manohar Dental Clinic. With advanced local anesthesia and modern rotary endodontic systems, the procedure is extremely comfortable and virtually pain-free."
    },
    {
      question: "How long do dental implants last?",
      answer: "With proper care, regular dental check-ups, and good oral hygiene, dental implants can last a lifetime. They function and behave just like natural teeth."
    },
    {
      question: "How many visits are required for a smile makeover?",
      answer: "A smile makeover typically requires 2 to 3 visits over a period of 1 to 2 weeks, depending on whether you receive dental veneers, teeth whitening, or minor orthodontics."
    },
    {
      question: "Do you offer emergency dental appointments?",
      answer: "Yes, we prioritize dental emergencies such as severe toothache, broken crowns, dental trauma, or sudden swelling. Please call us directly at +91 9703294358."
    }
  ];
  fs.writeFileSync(path.join(ROOT_DIR, 'data', 'faq.json'), JSON.stringify(faqs, null, 2));
  console.log('Created faq.json');
}

extractTreatments();
extractDoctors();
extractTestimonials();
extractFAQs();
