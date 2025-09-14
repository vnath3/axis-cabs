import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const posts = await import.meta.glob('../*.md', { eager: true }) as any;
  const base = (site?.toString() || 'https://axiscabs.com').replace(/\/$/, '');
  const items = Object.values(posts)
    .map((m: any) => ({
      url: base + (m.url || ''),
      title: m.frontmatter?.title || '',
      description: m.frontmatter?.description || '',
      date: m.frontmatter?.pubDate || new Date().toISOString(),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Axis Cabs Blog</title>
    <link>${base}/blog</link>
    <description>Travel tips, destination guides, and route planning insights.</description>
    ${items
      .map(
        (i) => `
    <item>
      <title><![CDATA[${i.title}]]></title>
      <link>${i.url}</link>
      <guid>${i.url}</guid>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
      <description><![CDATA[${i.description}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};

