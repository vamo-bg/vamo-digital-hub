import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://vamo.bg',
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: {
    // По подразбиране е `_astro`. Името се вижда във всеки URL на снимка или
    // стил, затова го държим четимо. Файловете вътре запазват отпечатъка от
    // съдържанието си — от него зависи дали браузърът може да ги кешира
    // безсрочно, затова той остава.
    assets: 'assets',
  },
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
