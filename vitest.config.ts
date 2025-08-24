import { defineConfig } from 'vitest/config';
import astro from '@astrojs/vite-plugin-astro';

export default defineConfig({
  plugins: [astro()],
  test: {
    environment: 'jsdom'
  }
});
