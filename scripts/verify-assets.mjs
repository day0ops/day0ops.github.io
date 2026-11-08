// scripts/verify-assets.mjs
import sharp from 'sharp';
import { existsSync, statSync } from 'fs';
import { resolve } from 'path';

const PUBLIC = resolve('public');

const checks = [
  { file: 'favicon.svg', minBytes: 100 },
  { file: 'favicon-32x32.png', width: 32, height: 32, opaqueCenter: true },
  { file: 'apple-touch-icon.png', width: 180, height: 180, opaqueCenter: true },
  { file: 'github-avatar.png', width: 400, height: 400, opaqueCenter: true },
  { file: 'favicon.ico', minBytes: 100 },
  { file: 'og-image.png', width: 1200, height: 630, opaqueCenter: true },
];

let pass = 0,
  fail = 0;

for (const check of checks) {
  const path = resolve(PUBLIC, check.file);
  if (!existsSync(path)) {
    console.error(`  FAIL  ${check.file} — file missing`);
    fail++;
    continue;
  }
  if (check.minBytes !== undefined) {
    const { size } = statSync(path);
    if (size < check.minBytes) {
      console.error(`  FAIL  ${check.file} — too small (${size} bytes)`);
      fail++;
      continue;
    }
    console.log(`  PASS  ${check.file}`);
    pass++;
    continue;
  }
  const meta = await sharp(path).metadata();
  if (meta.width !== check.width || meta.height !== check.height) {
    console.error(
      `  FAIL  ${check.file} — expected ${check.width}×${check.height}, got ${meta.width}×${meta.height}`,
    );
    fail++;
    continue;
  }
  if (check.opaqueCenter) {
    // Sample the center pixel to confirm background is rendered (not transparent)
    const cx = Math.floor(meta.width / 2);
    const cy = Math.floor(meta.height / 2);
    const { data, info } = await sharp(path)
      .extract({ left: cx, top: cy, width: 1, height: 1 })
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (info.channels === 4 && data[3] < 255) {
      console.error(
        `  FAIL  ${check.file} — center pixel is transparent (background not rendered)`,
      );
      fail++;
      continue;
    }
  }
  console.log(`  PASS  ${check.file}`);
  pass++;
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
