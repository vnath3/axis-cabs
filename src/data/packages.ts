export type PackageEntry = {
  slug: string;
  title: string;
  summary: string;
  days: { day: string; items: string[] }[];
  faqs: { q: string; a: string }[];
};

export const packages: PackageEntry[] = [
  {
    slug: 'ajanta-ellora-2-day-itinerary',
    title: 'Ajanta & Ellora 2‑Day Itinerary — Caves, Fort & Local Food',
    summary: 'Private cab • Handpicked stops • Flexible timing',
    days: [
      { day: 'Day 1', items: ['Ellora Caves', 'Grishneshwar Temple', 'Daulatabad Fort (optional)'] },
      { day: 'Day 2', items: ['Ajanta Caves', 'Scenic viewpoints', 'Local thali stop'] }
    ],
    faqs: [
      { q: 'Best season?', a: 'Oct–Mar is ideal; summers are hot.' },
      { q: 'Entry tickets included?', a: 'Tickets & meals excluded; included in your final quote on request.' }
    ]
  },
  { slug: 'goa-3-day-relax-itinerary', title: 'Goa 3‑Day Relax Itinerary — Beach & Forts', summary: 'North & South split • Sunset points • Optional watersports', days: [], faqs: [] },
  { slug: 'varanasi-2-day-rituals-heritage', title: 'Varanasi 2‑Day — Rituals & Heritage', summary: 'Ghat walks • Evening aarti • Silk alley', days: [], faqs: [] }
];