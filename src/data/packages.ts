export type PackageEntry = {
  slug: string;
  title: string;
  summary: string;
  days: { day: string; items: string[] }[];
  images: { src: string; alt: string }[];
  faqs: { q: string; a: string }[];
};

export const packages: PackageEntry[] = [
  {
    slug: "ajanta-ellora-2-day-itinerary",
    title: "Ajanta & Ellora 2‑Day Itinerary — Caves, Fort & Local Food",
    summary: "Private cab • Handpicked stops • Flexible timing",
    images: [
      { src: "/images/destinations/ajanta-ellora.jpg", alt: "Ajanta caves" },
      { src: "/images/destinations/ajanta-ellora.jpg", alt: "Ellora temple" },
      { src: "/images/destinations/ajanta-ellora.jpg", alt: "Daulatabad Fort" },
    ],
    days: [
      {
        day: "Day 1",
        items: [
          "Ellora Caves",
          "Grishneshwar Temple",
          "Daulatabad Fort (optional)",
        ],
      },
      {
        day: "Day 2",
        items: ["Ajanta Caves", "Scenic viewpoints", "Local thali stop"],
      },
    ],
    faqs: [
      { q: "Best season?", a: "Oct–Mar is ideal; summers are hot." },
      {
        q: "Entry tickets included?",
        a: "Tickets & meals excluded; included in your final quote on request.",
      },
    ],
  },
  {
    slug: "shirdi-darshan-weekend",
    title: "Shirdi Darshan Weekend — Sai Baba Temple & Local Stops",
    summary: "Private cab • Darshan assistance • Same day return",
    images: [
      { src: "/images/destinations/shirdi.jpg", alt: "Shirdi temple" },
      { src: "/images/destinations/shirdi.jpg", alt: "Shirdi street" },
    ],
    days: [
      {
        day: "Day 1",
        items: [
          "Early morning pickup",
          "Shirdi Sai Baba Temple",
          "Local sightseeing",
          "Return by night",
        ],
      },
    ],
    faqs: [],
  },
  {
    slug: "goa-3n4d-beach-escape",
    title: "Goa 4‑Day Beach Escape — Sun, Sand & Forts",
    summary:
      "Airport transfers • North & South Goa tours • Optional watersports",
    images: [
      { src: "/images/destinations/goa.jpg", alt: "Goa beach" },
      { src: "/images/destinations/goa.jpg", alt: "Goa fort" },
      { src: "/images/destinations/goa.jpg", alt: "Goa sunset" },
    ],
    days: [
      {
        day: "Day 1",
        items: ["Arrive Goa", "Check‑in", "Evening on the beach"],
      },
      { day: "Day 2", items: ["North Goa tour: Fort Aguada, Calangute, Baga"] },
      {
        day: "Day 3",
        items: ["South Goa tour: Colva Beach, Basilica of Bom Jesus"],
      },
      { day: "Day 4", items: ["Checkout and departure"] },
    ],
    faqs: [],
  },
  {
    slug: "mahabaleshwar-2d1n",
    title: "Mahabaleshwar 2‑Day Getaway — Hills & Strawberries",
    summary: "Scenic viewpoints • Mapro Garden • Flexible schedule",
    images: [
      { src: "/images/destinations/mahabaleshwar.jpg", alt: "Mahabaleshwar hills" },
      { src: "/images/destinations/mahabaleshwar.jpg", alt: "Mapro Garden" },
    ],
    days: [
      {
        day: "Day 1",
        items: ["Pickup from Pune", "Mapro Garden", "Arthur Seat Point"],
      },
      { day: "Day 2", items: ["Pratapgad Fort", "Return to Pune"] },
    ],
    faqs: [],
  },
  {
    slug: "golden-triangle-5d",
    title: "Golden Triangle 5‑Day Tour — Delhi, Agra & Jaipur",
    summary: "Private cab • Guided sightseeing • Customisable plan",
    images: [
      { src: "/images/destinations/golden-triangle.jpg", alt: "Taj Mahal" },
      { src: "/images/destinations/golden-triangle.jpg", alt: "India Gate" },
      { src: "/images/destinations/golden-triangle.jpg", alt: "Jaipur fort" },
    ],
    days: [
      { day: "Day 1", items: ["Arrive Delhi", "City tour"] },
      { day: "Day 2", items: ["Delhi to Agra", "Taj Mahal visit"] },
      { day: "Day 3", items: ["Agra to Jaipur", "Fatehpur Sikri en route"] },
      { day: "Day 4", items: ["Jaipur city tour: Amber Fort, Hawa Mahal"] },
      { day: "Day 5", items: ["Return to Delhi"] },
    ],
    faqs: [],
  },
];
