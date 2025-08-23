export type PackageEntry = {
  slug: string;
  title: string;
  summary: string;
  days: { day: string; items: string[] }[];
  images: { src: string; alt: string; story: string }[];
  faqs: { q: string; a: string }[];
  reviews: { name: string; rating: number; text: string }[];
};

export const packages: PackageEntry[] = [
  {
    slug: "ajanta-ellora-2-day-itinerary",
    title: "Ajanta & Ellora 2‑Day Itinerary — Caves, Fort & Local Food",
    summary: "Private cab • Handpicked stops • Flexible timing",
    images: [
      {
        src: "/images/destinations/ajanta-ellora.jpg",
        alt: "Ajanta caves",
        story:
          "Centuries-old Buddhist murals adorn the silent halls of Ajanta.",
      },
      {
        src: "/images/destinations/ellora.jpg",
        alt: "Ellora temple",
        story:
          "The monolithic Kailasa temple shows the scale of ancient craftsmanship.",
      },
      {
        src: "/images/destinations/daulatabad_fort.jpg",
        alt: "Daulatabad Fort",
        story: "Climb Daulatabad's steep ramps for sweeping Deccan views.",
      },
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
      {
        q: "What is the best time to visit Ajanta and Ellora?",
        a: "October to March offers pleasant weather and clearer views inside the caves. Summers can be extremely hot.",
      },
      {
        q: "How many caves can we cover in two days?",
        a: "Most travellers comfortably explore 12–15 prominent caves with ample time for photos and breaks.",
      },
      {
        q: "Are guides and entry tickets included?",
        a: "A local guide can be arranged on request. Tickets and meals are excluded but our team helps you purchase them easily.",
      },
    ],
    reviews: [
      {
        name: "Anita P.",
        rating: 5,
        text: "Driver was knowledgeable and patient. The caves were breathtaking!",
      },
      {
        name: "Rahul M.",
        rating: 4,
        text: "Comfortable ride and well planned itinerary. Loved the local thali stop.",
      },
    ],
  },
  {
    slug: "shirdi-darshan-weekend",
    title: "Shirdi Darshan Weekend — Sai Baba Temple & Local Stops",
    summary: "Private cab • Darshan assistance • Same day return",
    images: [
      {
        src: "/images/destinations/shirdi.jpg",
        alt: "Shirdi temple",
        story:
          "Early morning aarti at the Sai Baba temple draws thousands of devotees.",
      },
      {
        src: "/images/destinations/ShirdiSaibaba.jpg",
        alt: "Shirdi market",
        story: "Colourful shops around the temple sell prasad and souvenirs.",
      },
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
    faqs: [
      {
        q: "What are the temple darshan timings?",
        a: "Darshan typically starts around 4 AM and continues till late night. We schedule pickups to match your preferred slot.",
      },
      {
        q: "Can we arrange a VIP darshan pass?",
        a: "Yes, VIP passes can be arranged subject to temple availability and additional charges.",
      },
      {
        q: "Are meals included in the package?",
        a: "Meals are not included. Our driver can guide you to clean restaurants en route.",
      },
    ],
    reviews: [
      {
        name: "Meena R.",
        rating: 5,
        text: "Seamless darshan experience and punctual service.",
      },
      {
        name: "Suresh K.",
        rating: 4,
        text: "Clean car and helpful driver. Will book again.",
      },
    ],
  },
  {
    slug: "goa-3n4d-beach-escape",
    title: "Goa 4‑Day Beach Escape — Sun, Sand & Forts",
    summary:
      "Airport transfers • North & South Goa tours • Optional watersports",
    images: [
      {
        src: "/images/destinations/goa1.jpg",
        alt: "Goa beach",
        story:
          "Relax on soft sands with gentle Arabian Sea waves lapping nearby.",
      },
      {
        src: "/images/destinations/goa_fort.jpg",
        alt: "Goa fort",
        story:
          "Explore centuries-old coastal forts overlooking turquoise waters.",
      },
      {
        src: "/images/destinations/goa2.jpg",
        alt: "Goa sunset",
        story: "Evenings end with vivid orange sunsets across the horizon.",
      },
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
    faqs: [
      {
        q: "Is airport transfer included?",
        a: "Yes, private pickup and drop to Goa airport or railway station are part of the package.",
      },
      {
        q: "When is the best season to visit Goa?",
        a: "November to February offers sunny days and lively beaches, while June to September is monsoon with fewer crowds.",
      },
      {
        q: "Can we add watersports or a cruise?",
        a: "Absolutely. Parasailing, jet-ski, or a sunset cruise can be added at extra cost.",
      },
    ],
    reviews: [
      {
        name: "Kiran D.",
        rating: 5,
        text: "Perfect beach break. Driver knew all the good shacks.",
      },
      {
        name: "Latika S.",
        rating: 4,
        text: "Hotel pickup was on time and itinerary covered both North and South Goa.",
      },
    ],
  },
  {
    slug: "mahabaleshwar-2d1n",
    title: "Mahabaleshwar 2‑Day Getaway — Hills & Strawberries",
    summary: "Scenic viewpoints • Mapro Garden • Flexible schedule",
    images: [
      {
        src: "/images/destinations/mahabaleshwar.jpg",
        alt: "Mahabaleshwar hills",
        story: "Morning mist rolls over the lush hills of Mahabaleshwar.",
      },
      {
        src: "/images/destinations/mapro.jpg",
        alt: "Mapro Garden",
        story: "Sample fresh strawberry treats at the famous Mapro Garden.",
      },
    ],
    days: [
      {
        day: "Day 1",
        items: ["Pickup from Pune", "Mapro Garden", "Arthur Seat Point"],
      },
      { day: "Day 2", items: ["Pratapgad Fort", "Return to Pune"] },
    ],
    faqs: [
      {
        q: "When is strawberry season in Mahabaleshwar?",
        a: "December to February is peak strawberry season with farm visits and fresh produce.",
      },
      {
        q: "Do we stay overnight?",
        a: "Yes, the package includes a night halt in Mahabaleshwar with comfortable accommodation.",
      },
      {
        q: "Is boating at Venna Lake included?",
        a: "Boating charges are extra and can be paid directly at the lake.",
      },
    ],
    reviews: [
      {
        name: "Prakash L.",
        rating: 5,
        text: "Great getaway from Pune with plenty of scenic stops.",
      },
      {
        name: "Sneha T.",
        rating: 4,
        text: "Loved the strawberries! Wish we had more time at the viewpoints.",
      },
    ],
  },
  {
    slug: "golden-triangle-5d",
    title: "Golden Triangle 5‑Day Tour — Delhi, Agra & Jaipur",
    summary: "Private cab • Guided sightseeing • Customisable plan",
    images: [
      {
        src: "/images/destinations/taj.jpg",
        alt: "Taj Mahal",
        story:
          "Sunrise at the Taj Mahal is a highlight of the Golden Triangle.",
      },
      {
        src: "/images/destinations/india_gate.jpg",
        alt: "India Gate",
        story: "Drive past Delhi's iconic India Gate on your city tour.",
      },
      {
        src: "/images/destinations/jaipur.jpg",
        alt: "Jaipur fort",
        story: "The pink city of Jaipur boasts majestic forts and palaces.",
      },
    ],
    days: [
      { day: "Day 1", items: ["Arrive Delhi", "City tour"] },
      { day: "Day 2", items: ["Delhi to Agra", "Taj Mahal visit"] },
      { day: "Day 3", items: ["Agra to Jaipur", "Fatehpur Sikri en route"] },
      { day: "Day 4", items: ["Jaipur city tour: Amber Fort, Hawa Mahal"] },
      { day: "Day 5", items: ["Return to Delhi"] },
    ],
    faqs: [
      {
        q: "How long is the drive between each city?",
        a: "Each leg averages 4–5 hours with comfort breaks along the way.",
      },
      {
        q: "Are monument entry fees included?",
        a: "Entry fees and guide charges are extra but we assist with advance booking.",
      },
      {
        q: "Can the itinerary be customised?",
        a: "Yes, we can add or skip sights and adjust travel pace as per your preference.",
      },
    ],
    reviews: [
      {
        name: "Vivek J.",
        rating: 5,
        text: "Saw the best of North India in comfort. Highly recommend.",
      },
      {
        name: "Neha A.",
        rating: 4,
        text: "Driver was courteous and hotels suggested were good value.",
      },
    ],
  },
];
