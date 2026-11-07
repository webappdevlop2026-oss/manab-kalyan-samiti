import { copyFile, cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = join(root, 'dist');
const photos = join(root, 'photos');
const imageTypes = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const banglaDigits = '০১২৩৪৫৬৭৮৯';
const formatYear = new Intl.NumberFormat('bn-IN', { useGrouping: false });

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

async function photoFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.filter(entry => entry.isFile() && imageTypes.has(extname(entry.name).toLowerCase()))
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right, 'bn', { numeric: true }));
}

async function buildPhotos(folder = '') {
  const destination = join(output, 'photos', folder);
  const files = await photoFiles(join(photos, folder));
  if (!files.length) return '';

  await mkdir(destination, { recursive: true });
  const cards = await Promise.all(files.map(async (file) => {
    await copyFile(join(photos, folder, file), join(destination, file));
    const url = ['photos', ...(folder ? [folder] : []), file].map(encodeURIComponent).join('/');
    const title = escapeHtml(file.slice(0, -extname(file).length).replace(/[_-]+/g, ' ').trim() || 'পূজার ছবি');
    return `<figure class="album-photo">
              <a class="photo-link" data-photo href="${url}" aria-label="${title} বড় করে দেখুন">
                <img src="${url}" loading="lazy" decoding="async" alt="${title}">
                <span class="photo-expand" aria-hidden="true"><svg class="icon"><use href="#icon-expand"/></svg></span>
              </a>
              <figcaption>${title}</figcaption>
            </figure>`;
  }));
  return cards.join('\n');
}

const source = await readFile(join(root, 'index.html'), 'utf8');
const yearMarker = '<!-- puja-photo-years -->';
const undatedMarker = '<!-- puja-photo-undated -->';
if (!source.includes(yearMarker) || !source.includes(undatedMarker)) {
  throw new Error('The photo album insertion points are missing from index.html.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output);
await Promise.all([
  cp(join(root, 'assets'), join(output, 'assets'), { recursive: true }),
  ...['site.js', 'styles.css'].map(file => copyFile(join(root, file), join(output, file))),
]);

const yearGroups = new Map();
const folders = await readdir(photos, { withFileTypes: true });
for (const folder of folders) {
  if (!folder.isDirectory()) continue;
  const year = folder.name.replace(/[০-৯]/g, digit => String(banglaDigits.indexOf(digit)));
  if (!/^[1-9]\d{3}$/.test(year)) continue;

  const cards = await buildPhotos(folder.name);
  if (cards) yearGroups.set(year, [...(yearGroups.get(year) || []), cards]);
}

const years = [...yearGroups.keys()].sort().reverse().map(year => `<div class="album-group">
          <h3><time datetime="${year}">${formatYear.format(Number(year))}</time> সালের পূজা</h3>
          <div class="album-grid">
            ${yearGroups.get(year).join('\n')}
          </div>
        </div>`).join('\n');
const undated = await buildPhotos();
await writeFile(join(output, 'index.html'), source.replace(yearMarker, () => years)
  .replace(undatedMarker, () => undated));
