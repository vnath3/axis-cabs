import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://axiscabs.com',
  output: 'server',           // enables /api/* on Netlify
  adapter: netlify(),         // modern adapter
  integrations: [tailwind({ applyBaseStyles: true })],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
