const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.tsx', './src/**/*.js', './src/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
