export type DestinationItem = {
  title: string;
  slug: string; // internal link target e.g. /packages/ajanta-ellora-2-day-itinerary
  duration: string; // "2 Days / 1 Night"
  priceFromINR: number; // starting price
  image: { src: string; alt: string };
  highlights: string[]; // ["Cab", "Hotel", "Tickets"]
  tags?: string[];
};

export const destinations: DestinationItem[] = [
  {
    title: "Ajanta & Ellora",
    slug: "/packages/ajanta-ellora-2-day-itinerary",
    duration: "2 Days / 1 Night",
    priceFromINR: 8999,
    image: {
      src: "/images/destinations/ajanta-ellora.jpg",
      alt: "View of Ajanta and Ellora caves",
    },
    highlights: ["Cab", "Hotel", "Tickets"],
    tags: ["Weekend", "Heritage"],
  },
  {
    title: "Shirdi Darshan",
    slug: "/packages/shirdi-darshan-weekend",
    duration: "1 Day / Same Day Return",
    priceFromINR: 4999,
    image: {
      src: "/images/destinations/shirdi.jpg",
      alt: "Shirdi Sai Baba temple",
    },
    highlights: ["Cab", "Darshan Assist", "Tickets"],
    tags: ["Pilgrimage", "Weekend"],
  },
  {
    title: "Mumbai ↔ Pune",
    slug: "/city-to-city/pune-to-mumbai-cab",
    duration: "One‑Way / Round Trip",
    priceFromINR: 2999,
    image: {
      src: "/images/destinations/mumbai-pune.jpg",
      alt: "Mumbai to Pune highway",
    },
    highlights: ["Cab", "Expressway", "Tolls Optional"],
    tags: ["City", "Transfer"],
  },
  {
    title: "Goa Coastal",
    slug: "/packages/goa-3n4d-beach-escape",
    duration: "4 Days / 3 Nights",
    priceFromINR: 17999,
    image: { src: "/images/destinations/goa.jpg", alt: "Goa beach shoreline" },
    highlights: ["Cab", "Hotel", "Sightseeing"],
    tags: ["Beach", "Leisure"],
  },
  {
    title: "Mahabaleshwar",
    slug: "/packages/mahabaleshwar-2d1n",
    duration: "2 Days / 1 Night",
    priceFromINR: 7499,
    image: {
      src: "/images/destinations/mahabaleshwar.jpg",
      alt: "Mahabaleshwar hills",
    },
    highlights: ["Cab", "Hotel", "Mapro Visit"],
    tags: ["Weekend", "Hill"],
  },
  {
    title: "Golden Triangle",
    slug: "/packages/golden-triangle-5d",
    duration: "5 Days / 4 Nights",
    priceFromINR: 28999,
    image: {
      src: "/images/destinations/golden-triangle.jpg",
      alt: "Taj Mahal in the Golden Triangle",
    },
    highlights: ["Cab", "Hotel", "Tickets"],
    tags: ["Heritage", "Culture"],
  },
];
