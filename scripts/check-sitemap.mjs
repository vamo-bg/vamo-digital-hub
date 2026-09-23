#!/usr/bin/env node
/**
 * Проверява sitemap-а срещу готовия билд.
 *
 * Страница с `noindex` в sitemap е противоречива инструкция: файлът казва на
 * Google „индексирай това", а самата страница казва обратното. Search Console
 * го отчита като грешка и отчетът започва с червени редове.
 *
 * Филтърът в `astro.config.mjs` изключва правните страници поименно, но
 * `noindex` може да се появи и другаде — страница става чернова и се скрива,
 * без някой да се сети за sitemap-а. Затова тук се сравнява готовият изход, а
 * не намерението.
 *
 * Пуска се след билда и връща ненулев код при разминаване, за да спре деплоя.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SITE = 'https://vamo.bg';

/** Всички index.html файлове в билда, като пътища от корена на сайта. */
async function collectPages(dir, pages = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectPages(full, pages);
    } else if (entry.name.endsWith('.html')) {
      const path = '/' + relative(DIST, full).replace(/index\.html$/, '');
      pages.push({ path, file: full });
    }
  }
  return pages;
}

const sitemapFiles = (await readdir(DIST)).filter((f) => /^sitemap-\d+\.xml$/.test(f));
if (sitemapFiles.length === 0) {
  console.error('✗ Няма sitemap файл в dist/. Билдът не е завършил както трябва.');
  process.exit(1);
}

const urls = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(join(DIST, file), 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    urls.add(match[1].replace(SITE, ''));
  }
}

const pages = await collectPages(DIST);
const problems = [];
let noindexCount = 0;

for (const { path, file } of pages) {
  const html = await readFile(file, 'utf8');
  const isNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);
  if (isNoindex) {
    noindexCount += 1;
    if (urls.has(path)) problems.push(path);
  }
}

console.log(`Sitemap: ${urls.size} адреса`);
console.log(`Билд:    ${pages.length} страници, от тях ${noindexCount} с noindex`);

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} страници са едновременно в sitemap и с noindex:\n`);
  for (const path of problems) console.error(`    ${path}`);
  console.error(
    '\nИли махни noindex от страницата, или я изключи от филтъра в astro.config.mjs.',
  );
  process.exit(1);
}

console.log('✓ Нито една страница с noindex не е в sitemap.');
