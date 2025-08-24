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
    hero: '/images/destinations/ellora.jpg',
    gallery: [
      { src: '/images/destinations/ajanta-ellora.jpg', alt: 'Ajanta caves' },
      { src: '/images/destinations/ellora.jpg', alt: 'Ellora temple' },
      { src: '/images/destinations/daulatabad_fort.jpg', alt: 'Daulatabad Fort' }
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
      { id: 'time', q: 'Best time to visit?', a: 'October to March offers pleasant weather.' }
    ],
    reviews: [
      { name: 'Anita P.', rating: 5, text: 'Driver was knowledgeable and patient.' },
      { name: 'Rahul M.', rating: 4, text: 'Comfortable ride and good food stops.' }
    ],
    contact: {
      whatsapp: '+919922333305',
      phone: '+919922333305'
    },
    allowDynamicPricing: true,
    reviewsEnabled: true
  }
];
