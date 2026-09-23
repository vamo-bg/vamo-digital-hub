import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://vamo.bg',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // Страница с `noindex` няма работа в sitemap: това са две противоречиви
      // инструкции към Google и Search Console ги отчита като грешки.
      // Правните страници са с noindex, докато текстът им чака юрист.
      //
      // Списъкът се проверява след билда от `scripts/check-sitemap.mjs`, който
      // сравнява готовите страници със sitemap-а и спира деплоя при разминаване.
      filter: (page) =>
        ![
          '/obshti-usloviya/',
          '/politika-za-poveritelnost/',
          '/biskvitki/',
        ].some((path) => page.endsWith(path)),
    }),
  ],
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
