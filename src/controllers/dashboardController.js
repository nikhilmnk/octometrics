import { validateUsername } from '../utils/validator.js';
import { get, set } from '../utils/cache.js';
import { generateDashboard } from '../engines/dashboardEngine.js';
import { generateDashboardCard } from '../svg/dashboardCard.js';
import { loadTheme } from '../utils/themeLoader.js';

export const dashboardController = async (req, res) => {
  try {
    const {
      username,
      theme = 'dark',
      layout = 'default',  // 'default' | 'compact' | 'wide'
    } = req.query;

    if (!validateUsername(username)) {
      const errorSvg = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc" rx="8"/><text x="20" y="60" font-family="Arial" font-size="16" fill="#cc0000">Invalid username</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const cacheKey = `dashboard_${username}_${theme}_${layout}`;
    const cachedSvg = get(cacheKey);
    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    const dashboard = await generateDashboard(username);

    const themeObj = loadTheme(theme);
    const svg = generateDashboardCard(dashboard, themeObj, layout);

    set(cacheKey, svg);
    res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    console.error('Dashboard error:', error);
    let errorMessage = 'Error generating dashboard';
    if (error.message.includes('404')) errorMessage = 'User not found';
    else if (error.message.includes('403') || error.message.includes('401')) errorMessage = 'GitHub API rate limit exceeded';
    const errorSvg = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1e1e1e" rx="8"/><text x="20" y="60" font-family="Arial" font-size="16" fill="#ff7b72">${errorMessage}</text><text x="20" y="90" font-family="Arial" font-size="12" fill="#8b949e">${error.message.slice(0, 120)}</text></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
  }
};