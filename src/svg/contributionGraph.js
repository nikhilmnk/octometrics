// ── 2D Contribution Graph — Modern Card ─────────────────────────────────────
export const generateContributionGraph = (
  grid,
  theme,
  totalContributions = 0,
  year = null
) => {
  const SQ = 11; // square size
  const GAP = 3; // gap between squares
  const STEP = SQ + GAP;
  const PAD = 36;
  const HEADER = 56;

  const bg = theme.background;
  const bdr = theme.borderColor;
  const txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const acc = theme.accentColor;
  const ico = theme.iconColor || theme.accentColor;

  const weeks = grid.length;
  const W = PAD * 2 + weeks * STEP - GAP + 30; // +30 for extra right padding
  const H = HEADER + 7 * STEP - GAP + PAD + 18; // +18 for legend

  // Theme-aware contribution colours — green scale tinted towards accentColor
  const LEVELS = [
    `${bg}`, // 0 — empty
    `${acc}33`, // 1 — very light
    `${acc}66`, // 2 — light
    `${acc}aa`, // 3 — medium
    `${acc}`, // 4 — full
  ];

  // Day-of-week labels (Mon, Wed, Fri)
  const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  // Month label positions (omitted - using grid intensity only)

  const squares = grid
    .map((week, wi) => {
      return week
        .map((intensity, di) => {
          const x = PAD + wi * STEP;
          const y = HEADER + di * STEP;
          return `<rect x="${x}" y="${y}" width="${SQ}" height="${SQ}" rx="2"
        fill="${LEVELS[intensity]}" stroke="${bdr}" stroke-width="0.5" opacity="${intensity === 0 ? 0.5 : 1}"/>`;
        })
        .join('');
    })
    .join('');

  // Day labels on the left
  const dayLabelsSVG = DAY_LABELS.map((label, i) => {
    if (!label) return '';
    return `<text x="${PAD - 4}" y="${HEADER + i * STEP + SQ - 2}" font-family="Arial,sans-serif"
      font-size="9" fill="${sub}" text-anchor="end">${label}</text>`;
  }).join('');

  // Legend at the bottom
  const legendY = HEADER + 7 * STEP + 8;
  const legX = W - PAD - 5 * (SQ + 4) - 20;
  const legend = LEVELS.map(
    (c, i) => `
    <rect x="${legX + i * (SQ + 4)}" y="${legendY}" width="${SQ}" height="${SQ}" rx="2"
      fill="${c}" stroke="${bdr}" stroke-width="0.5" opacity="${i === 0 ? 0.5 : 1}"/>
  `
  ).join('');

  // fmt total
  const fmtTotal =
    totalContributions >= 1000
      ? (totalContributions / 1000).toFixed(1) + 'K'
      : String(totalContributions);

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ico};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${bg};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="cc"><rect width="${W}" height="${H}" rx="12"/></clipPath>
  </defs>

  <!-- Card -->
  <rect width="${W}" height="${H}" rx="12" fill="${bg}" stroke="${bdr}" stroke-width="1.5"/>
  <rect clip-path="url(#cc)" x="0" y="0" width="${W}" height="50" fill="url(#hg)"/>

  <!-- Contribution icon -->
  <g transform="translate(${PAD},14)">
    <rect x="0" y="0" width="16" height="16" rx="3" fill="none" stroke="${ico}" stroke-width="1.5"/>
    <rect x="2" y="2" width="5" height="5" rx="1" fill="${ico}" opacity="0.8"/>
    <rect x="9" y="2" width="5" height="5" rx="1" fill="${ico}" opacity="0.4"/>
    <rect x="2" y="9" width="5" height="5" rx="1" fill="${ico}" opacity="0.4"/>
    <rect x="9" y="9" width="5" height="5" rx="1" fill="${ico}"/>
  </g>

  <!-- Header -->
  <text x="${PAD + 22}" y="26" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="${txt}">Contribution Graph</text>
  <text x="${PAD + 22}" y="41" font-family="Arial,sans-serif" font-size="10" fill="${sub}">${fmtTotal} contributions • ${year || 'past year'}</text>

  <!-- Divider -->
  <line x1="${PAD}" y1="52" x2="${W - PAD}" y2="52" stroke="${bdr}" stroke-width="1" opacity="0.6"/>

  <!-- Day labels -->
  ${dayLabelsSVG}

  <!-- Squares -->
  ${squares}

  <!-- Legend: Less → More -->
  <text x="${legX - 6}" y="${legendY + SQ - 1}" font-family="Arial,sans-serif" font-size="9" fill="${sub}" text-anchor="end">Less</text>
  ${legend}
  <text x="${legX + 5 * (SQ + 4) + 2}" y="${legendY + SQ - 1}" font-family="Arial,sans-serif" font-size="9" fill="${sub}">More</text>

</svg>`;
};
