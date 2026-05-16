import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LANGS = new Set(['en', 'fr', 'nl', 'es']);
const DIRECTUS_URL = 'http://cms.rodruma.com';

async function fetchCv(fileId, lang) {
  const res = await fetch(`${DIRECTUS_URL}/assets/${fileId}`);
  if (!res.ok) throw new Error(`CV download failed (${lang}): ${res.status}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(resolve(__dirname, `../public/cv-${lang}.pdf`), Buffer.from(buffer));
  console.log(`✓ public/cv-${lang}.pdf`);
}

async function fetchSiteSettings() {
  const fields = [
    'email',
    'availability_open',
    'translations.languages_code',
    'translations.cv',
    'translations.location',
    'translations.availability_label',
    'translations.availability_from',
    'translations.availability_description',
  ].join(',');

  const res = await fetch(`${DIRECTUS_URL}/items/site_settings?fields=${fields}`);

  if (!res.ok) {
    throw new Error(`Directus responded ${res.status}: ${res.statusText}`);
  }

  const { data } = await res.json();

  const settings = {
    email: data.email,
    availability_open: data.availability_open,
  };

  const cvFiles = {};

  for (const t of data.translations ?? []) {
    const raw = typeof t.languages_code === 'string' ? t.languages_code : t.languages_code?.code;
    const code = raw?.split('-')[0];
    if (LANGS.has(code)) {
      if (t.cv) cvFiles[code] = t.cv;
      settings[code] = {
        cv: t.cv ? `/cv-${code}.pdf` : null,
        location: t.location ?? '',
        availability_label: t.availability_label ?? '',
        availability_from: t.availability_from ?? '',
        availability_description: t.availability_description ?? '',
      };
    }
  }

  return { settings, cvFiles };
}

function normalizeLangCode(languages_code) {
  const raw = typeof languages_code === 'string' ? languages_code : languages_code?.code;
  return raw?.split('-')[0];
}

function buildAboutBlocks(t) {
  const blocks = [];
  if (t.headline_title)          blocks.push({ type: 'headline', data: { title: t.headline_title, subtitle: t.headline_subtitle ?? null } });
  if (t.bio_content)             blocks.push({ type: 'bio',      data: { content: t.bio_content } });
  if (t.facts_items?.length)     blocks.push({ type: 'facts',    data: { items: t.facts_items } });
  if (t.cards_items?.length)     blocks.push({ type: 'cards',    data: { cols: t.cards_cols ?? 4, items: t.cards_items } });
  if (t.timeline_items?.length)  blocks.push({ type: 'timeline', data: { items: t.timeline_items } });
  if (t.current_columns?.length) blocks.push({ type: 'currents', data: { columns: t.current_columns } });
  if (t.quote_text)              blocks.push({ type: 'quote',    data: { text: t.quote_text, attribution: t.quote_attribution ?? null } });
  if (t.cta_text)                blocks.push({ type: 'cta',      data: { text: t.cta_text } });
  return blocks;
}

async function fetchAboutBlocks() {
  const fields = [
    'translations.languages_code',
    'translations.headline_title',
    'translations.headline_subtitle',
    'translations.bio_content',
    'translations.facts_items',
    'translations.cards_cols',
    'translations.cards_items',
    'translations.timeline_items',
    'translations.current_columns',
    'translations.quote_text',
    'translations.quote_attribution',
    'translations.cta_text',
  ].join(',');

  const res = await fetch(`${DIRECTUS_URL}/items/about?fields=${fields}`);
  if (!res.ok) throw new Error(`Directus responded ${res.status}: ${res.statusText}`);

  const { data } = await res.json();
  const result = Object.fromEntries([...LANGS].map(l => [l, []]));

  for (const t of data.translations ?? []) {
    const code = normalizeLangCode(t.languages_code);
    if (!LANGS.has(code)) continue;
    result[code] = buildAboutBlocks(t);
  }

  return result;
}

async function main() {
  const outDir = resolve(__dirname, '../public/data');
  const outPath = resolve(outDir, 'site-settings.json');

  console.log(`Fetching from ${DIRECTUS_URL}...`);

  try {
    const { settings, cvFiles } = await fetchSiteSettings();
    mkdirSync(outDir, { recursive: true });
    writeFileSync(outPath, JSON.stringify(settings, null, 2));
    console.log('✓ public/data/site-settings.json');

    const aboutBlocks = await fetchAboutBlocks();
    writeFileSync(resolve(outDir, 'about-blocks.json'), JSON.stringify(aboutBlocks, null, 2));
    console.log('✓ public/data/about-blocks.json');

    for (const [lang, fileId] of Object.entries(cvFiles)) {
      await fetchCv(fileId, lang);
    }
  } catch (err) {
    if (existsSync(outPath)) {
      console.warn(`⚠  Directus unreachable (${err.message}) — using cached files`);
    } else {
      console.error(`✗ Prefetch failed: ${err.message}`);
      process.exit(1);
    }
  }
}

await main();
