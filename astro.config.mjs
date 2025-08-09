import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.axiscabs.com',
  integrations: [tailwind({ applyBaseStyles: true })],
  prefetch: true,
});