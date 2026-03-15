import { dark } from '../themes/dark.js';
import { light } from '../themes/light.js';
import { tokyonight } from '../themes/tokyonight.js';
import { dracula } from '../themes/dracula.js';
import { baseTheme } from '../themes/baseTheme.js';

const themes = { dark, light, tokyonight, dracula };

export const loadTheme = (themeName) => {
  return { ...baseTheme, ...(themes[themeName] || themes.dark) };
};
