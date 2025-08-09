import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import netlify from '@astrojs/netlify' // <— add

import { fileURLToPath } from 'url'

export default defineConfig({
  site: 'https://www.axiscabs.com',
  integrations: [tailwind({ applyBaseStyles: true })],
  adapter: netlify(),               // <— add (see step 2)
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // <— add
      },
    },
  },
})
