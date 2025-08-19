export type DestinationItem = {
title: string;
slug: string; // internal link target e.g. /packages/ajanta-ellora-2-day-itinerary
duration: string; // "2 Days / 1 Night"
priceFromINR: number; // starting price
image: { src: string; alt: string };
highlights: string[]; // ["Cab", "Hotel", "Tickets"]
};

export const destinations: DestinationItem[] = [
{
title: "Ajanta & Ellora",
slug: "/packages/ajanta-ellora-2-day-itinerary",
duration: "2 Days / 1 Night",
priceFromINR: 8999,
image: { src: "/images/destinations/ajanta-ellora.jpg", alt: "Ajanta and Ellora caves scenic view" },
highlights: ["Cab", "Hotel", "Tickets"]
},
{
title: "Shirdi Darshan",
slug: "/packages/shirdi-darshan-weekend",
duration: "1 Day / Same Day Return",
priceFromINR: 4999,
image: { src: "/images/destinations/shirdi.jpg", alt: "Shirdi temple entrance" },
highlights: ["Cab", "Darshan Assist", "Tickets"]
},
{
title: "Mumbai ↔ Pune",
slug: "/city-to-city/pune-to-mumbai-cab",
duration: "One‑Way / Round Trip",
priceFromINR: 2999,
image: { src: "/images/destinations/mumbai-pune.jpg", alt: "Mumbai–Pune Expressway valley" },
highlights: ["Cab", "Expressway", "Tolls Optional"]
},
{
title: "Goa Coastal",
slug: "/packages/goa-3n4d-beach-escape",
duration: "4 Days / 3 Nights",
priceFromINR: 17999,
image: { src: "/images/destinations/goa.jpg", alt: "Goa beach coastline at sunset" },
highlights: ["Cab", "Hotel", "Sightseeing"]
},
{
title: "Mahabaleshwar",
slug: "/packages/mahabaleshwar-2d1n",
duration: "2 Days / 1 Night",
priceFromINR: 7499,
image: { src: "/images/destinations/mahabaleshwar.jpg", alt: "Mahabaleshwar viewpoints and valleys" },
highlights: ["Cab", "Hotel", "Mapro Visit"]
},
{
title: "Golden Triangle",
slug: "/packages/golden-triangle-5d",
duration: "5 Days / 4 Nights",
priceFromINR: 28999,
image: { src: "/images/destinations/golden-triangle.jpg", alt: "Taj Mahal and India Gate collage" },
highlights: ["Cab", "Hotel", "Tickets"]
}
];
