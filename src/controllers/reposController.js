import { validateUsername } from '../utils/validator.js';
import { get, set } from '../utils/cache.js';
import { getRepoStats } from '../engines/repoEngine.js';
import { generateRepoCard } from '../svg/repoCard.js';
import { loadTheme } from '../utils/themeLoader.js';
import { fetchUserRepositories } from '../services/githubService.js';

export const reposController = async (req, res) => {
  try {
    const {
      username,
      theme = 'dark',
      count = '6',      // how many repos to show
    } = req.query;

    if (!validateUsername(username)) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">Invalid username</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const cacheKey = `repos_${username}_${theme}_${count}`;
    const cachedSvg = get(cacheKey);
    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    const apiRepos = await fetchUserRepositories(username);
    const repos = getRepoStats(apiRepos, parseInt(count, 10) || 6);

    if (!repos || repos.length === 0) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">No repositories found</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const themeObj = loadTheme(theme);
    const svg = generateRepoCard(repos, themeObj);

    set(cacheKey, svg);
    res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    let errorMessage = 'Error fetching repos';
    if (error.message.includes('404')) errorMessage = 'User not found';
    else if (error.message.includes('403')) errorMessage = 'Rate limit exceeded';
    const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">${errorMessage}</text></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
  }
};