import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import netlify from '@astrojs/netlify'
import { fileURLToPath } from 'node:url' // ensure 'node:url'

export default defineConfig({
  site: 'https://www.axiscabs.com',
  integrations: [tailwind({ applyBaseStyles: true })],
  adapter: netlify(),
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
})
