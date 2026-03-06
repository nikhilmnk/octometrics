import { validateUsername } from '../utils/validator.js';
import { get, set } from '../utils/cache.js';
import {
  getContributionGraph,
  generate3DContributionGrid,
} from '../engines/contributionEngine.js';
import { generateContributionGraph } from '../svg/contributionGraph.js';
import { generateContribution3DGraph } from '../svg/contribution3DGraph.js';
import { loadTheme } from '../utils/themeLoader.js';
import { fetchContributionGraph } from '../services/githubService.js';

const getContributions = async (req, res) => {
  try {
    const { username, theme = 'dark', year } = req.query;
    if (!validateUsername(username)) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">Invalid username</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const cacheKey = `contributions_${username}_${theme}_${year || 'current'}`;
    const cachedSvg = get(cacheKey);
    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    const { grid, totalContributions } = await getContributionGraph(
      username,
      year
    );
    if (!grid || grid.length === 0) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">No contribution data found</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const themeObj = loadTheme(theme);
    const svg = generateContributionGraph(
      grid,
      themeObj,
      totalContributions,
      year
    );

    set(cacheKey, svg);

    res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    console.log('error', error);
    let errorMessage = 'Error fetching contributions';
    if (error.message.includes('404')) errorMessage = 'User not found';
    else if (error.message.includes('403') || error.message.includes('401'))
      errorMessage = 'Rate limit / auth error';
    else if (error.message.includes('GITHUB_TOKEN'))
      errorMessage = 'GITHUB_TOKEN not set — add it to .env';
    const errorSvg = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1e1e1e" rx="8"/><text x="20" y="50" font-family="Arial" font-size="14" fill="#ff7b72">${errorMessage}</text><text x="20" y="80" font-family="Arial" font-size="11" fill="#8b949e">Add GITHUB_TOKEN=your_token to .env and restart the server.</text><text x="20" y="100" font-family="Arial" font-size="11" fill="#8b949e">Get a token at: https://github.com/settings/tokens (scope: read:user)</text></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
  }
};

const getContributions3D = async (req, res) => {
  try {
    const { username, theme = 'dark', year } = req.query;
    if (!validateUsername(username)) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">Invalid username</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const cacheKey = `contributions3d_${username}_${theme}_${year || 'current'}`;
    const cachedSvg = get(cacheKey);
    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    let from = null;
    let to = null;
    if (year && String(year).match(/^\d{4}$/)) {
      from = `${year}-01-01T00:00:00Z`;
      to = `${year}-12-31T23:59:59Z`;
    }
    const calendar = await fetchContributionGraph(username, from, to);
    if (!calendar || !calendar.weeks || calendar.weeks.length === 0) {
      const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffcccc"/><text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">No contribution data found</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const { grid, totalContributions } = generate3DContributionGrid(calendar);
    const themeObj = loadTheme(theme);
    const svg = generateContribution3DGraph(
      grid,
      themeObj,
      totalContributions,
      year
    );

    set(cacheKey, svg);

    res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    let errorMessage = 'Error fetching 3D contributions';
    if (error.message.includes('404')) errorMessage = 'User not found';
    else if (error.message.includes('403') || error.message.includes('401'))
      errorMessage = 'Rate limit / auth error';
    else if (error.message.includes('GITHUB_TOKEN'))
      errorMessage = 'GITHUB_TOKEN not set — add it to .env';
    const errorSvg = `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1e1e1e" rx="8"/><text x="20" y="50" font-family="Arial" font-size="14" fill="#ff7b72">${errorMessage}</text><text x="20" y="80" font-family="Arial" font-size="11" fill="#8b949e">Add GITHUB_TOKEN=your_token to .env and restart the server.</text><text x="20" y="100" font-family="Arial" font-size="11" fill="#8b949e">Get a token at: https://github.com/settings/tokens (scope: read:user)</text></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
  }
};

export const contributionController = {
  getContributions,
  getContributions3D,
};
