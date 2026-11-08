// scripts/generate-brand-assets.mjs
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import puppeteer from 'puppeteer';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PUBLIC = resolve(ROOT, 'public');

await mkdir(PUBLIC, { recursive: true });

const svgSource = await readFile(resolve(PUBLIC, 'favicon.svg'), 'utf8');

/**
 * Remove pulse ring circles (identified by data-role="pulse-ring").
 * Used for: favicon-32x32.png, apple-touch-icon.png, favicon.ico sizes.
 */
function stripPulseRings(svg) {
  // \s* before \/> handles optional whitespace before self-closing slash (e.g. " />")
  return svg.replace(/<circle[^>]*data-role="pulse-ring"[^>]*\s*\/>/g, '');
}

/**
 * Replace the SVG width and height attributes.
 * The viewBox stays "0 0 64 64"; librsvg scales the content to fill the new size.
 */
function setSVGDimensions(svg, w, h) {
  return svg.replace(/width="\d+"/, `width="${w}"`).replace(/height="\d+"/, `height="${h}"`);
}

/**
 * Replace the rx attribute on the background rect.
 * Used for github-avatar: rx="200" per spec. When applied to a viewBox of "0 0 64 64",
 * SVG clamps rx to half the element width (32 SVG units = 200px at 400px output),
 * producing a perfect circle.
 */
function setRx(svg, rx) {
  return svg.replace(/(<rect[^>]+rx=")[^"]*(")/g, `$1${rx}$2`);
}

// --- favicon-32x32.png (32×32, no pulse rings) ---
console.log('→ favicon-32x32.png');
await sharp(Buffer.from(stripPulseRings(setSVGDimensions(svgSource, 32, 32))))
  .resize(32, 32)
  .png()
  .toFile(resolve(PUBLIC, 'favicon-32x32.png'));

// --- apple-touch-icon.png (180×180, no pulse rings) ---
console.log('→ apple-touch-icon.png');
await sharp(Buffer.from(stripPulseRings(setSVGDimensions(svgSource, 180, 180))))
  .resize(180, 180)
  .png()
  .toFile(resolve(PUBLIC, 'apple-touch-icon.png'));

// --- github-avatar.png (400×400, circular, pulse rings included) ---
// rx="200" per spec — SVG clamps this to 50% of width (perfect circle) in the 64-unit viewBox
console.log('→ github-avatar.png');
await sharp(Buffer.from(setRx(setSVGDimensions(svgSource, 400, 400), 200)))
  .resize(400, 400)
  .png()
  .toFile(resolve(PUBLIC, 'github-avatar.png'));

// --- favicon.ico (16×16 + 32×32 multi-size, no pulse rings) ---
console.log('→ favicon.ico');
const [png16, png32] = await Promise.all([
  sharp(Buffer.from(stripPulseRings(setSVGDimensions(svgSource, 16, 16))))
    .resize(16, 16)
    .png()
    .toBuffer(),
  sharp(Buffer.from(stripPulseRings(setSVGDimensions(svgSource, 32, 32))))
    .resize(32, 32)
    .png()
    .toBuffer(),
]);
await writeFile(resolve(PUBLIC, 'favicon.ico'), await pngToIco([png16, png32]));

// --- og-image.png (1200×630, rendered via Puppeteer with Geist fonts) ---
console.log('→ og-image.png  (launching browser…)');
const svgMark = setSVGDimensions(svgSource, 120, 120);
const template = await readFile(resolve(__dirname, 'og-image-template.html'), 'utf8');
const html = template.replace('<!-- MARK -->', svgMark);

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: resolve(PUBLIC, 'og-image.png') });
} finally {
  await browser.close();
}

console.log('\nAll assets written to public/');
