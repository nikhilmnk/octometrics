import { validateUsername } from '../utils/validator.js';
import { get, set } from '../utils/cache.js';
import { getLanguageStats } from '../engines/languageEngine.js';
import { generateLanguageCard } from '../svg/languageCard.js';
import { loadTheme } from '../utils/themeLoader.js';
import { fetchUserRepositories } from '../services/githubService.js';

export const languagesController = async (req, res) => {
  try {
    const {
      username,
      theme = 'dark',
      layout = 'bar',     // 'bar' | 'circle'
      view = 'top',     // 'top' | 'all'
      top = '5',       // how many top languages (ignored when view=all)
    } = req.query;

    if (!validateUsername(username)) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">Invalid username</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const cacheKey = `languages_${username}_${theme}_${layout}_${view}_${top}`;
    const cachedSvg = get(cacheKey);
    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    const repos = await fetchUserRepositories(username);
    const { all, top: topLangs } = getLanguageStats(repos, parseInt(top, 10) || 5);

    const languages = view === 'all' ? all : topLangs;

    if (!languages || Object.keys(languages).length === 0) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">No languages found</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const themeObj = loadTheme(theme);
    const svg = generateLanguageCard(languages, themeObj, layout, view);

    set(cacheKey, svg);
    res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    let errorMessage = 'Error fetching languages';
    if (error.message.includes('404')) errorMessage = 'User not found';
    else if (error.message.includes('403')) errorMessage = 'Rate limit exceeded';
    const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">${errorMessage}</text></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
  }
};