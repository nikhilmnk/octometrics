export const createSVGElement = (tag, attrs = {}) => {
  let attrStr = '';
  for (const [key, value] of Object.entries(attrs)) {
    attrStr += ` ${key}="${value}"`;
  }
  return `<${tag}${attrStr}/>`;
};

export const wrapInSVG = (content, width = 400, height = 200) => {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};