import { widgetDefaults } from '../config/widgetConfig.js';

export function getWidgetOptions(query = {}) {
  const explicitCredit = String(query.credit).toLowerCase() === 'true';
  const legacyHideCredit = String(query.hide_credit).toLowerCase() === 'true';
  const showAttribution = legacyHideCredit
    ? false
    : explicitCredit || widgetDefaults.showAttribution;

  return {
    showAttribution,
    attributionText: query.credit_text || widgetDefaults.attributionText,
    attributionLink: query.credit_link || widgetDefaults.attributionLink,
  };
}

export function getWidgetCacheKeySuffix(options) {
  return options.showAttribution
    ? `credit_on_${options.attributionText}_${options.attributionLink}`
    : 'credit_off';
}
