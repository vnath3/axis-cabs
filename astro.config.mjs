import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';
import netlify from '@astrojs/netlify/functions'; // ✅ Netlify Functions adapter

export default defineConfig({
  site: 'https://axiscabs.com',
  output: 'server',               // ✅ needed for API routes/SSR
  adapter: netlify(),             // ✅ compile /src/pages/api/* into Netlify Functions
  integrations: [tailwind({ applyBaseStyles: true })],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
