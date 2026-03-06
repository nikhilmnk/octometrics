import { escapeSVG } from '../utils/sanitize.js';

// Compact SVG icon paths (20×20 viewBox, from Octicons / heroicons)
const ICONS = {
  repo: 'M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z',
  followers: 'M10.25 2.44a.75.75 0 01.985-.346L16.25 4.5V7a4.002 4.002 0 01-3.01 3.877L12.5 11v.5a.75.75 0 01-1.5 0V11l-.74-.123A4.002 4.002 0 017.25 7V4.5l5.015-2.406-.015.346zM10 3.868L6.75 5.374V7a2.5 2.5 0 001.85 2.415L10 9.732V3.868zm1.5 0v5.864l1.4-.317A2.5 2.5 0 0014.75 7V5.374L11.5 3.868zM2.5 14a1 1 0 011-1h13a1 1 0 110 2h-13a1 1 0 01-1-1zm1.5 3a1 1 0 112 0 1 1 0 01-2 0zm4 0a1 1 0 112 0 1 1 0 01-2 0zm4 0a1 1 0 112 0 1 1 0 01-2 0z',
  following: 'M16 11a5 5 0 11-10 0 5 5 0 0110 0zm-5-3a3 3 0 100 6 3 3 0 000-6zm-1 3a1 1 0 112 0 1 1 0 01-2 0zm-5.5-5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM7 3.5a2 2 0 11-4 0 2 2 0 014 0zM2.5 9A4.5 4.5 0 000 13v1.5a.5.5 0 001 0V13a3.5 3.5 0 013.5-3.5h.5v-1H2.5z',
  stars: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z',
  forks: 'M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z',
  age: 'M3.75 0a.75.75 0 01.75.75V2h7V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v11a1.75 1.75 0 01-1.75 1.75H2.25A1.75 1.75 0 01.5 14.75v-11C.5 2.784 1.284 2 2.25 2H3.5V.75A.75.75 0 013.75 0zm10 6.5H2.5v8.25c0 .138.112.25.25.25h11a.25.25 0 00.25-.25V6.5zm-2 2a.5.5 0 010 1H9.5a.5.5 0 010-1H11.75zm-5.5 0H8.5a.5.5 0 010 1H6.25a.5.5 0 010-1z',
};

const icon = (name, color, x, y) =>
  `<g transform="translate(${x},${y}) scale(0.82)">
    <path fill="${color}" d="${ICONS[name]}"/>
  </g>`;

export const generateStatsCard = (stats, theme) => {
  const W = 495, H = 195;
  const bg = theme.background;
  const bdr = theme.borderColor;
  const txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const acc = theme.accentColor;
  const ico = theme.iconColor || theme.accentColor;

  // 6 stat rows, 2 columns
  const items = [
    { icon: 'repo', label: 'Repositories', value: stats.totalRepos },
    { icon: 'followers', label: 'Followers', value: stats.followers },
    { icon: 'following', label: 'Following', value: stats.following },
    { icon: 'stars', label: 'Stars Received', value: stats.starsReceived },
    { icon: 'forks', label: 'Forks', value: stats.forks },
    { icon: 'age', label: 'Account Age', value: `${stats.accountAge}d` },
  ];

  // Layout grid: 2 cols × 3 rows
  const colX = [20, 258];
  const rowY = [88, 128, 168];
  const icoSz = 16;

  const statRows = items.map((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = colX[col];
    const y = rowY[row];
    const iX = x;
    const iY = y - icoSz + 2;

    return `
      ${icon(item.icon, ico, iX, iY)}
      <text x="${iX + icoSz + 6}" y="${y}" font-family="Arial,sans-serif" font-size="12" fill="${sub}">${item.label}</text>
      <text x="${iX + icoSz + 6}" y="${y + 18}" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="${acc}">${item.value}</text>
    `;
  }).join('');

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ico};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${bg};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="card-clip">
      <rect width="${W}" height="${H}" rx="12"/>
    </clipPath>
  </defs>

  <!-- Card background -->
  <rect width="${W}" height="${H}" rx="12" fill="${bg}" stroke="${bdr}" stroke-width="1.5"/>

  <!-- Header gradient strip -->
  <rect clip-path="url(#card-clip)" x="0" y="0" width="${W}" height="55" fill="url(#headerGrad)"/>

  <!-- GitHub mark icon -->
  <g transform="translate(20,14) scale(1.15)">
    <path fill="${ico}" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </g>

  <!-- Title -->
  <text x="46" y="27" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="${txt}">GitHub Stats</text>
  <text x="46" y="43" font-family="Arial,sans-serif" font-size="11" fill="${sub}">@${escapeSVG(stats.username)}</text>

  <!-- Divider -->
  <line x1="16" y1="58" x2="${W - 16}" y2="58" stroke="${bdr}" stroke-width="1"/>

  <!-- Stat rows -->
  ${statRows}
</svg>`;
};