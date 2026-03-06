import { escapeSVG } from '../utils/sanitize.js';

export const generateBadge = (label, value, color = '#4c1') => {
  const safeLabel = escapeSVG(label);
  const safeValue = escapeSVG(value);
  const labelWidth = safeLabel.length * 7 + 10;
  const valueWidth = safeValue.length * 7 + 10;
  const totalWidth = labelWidth + valueWidth;
  const height = 20;

  return `<svg width="${totalWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="badge" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#bbb;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#999;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${labelWidth}" height="${height}" fill="url(#badge)" rx="3" ry="3"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${color}" rx="3" ry="3"/>
    <text x="${labelWidth / 2}" y="14" text-anchor="middle" fill="#000" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">${safeLabel}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14" text-anchor="middle" fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">${safeValue}</text>
  </svg>`;
};

export const renderBadgeCard = (badgeData) => {
  return generateBadge(badgeData.label, badgeData.value);
};