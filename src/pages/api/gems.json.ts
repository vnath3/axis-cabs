import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

type GemRow = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  where: string;
  tags: string[];
  teaser: string;
  image_url?: string | null;
  published?: boolean;
};

const FALLBACK: GemRow[] = [
  {id:'lonar', name:'Lonar Crater Lake', lat:19.985, lng:76.507, tags:['nature','photogenic'], where:'Buldhana', teaser:'Meteor-formed emerald lake.'},
  {id:'daulatabad', name:'Daulatabad (Devgiri) Fort', lat:19.943, lng:75.221, tags:['heritage','photogenic'], where:'Near Aurangabad', teaser:'Secret passages, epic views.'},
  {id:'ellora', name:'Ellora: Lesser-known Caves', lat:20.026, lng:75.179, tags:['heritage'], where:'Ellora', teaser:'Quiet caverns beyond Kailasa.'},
  {id:'ajanta', name:'Ajanta Scenic Viewpoints', lat:20.551, lng:75.703, tags:['photogenic','heritage'], where:'Ajanta', teaser:'Forest-framed canyon vistas.'},
  {id:'pitalkhora', name:'Pitalkhora Caves', lat:21.092, lng:74.716, tags:['heritage','nature'], where:'Satpura', teaser:'Monasteries + seasonal falls.'},
  {id:'gautala', name:'Gautala Wildlife Sanctuary', lat:20.423, lng:75.466, tags:['nature'], where:'Kannad', teaser:'Plateau forests, birdlife.'},
];

export const GET: APIRoute = async ({ request }) => {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  });

  const url = import.meta.env.SUPABASE_URL as string | undefined;
  const key = (import.meta.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_ANON_KEY) as string | undefined;

  // If Supabase is not configured, serve fallback dataset
  if (!url || !key) {
    return new Response(JSON.stringify({ source: 'fallback', data: FALLBACK }), { headers, status: 200 });
  }

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    // Try plural table first, then singular as a fallback
    async function fetchFrom(table: string) {
      return supabase
        .from(table)
        .select('id,name,lat,lng,where,tags,teaser,image_url,published')
        .eq('published', true)
        .limit(500);
    }

    let { data, error } = await fetchFrom('gems');
    if (error || !data || data.length === 0) {
      const alt = await fetchFrom('gem');
      data = alt.data as any;
      error = alt.error as any;
    }

    if (error) throw error;
    const rows = (data || []) as GemRow[];
    return new Response(JSON.stringify({ source: 'supabase', data: rows }), { headers, status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ source: 'error-fallback', data: FALLBACK }), { headers, status: 200 });
  }
};
