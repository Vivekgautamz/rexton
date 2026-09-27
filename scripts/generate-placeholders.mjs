/**
 * Generates original SVG watch illustrations for seed data and placeholders.
 * Run: node scripts/generate-placeholders.mjs
 *
 * Everything REXTON ships is drawn here from scratch — no third-party
 * product photography is used.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/images/products");
mkdirSync(outDir, { recursive: true });

const dials = [
  { id: "onyx", dial: "#111110", ring: "#1c1c1a", accent: "#e8e4d9", hand: "#f4f1e8" },
  { id: "silver", dial: "#e9e8e4", ring: "#d5d3cc", accent: "#3a3a36", hand: "#1a1a18" },
  { id: "champagne", dial: "#e7dcc4", ring: "#d8caab", accent: "#4a4130", hand: "#241f16" },
  { id: "midnight", dial: "#16233c", ring: "#1e2f4f", accent: "#d9cfae", hand: "#f2ede0" },
  { id: "ivory", dial: "#f6f3ec", ring: "#e7e2d6", accent: "#3c3a34", hand: "#16150f" },
  { id: "slate", dial: "#4c5157", ring: "#3d4247", accent: "#e5e1d6", hand: "#fbf8f0" },
];

const svg = ({ dial, ring, accent, hand }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img">
  <defs>
    <linearGradient id="case" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f2f0ea"/>
      <stop offset="38%" stop-color="#b9b5aa"/>
      <stop offset="62%" stop-color="#8f8b81"/>
      <stop offset="100%" stop-color="#dedbd3"/>
    </linearGradient>
    <linearGradient id="strap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2b2926"/>
      <stop offset="100%" stop-color="#161513"/>
    </linearGradient>
    <radialGradient id="glass" cx="30%" cy="22%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.34"/>
      <stop offset="46%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="800" height="1000" fill="#f7f6f3"/>

  <!-- straps -->
  <path d="M310 250 h180 v-190 a30 30 0 0 0 -30 -30 h-120 a30 30 0 0 0 -30 30 z" fill="url(#strap)"/>
  <path d="M310 750 h180 v190 a30 30 0 0 1 -30 30 h-120 a30 30 0 0 1 -30 -30 z" fill="url(#strap)"/>
  <g stroke="#3a3835" stroke-width="2" stroke-dasharray="8 10" opacity="0.75">
    <line x1="330" y1="34" x2="330" y2="250"/>
    <line x1="470" y1="34" x2="470" y2="250"/>
    <line x1="330" y1="750" x2="330" y2="966"/>
    <line x1="470" y1="750" x2="470" y2="966"/>
  </g>

  <!-- crown -->
  <rect x="612" y="480" width="46" height="40" rx="8" fill="#9a968c"/>
  <rect x="640" y="486" width="16" height="28" rx="5" fill="#c8c4b9"/>

  <!-- case -->
  <circle cx="400" cy="500" r="234" fill="url(#case)"/>
  <circle cx="400" cy="500" r="212" fill="${ring}"/>
  <circle cx="400" cy="500" r="196" fill="${dial}"/>

  <!-- minute track -->
  <g stroke="${accent}" stroke-width="2" opacity="0.6">
    ${Array.from({ length: 60 })
      .map((_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const r1 = i % 5 === 0 ? 164 : 176;
        const x1 = 400 + Math.sin(a) * r1;
        const y1 = 500 - Math.cos(a) * r1;
        const x2 = 400 + Math.sin(a) * 186;
        const y2 = 500 - Math.cos(a) * 186;
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
      })
      .join("")}
  </g>

  <!-- hour markers -->
  <g fill="${accent}">
    ${Array.from({ length: 12 })
      .map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x = 400 + Math.sin(a) * 138;
        const y = 500 - Math.cos(a) * 138;
        const w = i % 3 === 0 ? 16 : 9;
        const h = i % 3 === 0 ? 34 : 24;
        return `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${w}" height="${h}" rx="3" transform="rotate(${i * 30} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
      })
      .join("")}
  </g>

  <!-- sub dial -->
  <circle cx="400" cy="596" r="56" fill="${ring}" opacity="0.55"/>
  <circle cx="400" cy="596" r="48" fill="${dial}"/>
  <g stroke="${accent}" stroke-width="2" opacity="0.75">
    <line x1="400" y1="556" x2="400" y2="566"/>
    <line x1="440" y1="596" x2="430" y2="596"/>
    <line x1="400" y1="636" x2="400" y2="626"/>
    <line x1="360" y1="596" x2="370" y2="596"/>
  </g>
  <line x1="400" y1="596" x2="424" y2="578" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>

  <!-- hands -->
  <g stroke-linecap="round">
    <line x1="400" y1="500" x2="400" y2="352" stroke="${hand}" stroke-width="13"/>
    <line x1="400" y1="500" x2="516" y2="438" stroke="${hand}" stroke-width="9"/>
    <line x1="400" y1="500" x2="332" y2="628" stroke="${accent}" stroke-width="4"/>
  </g>
  <circle cx="400" cy="500" r="13" fill="${accent}"/>
  <circle cx="400" cy="500" r="5" fill="${dial}"/>

  <!-- brand text -->
  <text x="400" y="418" text-anchor="middle" fill="${accent}" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="9">REXTON</text>
  <text x="400" y="452" text-anchor="middle" fill="${accent}" font-family="Helvetica, Arial, sans-serif" font-size="13" letter-spacing="5" opacity="0.75">SWISS TIMELESS ROOT</text>

  <!-- sapphire reflection -->
  <circle cx="400" cy="500" r="196" fill="url(#glass)"/>
  <circle cx="400" cy="500" r="212" fill="none" stroke="#000" stroke-opacity="0.08" stroke-width="3"/>
</svg>`;

for (const dial of dials) {
  writeFileSync(resolve(outDir, `watch-${dial.id}.svg`), svg(dial));
}

writeFileSync(
  resolve(root, "public/images/placeholder-watch.svg"),
  svg(dials[0])
);

console.log(`Generated ${dials.length + 1} images in public/images`);
