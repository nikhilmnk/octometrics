import { validateUsername } from '../utils/validator.js';
import { get, set } from '../utils/cache.js';
import {
  fetchUserProfile,
  fetchUserRepositories,
} from '../services/githubService.js';
import { getUserStats } from '../engines/statsEngine.js';
import { generateStatsCard } from '../svg/statsCard.js';
import { loadTheme } from '../utils/themeLoader.js';
import { addSvgCredit, shouldHideCredit } from '../utils/svgCredit.js';

export const statsController = async (req, res) => {
  try {
    const { username, theme = 'dark', hide_credit } = req.query;
    const hideCredit = shouldHideCredit(hide_credit);
    if (!validateUsername(username)) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">Invalid username</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const cacheKey = `stats_${username}_${theme}_${hideCredit ? 'nocredit' : 'credit'}`;
    const cachedSvg = get(cacheKey);
    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    const profile = await fetchUserProfile(username);
    const repos = await fetchUserRepositories(username);
    const stats = getUserStats(profile, repos);
    const themeObj = loadTheme(theme);
    const svg = addSvgCredit(generateStatsCard(stats, themeObj), {
      hideCredit,
    });

    set(cacheKey, svg);

    res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    let errorMessage = 'Error fetching stats';
    if (error.message.includes('404')) errorMessage = 'User not found';
    else if (error.message.includes('403'))
      errorMessage = 'Rate limit exceeded';
    const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">${errorMessage}</text></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
  }
};
