import type { APIRoute } from 'astro';
import { routes } from '@/data/routes';
import { packages } from '@/data/packages';
import { gems } from '@/data/gems';

function baseUrl(site?: URL): string {
  const env = process.env.SITE || process.env.URL || '';
  return (env || site?.toString() || 'https://axiscabs.com').replace(/\/$/, '');
}

export const GET: APIRoute = ({ site }) => {
  const base = baseUrl(site);
  const pages = [
    '',
    ...routes.map((r) => `city-to-city/${r.slug}`),
    ...packages.map((p) => `packages/${p.slug}`),
    ...gems.map((g) => `hidden-gems/${g.slug}`),
  ];

  const urls = pages.map((p) => `<url><loc>${base}/${p}</loc></url>`).join('');
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls +
    '</urlset>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

