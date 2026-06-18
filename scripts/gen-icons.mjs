import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDir = resolve(root, 'public/icons');

const OLIVE = '#6b7d3a';
const INK = '#33321c';
const BRICK = '#bf4a2e';

// Dumbbell drawn in a 64x64 coordinate space.
function dumbbell(strokeWidth = 3.5) {
  return `
    <g stroke="${INK}" stroke-width="${strokeWidth}" stroke-linecap="round">
      <rect x="14" y="27" width="8" height="10" rx="2" fill="${BRICK}"/>
      <rect x="42" y="27" width="8" height="10" rx="2" fill="${BRICK}"/>
      <line x1="22" y1="32" x2="42" y2="32"/>
    </g>`;
}

// Rounded-corner icon: dumbbell fills most of the tile.
function standardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="${OLIVE}"/>
    ${dumbbell()}
  </svg>`;
}

// Maskable icon: full-bleed background, dumbbell scaled into the inner
// safe zone (~60%) so platform masks (circle/squircle) never crop it.
function maskableSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${OLIVE}"/>
    <g transform="translate(32 32) scale(0.62) translate(-32 -32)">
      ${dumbbell(4.2)}
    </g>
  </svg>`;
}

async function render(svg, size, file) {
  const out = resolve(iconsDir, file);
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
  console.log(`wrote ${file} (${size}x${size})`);
}

await mkdir(iconsDir, { recursive: true });
await render(standardSvg(), 192, 'icon-192.png');
await render(standardSvg(), 512, 'icon-512.png');
await render(maskableSvg(), 512, 'icon-maskable-512.png');
await render(standardSvg(), 180, 'apple-touch-icon.png');
