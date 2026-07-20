import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://vamo.bg',
  output: 'static',
  integrations: [mdx(), sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      PUBLIC_SITE_NAME: envField.string({
        context: 'client',
        access: 'public',
        default: 'VAMO',
      }),
    },
  },
});
