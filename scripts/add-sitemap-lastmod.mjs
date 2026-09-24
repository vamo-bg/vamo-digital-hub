#!/usr/bin/env node
/**
 * Добавя `<lastmod>` в sitemap-а — само за адреси, за които наистина знаем
 * дата на промяна.
 *
 * Единствено блогът пази `pubDate`/`updatedDate` в схемата си (виж
 * `src/content.config.ts`). Услуги, портфолио, клиенти и т.н. нямат такова
 * поле — измислена дата подвежда Google повече, отколкото липсваща, затова
 * тези адреси остават без `lastmod`.
 *
 * Файловата mtime нарочно не се ползва: `actions/checkout` нулира mtime на
 * всеки файл при всеки build, което би дало на всяка страница „последна
 * промяна днес" — грешно точно както измислена дата.
 *
 * Пуска се след билда, преди `check-sitemap.mjs`.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const BLOG_DIR = 'src/content/blog';
const SITE = 'https://vamo.bg';

function extractField(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*"?([^"\\n]+)"?\\s*$`, 'm'));
  return match ? match[1].trim() : undefined;
}

const files = (await readdir(BLOG_DIR)).filter((f) => /\.mdx?$/.test(f));
const lastmodByUrl = new Map();
let latest;

for (const file of files) {
  const raw = await readFile(join(BLOG_DIR, file), 'utf8');
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) continue;
  const frontmatter = frontmatterMatch[1];

  if (extractField(frontmatter, 'draft') === 'true') continue;

  const pubDate = extractField(frontmatter, 'pubDate');
  const updatedDate = extractField(frontmatter, 'updatedDate');
  const dateStr = updatedDate ?? pubDate;
  if (!dateStr) continue;

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) continue;

  const slug = file.replace(/\.mdx?$/, '');
  lastmodByUrl.set(`${SITE}/blog/${slug}/`, date);
  if (!latest || date > latest) latest = date;
}

if (latest) lastmodByUrl.set(`${SITE}/blog/`, latest);

const sitemapFiles = (await readdir(DIST)).filter((f) => /^sitemap-\d+\.xml$/.test(f));
let updated = 0;

for (const file of sitemapFiles) {
  const path = join(DIST, file);
  let xml = await readFile(path, 'utf8');

  xml = xml.replace(/<url><loc>([^<]+)<\/loc><\/url>/g, (whole, url) => {
    const date = lastmodByUrl.get(url);
    if (!date) return whole;
    updated += 1;
    return `<url><loc>${url}</loc><lastmod>${date.toISOString()}</lastmod></url>`;
  });

  await writeFile(path, xml);
}

console.log(`✓ ${updated} адреса в sitemap-а получиха lastmod (от ${lastmodByUrl.size} с известна дата).`);
