import { generateTyping } from '../engines/typingEngine.js';
import { generateTypingCard } from '../svg/typingCard.js';
import { loadTheme } from '../utils/themeLoader.js';
import { addSvgCredit, shouldHideCredit } from '../utils/svgCredit.js';

export const typingController = async (req, res) => {
  try {
    const {
      font = 'Fira Code',
      size = '24',
      duration = '3000',
      pause = '1000',
      color = '00F7FF',
      width = '700',
      center = 'false',
      vCenter = 'false',
      theme = 'dark',
      hide_credit,
    } = req.query;
    const hideCredit = shouldHideCredit(hide_credit);

    let { lines } = req.query;

    if (!lines) {
      const errorSvg = `
      <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffcccc"/>
        <text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">
          Missing 'lines' parameter
        </text>
        <text x="10" y="80" font-family="Arial" font-size="12" fill="#cc0000">
          Example: ?lines=Hello+World;Welcome+Here
        </text>
      </svg>`;

      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send(errorSvg);
    }

    // decode "+" -> space
    lines = decodeURIComponent(lines.replace(/\+/g, ' '));

    // allow ; or ,
    const parsedLines = lines
      .split(/[;,]/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedDuration = parseInt(duration, 10) || 3000;
    const parsedPause = parseInt(pause, 10) || 1000;
    const parsedSize = parseInt(size, 10) || 24;
    const parsedWidth = parseInt(width, 10) || 700;

    const themeObj = loadTheme(theme);

    const typingData = generateTyping(parsedLines, parsedDuration, parsedPause);

    const svg = addSvgCredit(
      generateTypingCard({
        typingData,
        font,
        size: parsedSize,
        width: parsedWidth,
        color,
        center: center === 'true',
        vCenter: vCenter === 'true',
        theme: themeObj,
      }),
      { hideCredit }
    );

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(svg);
  } catch (error) {
    console.log('error', error);
    const errorSvg = `
    <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffcccc"/>
      <text x="10" y="50" font-family="Arial" font-size="16" fill="#cc0000">
        Error generating typing animation
      </text>
    </svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(errorSvg);
  }
};
