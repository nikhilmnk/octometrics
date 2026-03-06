import { generateBanner } from '../engines/bannerEngine.js';
import { generateBannerCard } from '../svg/bannerCard.js';
import { loadTheme } from '../utils/themeLoader.js';

export const bannerController = async (req, res) => {
  try {
    const {
      username, name,
      title,
      subtitle,
      tech,
      location,
      social,
      wave = 'true',
      pattern = 'dots',
      align = 'center',
      theme = 'dark',
    } = req.query;

    const displayName = username || name;

    if (!displayName) {
      const err = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffcccc"/>
        <text x="20" y="50" font-family="Arial" font-size="16" fill="#cc0000">Missing 'username' (or 'name') parameter</text>
        <text x="20" y="80" font-family="Arial" font-size="12" fill="#cc0000">Example: ?username=nikhilmnk&amp;title=Developer&amp;tech=JS,TS,Go</text>
      </svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(err);
    }

    const themeObj = loadTheme(theme);
    const bannerData = generateBanner(displayName, title, tech, { subtitle, location, social, wave, pattern, align });
    const svg = generateBannerCard(bannerData, themeObj);

    res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    const err = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffcccc"/>
      <text x="20" y="50" font-family="Arial" font-size="16" fill="#cc0000">Error generating banner</text>
    </svg>`;
    res.setHeader('Content-Type', 'image/svg+xml').send(err);
  }
};