import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
// If you ever want to block staging, add a condition for *.netlify.app here.
  const body = [
'User-agent: *',
'Allow: /',
'',
'Sitemap: https://axis-cabs.netlify.app/sitemap.xml',
    ''
].join('\n');

return new Response(body, {
headers: { 'Content-Type': 'text/plain; charset=utf-8' }
});
};
