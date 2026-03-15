import { escapeSVG } from '../utils/sanitize.js';

const FIRE_ICON =
  'M8.8.6c.2 1.4-.3 2.5-1.2 3.5-.7.7-1.2 1.4-1.2 2.5 0 1 .4 1.9 1 2.6-.3.1-.6.1-.9.1-2.5 0-4.5-2-4.5-4.5 0-1.9 1-3.2 2.2-4.6C5.2 1.2 5.9.5 6 .1c1 1 1.7 1.9 2 3 .3-.2.6-.5.8-.8zM10.7 4c1.5 1.2 3.3 3 3.3 5.7 0 3.5-2.6 6.3-6 6.3s-6-2.8-6-6.3c0-1.1.3-2.1.8-3 .2 3 2.1 4.7 4.2 4.7 2.4 0 4.1-1.7 4.1-4.1 0-1.1-.2-2.2-.4-3.3z';

const fmt = (value) =>
  value >= 1000
    ? `${(value / 1000).toFixed(value >= 10000 ? 1 : 2).replace(/\.?0+$/, '')}K`
    : String(value);

const metricCard = ({ x, y, width, label, value, accent, sub, bg }) => `
  <rect x="${x}" y="${y}" width="${width}" height="78" rx="10" fill="${bg}" opacity="0.38"/>
  <text x="${x + 14}" y="${y + 24}" font-family="Arial,sans-serif" font-size="11" fill="${sub}">${label}</text>
  <text x="${x + 14}" y="${y + 54}" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="${accent}">${value}</text>
`;

export const generateStreakCard = (username, streak, theme) => {
  const W = 495;
  const H = 195;
  const bg = theme.background;
  const bdr = theme.borderColor;
  const txt = theme.textColor;
  const sub = theme.subtextColor || '#8b949e';
  const acc = theme.accentColor;
  const ico = theme.iconColor || theme.accentColor;
  const cardBg = theme.borderColor;
  const metricWidth = 145;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="streakHeader" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${ico};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${bg};stop-opacity:0"/>
    </linearGradient>
    <clipPath id="streakClip">
      <rect width="${W}" height="${H}" rx="12"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${H}" rx="12" fill="${bg}" stroke="${bdr}" stroke-width="1.5"/>
  <rect clip-path="url(#streakClip)" x="0" y="0" width="${W}" height="55" fill="url(#streakHeader)"/>

  <g transform="translate(20,14) scale(1.1)">
    <path fill="${ico}" d="${FIRE_ICON}"/>
  </g>

  <text x="46" y="27" font-family="Arial,sans-serif" font-size="15" font-weight="bold" fill="${txt}">GitHub Streak</text>
  <text x="46" y="43" font-family="Arial,sans-serif" font-size="11" fill="${sub}">@${escapeSVG(username)} • ${streak.year}</text>

  <line x1="16" y1="58" x2="${W - 16}" y2="58" stroke="${bdr}" stroke-width="1"/>

  ${metricCard({
    x: 20,
    y: 86,
    width: metricWidth,
    label: 'Current Streak',
    value: `${streak.currentStreak} day${streak.currentStreak === 1 ? '' : 's'}`,
    accent: acc,
    sub,
    bg: cardBg,
  })}
  ${metricCard({
    x: 175,
    y: 86,
    width: metricWidth,
    label: 'Longest Streak',
    value: `${streak.longestStreak} day${streak.longestStreak === 1 ? '' : 's'}`,
    accent: acc,
    sub,
    bg: cardBg,
  })}
  ${metricCard({
    x: 330,
    y: 86,
    width: metricWidth,
    label: 'Total Contributions',
    value: fmt(streak.totalContributions),
    accent: acc,
    sub,
    bg: cardBg,
  })}
</svg>`;
};
