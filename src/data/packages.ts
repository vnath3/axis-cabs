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
  },
  {
    id: 'shirdi-darshan',
    slug: 'shirdi-darshan',
    region: 'Maharashtra',
    title: 'Shirdi Darshan',
    subtitle: 'Sai Baba Samadhi Mandir & Sacred Sites',
    summary: 'Same-day trip • Priority planning • Clean cabs & pro drivers',
    narrativeHtml: `
<h1>Shirdi Darshan – A Peaceful Pilgrimage to Sai Baba</h1>
<p>Plan a comfortable one-day or overnight visit to Shirdi with Axis Cabs. We handle timings around <strong>aarti</strong>, queue strategy, and food/comfort breaks so your visit is unhurried and meaningful.</p>
<hr />
<h2>Key Temples & Spots</h2>
<ul>
  <li><strong>Samadhi Mandir</strong> – Main darshan (peak hours early morning & evenings)</li>
  <li><strong>Dwarkamai</strong> – Baba’s residence; sacred dhuni (fire)</li>
  <li><strong>Chavadi</strong> – Procession site, serene atmosphere</li>
  <li><strong>Lendi Baug</strong> – Garden where Baba meditated</li>
  <li><strong>Shani Shingnapur</strong> (optional) – 70 km from Shirdi; temple without doors</li>
  </ul>
<hr />
<h2>Good to Know</h2>
<ul>
  <li><strong>Darshan Windows</strong>: Mandir is open from early morning; Kakad Aarti is popular</li>
  <li><strong>Dress & Decorum</strong>: Modest clothing preferred; deposit bags/phones if required</li>
  <li><strong>Best Season</strong>: Oct–Mar pleasant; weekends/festivals are busy – plan buffer time</li>
</ul>
`,
    hero: '/images/destinations/ShirdiSaibaba.jpg',
    gallery: [
      { src: '/images/destinations/ShirdiSaibaba.jpg', alt: 'Shirdi – Sai Baba Samadhi Mandir' },
      { src: '/images/destinations/shirdi.jpg', alt: 'Shirdi town & temple complex' }
    ],
    tripStyle: ['Pilgrimage', 'Spiritual'],
    meta: {
      durationDays: 1,
      bestSeasons: ['Oct', 'Mar'],
      fromCities: ['Pune', 'Mumbai']
    },
    highlights: [
      { title: 'Samadhi Mandir darshan', detail: 'Seek blessings at Sai Baba’s Samadhi.' },
      { title: 'Dwarkamai & Chavadi', detail: 'Walk through spaces where Baba lived and taught.' },
      { title: 'Shani Shingnapur Temple (optional)', detail: 'Unique open-air shrine; combine if time permits.' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pune – Shirdi – Pune (or Mumbai – Shirdi – Mumbai)',
        distance_km: 450,
        travel_time_hours: 10,
        activities: [
          { time_hint: '05:30', name: 'Start from your city', why: 'Early start avoids traffic; reach before peak queues' },
          { time_hint: '10:30', name: 'Shirdi Darshan', why: 'Samadhi Mandir + Dwarkamai + Chavadi + Lendi Baug' },
          { time_hint: '14:00', name: 'Lunch break', why: 'Recommended clean eateries close to Mandir road' },
          { time_hint: '15:30', name: 'Optional: Shani Shingnapur', why: 'Add if energy/time permits (70 km detour)' },
          { time_hint: '19:00', name: 'Depart Shirdi', why: 'Return with buffer for breaks' }
        ],
        food: ['South Indian breakfast en route', 'Simple thali near Mandir'],
        safety: ['Carry water & light snacks', 'Keep footwear & valuables secure']
      }
    ],
    pricing: {
      updated: '2024-01-01',
      assumptions: ['AC cab', 'driver allowance', 'fuel & tolls'],
      bands: [
        { pax: '1-4', vehicle: 'Sedan', from: 5500, to: 7000 },
        { pax: '1-6', vehicle: 'SUV', from: 6500, to: 8500 },
        { pax: '1-12', vehicle: 'Traveller', from: 12000, to: 15000 }
      ],
      disclaimers: ['Temple entry not included', 'Actual time depends on crowd & aarti slots']
    },
    faqs: [
      { id: 1, q: 'Best time for darshan?', a: 'Early morning (Kakad Aarti window) or late evening has relatively shorter queues. Weekdays are lighter than weekends/festivals.' },
      { id: 2, q: 'Can I add Shani Shingnapur?', a: 'Yes. It’s about 70 km from Shirdi. We can add it if time/energy permits, or plan an overnight trip.' },
      { id: 3, q: 'What to wear / carry?', a: 'Modest wear preferred. Carry water, a light shawl in winter, and keep valuables minimal.' },
      { id: 4, q: 'Food & washrooms en route?', a: 'We stop at clean, known places for breakfast/lunch and restrooms. Let the driver know preferences.' },
      { id: 5, q: 'Is photography allowed?', a: 'Inside the Mandir, photography may be restricted. Follow the latest temple guidelines.' }
    ],
    reviews: [
      { name: 'Meera S.', rating: 5, text: 'Peaceful darshan and very courteous driver – perfect day trip.', city: 'Pune', created_at: '2024-03-10' },
      { name: 'Daniel R.', rating: 5, text: 'They planned around aarti timings. Smooth journey throughout.', city: 'London', created_at: '2024-04-02' },
      { name: 'Sanjay T.', rating: 4, text: 'Clean car, punctual pickup. Added Shani Shingnapur as requested.', city: 'Mumbai', created_at: '2024-05-21' },
      { name: 'Ritika G.', rating: 5, text: 'Driver guided us through queues and parking – stress-free.', city: 'Bengaluru', created_at: '2024-06-15' },
      { name: 'Arun P.', rating: 5, text: 'Great coordination and safe driving. Will book again.', city: 'Hyderabad', created_at: '2024-07-08' }
    ],
    contact: {
      whatsapp: '+919922333305',
      phone: '+919922333305'
    },
    allowDynamicPricing: true,
    reviewsEnabled: true
  },
  {
    id: 'goa-coastal',
    slug: 'goa-3n4d-beach-escape',
    region: 'Goa',
    title: 'Goa Coastal 3N/4D',
    subtitle: 'Beaches, Forts, Sunsets & Seafood',
    summary: 'Private cab • Handpicked stays • Flexible sightseeing',
    narrativeHtml: `
<h1>Goa Coastal – Sun, Sand, and Slow Days</h1>
<p>Experience Goa beyond the rush. Mix iconic beaches with quiet coves, heritage forts, and cafés you’ll want to linger at. This coastal plan balances <strong>North Goa highlights</strong> with time to unwind.</p>
<hr />
<h2>Trip Snapshot</h2>
<ul>
  <li><strong>Best for</strong>: Couples, families, friends who prefer an easy pace</li>
  <li><strong>Style</strong>: Leisure • Beach • Heritage</li>
  <li><strong>Season</strong>: Nov–Mar is peak (pleasant); monsoon is lush and quiet</li>
</ul>
`,
    hero: '/images/destinations/goa.jpg',
    gallery: [
      { src: '/images/destinations/goa.jpg', alt: 'Goa beach shoreline at sunset' },
      { src: '/images/destinations/goa1.jpg', alt: 'Palm-lined beach road in Goa' },
      { src: '/images/destinations/goa2.jpg', alt: 'Quiet cove and blue waters in Goa' },
      { src: '/images/destinations/goa_fort.jpg', alt: 'Goa coastal fort and sea views' }
    ],
    tripStyle: ['Beach', 'Leisure'],
    meta: {
      durationDays: 4,
      bestSeasons: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      fromCities: ['Goa Airport (GOI)', 'Pune', 'Mumbai']
    },
    highlights: [
      { title: 'Fort Aguada & Chapora', detail: 'Golden-hour viewpoints and coastal history.' },
      { title: 'Candolim • Calangute • Baga', detail: 'Classic beach trio with shacks and watersports.' },
      { title: 'Vagator & Anjuna', detail: 'Cliff views, cafés, and flea market (days vary).' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival • Beach Walks',
        distance_km: 40,
        travel_time_hours: 1.5,
        activities: [
          { time_hint: '12:00', name: 'Airport/Station pickup', why: 'Smooth transfer to your stay' },
          { time_hint: '16:00', name: 'Candolim beach & sunset', why: 'Easy first day, unwind by the sea' }
        ],
        food: ['Beach shack fresh catch', 'Goan curries'],
        safety: ['Hydrate and use reef-safe sunscreen']
      },
      {
        day: 2,
        title: 'Forts & North Goa Circuit',
        distance_km: 70,
        travel_time_hours: 3,
        activities: [
          { time_hint: '09:00', name: 'Fort Aguada', why: 'Views across the Arabian Sea' },
          { time_hint: '12:30', name: 'Anjuna lunch', why: 'Cafés with cliff views' },
          { time_hint: '16:30', name: 'Chapora Fort', why: 'Golden-hour photos and breeze' }
        ],
        food: ['Prawn recheado', 'Kingfish rawa fry'],
        safety: ['Wear comfy footwear for fort climbs']
      },
      {
        day: 3,
        title: 'Free Day • Optional South Goa',
        distance_km: 120,
        travel_time_hours: 4,
        activities: [
          { time_hint: '10:00', name: 'Optional: Colva/Palolem', why: 'Quieter beaches, postcard coves' },
          { time_hint: '18:30', name: 'Night market (seasonal)', why: 'Music, street food, artisanal stalls' }
        ],
        food: ['Local bakeries', 'Beach BBQ'],
        safety: ['Check tide/watersports flags']
      },
      {
        day: 4,
        title: 'Easy Morning • Departure',
        distance_km: 40,
        travel_time_hours: 1.5,
        activities: [
          { time_hint: '08:30', name: 'Café breakfast', why: 'Slow start before checkout' },
          { time_hint: '11:00', name: 'Drop at Airport/Station', why: 'Buffer for security & queues' }
        ]
      }
    ],
    pricing: {
      updated: '2024-01-01',
      assumptions: ['AC cab', 'local sightseeing as per plan'],
      bands: [
        { pax: '1-4', vehicle: 'Sedan', from: 11500, to: 14500 },
        { pax: '1-6', vehicle: 'SUV', from: 13500, to: 17500 }
      ],
      disclaimers: ['Hotel & flights not included unless specified', 'Watersports and entry tickets extra']
    },
    faqs: [
      { id: 1, q: 'Best months to visit Goa?', a: 'Nov–Mar for pleasant weather; monsoon (Jun–Sep) is quieter and lush.' },
      { id: 2, q: 'Is this kid-friendly?', a: 'Yes. We pace the day light and can add kid-friendly cafés and safe beaches.' },
      { id: 3, q: 'South vs. North Goa?', a: 'North has more cafés/markets; South has calmer beaches. This plan leans North with an optional South day.' },
      { id: 4, q: 'What to pack?', a: 'Light cottons, sunscreen, hat, flip flops, and a light cover-up for evenings.' },
      { id: 5, q: 'Can you add stays?', a: 'Yes. Share a budget range and vibe (resort/boutique/hostel) and we’ll suggest options.' }
    ],
    reviews: [
      { name: 'Priya N.', rating: 5, text: 'Perfect mix of beaches and cafés. Driver was patient and helpful.', city: 'Bengaluru', created_at: '2024-02-11' },
      { name: 'Alex T.', rating: 5, text: 'Loved the fort sunsets and the flexible plan. Great value.', city: 'London', created_at: '2024-03-02' },
      { name: 'Rohit S.', rating: 4, text: 'Clean car, good local tips. Will try South Goa next time.', city: 'Pune', created_at: '2024-04-18' },
      { name: 'Nikita M.', rating: 5, text: 'Super smooth airport transfers and beach days. Stress-free!', city: 'Mumbai', created_at: '2024-05-27' }
    ],
    contact: {
      whatsapp: '+919922333305',
      phone: '+919922333305'
    },
    allowDynamicPricing: true,
    reviewsEnabled: true
  },
  {
    id: 'mahabaleshwar-2d1n',
    slug: 'mahabaleshwar-2d1n',
    region: 'Maharashtra',
    title: 'Mahabaleshwar 2D/1N',
    subtitle: 'Valley Views, Mapro & Temples',
    summary: 'Private cab • Scenic viewpoints • Strawberries in season',
    narrativeHtml: `
<h1>Mahabaleshwar – Hills, Viewpoints, and Strawberries</h1>
<p>A classic Western Ghats getaway. Explore lush valleys, serene lakes, and the famous Mapro garden. Easy drives, cool breeze, and sunset points make this a perfect short break.</p>
<hr />
<h2>Trip Snapshot</h2>
<ul>
  <li><strong>Best for</strong>: Families & couples</li>
  <li><strong>Style</strong>: Hill • Leisure • Food</li>
  <li><strong>Season</strong>: Oct–Mar is pleasant; Feb–Apr for strawberries; monsoon is lush</li>
</ul>
`,
    hero: '/images/destinations/mahabaleshwar.jpg',
    gallery: [
      { src: '/images/destinations/mahabaleshwar.jpg', alt: 'Mahabaleshwar – valley views' },
      { src: '/images/destinations/mapro.jpg', alt: 'Mapro garden – strawberries and café' }
    ],
    tripStyle: ['Hill', 'Leisure'],
    meta: {
      durationDays: 2,
      bestSeasons: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
      fromCities: ['Pune', 'Mumbai']
    },
    highlights: [
      { title: 'Elephant’s Head Point', detail: 'Dramatic valley cliffs and breezes.' },
      { title: 'Venna Lake', detail: 'Boating and easy lakeside strolls.' },
      { title: 'Mapro Garden', detail: 'Seasonal strawberries, sandwiches & shakes.' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pune/Mumbai – Mahabaleshwar',
        distance_km: 120,
        travel_time_hours: 4,
        activities: [
          { time_hint: '08:00', name: 'Depart city', why: 'Beat traffic; clear air on ghat roads' },
          { time_hint: '12:30', name: 'Venna Lake & lunch', why: 'Easy start to the trip' },
          { time_hint: '16:30', name: 'Sunset point (e.g., Wilson/Elphinstone)', why: 'Golden-hour valley views' }
        ],
        food: ['Corn patties, strawberry cream'],
        safety: ['Carry light jackets; ghats can be misty']
      },
      {
        day: 2,
        title: 'Viewpoints • Mapro • Return',
        distance_km: 150,
        travel_time_hours: 4,
        activities: [
          { time_hint: '09:00', name: 'Elephant’s Head/Kate’s Point', why: 'Iconic spots before crowds' },
          { time_hint: '12:30', name: 'Mapro Garden', why: 'Seasonal strawberry delights' },
          { time_hint: '15:30', name: 'Return drive', why: 'Reach by evening' }
        ]
      }
    ],
    pricing: {
      updated: '2024-01-01',
      assumptions: ['AC cab', 'driver allowance', 'tolls & parking'],
      bands: [
        { pax: '1-4', vehicle: 'Sedan', from: 6500, to: 8500 },
        { pax: '1-6', vehicle: 'SUV', from: 8000, to: 10500 }
      ],
      disclaimers: ['Hotel & activities not included unless specified']
    },
    faqs: [
      { id: 1, q: 'Best time to visit?', a: 'Oct–Mar is pleasant; Feb–Apr for strawberries; monsoon is lush but can be foggy.' },
      { id: 2, q: 'Is boating open at Venna Lake?', a: 'Usually yes, but depends on weather and crowd. We’ll advise on the day.' },
      { id: 3, q: 'Good for kids?', a: 'Yes – easy walks, boating, and Mapro treats keep it fun.' },
      { id: 4, q: 'Stay options?', a: 'We can suggest resorts/boutiques depending on budget and vibe.' }
    ],
    reviews: [
      { name: 'Kunal D.', rating: 4, text: 'Lovely weekend – clean cab and flexible stops.', city: 'Pune', created_at: '2024-02-08' },
      { name: 'Aishwarya P.', rating: 4, text: 'Driver knew the best points; Mapro lunch was great.', city: 'Mumbai', created_at: '2024-03-14' },
      { name: 'Tanvi R.', rating: 4, text: 'Smooth ghat driving and on-time pickups.', city: 'Nashik', created_at: '2024-04-20' },
      { name: 'Viren S.', rating: 4, text: 'Good plan and helpful suggestions.', city: 'Ahmedabad', created_at: '2024-05-11' },
      { name: 'Rachel M.', rating: 4, text: 'Comfortable car and scenic views everywhere.', city: 'London', created_at: '2024-06-02' }
    ],
    contact: {
      whatsapp: '+919922333305',
      phone: '+919922333305'
    },
    allowDynamicPricing: true,
    reviewsEnabled: true
  },
  {
    id: 'golden-triangle-5d',
    slug: 'golden-triangle-5d',
    region: 'Delhi–Agra–Jaipur',
    title: 'Golden Triangle 5D',
    subtitle: 'Delhi, Agra (Taj) & Jaipur Highlights',
    summary: 'Private cab • Guided sights • Flexible pacing',
    narrativeHtml: `
<h1>Golden Triangle – India’s Classic Culture Circuit</h1>
<p>Cover the icons with time to breathe: Old Delhi bazaars, the Taj Mahal at sunrise, and Jaipur’s forts and palaces. Balanced driving legs with curated food stops and photo breaks.</p>
<hr />
<h2>Trip Snapshot</h2>
<ul>
  <li><strong>Best for</strong>: First-time visitors, culture lovers</li>
  <li><strong>Style</strong>: Heritage • Food • Photography</li>
  <li><strong>Season</strong>: Oct–Mar is ideal; summers are hot</li>
</ul>
`,
    hero: '/images/destinations/golden-triangle.jpg',
    gallery: [
      { src: '/images/destinations/taj.jpg', alt: 'Agra – Taj Mahal at sunrise' },
      { src: '/images/destinations/india_gate.jpg', alt: 'Delhi – India Gate' },
      { src: '/images/destinations/jaipur.jpg', alt: 'Jaipur – Amer Fort & pink city vibes' }
    ],
    tripStyle: ['Heritage', 'Culture'],
    meta: {
      durationDays: 5,
      bestSeasons: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      fromCities: ['Delhi']
    },
    highlights: [
      { title: 'Old Delhi & New Delhi', detail: 'Red Fort, Jama Masjid, Rajpath & markets.' },
      { title: 'Taj Mahal & Agra Fort', detail: 'Sunrise Taj visit and Mughal architecture.' },
      { title: 'Jaipur Forts & Palaces', detail: 'Amber, City Palace, Hawa Mahal, local bazaars.' }
    ],
    itinerary: [
      { day: 1, title: 'Arrive Delhi • Local Sights', distance_km: 60, travel_time_hours: 3, activities: [
        { time_hint: '10:00', name: 'India Gate & Rajpath', why: 'Orientation and photos' },
        { time_hint: '16:00', name: 'Old Delhi walk', why: 'Bazaars and street food' }
      ]},
      { day: 2, title: 'Delhi → Agra', distance_km: 230, travel_time_hours: 4.5, activities: [
        { time_hint: '09:00', name: 'Agra Fort', why: 'Unmissable Mughal fort' },
        { time_hint: '17:30', name: 'Mehtab Bagh sunset', why: 'Taj from across the Yamuna' }
      ]},
      { day: 3, title: 'Taj Sunrise • Agra → Jaipur', distance_km: 240, travel_time_hours: 5, activities: [
        { time_hint: '06:00', name: 'Taj Mahal sunrise', why: 'Best light and thinner crowds' },
        { time_hint: '12:00', name: 'Drive to Jaipur via Fatehpur Sikri (optional)', why: 'Historic detour if time permits' }
      ]},
      { day: 4, title: 'Jaipur Forts & City', distance_km: 80, travel_time_hours: 3, activities: [
        { time_hint: '09:00', name: 'Amber Fort', why: 'Hilltop fort and views' },
        { time_hint: '15:30', name: 'City Palace & Hawa Mahal', why: 'Royal residences and iconic façade' }
      ]},
      { day: 5, title: 'Jaipur → Delhi • Depart', distance_km: 270, travel_time_hours: 5.5, activities: [
        { time_hint: '09:00', name: 'Local crafts & brunch', why: 'Pick up souvenirs and relax' },
        { time_hint: '12:00', name: 'Drive to Delhi', why: 'Airport/rail drop with buffer' }
      ]}
    ],
    pricing: {
      updated: '2024-01-01',
      assumptions: ['AC cab', 'intercity transfers & local sightseeing'],
      bands: [
        { pax: '1-4', vehicle: 'Sedan', from: 28500, to: 34500 },
        { pax: '1-6', vehicle: 'SUV', from: 32500, to: 39500 }
      ],
      disclaimers: ['Hotel & monument tickets extra unless specified', 'Guide services on request']
    },
    faqs: [
      { id: 1, q: 'Is Taj closed on any day?', a: 'Yes, the Taj Mahal is closed on Fridays.' },
      { id: 2, q: 'Best time to visit?', a: 'Oct–Mar is pleasant; summer heat can be intense, plan early starts.' },
      { id: 3, q: 'Can you add a guide?', a: 'Yes, certified guides can be arranged in each city.' },
      { id: 4, q: 'Can we customize pace?', a: 'Absolutely. We can add free time, cafés, or shopping as you like.' }
    ],
    reviews: [
      { name: 'Helena W.', rating: 4, text: 'Great pacing and helpful driver across cities.', city: 'Berlin', created_at: '2024-01-18' },
      { name: 'Rajat B.', rating: 4, text: 'Smooth transfers and clean car. Taj sunrise was magical.', city: 'Mumbai', created_at: '2024-02-09' },
      { name: 'Sofia L.', rating: 5, text: 'Loved Jaipur day and food stops. Very well planned.', city: 'Lisbon', created_at: '2024-03-27' },
      { name: 'James P.', rating: 4, text: 'Good flexibility and safe driving.', city: 'London', created_at: '2024-04-30' },
      { name: 'Neha A.', rating: 4, text: 'Comfortable and efficient – covered all key spots.', city: 'Delhi', created_at: '2024-05-20' }
    ],
    contact: {
      whatsapp: '+919922333305',
      phone: '+919922333305'
    },
    allowDynamicPricing: true,
    reviewsEnabled: true
  }
];
