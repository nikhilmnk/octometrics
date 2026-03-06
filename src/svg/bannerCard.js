import { escapeSVG } from '../utils/sanitize.js';

// ── Tech icon SVG paths (inline, 24×24 viewBox) ─────────────────────────────
const TECH_ICONS = {
  // language/framework colour dots
  JS: { color: '#f7df1e', label: 'JS' },
  TS: { color: '#3178c6', label: 'TS' },
  PY: { color: '#3572a5', label: 'PY' },
  GO: { color: '#00add8', label: 'GO' },
  RS: { color: '#dea584', label: 'RS' },
  CPP: { color: '#f34b7d', label: 'C++' },
  JAVA: { color: '#b07219', label: 'JV' },
  RB: { color: '#701516', label: 'RB' },
  PHP: { color: '#4f5d95', label: 'PHP' },
  CS: { color: '#178600', label: 'C#' },
  KT: { color: '#a97bff', label: 'KT' },
  SW: { color: '#f05138', label: 'SW' },
  DART: { color: '#00b4ab', label: 'DA' },
  VUE: { color: '#41b883', label: 'VU' },
  REACT: { color: '#61dafb', label: 'RE' },
  NODE: { color: '#339933', label: 'NO' },
  HTML: { color: '#e34c26', label: 'HT' },
  CSS: { color: '#563d7c', label: 'CSS' },
  RUST: { color: '#dea584', label: 'RU' },
  DOCKER: { color: '#2496ed', label: 'DK' },
  K8S: { color: '#326ce5', label: 'K8' },
  GIT: { color: '#f05032', label: 'GI' },
  AWS: { color: '#ff9900', label: 'AWS' },
  GCP: { color: '#4285f4', label: 'GC' },
};

// Normalise a tech string to find its icon config
const getIconCfg = (tech) => {
  const key = tech.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (TECH_ICONS[key]) return { ...TECH_ICONS[key], full: tech };
  // fuzzy match
  for (const [k, v] of Object.entries(TECH_ICONS)) {
    if (key.includes(k) || k.includes(key)) return { ...v, full: tech };
  }
  // fallback — generic pill
  return { color: '#6e7681', label: tech.slice(0, 3).toUpperCase(), full: tech };
};

// ── SVG for a single tech badge pill ────────────────────────────────────────
const techBadge = (tech, x, y) => {
  const cfg = getIconCfg(tech);
  const label = escapeSVG(cfg.full);
  // dot area (22px left) + text width + right padding (8px)
  const PW = Math.max(48, label.length * 7 + 30);
  return {
    svg: `
    <g transform="translate(${x},${y})">
      <rect width="${PW}" height="22" rx="11" fill="${cfg.color}" opacity="0.22"/>
      <rect width="${PW}" height="22" rx="11" fill="none" stroke="${cfg.color}" stroke-width="1" opacity="0.6"/>
      <circle cx="12" cy="11" r="4" fill="${cfg.color}"/>
      <text x="22" y="15" font-family="Arial,sans-serif" font-size="10" font-weight="bold"
        fill="${cfg.color}" text-anchor="start">${label}</text>
    </g>`, width: PW + 8
  };
};

// ── Dot / grid background pattern ───────────────────────────────────────────
const dots = (W, H, color) => {
  let d = '';
  for (let x = 20; x < W; x += 28) {
    for (let y = 20; y < H; y += 28) {
      d += `<circle cx="${x}" cy="${y}" r="1.2" fill="${color}" opacity="0.18"/>`;
    }
  }
  return d;
};

const grid = (W, H, color) => {
  let lines = '';
  for (let x = 0; x < W; x += 40)
    lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${color}" stroke-width="0.5" opacity="0.12"/>`;
  for (let y = 0; y < H; y += 40)
    lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${color}" stroke-width="0.5" opacity="0.12"/>`;
  return lines;
};

// ── Animated wave at bottom ──────────────────────────────────────────────────
const wave = (W, H, color) => `
  <path opacity="0.25" fill="${color}">
    <animate attributeName="d" dur="6s" repeatCount="indefinite"
      values="
        M0 ${H - 40} Q${W * 0.25} ${H - 60} ${W * 0.5} ${H - 40} Q${W * 0.75} ${H - 20} ${W} ${H - 40} L${W} ${H} L0 ${H} Z;
        M0 ${H - 40} Q${W * 0.25} ${H - 20} ${W * 0.5} ${H - 40} Q${W * 0.75} ${H - 60} ${W} ${H - 40} L${W} ${H} L0 ${H} Z;
        M0 ${H - 40} Q${W * 0.25} ${H - 60} ${W * 0.5} ${H - 40} Q${W * 0.75} ${H - 20} ${W} ${H - 40} L${W} ${H} L0 ${H} Z
      "/>
  </path>
  <path opacity="0.15" fill="${color}">
    <animate attributeName="d" dur="9s" repeatCount="indefinite"
      values="
        M0 ${H - 24} Q${W * 0.33} ${H - 44} ${W * 0.66} ${H - 20} Q${W * 0.83} ${H - 10} ${W} ${H - 28} L${W} ${H} L0 ${H} Z;
        M0 ${H - 24} Q${W * 0.33} ${H - 10} ${W * 0.66} ${H - 32} Q${W * 0.83} ${H - 44} ${W} ${H - 20} L${W} ${H} L0 ${H} Z;
        M0 ${H - 24} Q${W * 0.33} ${H - 44} ${W * 0.66} ${H - 20} Q${W * 0.83} ${H - 10} ${W} ${H - 28} L${W} ${H} L0 ${H} Z
      "/>
  </path>`;

// ── Decorative blob circles ──────────────────────────────────────────────────
const blobs = (W, H, c1, c2) => `
  <circle cx="${W - 80}" cy="60" r="70" fill="${c1}" opacity="0.08"/>
  <circle cx="${W - 40}" cy="30" r="40" fill="${c2}" opacity="0.10"/>
  <circle cx="60" cy="${H - 30}" r="55" fill="${c1}" opacity="0.07"/>
  <circle cx="20" cy="${H + 10}" r="30" fill="${c2}" opacity="0.09"/>`;

// ── Corner accent lines ──────────────────────────────────────────────────────
const cornerAccents = (W, H, color) => `
  <line x1="0" y1="0" x2="60" y2="0" stroke="${color}" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
  <line x1="0" y1="0" x2="0" y2="60" stroke="${color}" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
  <line x1="${W}" y1="0" x2="${W - 60}" y2="0" stroke="${color}" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
  <line x1="${W}" y1="0" x2="${W}" y2="60" stroke="${color}" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
  <line x1="0" y1="${H}" x2="60" y2="${H}" stroke="${color}" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
  <line x1="0" y1="${H}" x2="0" y2="${H - 60}" stroke="${color}" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
  <line x1="${W}" y1="${H}" x2="${W - 60}" y2="${H}" stroke="${color}" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
  <line x1="${W}" y1="${H}" x2="${W}" y2="${H - 60}" stroke="${color}" stroke-width="3" opacity="0.4" stroke-linecap="round"/>`;

// ── Social handle pill ───────────────────────────────────────────────────────
const socialPills = (socials, cx, y, acc, sub) => {
  if (!socials.length) return '';
  const pills = socials.map(s => escapeSVG(s));
  const total = pills.reduce((sum, s) => sum + s.length * 7 + 28, 0) + (pills.length - 1) * 8;
  let out = '', ox = cx - total / 2;
  pills.forEach(p => {
    const pw = p.length * 7 + 28;
    out += `<rect x="${ox}" y="${y}" width="${pw}" height="20" rx="10" fill="${acc}" opacity="0.15"/>
      <text x="${ox + pw / 2}" y="${y + 14}" font-family="Arial,sans-serif" font-size="11" fill="${sub}" text-anchor="middle">${p}</text>`;
    ox += pw + 8;
  });
  return out;
};

// ── Location tag ─────────────────────────────────────────────────────────────
const locationTag = (loc, cx, y, sub) => {
  if (!loc) return '';
  const escaped = escapeSVG(loc);
  return `
    <text x="${cx}" y="${y}" font-family="Arial,sans-serif" font-size="12" fill="${sub}" text-anchor="middle" opacity="0.8">📍 ${escaped}</text>`;
};

// ── MAIN CARD ─────────────────────────────────────────────────────────────────
export const generateBannerCard = (data, theme) => {
  const { name, title, subtitle, location, social, techStack, wave: showWave, pattern, align } = data;

  const W = 860;

  // Dynamic height — grows with content rows
  let H = 140;
  H += title ? 32 : 0;
  H += subtitle ? 24 : 0;
  H += location ? 24 : 0;
  H += social.length > 0 ? 28 : 0;
  H += techStack.length > 0 ? 40 : 0;
  H = Math.max(H, 180);

  const cx = align === 'left' ? 60 : W / 2;
  const anchor = align === 'left' ? 'start' : 'middle';

  const bg = theme.background;
  const bdr = theme.borderColor;
  const txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const acc = theme.accentColor;
  const ico = theme.iconColor || theme.accentColor;

  // -- Tech badges row
  let techSVG = '';
  if (techStack.length > 0) {
    const badgeData = techStack.map(t => techBadge(t, 0, 0));
    const totalW = badgeData.reduce((s, b) => s + b.width, 0);
    let bx = align === 'left' ? cx : cx - totalW / 2;
    badgeData.forEach(b => { techSVG += b.svg.replace('translate(0,0)', `translate(${bx},0)`); bx += b.width; });
  }

  // -- Vertical positioning
  let contentY = H * 0.5 - 20;
  if (title || subtitle) contentY = H * 0.4;
  const nameY = contentY;
  const titleY = nameY + 30;
  const subtitleY = titleY + 22;
  const locY = (subtitle ? subtitleY : titleY) + 26;
  const socialY = locY + (location ? 22 : 0);
  const techY = socialY + 24;

  // build background pattern
  const bgPattern = pattern === 'grid'
    ? grid(W, H, ico)
    : pattern === 'none' ? ''
      : dots(W, H, ico);

  // Gradient: diagonal, theme bg → translucent accent
  const gradId = 'bg';
  const grad2Id = 'shimmer';

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Main background gradient -->
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   style="stop-color:${bg};stop-opacity:1"/>
      <stop offset="60%"  style="stop-color:${bg};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:${acc};stop-opacity:0.3"/>
    </linearGradient>
    <!-- Shimmer overlay -->
    <linearGradient id="${grad2Id}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   style="stop-color:${ico};stop-opacity:0"/>
      <stop offset="50%"  style="stop-color:${ico};stop-opacity:0.06"/>
      <stop offset="100%" style="stop-color:${ico};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="card-clip">
      <rect width="${W}" height="${H}" rx="16"/>
    </clipPath>
  </defs>

  <!-- Card background -->
  <rect width="${W}" height="${H}" rx="16" fill="url(#${gradId})" stroke="${bdr}" stroke-width="1.5"/>

  <!-- Clip group for all inner elements -->
  <g clip-path="url(#card-clip)">

    <!-- Background pattern -->
    ${bgPattern}

    <!-- Decorative blob circles -->
    ${blobs(W, H, ico, acc)}

    <!-- Animated wave -->
    ${showWave ? wave(W, H, acc) : ''}

    <!-- Shimmer overlay -->
    <rect width="${W}" height="${H}" fill="url(#${grad2Id})"/>

    <!-- Corner accent lines -->
    ${cornerAccents(W, H, ico)}

    <!-- ── CONTENT ── -->

    <!-- Name -->
    <text x="${cx}" y="${nameY}" font-family="Arial,sans-serif" font-size="40" font-weight="bold"
      fill="${txt}" text-anchor="${anchor}" letter-spacing="1">${escapeSVG(name)}</text>

    <!-- Accent underline under name -->
    <rect x="${align === 'left' ? cx : cx - 60}" y="${nameY + 5}" width="120" height="3" rx="2" fill="${acc}" opacity="0.7"/>

    <!-- Title -->
    ${title ? `<text x="${cx}" y="${titleY}" font-family="Arial,sans-serif" font-size="18" font-weight="600"
      fill="${acc}" text-anchor="${anchor}" opacity="0.95">${escapeSVG(title)}</text>` : ''}

    <!-- Subtitle -->
    ${subtitle ? `<text x="${cx}" y="${subtitleY}" font-family="Arial,sans-serif" font-size="14"
      fill="${sub}" text-anchor="${anchor}" opacity="0.85">${escapeSVG(subtitle)}</text>` : ''}

    <!-- Location -->
    ${locationTag(location, cx, locY, sub)}

    <!-- Social pills -->
    ${socialPills(social, cx, socialY, acc, sub)}

    <!-- Tech badges -->
    ${techStack.length > 0 ? `<g transform="translate(0,${techY})">${techSVG}</g>` : ''}

  </g>
</svg>`;
};