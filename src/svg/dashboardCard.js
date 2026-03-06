import { escapeSVG } from '../utils/sanitize.js';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => {
  if (n >= 1000)
    return (n / 1000).toFixed(n >= 10000 ? 1 : 2).replace(/\.?0+$/, '') + 'K';
  return String(n);
};
const trunc = (s, max) =>
  s && s.length > max ? s.slice(0, max - 1) + '…' : s || '';

// Language colours (same palette as languageCard)
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Ruby: '#701516',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
  default: '#8b949e',
};
const lc = (lang) => LANG_COLORS[lang] || LANG_COLORS.default;

// ── STAT ICONS ────────────────────────────────────────────────────────────────
const ICONS = {
  repos:
    'M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z',
  followers:
    'M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z',
  stars:
    'M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z',
  forks:
    'M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z',
  age: 'M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h-2a.25.25 0 00-.25.25V6h11V3.75a.25.25 0 00-.25-.25h-2V5a.75.75 0 01-1.5 0V3.5h-5V5a.75.75 0 01-1.5 0V3.5z',
};

const icon = (key, x, y, color, scale = 0.9) =>
  `<g transform="translate(${x},${y}) scale(${scale})"><path fill="${color}" d="${ICONS[key]}"/></g>`;

// ── SECTION RENDERERS ─────────────────────────────────────────────────────────

// Stats grid (2×3)
const renderStats = (stats, x, y, W, theme) => {
  const items = [
    { icon: 'repos', label: 'Repos', val: fmt(stats.totalRepos || 0) },
    { icon: 'followers', label: 'Followers', val: fmt(stats.followers || 0) },
    { icon: 'stars', label: 'Stars', val: fmt(stats.starsReceived || 0) },
    { icon: 'forks', label: 'Forks', val: fmt(stats.totalForks || 0) },
    { icon: 'followers', label: 'Following', val: fmt(stats.following || 0) },
    { icon: 'age', label: 'Account Age', val: `${stats.accountAge || 0}y` },
  ];
  const COLS = 3;
  const CW = (W - 8) / COLS;
  const CH = 46;
  return items
    .map((item, i) => {
      const col = i % COLS,
        row = Math.floor(i / COLS);
      const cx = x + col * CW,
        cy = y + row * (CH + 6);
      return `
      <rect x="${cx}" y="${cy}" width="${CW - 6}" height="${CH}" rx="6"
        fill="${theme.borderColor}" opacity="0.25"/>
      ${icon(item.icon, cx + 8, cy + 14, theme.iconColor || theme.accentColor, 0.75)}
      <text x="${cx + 24}" y="${cy + 17}" font-family="Arial,sans-serif" font-size="9" fill="${theme.subtextColor || '#8b949e'}">${item.label}</text>
      <text x="${cx + 8}" y="${cy + 36}" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="${theme.textColor}">${item.val}</text>`;
    })
    .join('');
};

// Language bars
const renderLanguages = (langs, x, y, W, theme) => {
  const entries = Object.entries(langs).slice(0, 6);
  const BAR_W = W - 60;
  return entries
    .map(([lang, pct], i) => {
      const fy = y + i * 24;
      const filled = Math.max(4, (pct / 100) * BAR_W);
      return `
      <circle cx="${x + 7}" cy="${fy + 8}" r="5" fill="${lc(lang)}"/>
      <text x="${x + 16}" y="${fy + 12}" font-family="Arial,sans-serif" font-size="10" fill="${theme.subtextColor || '#8b949e'}">${escapeSVG(lang)}</text>
      <text x="${x + W - 2}" y="${fy + 12}" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="${theme.accentColor}" text-anchor="end">${pct}%</text>
      <rect x="${x}" y="${fy + 16}" width="${BAR_W}" height="5" rx="2.5" fill="${theme.borderColor}" opacity="0.4"/>
      <rect x="${x}" y="${fy + 16}" width="${filled}" height="5" rx="2.5" fill="${lc(lang)}"/>`;
    })
    .join('');
};

// Mini repo list
const renderRepos = (repos, x, y, W, theme) => {
  return repos
    .slice(0, 4)
    .map((repo, i) => {
      const ry = y + i * 42;
      const name = trunc(repo.name, 22);
      const desc = trunc(repo.description, 36);
      return `
      <rect x="${x}" y="${ry}" width="${W}" height="38" rx="5"
        fill="${theme.borderColor}" opacity="0.2"/>
      <text x="${x + 8}" y="${ry + 14}" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="${theme.accentColor}">${escapeSVG(name)}</text>
      <text x="${x + 8}" y="${ry + 26}" font-family="Arial,sans-serif" font-size="9" fill="${theme.subtextColor || '#8b949e'}">${escapeSVG(desc)}</text>
      <text x="${x + W - 8}" y="${ry + 26}" font-family="Arial,sans-serif" font-size="9" fill="${theme.subtextColor || '#8b949e'}" text-anchor="end">★ ${fmt(repo.stars)}  ⑂ ${fmt(repo.forks)}</text>`;
    })
    .join('');
};

// Section header with icon strip
const sectionHeader = (label, iconKey, x, y, ico, txt) => `
  <rect x="${x}" y="${y}" width="3" height="14" rx="1.5" fill="${ico}"/>
  <text x="${x + 8}" y="${y + 11}" font-family="Arial,sans-serif" font-size="11" font-weight="bold" fill="${txt}">${label}</text>`;

// ── LAYOUT: DEFAULT (2-col) ───────────────────────────────────────────────────
const layoutDefault = (data, theme) => {
  const { username, name, bio, stats, languages, repos } = data;
  const W = 760,
    PAD = 20,
    COL = (W - PAD * 3) / 2;
  const langH = Math.min(6, Object.keys(languages).length) * 24 + 4;
  const repoH = Math.min(4, repos.length) * 42;
  const H = PAD + 50 + PAD + 110 + PAD + Math.max(langH, repoH) + PAD + 20;

  const bg = theme.background,
    bdr = theme.borderColor,
    txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const ico = theme.iconColor || theme.accentColor;

  const LEFT = PAD;
  const RIGHT = PAD * 2 + COL;

  // Bio section
  const bioSVG = bio
    ? `<text x="${LEFT}" y="78" font-family="Arial,sans-serif" font-size="11" fill="${sub}">${escapeSVG(trunc(bio, 70))}</text>`
    : '';

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ico};stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:${bg};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="cc"><rect width="${W}" height="${H}" rx="14"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" rx="14" fill="${bg}" stroke="${bdr}" stroke-width="1.5"/>
  <rect clip-path="url(#cc)" x="0" y="0" width="${W}" height="58" fill="url(#hg)"/>

  <!-- Header -->
  <text x="${PAD}" y="30" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="${txt}">${escapeSVG(name)}</text>
  <text x="${PAD}" y="47" font-family="Arial,sans-serif" font-size="11" fill="${sub}">@${escapeSVG(username)}</text>
  ${bioSVG}

  <line x1="${PAD}" y1="60" x2="${W - PAD}" y2="60" stroke="${bdr}" stroke-width="1" opacity="0.6"/>

  <!-- LEFT: Stats -->
  ${sectionHeader('Stats', 'repos', LEFT, 68, ico, txt)}
  ${renderStats(stats, LEFT, 88, COL, theme)}

  <!-- RIGHT: Languages -->
  ${sectionHeader('Top Languages', 'repos', RIGHT, 68, ico, txt)}
  ${renderLanguages(languages, RIGHT, 88, COL, theme)}

  <!-- Full-width: Repos -->
  ${sectionHeader('Top Repositories', 'repos', LEFT, 210, ico, txt)}
  ${renderRepos(repos, LEFT, 228, W - PAD * 2, theme)}

</svg>`;
};

// ── LAYOUT: COMPACT (1-col) ───────────────────────────────────────────────────
const layoutCompact = (data, theme) => {
  const { username, name, bio, stats, languages, repos } = data;
  const W = 495,
    PAD = 16;
  const langH = Math.min(4, Object.keys(languages).length) * 24 + 4;
  const H =
    PAD +
    50 +
    14 +
    100 +
    20 +
    langH +
    20 +
    Math.min(3, repos.length) * 42 +
    PAD;

  const bg = theme.background,
    bdr = theme.borderColor,
    txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e',
    ico = theme.iconColor || theme.accentColor;

  const bioSVG = bio
    ? `<text x="${PAD}" y="68" font-family="Arial,sans-serif" font-size="10" fill="${sub}">${escapeSVG(trunc(bio, 55))}</text>`
    : '';

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ico};stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:${bg};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="cc"><rect width="${W}" height="${H}" rx="12"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" rx="12" fill="${bg}" stroke="${bdr}" stroke-width="1.5"/>
  <rect clip-path="url(#cc)" x="0" y="0" width="${W}" height="54" fill="url(#hg)"/>

  <text x="${PAD}" y="28" font-family="Arial,sans-serif" font-size="17" font-weight="bold" fill="${txt}">${escapeSVG(name)}</text>
  <text x="${PAD}" y="44" font-family="Arial,sans-serif" font-size="10" fill="${sub}">@${escapeSVG(username)}</text>
  ${bioSVG}

  <line x1="${PAD}" y1="54" x2="${W - PAD}" y2="54" stroke="${bdr}" stroke-width="1" opacity="0.6"/>

  ${sectionHeader('Stats', 'repos', PAD, 62, ico, txt)}
  ${renderStats(stats, PAD, 80, W - PAD * 2, theme)}

  ${sectionHeader('Languages', 'repos', PAD, 194, ico, txt)}
  ${renderLanguages(languages, PAD, 212, W - PAD * 2, theme)}

  ${sectionHeader('Repos', 'repos', PAD, 212 + langH + 8, ico, txt)}
  ${renderRepos(repos, PAD, 212 + langH + 26, W - PAD * 2, theme)}

</svg>`;
};

// ── LAYOUT: WIDE (3-col) ─────────────────────────────────────────────────────
const layoutWide = (data, theme) => {
  const { username, name, bio, stats, languages, repos } = data;
  const W = 1000,
    PAD = 20,
    COL = (W - PAD * 4) / 3;
  const langH = Math.min(6, Object.keys(languages).length) * 24 + 4;
  const repoH = Math.min(4, repos.length) * 42;
  const contentH = Math.max(langH, repoH, 120);
  const H = PAD + 58 + PAD + contentH + PAD;

  const bg = theme.background,
    bdr = theme.borderColor,
    txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e',
    ico = theme.iconColor || theme.accentColor;

  const C1 = PAD,
    C2 = PAD * 2 + COL,
    C3 = PAD * 3 + COL * 2;
  const bioSVG = bio
    ? `<text x="${PAD}" y="52" font-family="Arial,sans-serif" font-size="11" fill="${sub}">${escapeSVG(trunc(bio, 90))}</text>`
    : '';

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ico};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${bg};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="cc"><rect width="${W}" height="${H}" rx="14"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" rx="14" fill="${bg}" stroke="${bdr}" stroke-width="1.5"/>
  <rect clip-path="url(#cc)" x="0" y="0" width="${W}" height="62" fill="url(#hg)"/>

  <text x="${PAD}" y="28" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="${txt}">${escapeSVG(name)}</text>
  <text x="${PAD + 200}" y="28" font-family="Arial,sans-serif" font-size="11" fill="${sub}">@${escapeSVG(username)}</text>
  ${bioSVG}
  <line x1="${PAD}" y1="60" x2="${W - PAD}" y2="60" stroke="${bdr}" stroke-width="1" opacity="0.6"/>

  <!-- 3 columns -->
  <line x1="${C2 - PAD / 2}" y1="68" x2="${C2 - PAD / 2}" y2="${H - PAD}" stroke="${bdr}" stroke-width="1" opacity="0.3"/>
  <line x1="${C3 - PAD / 2}" y1="68" x2="${C3 - PAD / 2}" y2="${H - PAD}" stroke="${bdr}" stroke-width="1" opacity="0.3"/>

  ${sectionHeader('Stats', 'repos', C1, 68, ico, txt)}
  ${renderStats(stats, C1, 88, COL, theme)}

  ${sectionHeader('Languages', 'repos', C2, 68, ico, txt)}
  ${renderLanguages(languages, C2, 88, COL, theme)}

  ${sectionHeader('Repositories', 'repos', C3, 68, ico, txt)}
  ${renderRepos(repos, C3, 88, COL, theme)}

</svg>`;
};

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export const generateDashboardCard = (data, theme, layout = 'default') => {
  switch (layout) {
    case 'compact':
      return layoutCompact(data, theme);
    case 'wide':
      return layoutWide(data, theme);
    default:
      return layoutDefault(data, theme);
  }
};
