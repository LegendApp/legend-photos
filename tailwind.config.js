/** @type {import('tailwindcss').Config} */
const { themeColors } = require('./src/theme/colors');

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ...themeColors,
      },
    },
  },
}