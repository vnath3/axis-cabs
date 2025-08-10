import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
// site comes from astro.config.mjs -> site: 'https://axiscabs.com'
  const base = (site ?? new URL('/', 'https://axiscabs.com')).toString().replace(/\/$/, '');
  const body = [
'User-agent: *',
'Allow: /',
'',
`Sitemap: ${base}/sitemap.xml`,
''
].join('\n');

return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};


//import type { APIRoute } from 'astro';
//
//export const GET: APIRoute = () => {
//// If you ever want to block staging, add a condition for *.netlify.app here.
//  const body = [
//'User-agent: *',
//'Allow: /',
//'',
//'Sitemap: https://axis-cabs.netlify.app/sitemap.xml',
//    ''
//].join('\n');
//
//return new Response(body, {
//headers: { 'Content-Type': 'text/plain; charset=utf-8' }
//});
//};
