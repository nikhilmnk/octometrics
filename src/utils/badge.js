const NAMED_COLORS = {
  brightgreen: '#4c1',
  green: '#97ca00',
  yellowgreen: '#a4a61d',
  yellow: '#dfb317',
  orange: '#fe7d37',
  red: '#e05d44',
  blue: '#007ec6',
  lightgrey: '#9f9f9f',
  success: '#4c1',
  important: '#fe7d37',
  critical: '#e05d44',
  informational: '#007ec6',
  inactive: '#9f9f9f',
};

function decodeBadgePart(value) {
  return decodeURIComponent(String(value || ''))
    .replace(/_/g, ' ')
    .trim();
}

export function resolveBadgeColor(color) {
  const normalized = String(color || '')
    .trim()
    .toLowerCase();

  if (!normalized) {
    return '#4c1';
  }

  if (NAMED_COLORS[normalized]) {
    return NAMED_COLORS[normalized];
  }

  if (/^[0-9a-f]{3}$/i.test(normalized) || /^[0-9a-f]{6}$/i.test(normalized)) {
    return `#${normalized}`;
  }

  if (
    /^#[0-9a-f]{3}$/i.test(normalized) ||
    /^#[0-9a-f]{6}$/i.test(normalized)
  ) {
    return normalized;
  }

  return '#4c1';
}

export function parseCustomBadgePath(badgePath, query = {}) {
  const raw = String(badgePath || '').trim();
  if (!raw) {
    throw new Error('Badge path is required');
  }

  const parts = raw.split('-').filter(Boolean);
  if (parts.length < 2) {
    throw new Error('Badge path must include text and color');
  }

  const color = resolveBadgeColor(parts.at(-1));
  const style = query.style === 'for-the-badge' ? 'for-the-badge' : 'flat';
  const label = decodeBadgePart(parts.slice(0, -1).join('-'));
  const message = decodeBadgePart(query.message || '');

  if (!label) {
    throw new Error('Badge text is required');
  }

  return {
    label,
    value: message,
    color,
    style,
    singleSegment: !message,
  };
}
