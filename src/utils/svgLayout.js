/**
 * SVG Layout Helpers - Consolidates common SVG patterns
 */

/**
 * Container for SVG structure with padding and background
 */
export function svgContainer({
  width = 900,
  height = 300,
  bgColor = '#fff',
  borderColor = '#ddd',
  borderWidth = 1,
  borderRadius = 12,
  children = ''
} = {}) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <style>
          .svg-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
          .svg-heading { font-size: 18px; font-weight: 600; fill: #333; }
          .svg-label { font-size: 12px; fill: #666; }
          .svg-value { font-size: 14px; fill: #333; font-weight: 500; }
        </style>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="${bgColor}" stroke="${borderColor}" stroke-width="${borderWidth}" rx="${borderRadius}" />
      ${children}
    </svg>
  `.trim();
}

/**
 * Text element with styling
 */
export function svgText({
  x,
  y,
  text,
  fontSize = 14,
  fill = '#333',
  fontWeight = '400',
  textAnchor = 'start',
  className = 'svg-text'
} = {}) {
  return `<text x="${x}" y="${y}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" text-anchor="${textAnchor}" class="${className}">${text}</text>`;
}

/**
 * Bar chart component
 */
export function svgBar({
  x,
  y,
  width,
  height,
  fill = '#0366d6',
  label = '',
  value = '',
  labelFill = '#666',
  valueFill = '#333'
} = {}) {
  return `
    <g>
      ${label ? `<text x="${x}" y="${y - 8}" font-size="12" fill="${labelFill}" class="svg-text">${label}</text>` : ''}
      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" rx="4" />
      ${value ? `<text x="${x + width / 2}" y="${y + height / 2 + 4}" font-size="11" fill="${valueFill}" text-anchor="middle" class="svg-text" font-weight="500">${value}</text>` : ''}
    </g>
  `.trim();
}

/**
 * Legend item
 */
export function svgLegendItem({
  x,
  y,
  color,
  label,
  size = 12
} = {}) {
  return `
    <g>
      <rect x="${x}" y="${y - size / 2}" width="${size}" height="${size}" fill="${color}" rx="2" />
      <text x="${x + size + 8}" y="${y + 4}" font-size="13" fill="#666" class="svg-text">${label}</text>
    </g>
  `.trim();
}

/**
 * Stat card component
 */
export function svgStatCard({
  x,
  y,
  width,
  label,
  value,
  icon = '',
  bgColor = '#f6f8fa',
  labelFill = '#666',
  valueFill = '#333'
} = {}) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="100" fill="${bgColor}" rx="6" />
      ${icon ? `<text x="${x + 16}" y="${y + 30}" font-size="24">${icon}</text>` : ''}
      <text x="${x + 16}" y="${y + 65}" font-size="12" fill="${labelFill}" class="svg-text">${label}</text>
      <text x="${x + 16}" y="${y + 85}" font-size="20" fill="${valueFill}" class="svg-text" font-weight="600">${value}</text>
    </g>
  `.trim();
}

/**
 * Progress bar component
 */
export function svgProgressBar({
  x,
  y,
  width = 300,
  height = 8,
  percentage = 0,
  fillColor = '#0366d6',
  bgColor = '#e1e4e8',
  label = '',
  value = ''
} = {}) {
  const fillWidth = (width * percentage) / 100;

  return `
    <g>
      ${label ? `<text x="${x}" y="${y - 8}" font-size="12" fill="#666" class="svg-text">${label}</text>` : ''}
      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${bgColor}" rx="4" />
      <rect x="${x}" y="${y}" width="${fillWidth}" height="${height}" fill="${fillColor}" rx="4" />
      ${value ? `<text x="${x + width + 12}" y="${y + height + 2}" font-size="11" fill="#666" class="svg-text">${value}</text>` : ''}
    </g>
  `.trim();
}

/**
 * Divider line
 */
export function svgDivider({
  x1,
  y1,
  x2,
  y2,
  stroke = '#e1e4e8',
  strokeWidth = 1
} = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
}

/**
 * Badge component
 */
export function svgBadge({
  x,
  y,
  text,
  bgColor = '#f1f8e9',
  textColor = '#33691e',
  size = 'sm'
} = {}) {
  const sizes = {
    sm: { width: 60, height: 20, fontSize: 11, padding: 4 },
    md: { width: 80, height: 24, fontSize: 12, padding: 6 },
    lg: { width: 100, height: 28, fontSize: 13, padding: 8 }
  };

  const s = sizes[size] || sizes.sm;

  return `
    <g>
      <rect x="${x}" y="${y}" width="${s.width}" height="${s.height}" fill="${bgColor}" rx="${s.height / 2}" />
      <text x="${x + s.width / 2}" y="${y + s.height / 2 + 4}" font-size="${s.fontSize}" fill="${textColor}" text-anchor="middle" class="svg-text" font-weight="500">${text}</text>
    </g>
  `.trim();
}

/**
 * Tooltip-like info box
 */
export function svgInfoBox({
  x,
  y,
  width,
  title,
  content,
  bgColor = '#f6f8fa',
  borderColor = '#e1e4e8'
} = {}) {
  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="auto" fill="${bgColor}" stroke="${borderColor}" stroke-width="1" rx="6" />
      <text x="${x + 12}" y="${y + 20}" font-size="13" fill="#333" class="svg-text" font-weight="600">${title}</text>
      <text x="${x + 12}" y="${y + 40}" font-size="12" fill="#666" class="svg-text">${content}</text>
    </g>
  `.trim();
}

/**
 * Build grid layout for multiple items
 */
export function buildGrid({
  cols = 3,
  width = 900,
  gap = 20,
  padding = 20
} = {}) {
  const contentWidth = width - padding * 2;
  const itemWidth = (contentWidth - gap * (cols - 1)) / cols;

  const grid = [];
  for (let i = 0; i < 100; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = padding + col * (itemWidth + gap);
    const y = padding + row * (itemWidth + gap);

    grid.push({ row, col, x, y, width: itemWidth, height: itemWidth });
  }

  return grid;
}

/**
 * Build horizontal layout
 */
export function buildHorizontalLayout({
  items = 3,
  width = 900,
  height = 300,
  gap = 20,
  padding = 20
} = {}) {
  const contentWidth = width - padding * 2;
  const itemWidth = (contentWidth - gap * (items - 1)) / items;

  const layout = [];
  for (let i = 0; i < items; i++) {
    layout.push({
      index: i,
      x: padding + i * (itemWidth + gap),
      y: padding,
      width: itemWidth,
      height: height - padding * 2
    });
  }

  return layout;
}

/**
 * Build vertical layout (stack)
 */
export function buildVerticalLayout({
  items = 5,
  width = 900,
  gap = 10,
  padding = 20,
  itemHeight = 40
} = {}) {
  const layout = [];
  for (let i = 0; i < items; i++) {
    layout.push({
      index: i,
      x: padding,
      y: padding + i * (itemHeight + gap),
      width: width - padding * 2,
      height: itemHeight
    });
  }

  return layout;
}
