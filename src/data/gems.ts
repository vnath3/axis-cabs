export type GemEntry = {
  slug: string;
  title: string;
  region: string;
  summary: string;
  bestTime?: string;
  howToReach?: string;
  content: string[];
};

export const gems: GemEntry[] = [
  {
    slug: 'ellora-secret-viewpoints',
    title: 'Ellora Secret Viewpoints — Photo Spots & Best Time',
    region: 'Maharashtra',
    summary: 'Quiet viewpoints near Ellora with sunrise/sunset framing for photographers.',
    bestTime: 'Oct–Mar • Sunrise & Golden Hour',
    howToReach: 'Private cab from Aurangabad (30–40 mins).',
    content: [
      'Two lesser‑known overlooks with minimal crowds.',
      'Carry water; uneven surfaces. Respect local guidelines.'
    ]
  },
  {
    slug: 'lonar-crater-day-trip',
    title: 'Lonar Crater Day Trip — Meteor Lake & Temples',
    region: 'Maharashtra',
    summary: 'Unique meteor‑impact lake with birdlife and heritage temples.',
    bestTime: 'Nov–Feb',
    howToReach: '3–4 hrs from Aurangabad by cab.',
    content: ['Do the rim walk for views.', 'Local guides available near the temple complex.']
  }
];