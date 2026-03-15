import {
  parseCustomBadgePath,
  resolveBadgeColor,
} from '../../src/utils/badge.js';

describe('custom badge parsing', () => {
  test('parses a single-segment badge with named color', () => {
    const badge = parseCustomBadgePath('JavaScript-yellow', {
      style: 'for-the-badge',
    });

    expect(badge).toEqual({
      label: 'JavaScript',
      value: '',
      color: '#dfb317',
      style: 'for-the-badge',
      singleSegment: true,
    });
  });

  test('accepts hex colors without the hash prefix', () => {
    expect(resolveBadgeColor('20232A')).toBe('#20232a');
  });

  test('supports underscore-separated text', () => {
    const badge = parseCustomBadgePath('Node_JS-green');

    expect(badge.label).toBe('Node JS');
    expect(badge.color).toBe('#97ca00');
  });
});
