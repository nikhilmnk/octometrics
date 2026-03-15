import { escapeSVG } from '../utils/sanitize.js';

function getBadgeStyle(style) {
  if (style === 'for-the-badge') {
    return {
      height: 28,
      fontSize: 12,
      fontWeight: '700',
      charWidth: 8,
      paddingX: 14,
      textY: 18,
      radius: 4,
    };
  }

  return {
    height: 20,
    fontSize: 11,
    fontWeight: '400',
    charWidth: 7,
    paddingX: 10,
    textY: 14,
    radius: 3,
  };
}

export const generateBadge = (
  label,
  value = '',
  color = '#4c1',
  options = {}
) => {
  const safeLabel = escapeSVG(label);
  const safeValue = escapeSVG(value);
  const {
    style = 'flat',
    singleSegment = false,
    labelColor = '#555',
    textColor = '#fff',
  } = options;
  const badgeStyle = getBadgeStyle(style);
  const { height, fontSize, fontWeight, charWidth, paddingX, textY, radius } =
    badgeStyle;

  if (singleSegment) {
    const width = safeLabel.length * charWidth + paddingX * 2;

    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="${color}" rx="${radius}" ry="${radius}"/>
    <text x="${width / 2}" y="${textY}" text-anchor="middle" fill="${textColor}" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${fontSize}" font-weight="${fontWeight}">${safeLabel}</text>
  </svg>`;
  }

  const labelWidth = safeLabel.length * charWidth + paddingX;
  const valueWidth = safeValue.length * charWidth + paddingX;
  const totalWidth = labelWidth + valueWidth;

  return `<svg width="${totalWidth}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="badge" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#bbb;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#999;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${labelWidth}" height="${height}" fill="${labelColor}" rx="${radius}" ry="${radius}"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${color}" rx="${radius}" ry="${radius}"/>
    <text x="${labelWidth / 2}" y="${textY}" text-anchor="middle" fill="${textColor}" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${fontSize}" font-weight="${fontWeight}">${safeLabel}</text>
    <text x="${labelWidth + valueWidth / 2}" y="${textY}" text-anchor="middle" fill="${textColor}" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${fontSize}" font-weight="${fontWeight}">${safeValue}</text>
  </svg>`;
};

export const renderBadgeCard = (badgeData) => {
  return generateBadge(
    badgeData.label,
    badgeData.value,
    badgeData.color,
    badgeData
  );
};
