import { escapeSVG } from '../utils/sanitize.js';

// Format large numbers: 13647 → "13.6K", 500 → "500"
const fmt = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 1 : 2).replace(/\.?0+$/, '') + 'K';
  return String(n);
};

// Truncate text to maxChars, appending ellipsis if needed
const trunc = (str, max) => str.length > max ? str.slice(0, max - 1) + '…' : str;

// Split description into up to 2 lines of maxChars each
const wrapDesc = (str, max) => {
  if (str.length <= max) return [str, ''];
  // try to break at a word boundary
  const cut = str.slice(0, max);
  const spaceIdx = cut.lastIndexOf(' ');
  const line1 = spaceIdx > max * 0.5 ? cut.slice(0, spaceIdx) : cut;
  const rest = str.slice(line1.length).trim();
  const line2 = rest.length > max ? rest.slice(0, max - 1) + '…' : rest;
  return [line1, line2];
};

// Language colour dots (a small curated set matching GitHub's colours)
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Ruby: '#701516', Java: '#b07219', Go: '#00ADD8',
  Rust: '#dea584', C: '#555555', 'C++': '#f34b7d',
  'C#': '#178600', PHP: '#4F5D95', Swift: '#F05138',
  Kotlin: '#A97BFF', HTML: '#e34c26', CSS: '#563d7c',
  Shell: '#89e051', Dart: '#00B4AB', Scala: '#c22d40',
  R: '#198CE7', Vue: '#41b883', default: '#8b949e',
};
const langColor = (l) => LANG_COLORS[l] || LANG_COLORS.default;

// Compact star path (16×16 heroicon / octicon style)
const STAR_PATH = 'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z';
const FORK_PATH = 'M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z';

// ── CARD ──────────────────────────────────────────────────────────────────────
export const generateRepoCard = (repos, theme) => {
  const W = 495;
  const COLS = 2;
  const CELL_W = (W - 48) / COLS;   // 2-column grid with gaps
  const CELL_H = 122;
  const GAP = 12;
  const PAD = 16;
  const HEADER = 60;

  const bg = theme.background;
  const bdr = theme.borderColor;
  const txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const acc = theme.accentColor;
  const ico = theme.iconColor || theme.accentColor;

  const rows = Math.ceil(repos.length / COLS);
  const svgH = HEADER + rows * (CELL_H + GAP) + PAD;

  // approx chars that fit per line at the given font-size inside CELL_W
  const NAME_MAX = 22;   // 12px bold, after 24px icon offset
  const DESC_MAX = 34;   // 10px, full cell width minus padding

  const cards = repos.map((repo, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (CELL_W + GAP);
    const y = HEADER + row * (CELL_H + GAP);
    const name = trunc(repo.name, NAME_MAX);
    const [dl1, dl2] = wrapDesc(repo.description, DESC_MAX);
    const lc = repo.language ? langColor(repo.language) : null;

    // rows inside card:
    //  y+20  name
    //  y+36  desc line 1
    //  y+48  desc line 2 (if any)
    //  y+70  language dot
    //  y+88  ⭐ stars
    //  y+104 🍴 forks

    return `
      <!-- Repo card bg -->
      <rect x="${x}" y="${y}" width="${CELL_W}" height="${CELL_H}" rx="8"
        fill="${bg}" stroke="${bdr}" stroke-width="1"/>

      <!-- Repo icon + name -->
      <g transform="translate(${x + 10},${y + 8}) scale(0.75)">
        <path fill="${ico}" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
      </g>
      <text x="${x + 24}" y="${y + 20}" font-family="Arial,sans-serif" font-size="12"
        font-weight="bold" fill="${acc}">${escapeSVG(name)}</text>

      <!-- Description line 1 -->
      <text x="${x + 10}" y="${y + 36}" font-family="Arial,sans-serif" font-size="10"
        fill="${sub}">${escapeSVG(dl1)}</text>
      <!-- Description line 2 -->
      ${dl2 ? `<text x="${x + 10}" y="${y + 48}" font-family="Arial,sans-serif" font-size="10" fill="${sub}">${escapeSVG(dl2)}</text>` : ''}

      <!-- Language dot + name -->
      ${lc ? `
        <circle cx="${x + 15}" cy="${y + 68}" r="5" fill="${lc}"/>
        <text x="${x + 25}" y="${y + 72}" font-family="Arial,sans-serif" font-size="10" fill="${sub}">${escapeSVG(repo.language)}</text>
      ` : ''}

      <!-- Stars (own row) -->
      <g transform="translate(${x + 10},${y + 82}) scale(0.75)">
        <path fill="${sub}" d="${STAR_PATH}"/>
      </g>
      <text x="${x + 24}" y="${y + 92}" font-family="Arial,sans-serif"
        font-size="10" fill="${sub}">${fmt(repo.stars)} stars</text>

      <!-- Forks (own row) -->
      <g transform="translate(${x + 10},${y + 98}) scale(0.75)">
        <path fill="${sub}" d="${FORK_PATH}"/>
      </g>
      <text x="${x + 24}" y="${y + 108}" font-family="Arial,sans-serif"
        font-size="10" fill="${sub}">${fmt(repo.forks)} forks</text>

      <!-- Bottom border highlight -->
      <line x1="${x}" y1="${y + CELL_H - 1}" x2="${x + CELL_W}" y2="${y + CELL_H - 1}"
        stroke="${acc}" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
    `;
  }).join('');

  return `<svg width="${W}" height="${svgH}" viewBox="0 0 ${W} ${svgH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ico};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${bg};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="cc"><rect width="${W}" height="${svgH}" rx="12"/></clipPath>
  </defs>

  <!-- Card background -->
  <rect width="${W}" height="${svgH}" rx="12" fill="${bg}" stroke="${bdr}" stroke-width="1.5"/>
  <rect clip-path="url(#cc)" x="0" y="0" width="${W}" height="55" fill="url(#hg)"/>

  <!-- Repo stack icon -->
  <g transform="translate(20,15)">
    <rect x="0" y="2" width="18" height="14" rx="2" fill="none" stroke="${ico}" stroke-width="1.5"/>
    <rect x="2" y="0" width="14" height="2" rx="1" fill="${ico}" opacity="0.6"/>
    <line x1="4" y1="6"  x2="14" y2="6"  stroke="${ico}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="4" y1="9"  x2="14" y2="9"  stroke="${ico}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="4" y1="12" x2="10" y2="12" stroke="${ico}" stroke-width="1.2" stroke-linecap="round"/>
  </g>

  <!-- Header -->
  <text x="46" y="27" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="${txt}">Top Repositories</text>
  <text x="46" y="43" font-family="Arial,sans-serif" font-size="11" fill="${sub}">${repos.length} repositories • sorted by stars</text>

  <!-- Divider -->
  <line x1="16" y1="55" x2="${W - 16}" y2="55" stroke="${bdr}" stroke-width="1"/>

  ${cards}
</svg>`;
};