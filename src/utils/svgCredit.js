import { escapeSVG } from './sanitize.js';

const CREDIT_TEXT = 'Powered by OctoMetrics';
const CREDIT_URL = 'https://github.com/nikhilmnk/octometrics';

function parseSvgDimension(svg, attr) {
  const directMatch = svg.match(new RegExp(`${attr}="([0-9.]+)`));
  if (directMatch) {
    return parseFloat(directMatch[1]);
  }

  const viewBoxMatch = svg.match(/viewBox="([0-9.\s-]+)"/);
  if (!viewBoxMatch) {
    return null;
  }

  const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return null;
  }

  return attr === 'width' ? parts[2] : parts[3];
}

export function shouldHideCredit(value) {
  return String(value).toLowerCase() === 'true';
}

export function addSvgCredit(svg, options = {}) {
  const { hideCredit = false } = options;

  if (hideCredit || !svg.includes('</svg>')) {
    return svg;
  }

  const width = parseSvgDimension(svg, 'width');
  const height = parseSvgDimension(svg, 'height');

  if (!width || !height) {
    return svg;
  }

  const fontSize = Math.max(7, Math.min(10, Math.floor(height / 18)));
  const x = width - 10;
  const y = height - 8;
  const safeText = escapeSVG(CREDIT_TEXT);
  const safeUrl = escapeSVG(CREDIT_URL);

  const footer = `
  <a href="${safeUrl}" target="_blank">
    <text x="${x}" y="${y}" text-anchor="end" font-family="Arial,sans-serif" font-size="${fontSize}" fill="#ffffff" opacity="0.35">${safeText}</text>
  </a>
`;

  return svg.replace('</svg>', `${footer}</svg>`);
}
