export type RouteEntry = {
  slug: string;
  from: string;
  to: string;
  title: string;
  summary: string;
  distanceHint?: string;
  faqs: { q: string; a: string }[];
};

export const routes: RouteEntry[] = [
  {
    slug: 'pune-to-mumbai-cab',
    from: 'Pune',
    to: 'Mumbai',
    title: 'Pune to Mumbai Cab — On‑Time Airport Transfers, 24×7',
    summary: '5,000+ trips • GPS‑tracked • Transparent fares • Professional drivers',
    distanceHint: '150 km • 3–4 hrs',
    faqs: [
      { q: 'Are tolls & parking included?', a: 'Usually excluded; shown transparently in your quote.' },
      { q: 'Waiting charges?', a: '45 mins free at airport pickup; then charged in 15‑min blocks.' },
      { q: 'Night charges?', a: 'Included in band; final quote confirms.' },
      { q: 'Payment modes?', a: 'UPI, card, cash; GST invoice for corporates.' }
    ]
  },
  { slug: 'mumbai-to-goa-cab', from: 'Mumbai', to: 'Goa', title: 'Mumbai to Goa Cab — Coastal Drives, SUVs & Tempo Travellers', summary: 'Door‑to‑door • Sanitized fleet • Experienced intercity drivers', distanceHint: '590 km • 10–12 hrs', faqs: [] },
  { slug: 'aurangabad-to-ellora-ajanta-cab', from: 'Aurangabad', to: 'Ellora & Ajanta', title: 'Aurangabad to Ellora & Ajanta Cab — Heritage Transfers', summary: 'Flexible stops • Clean vehicles • Local expertise', distanceHint: 'Ellora 30 km • Ajanta 100 km', faqs: [] },
  { slug: 'delhi-to-agra-cab', from: 'Delhi', to: 'Agra', title: 'Delhi to Agra Cab — Taj Mahal Day Trip', summary: 'Same‑day return • Expressway • Professional drivers', distanceHint: '230 km • 3–4 hrs', faqs: [] },
  { slug: 'jaipur-to-udaipur-cab', from: 'Jaipur', to: 'Udaipur', title: 'Jaipur to Udaipur Cab — Rajasthan Circuit', summary: 'Comfortable sedans & SUVs • Scenic route', distanceHint: '400 km • 7–8 hrs', faqs: [] }
];