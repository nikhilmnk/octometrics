// ── 3D Contribution Graph — Isometric Bar Chart ──────────────────────────────
export const generateContribution3DGraph = (
  grid,
  theme,
  totalContributions = 0,
  year = null
) => {
  const bg = theme.background;
  const bdr = theme.borderColor;
  const txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const acc = theme.accentColor;
  const ico = theme.iconColor || theme.accentColor;

  // Isometric projection constants
  const BAR_W = 7;
  const BAR_D = 4; // depth of top/right faces
  const GAP_W = 2; // gap between bars in same week
  const GAP_WK = 4; // gap between weeks

  const STEP_X = BAR_W + GAP_WK; // Horizontal step per week
  const STEP_Y = (BAR_W + GAP_W) / 2; // Vertical/Depth step per day (isometric skew)

  const MAX_BAR = 50; // max height of the front face
  const BASE_Y = 40; // distance from bottom of rendering area to the lowest baseline
  const PAD = 20;
  const HEADER = 56;

  const weeks = grid.length;
  const maxCount = Math.max(1, ...grid.flat());

  // 3D Isometric layout requires a wider bounding box because each day shifts right and down down
  // Calculate exact bounds
  const DRAWING_W = weeks * STEP_X + 7 * STEP_X;
  const DRAWING_H = MAX_BAR + BASE_Y + 7 * STEP_Y + 20; // +20 extra headroom

  const W = Math.max(760, PAD * 2 + DRAWING_W); // Ensure it's wide enough for typical GitHub layout
  const H = Math.max(195, HEADER + DRAWING_H + PAD + 20);

  // colour scale — 5 levels, tinted from accent
  const barColor = (count) => {
    if (count === 0) return null;
    const ratio = count / maxCount;
    const level = Math.ceil(ratio * 4);
    const alphas = ['33', '66', '99', 'bb', 'ff'];
    return `${acc}${alphas[Math.min(level, 4) - 1]}`;
  };

  const bars = [];

  // Render back-to-front (weeks right-to-left, days bottom-to-top)
  // Deeper Z should be drawn first. `wi` represents X (left to right), `di` represents Y (top to bottom).
  // In our isometric formula, higher `wi` shifts the Y coordinate UP (farther back).
  // Therefore, higher `wi` (distant) MUST be drawn FIRST.
  // And lower `di` (Sunday) moves UP (farther back), so lower `di` MUST be drawn FIRST.

  [...grid].reverse().forEach((week, revWi) => {
    const wi = weeks - 1 - revWi;
    week.forEach((count, di) => {
      if (count === 0) return;

      // Calculate isometric base coordinate (bx, by)
      const bx = PAD + wi * STEP_X + di * STEP_X * 0.5; // x shifts right per week, and slightly right per day
      const by =
        HEADER + DRAWING_H - BASE_Y + di * STEP_Y - wi * STEP_Y * 0.2 + 20; // y shifts down per day, shifted down slightly by 20 for header clearance

      const bh = Math.max(3, Math.round((count / maxCount) * MAX_BAR));
      const color = barColor(count);

      // Front face
      bars.push(`<rect x="${bx}" y="${by - bh}" width="${BAR_W}" height="${bh}"
        fill="${color}" opacity="0.9"/>`);

      // Top face
      bars.push(`<polygon points="${bx},${by - bh} ${bx + BAR_W},${by - bh} ${bx + BAR_W + BAR_D},${by - bh - BAR_D} ${bx + BAR_D},${by - bh - BAR_D}"
        fill="${color}" opacity="1"/>`);

      // Right face
      bars.push(`<polygon points="${bx + BAR_W},${by - bh} ${bx + BAR_W},${by} ${bx + BAR_W + BAR_D},${by - BAR_D} ${bx + BAR_W + BAR_D},${by - bh - BAR_D}"
        fill="${color}" opacity="0.5"/>`);
    });
  });

  // Baseline
  const baseY = HEADER + DRAWING_H - BASE_Y + 1;

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

  <!-- 3D icon in header -->
  <g transform="translate(${PAD},14)">
    <rect x="3" y="4" width="10" height="8" rx="1" fill="none" stroke="${ico}" stroke-width="1.5"/>
    <polygon points="0,4 3,4 3,12 0,12" fill="${ico}" opacity="0.6"/>
    <polygon points="0,4 3,2 13,2 10,4" fill="${ico}" opacity="0.9"/>
  </g>

  <!-- Header -->
  <text x="${PAD + 22}" y="26" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="${txt}">3D Contribution Graph</text>
  <text x="${PAD + 22}" y="41" font-family="Arial,sans-serif" font-size="10" fill="${sub}">${fmtTotal} contributions • ${year ? `${year} isometric bars` : 'isometric bars'}</text>

  <!-- Divider -->
  <line x1="${PAD}" y1="52" x2="${W - PAD}" y2="52" stroke="${bdr}" stroke-width="1" opacity="0.6"/>

  <!-- Bars -->
  ${bars.join('\n  ')}

  <!-- Baseline -->
  <line x1="${PAD}" y1="${baseY}" x2="${W - PAD}" y2="${baseY}" stroke="${bdr}" stroke-width="1" opacity="0.5"/>

</svg>`;
};
