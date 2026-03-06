/**
 * Centralized error SVG rendering to eliminate duplication
 * @param {string} message - Error message to display
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @returns {string} - SVG error response
 */
export function renderErrorSVG(message = 'Error', width = 400, height = 200) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#ffcccc"/>
    <text x="20" y="50" font-family="Arial" font-size="16" fill="#cc0000">${message}</text>
  </svg>`;
}
