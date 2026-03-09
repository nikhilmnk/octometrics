/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0d1117',
        'dark-panel': '#161b22',
        'dark-accent': '#58a6ff',
        'dark-border': '#30363d',
        'dark-text': '#c9d1d9',
      },
    },
  },
  plugins: [],
};
