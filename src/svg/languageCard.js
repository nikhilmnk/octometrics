import { escapeSVG } from '../utils/sanitize.js';

// Distinct palette for language colours (cycles if more langs than colours)
const LANG_COLORS = [
  '#58a6ff', '#ff7b72', '#d2a8ff', '#ffa657', '#7ee787',
  '#f778ba', '#79c0ff', '#e3b341', '#56d364', '#db6d28',
  '#a5d6ff', '#ffdcd7', '#ddf4ff', '#fff8c5', '#f0f6fc',
];

const getLangColor = (i) => LANG_COLORS[i % LANG_COLORS.length];

// ── BAR LAYOUT ────────────────────────────────────────────────────────────────
const barLayout = (langs, theme, W) => {
  const BAR_W = W - 90;
  const ROW_H = 38;
  const HEADER_H = 60;
  const svgH = HEADER_H + langs.length * ROW_H + 16;

  const rows = langs.map(([lang, pct], i) => {
    const filled = Math.max(2, (pct / 100) * BAR_W);
    const y = HEADER_H + i * ROW_H;
    const color = getLangColor(i);
    return `
      <rect x="20" y="${y + 4}" width="8" height="8" rx="2" fill="${color}"/>
      <text x="34" y="${y + 13}" font-family="Arial,sans-serif" font-size="11" fill="${theme.subtextColor || theme.textColor}">${escapeSVG(lang)}</text>
      <text x="${W - 10}" y="${y + 13}" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="${theme.accentColor}" text-anchor="end">${pct}%</text>
      <rect x="20" y="${y + 20}" width="${BAR_W}" height="8" rx="4" fill="${theme.borderColor}" opacity="0.5"/>
      <rect x="20" y="${y + 20}" width="${filled}" height="8" rx="4" fill="${color}"/>
    `;
  }).join('');

  return { svgH, body: rows };
};

// ── CIRCLE LAYOUT ─────────────────────────────────────────────────────────────
const circleLayout = (langs, theme, W) => {
  const COLS = 3;
  const CELL_W = W / COLS;
  const CELL_H = 90;
  const HEADER_H = 60;
  const R = 24;
  const STROKE = 5;
  const CIRC = 2 * Math.PI * R;
  const rows = Math.ceil(langs.length / COLS);
  const svgH = HEADER_H + rows * CELL_H + 16;

  const circles = langs.map(([lang, pct], i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const cx = CELL_W * col + CELL_W / 2;
    const cy = HEADER_H + row * CELL_H + R + 12;
    const dash = (pct / 100) * CIRC;
    const gap = CIRC - dash;
    const color = getLangColor(i);
    return `
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${theme.borderColor}" stroke-width="${STROKE}" opacity="0.5"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${color}" stroke-width="${STROKE}"
        stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
        stroke-dashoffset="${(CIRC / 4).toFixed(2)}"
        stroke-linecap="round"/>
      <text x="${cx}" y="${cy + 4}" font-family="Arial,sans-serif" font-size="10" font-weight="bold"
        fill="${theme.accentColor}" text-anchor="middle">${pct}%</text>
      <text x="${cx}" y="${cy + R + 16}" font-family="Arial,sans-serif" font-size="10"
        fill="${theme.subtextColor || theme.textColor}" text-anchor="middle">${escapeSVG(lang)}</text>
    `;
  }).join('');

  return { svgH, body: circles };
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
export const generateLanguageCard = (languages, theme, layout = 'bar', view = 'top') => {
  const W = 495;
  const bg = theme.background;
  const bdr = theme.borderColor;
  const txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const acc = theme.accentColor;
  const ico = theme.iconColor || theme.accentColor;

  const langs = Object.entries(languages).sort((a, b) => b[1] - a[1]);

  const { svgH, body } = layout === 'circle'
    ? circleLayout(langs, theme, W)
    : barLayout(langs, theme, W);

  const label = view === 'all' ? 'All Languages' : 'Top Languages';

  return `<svg width="${W}" height="${svgH}" viewBox="0 0 ${W} ${svgH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ico};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${bg};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="cc"><rect width="${W}" height="${svgH}" rx="12"/></clipPath>
  </defs>

  <!-- Card -->
  <rect width="${W}" height="${svgH}" rx="12" fill="${bg}" stroke="${bdr}" stroke-width="1.5"/>
  <rect clip-path="url(#cc)" x="0" y="0" width="${W}" height="55" fill="url(#hg)"/>

  <!-- Code icon -->
  <g transform="translate(20,16)">
    <path fill="${ico}" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" transform="scale(0) translate(0,0)"/>
    <path fill="${ico}" d="M8 3a1 1 0 000 2h1a1 1 0 000-2H8zM6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 000 2h3a1 1 0 000-2H7z"/>
    <rect x="0" y="0" width="16" height="16" rx="3" fill="none" stroke="${ico}" stroke-width="1.5"/>
  </g>

  <!-- Header -->
  <text x="44" y="27" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="${txt}">${label}</text>
  <text x="44" y="43" font-family="Arial,sans-serif" font-size="11" fill="${sub}">${langs.length} language${langs.length !== 1 ? 's' : ''} • ${layout === 'circle' ? 'Circular' : 'Bar'} view</text>

  <!-- Divider -->
  <line x1="16" y1="55" x2="${W - 16}" y2="55" stroke="${bdr}" stroke-width="1"/>

  ${body}
</svg>`;
};