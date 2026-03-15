import { baseTheme } from '../../themes/baseTheme.js';

export function createBaseCard({
  width = 400,
  height = 200,
  theme,
  children = '',
}) {
  const mergedTheme = { ...baseTheme, ...theme };

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .om-font { font-family: ${mergedTheme.fontFamily}; }
        </style>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${mergedTheme.borderRadius}" fill="${mergedTheme.background || '#0d1117'}" stroke="${mergedTheme.borderColor || '#30363d'}" stroke-width="1.5" />
      ${children}
    </svg>
  `.trim();
}
