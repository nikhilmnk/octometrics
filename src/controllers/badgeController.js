import { validateUsername, validateRepo } from '../utils/validator.js';
import { get, set } from '../utils/cache.js';
import { getBadgeData } from '../engines/badgeEngine.js';
import { renderBadgeCard } from '../svg/badgeCard.js';
import { parseCustomBadgePath } from '../utils/badge.js';
import { addSvgCredit } from '../utils/svgCredit.js';
import {
  getWidgetCacheKeySuffix,
  getWidgetOptions,
} from '../utils/widgetOptions.js';

export const badgeController = async (req, res) => {
  try {
    const { type } = req.params;
    const { repo, user } = req.query;
    const widgetOptions = getWidgetOptions(req.query);

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

    const cacheKey = `badge_${type}_${param}_${getWidgetCacheKeySuffix(widgetOptions)}`;
    const cachedSvg = get(cacheKey);
    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    const badgeData = await getBadgeData(type, param);
    const svg = addSvgCredit(renderBadgeCard(badgeData), widgetOptions);

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

export const customBadgeController = (req, res) => {
  try {
    const { badge } = req.params;
    const widgetOptions = getWidgetOptions(req.query);
    const badgeData = parseCustomBadgePath(badge, req.query);
    const cacheKey = `custom_badge_${badge}_${JSON.stringify(req.query || {})}_${getWidgetCacheKeySuffix(widgetOptions)}`;
    const cachedSvg = get(cacheKey);

    if (cachedSvg) {
      return res.setHeader('Content-Type', 'image/svg+xml').send(cachedSvg);
    }

    const svg = addSvgCredit(renderBadgeCard(badgeData), widgetOptions);
    set(cacheKey, svg);

    return res.setHeader('Content-Type', 'image/svg+xml').send(svg);
  } catch (error) {
    const errorSvg = `<svg width="180" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#e05d44" rx="3" ry="3"/><text x="90" y="14" text-anchor="middle" fill="#fff" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">Invalid badge path</text></svg>`;
    return res.setHeader('Content-Type', 'image/svg+xml').send(errorSvg);
  }
};
