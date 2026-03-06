import { dark } from '../themes/dark.js';
import { light } from '../themes/light.js';
import { tokyonight } from '../themes/tokyonight.js';
import { dracula } from '../themes/dracula.js';

const themes = { dark, light, tokyonight, dracula };

export const loadTheme = (themeName) => {
  return themes[themeName] || themes.dark;
};
