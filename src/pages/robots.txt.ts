import type { APIRoute } from 'astro';

function baseUrl(site?: URL): string {
  const env = process.env.SITE || process.env.URL || '';
  return (env || site?.toString() || 'https://axiscabs.com').replace(/\/$/, '');
}

export const GET: APIRoute = ({ site }) => {
  const base = baseUrl(site);
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

