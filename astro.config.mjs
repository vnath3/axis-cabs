import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';
import netlify from '@astrojs/netlify'; // ✅ NEW unified adapter

export default defineConfig({
  site: 'https://axiscabs.com',
  output: 'server',                // API/SSR
  adapter: netlify({ mode: 'functions' }), // ✅ replace deprecated '@astrojs/netlify/functions'
  integrations: [tailwind({ applyBaseStyles: true })],
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
