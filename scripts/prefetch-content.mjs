import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LANGS = new Set(['en', 'fr', 'nl', 'es']);
const DIRECTUS_URL = 'http://cms.rodruma.com';

async function fetchSiteSettings() {
  const fields = [
    'email',
    'availability_open',
    'translations.languages_code',
    'translations.location',
    'translations.availability_label',
    'translations.availability_from',
    'translations.availability_description',
  ].join(',');

  const res = await fetch(`${DIRECTUS_URL}/items/site_settings?fields=${fields}`);

  if (!res.ok) {
    throw new Error(`Directus responded ${res.status}: ${res.statusText}`);
  }

  const {data} = await res.json();

  const result = {
    email: data.email,
    availability_open: data.availability_open,
  };

  for (const t of data.translations ?? []) {
    const raw = typeof t.languages_code === 'string' ? t.languages_code : t.languages_code?.code;
    const code = raw?.split('-')[0];
    if (LANGS.has(code)) {
      result[code] = {
        location: t.location ?? '',
        availability_label: t.availability_label ?? '',
        availability_from: t.availability_from ?? '',
        availability_description: t.availability_description ?? '',
      };
    }
  }

  return result;
}

async function main() {
  const outDir = resolve(__dirname, '../public/data');
  const outPath = resolve(outDir, 'site-settings.json');

  console.log(`Fetching from ${DIRECTUS_URL}...`);

  try {
    const siteSettings = await fetchSiteSettings();
    mkdirSync(outDir, { recursive: true });
    writeFileSync(outPath, JSON.stringify(siteSettings, null, 2));
    console.log('✓ public/data/site-settings.json');
  } catch (err) {
    if (existsSync(outPath)) {
      console.warn(`⚠  Directus unreachable (${err.message}) — using cached site-settings.json`);
    } else {
      console.error(`✗ Prefetch failed: ${err.message}`);
      process.exit(1);
    }
  }
}

await main();
