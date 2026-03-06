// ── 3D Contribution Graph — Isometric Bar Chart ──────────────────────────────
export const generateContribution3DGraph = (grid, theme, totalContributions = 0) => {
  const bg = theme.background;
  const bdr = theme.borderColor;
  const txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const acc = theme.accentColor;
  const ico = theme.iconColor || theme.accentColor;

  // Isometric projection constants
  const BAR_W = 9;
  const BAR_D = 4;     // depth of top face
  const GAP_W = 3;     // gap between bars in a week
  const GAP_WK = 6;     // gap between weeks
  const STEP_W = BAR_W + GAP_W;
  const WEEK_W = BAR_W + GAP_WK;
  const MAX_BAR = 60;    // max bar height in px
  const BASE_Y = 30;    // baseline from bottom of drawing area
  const PAD = 16;
  const HEADER = 56;

  const weeks = grid.length;
  const maxCount = Math.max(1, ...grid.flat());

  const DRAWING_W = weeks * WEEK_W + 6 * STEP_W;
  const DRAWING_H = MAX_BAR + BASE_Y + BAR_D;
  const W = PAD * 2 + DRAWING_W;
  const H = HEADER + DRAWING_H + PAD + 10;

  // colour scale — 5 levels, tinted from accent
  const barColor = (count) => {
    if (count === 0) return null;
    const ratio = count / maxCount;
    const level = Math.ceil(ratio * 4);
    const alphas = ['33', '66', '99', 'bb', 'ff'];
    return `${acc}${alphas[Math.min(level, 4) - 1]}`;
  };

  const bars = [];

  grid.forEach((week, wi) => {
    week.forEach((count, di) => {
      if (count === 0) return;

      const bh = Math.max(3, Math.round((count / maxCount) * MAX_BAR));
      const color = barColor(count);
      const bx = PAD + wi * WEEK_W + di * STEP_W;
      const by = HEADER + DRAWING_H - BASE_Y - bh;

      // Front face
      bars.push(`<rect x="${bx}" y="${by}" width="${BAR_W}" height="${bh}"
        fill="${color}" opacity="0.9"/>`);

      // Top face (lighter)
      bars.push(`<polygon points="${bx},${by} ${bx + BAR_W},${by} ${bx + BAR_W + BAR_D},${by - BAR_D} ${bx + BAR_D},${by - BAR_D}"
        fill="${color}" opacity="1"/>`);

      // Right face (darker)
      bars.push(`<polygon points="${bx + BAR_W},${by} ${bx + BAR_W},${by + bh} ${bx + BAR_W + BAR_D},${by + bh - BAR_D} ${bx + BAR_W + BAR_D},${by - BAR_D}"
        fill="${color}" opacity="0.5"/>`);
    });
  });

  // Baseline
  const baseY = HEADER + DRAWING_H - BASE_Y + 1;

  // fmt total
  const fmtTotal = totalContributions >= 1000
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

  <!-- 3D icon in header -->
  <g transform="translate(${PAD},14)">
    <rect x="3" y="4" width="10" height="8" rx="1" fill="none" stroke="${ico}" stroke-width="1.5"/>
    <polygon points="0,4 3,4 3,12 0,12" fill="${ico}" opacity="0.6"/>
    <polygon points="0,4 3,2 13,2 10,4" fill="${ico}" opacity="0.9"/>
  </g>

  <!-- Header -->
  <text x="${PAD + 22}" y="26" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="${txt}">3D Contribution Graph</text>
  <text x="${PAD + 22}" y="41" font-family="Arial,sans-serif" font-size="10" fill="${sub}">${fmtTotal} contributions • isometric bars</text>

  <!-- Divider -->
  <line x1="${PAD}" y1="52" x2="${W - PAD}" y2="52" stroke="${bdr}" stroke-width="1" opacity="0.6"/>

  <!-- Bars -->
  ${bars.join('\n  ')}

  <!-- Baseline -->
  <line x1="${PAD}" y1="${baseY}" x2="${W - PAD}" y2="${baseY}" stroke="${bdr}" stroke-width="1" opacity="0.5"/>

</svg>`;
};