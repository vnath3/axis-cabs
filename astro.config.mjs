import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://axiscabs.com',
  output: 'static', // ← pre-render everything
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
