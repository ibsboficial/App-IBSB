// ============================================================
// Gera os ícones PWA do IBSB (placeholder — sem logo oficial)
// Uso: npm run icons
// Dependência: pngjs (devDependency)
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/icons');

// Cores da marca
const C1 = { r: 47, g: 143, b: 230 }; // #2f8fe6
const C2 = { r: 15, g: 95, b: 176 };  // #0f5fb0
const WHITE = { r: 255, g: 255, b: 255 };
const GOLD = { r: 233, g: 179, b: 74 }; // #e9b34a

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (edge, d) => clamp01((edge - d) / 2 + 0.5); // borda suave ~2px

function lerp(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function roundedRectSdf(px, py, half, radius) {
  const qx = Math.abs(px) - (half - radius);
  const qy = Math.abs(py) - (half - radius);
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - radius;
}

function circleSdf(px, py, cx, cy, r) {
  return Math.hypot(px - cx, py - cy) - r;
}

function rectSdf(px, py, cx, cy, hw, hh) {
  const qx = Math.abs(px - cx) - hw;
  const qy = Math.abs(py - cy) - hh;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
}

function render(size, { maskable = false } = {}) {
  const png = new PNG({ width: size, height: size });
  const half = size / 2;
  const px = 1 / size; // passo normalizado

  // dimensões normalizadas [0,1]
  const crossHalf = 0.145; // meia espessura da cruz
  const goldCx = 0.76;
  const goldCy = 0.22;
  const goldR = 0.1;

  const shapeRadius = maskable ? 0 : 0.2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // coordenadas normalizadas centradas em 0.5
      const nx = (x + 0.5) / size;
      const ny = (y + 0.5) / size;
      const px2 = nx - 0.5;
      const py2 = ny - 0.5;

      let alpha = 1;
      let color;

      if (!maskable) {
        // cantos arredondados
        const dShape = roundedRectSdf(px2, py2, 0.5, shapeRadius);
        alpha = smooth(0, dShape * size / size);
        alpha = clamp01(smooth(0, dShape * size * 2)); // borda 0.5px
      }

      // fundo com gradiente diagonal
      const t = clamp01((nx + ny) / 2);
      color = lerp(C1, C2, t);

      // cruz branca (SDF da união de duas barras)
      const dCrossV = rectSdf(px2, py2, 0, 0, crossHalf, 0.5);
      const dCrossH = rectSdf(px2, py2, 0, 0, 0.5, crossHalf);
      const dCross = Math.min(dCrossV, dCrossH);

      // círculo dourado (destaque)
      const dGold = circleSdf(nx, ny, goldCx, goldCy, goldR);

      // composição com bordas suaves
      const crossA = clamp01(smooth(0, dCross * size * 2));
      const goldA = clamp01(smooth(0, dGold * size * 2));

      if (crossA > 0) {
        color = lerp(color, WHITE, crossA);
      }
      if (goldA > 0) {
        color = lerp(color, GOLD, goldA);
      }

      const idx = (size * y + x) << 2;
      png.data[idx] = color.r;
      png.data[idx + 1] = color.g;
      png.data[idx + 2] = color.b;
      png.data[idx + 3] = Math.round(255 * alpha);
    }
  }
  return png;
}

fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  ['icon-192.png', 192, {}],
  ['icon-512.png', 512, {}],
  ['maskable-512.png', 512, { maskable: true }],
  ['apple-touch-icon.png', 180, {}],
];

for (const [name, size, opts] of jobs) {
  const png = render(size, opts);
  fs.writeFileSync(path.join(OUT, name), PNG.sync.write(png));
  console.log(`Gerado: ${name} (${size}x${size})`);
}

console.log('Ícones gerados em public/icons/');
