import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// ✅ Use the FUNCTIONS adapter (Node runtime)
import netlify from '@astrojs/netlify/functions';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://axiscabs.com',      // for sitemap/canonicals
  output: 'server',                  // enable SSR
  adapter: netlify(),                // build Netlify Function for SSR
  integrations: [tailwind({ applyBaseStyles: true })],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});


// import { defineConfig } from 'astro/config';
// import tailwind from '@astrojs/tailwind';
// import netlify from '@astrojs/netlify';
// import { fileURLToPath } from 'node:url';
//
// export default defineConfig({
//   output: 'server',
//   integrations: [tailwind({ applyBaseStyles: true })],
//   adapter: netlify(),
//   vite: {
//     resolve: {
//       alias: {
//         '@': fileURLToPath(new URL('./src', import.meta.url)),
//       },
//     },
//   },
// });
