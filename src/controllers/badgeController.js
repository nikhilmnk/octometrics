import { validateUsername, validateRepo } from '../utils/validator.js';
import { get, set } from '../utils/cache.js';
import { getBadgeData } from '../engines/badgeEngine.js';
import { renderBadgeCard } from '../svg/badgeCard.js';

export const badgeController = async (req, res) => {
  try {
    const { type } = req.params;
    const { repo, user } = req.query;

    let param, isValid;
    if (type === 'followers') {
      param = user;
      isValid = validateUsername(param);
    } else {
      param = repo;
      isValid = validateRepo(param);
    }

    if (!isValid) {
      const errorSvg = `<svg width="200" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e05d44" rx="3" ry="3"/><text x="100" y="14" text-anchor="middle" fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">Invalid ${type === 'followers' ? 'user' : 'repo'}</text></svg>`;
      return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
    }

    const cacheKey = `badge_${type}_${param}`;
    const cachedSvg = get(cacheKey);
    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    const badgeData = await getBadgeData(type, param);
    const svg = renderBadgeCard(badgeData);

    set(cacheKey, svg);

    res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    let errorMessage = 'Error';
    if (error.message.includes('404')) errorMessage = 'Not found';
    else if (error.message.includes('403')) errorMessage = 'Rate limit';
    const errorSvg = `<svg width="150" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e05d44" rx="3" ry="3"/><text x="75" y="14" text-anchor="middle" fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">${errorMessage}</text></svg>`;
    res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
  }
};
