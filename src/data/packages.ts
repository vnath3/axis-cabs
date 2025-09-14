export interface PackageMeta {
  durationDays: number;
  bestSeasons: string[];
  fromCities: string[];
}

export interface PackageHighlight {
  title: string;
  detail: string;
}

export interface ItineraryActivity {
  time_hint: string;
  name: string;
  why: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  distance_km: number;
  travel_time_hours: number;
  activities: ItineraryActivity[];
  food?: string[];
  safety?: string[];
}

export interface PricingBand {
  pax: string;
  vehicle: string;
  from: number;
  to: number;
}

export interface PackagePricing {
  updated: string; // YYYY-MM-DD
  assumptions: string[];
  bands: PricingBand[];
  disclaimers: string[];
}

export interface PackageFaq {
  id: string | number;
  q: string;
  a: string;
}

export interface PackageReview {
  name: string;
  rating: number;
  text: string;
  city?: string;
  created_at?: string; // ISO date
}

export interface PackageContact {
  whatsapp: string;
  phone: string;
}

export interface PackageEntry {
  id: string;
  slug: string;
  region: string;
  title: string;
  subtitle: string;
  summary: string;
  narrative?: string;
  narrativeHtml?: string;
  hero: string;
  gallery: { src: string; alt: string }[];
  tripStyle: string[];
  meta: PackageMeta;
  highlights: PackageHighlight[];
  itinerary: ItineraryDay[];
  pricing?: PackagePricing;
  faqs: PackageFaq[];
  reviews: PackageReview[];
  contact: PackageContact;
  allowDynamicPricing?: boolean;
  reviewsEnabled?: boolean;
}

export const packages: PackageEntry[] = [
  {
    id: 'ajanta-ellora',
    slug: 'ajanta-ellora-2-day-itinerary',
    region: 'Maharashtra',
    title: 'Ajanta & Ellora 2\u2011Day Itinerary',
    subtitle: 'Caves, Fort & Local Food',
    summary: 'Private cab \u2022 Handpicked stops \u2022 Flexible timing',
    narrativeHtml: `
<h1>Ajanta & Ellora Caves – A Timeless Journey into India’s Ancient Rock-Cut Marvels</h1>

<h2>Why Visit Ajanta & Ellora?</h2>
<p>Hidden in the rugged landscapes of Maharashtra, the Ajanta and Ellora Caves are UNESCO World Heritage Sites that rank among <strong>India’s greatest cultural treasures</strong>. Together, they tell the story of over <strong>2,000 years of Indian art, faith, and craftsmanship</strong>, carved painstakingly into solid rock. For international travelers seeking <strong>authentic history beyond the Taj Mahal</strong>, this is a must-visit destination.</p>

<hr />

<h2>The Ajanta Caves – A Buddhist Masterpiece</h2>
<ul>
  <li><strong>Era</strong>: 2nd century BCE to 6th century CE</li>
  <li><strong>Highlights</strong>: 30 rock-cut caves with <strong>exquisite murals and sculptures</strong> depicting the life of the Buddha, Jataka tales, and intricate carvings.</li>
  <li><strong>Famous for</strong>: The <strong>Ajanta Paintings</strong>, among the <strong>oldest surviving murals in the world</strong>, offering a glimpse into ancient Indian lifestyle, fashion, and philosophy.</li>
  <li><strong>Best Experience</strong>: Step into Cave 1 and witness the stunning frescoes of the Bodhisattva Padmapani, painted with natural dyes that still glow after centuries.</li>
  </ul>

<hr />

<h2>The Ellora Caves – Faith in Stone</h2>
<ul>
  <li><strong>Era</strong>: 6th century to 10th century CE</li>
  <li><strong>Highlights</strong>: 34 caves representing <strong>three major religions – Hinduism, Buddhism, and Jainism</strong> living side by side.</li>
  <li><strong>Crown Jewel</strong>: The <strong>Kailasa Temple (Cave 16)</strong>, the world’s largest monolithic rock excavation. Carved from a single stone, it is twice the size of the Parthenon in Athens.</li>
  <li><strong>Unique Insight</strong>: Ellora symbolizes India’s tradition of <strong>religious tolerance and cultural fusion</strong>, making it deeply relevant for global travelers today.</li>
  </ul>

<hr />

<h2>Quick Facts for Travelers</h2>
<ul>
  <li>📍 <strong>Location</strong>: Aurangabad district, Maharashtra, India</li>
  <li>✈️ <strong>Nearest Airport</strong>: Aurangabad (IXU), ~30 km from Ellora and ~100 km from Ajanta</li>
  <li>🚆 <strong>Nearest Railway</strong>: Aurangabad Railway Station</li>
  <li>🚌 <strong>Connectivity</strong>: Regular buses and taxis from Aurangabad city</li>
  <li>⏱ <strong>Ideal Duration</strong>: 2–3 days (Ajanta one full day + Ellora one full day + Daulatabad Fort / Bibi Ka Maqbara as add-ons)</li>
  <li>🌤 <strong>Best Season to Visit</strong>: November to March (pleasant weather)</li>
  </ul>

<hr />

<h2>Tips for International Tourists</h2>
<ul>
  <li>✅ <strong>Hire a local guide</strong> – The stories behind the carvings bring the stones to life.</li>
  <li>✅ <strong>Carry cash &amp; water</strong> – Limited ATMs and facilities near the caves.</li>
  <li>✅ <strong>Respect the heritage</strong> – Photography without flash is allowed, but avoid touching the paintings.</li>
  <li>✅ <strong>Combine Your Trip</strong> – Ajanta &amp; Ellora can be combined with <strong>Aurangabad city tour, Shirdi pilgrimage, or even Mumbai</strong>.</li>
  </ul>

<hr />

<h2>Hidden Gems Nearby</h2>
<ul>
  <li>🏰 <strong>Daulatabad Fort</strong> – A 14th-century fort with ingenious defense systems, just 15 km from Ellora.</li>
  <li>🌸 <strong>Grishneshwar Temple</strong> – One of the 12 sacred Jyotirlingas of Lord Shiva, located near Ellora.</li>
  <li>🌆 <strong>Bibi Ka Maqbara</strong> – Often called the &quot;Mini Taj Mahal&quot;, built by Aurangzeb’s son, symbolizing Mughal elegance.</li>
  <li>🌳 <strong>Lonar Crater Lake</strong> – A rare meteorite crater lake, 3 hours from Ajanta, perfect for nature lovers.</li>
  </ul>

<hr />

<h2>Why This Should Be on Your Bucket List</h2>
<p>The Ajanta &amp; Ellora Caves are not just monuments – they are <strong>living classrooms of world history, art, and culture</strong>. For travelers who want more than photographs, they offer a journey into <strong>India’s soul</strong>, where every carved pillar and painted wall whispers stories of devotion, creativity, and timeless human spirit.</p>
<p><strong>👉 Book your Ajanta &amp; Ellora tour today</strong> and witness the magic where <strong>history meets eternity</strong>.</p>
`,
    hero: '/images/destinations/ellora.jpg',
    gallery: [
      // Ajanta & Ellora set (expanded)
      { src: '/images/destinations/ajanta_ellora/ajanta1.jpg', alt: 'Ajanta Caves – facade view' },
      { src: '/images/destinations/ajanta_ellora/ajanta_2.jpg', alt: 'Ajanta Caves – rock-cut chambers' },
      { src: '/images/destinations/ajanta_ellora/ajanta_caves.jpg', alt: 'Ajanta Caves – cliffside panorama' },
      { src: '/images/destinations/ajanta_ellora/ajanta_ellora1.jpg', alt: 'Ellora Caves – architectural details' },
      { src: '/images/destinations/ajanta_ellora/ajanta_fall.jpg', alt: 'Ajanta – monsoon waterfall near caves' },
      { src: '/images/destinations/ajanta_ellora/ajanta_inner_view1.jpg', alt: 'Ajanta – inner hall with pillars' },
      { src: '/images/destinations/ajanta_ellora/ajanta_inner_view2.jpg', alt: 'Ajanta – interior carvings and fresco hints' },
      { src: '/images/destinations/ajanta_ellora/ajanta_temple.jpg', alt: 'Ellora – Kailasa Temple exterior' },
      { src: '/images/destinations/ajanta_ellora/ajanta_view.jpg', alt: 'Ajanta – scenic viewpoint across the bend' },
      // Keep a couple of general destination images
      { src: '/images/destinations/ellora.jpg', alt: 'Ellora temple broad view' },
      { src: '/images/destinations/daulatabad_fort.jpg', alt: 'Daulatabad Fort ramparts' }
    ],
    tripStyle: ['Culture', 'Heritage'],
    meta: {
      durationDays: 2,
      bestSeasons: ['Oct', 'Mar'],
      fromCities: ['Pune', 'Mumbai']
    },
    highlights: [
      { title: 'Ajanta murals', detail: 'Centuries-old Buddhist murals adorn the silent halls.' },
      { title: 'Kailasa temple', detail: 'Monolithic masterpiece at Ellora.' },
      { title: 'Daulatabad Fort', detail: 'Climb for sweeping Deccan views.' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pune to Ellora',
        distance_km: 260,
        travel_time_hours: 6,
        activities: [
          { time_hint: '06:00', name: 'Depart Pune', why: 'Beat city traffic' },
          { time_hint: '11:00', name: 'Ellora Caves', why: 'Explore cave temples' },
          { time_hint: '15:00', name: 'Daulatabad Fort', why: 'Optional climb' }
        ],
        food: ['Local thali'],
        safety: ['Carry water']
      },
      {
        day: 2,
        title: 'Ajanta & Return',
        distance_km: 300,
        travel_time_hours: 7,
        activities: [
          { time_hint: '08:00', name: 'Ajanta Caves', why: 'See ancient murals' },
          { time_hint: '15:00', name: 'Return to Pune', why: 'Evening drop' }
        ]
      }
    ],
    pricing: {
      updated: '2024-01-01',
      assumptions: ['AC cab', 'fuel'],
      bands: [
        { pax: '1-4', vehicle: 'Sedan', from: 8500, to: 9500 },
        { pax: '1-6', vehicle: 'SUV', from: 9500, to: 12000 }
      ],
      disclaimers: ['Excludes meals and entry tickets']
    },
    faqs: [
      { id: 1, q: 'Where are Ajanta and Ellora Caves located?', a: 'Ajanta and Ellora Caves are in Aurangabad district, Maharashtra. Ajanta is about 100 km from Aurangabad city, while Ellora is ~30 km away.' },
      { id: 2, q: 'What is special about Ajanta Caves?', a: 'The Ajanta Caves are famous for their ancient Buddhist murals and frescoes (2nd century BCE onwards). They depict Jataka tales and the life of Buddha — among the finest collections of ancient Indian art.' },
      { id: 3, q: 'Why is Ellora Cave 16 (Kailasa Temple) world-famous?', a: 'Kailasa Temple (Cave 16) at Ellora is the largest monolithic rock‑cut temple in the world, carved from a single stone. It represents Mount Kailash, the abode of Lord Shiva; it is roughly twice the size of the Parthenon in Athens.' },
      { id: 4, q: 'How far is Ajanta from Ellora?', a: 'About 100 km (62 miles). Most travelers plan 2 days — one full day at Ajanta and another at Ellora.' },
      { id: 5, q: 'What is the best time to visit Ajanta and Ellora?', a: 'November to March (cool and pleasant). Summers are hot; monsoon (Jun–Sep) is lush but can be slippery.' },
      { id: 6, q: 'How can international tourists reach Ajanta and Ellora?', a: 'Fly to Aurangabad Airport (IXU), well connected with Mumbai and Delhi. From Aurangabad, taxis and buses go to both sites.' },
      { id: 7, q: 'Are Ajanta and Ellora UNESCO World Heritage Sites?', a: 'Yes. Both Ajanta and Ellora are UNESCO World Heritage Sites, celebrated globally for art, architecture, and cultural significance.' },
      { id: 8, q: 'What is Daulatabad Fort famous for?', a: 'Daulatabad Fort (≈15 km from Ellora) is one of India’s most powerful hill forts. Its defense systems — curved entryways, secret passages, and a bat cave — made it very hard to conquer.' },
      { id: 9, q: 'How much time is required to explore Daulatabad Fort?', a: 'Plan 2–3 hours. Don’t miss the climb to the top for panoramic Aurangabad views.' },
      { id: 10, q: 'Can Ajanta, Ellora, and Daulatabad be covered in one trip?', a: 'Yes. A 2–3 day itinerary is ideal — Day 1: Ajanta; Day 2: Ellora + Daulatabad; add Aurangabad city sights if time permits.' },
      { id: 11, q: 'Are guides available at Ajanta and Ellora?', a: 'Yes. Certified guides are available at both sites. A guide enriches the visit by explaining hidden meanings and stories behind the carvings and paintings.' },
      { id: 12, q: 'What are the entry fees for Ajanta and Ellora?', a: '<ul><li><strong>Ajanta Caves</strong>: ≈ ₹600 (international)</li><li><strong>Ellora Caves</strong>: ≈ ₹600 (international)</li><li><strong>Daulatabad Fort</strong>: ≈ ₹300 (international)</li></ul><p class="text-xs">Fees change — check ASI website.</p>' },
      { id: 13, q: 'Are Ajanta and Ellora open every day?', a: '<ul><li><strong>Ajanta Caves</strong>: Closed Mondays</li><li><strong>Ellora Caves</strong>: Closed Tuesdays</li><li><strong>Daulatabad Fort</strong>: Open daily</li></ul>' },
      { id: 14, q: 'Is photography allowed inside the caves?', a: 'Yes, without flash. Flash damages ancient paintings — please respect preservation rules.' },
      { id: 15, q: 'What are some hidden gems near Ajanta and Ellora?', a: '<ul><li><strong>Grishneshwar Temple</strong> — one of 12 Jyotirlingas (near Ellora)</li><li><strong>Bibi Ka Maqbara</strong> — “Mini Taj Mahal” in Aurangabad</li><li><strong>Lonar Crater Lake</strong> — rare meteorite lake (~3 hours from Ajanta)</li></ul>' },
    ],
    reviews: [
      { name: 'Anita P.', rating: 5, text: 'Driver was knowledgeable and patient.', city: 'Pune', created_at: '2024-01-12' },
      { name: 'Rahul M.', rating: 4, text: 'Comfortable ride and good food stops.', city: 'Mumbai', created_at: '2024-02-05' },
      { name: 'Elena S.', rating: 5, text: 'Ajanta murals were breathtaking. Our driver managed timings perfectly to avoid crowds.', city: 'Madrid', created_at: '2024-03-18' },
      { name: 'Vikram K.', rating: 5, text: 'Seamless 2-day plan — Ellora and Daulatabad in one go. Highly recommend Axis.', city: 'Bengaluru', created_at: '2024-04-22' },
      { name: 'Samantha L.', rating: 5, text: 'Clean car, clear pricing, and great historical context from the driver.', city: 'London', created_at: '2024-05-09' }
    ],
    contact: {
      whatsapp: '+919922333305',
      phone: '+919922333305'
    },
    allowDynamicPricing: true,
    reviewsEnabled: true
  }
];
