// import { defineConfig } from 'astro/config';
// import tailwind from '@astrojs/tailwind';
// import netlify from '@astrojs/netlify/functions'; // <— ensure installed
//
// export default defineConfig({
//   site: 'https://axiscabs.com',        // <— drives sitemap URLs and canonicals
//   output: 'server',                    // <— SSR so dynamic routes work
//   adapter: netlify(),                  // <— generate Netlify Function for SSR
//   integrations: [tailwind({ applyBaseStyles: true })],
//   prefetch: true,
// });

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  output: 'server',
  integrations: [tailwind({ applyBaseStyles: true })],
  adapter: netlify(),
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
