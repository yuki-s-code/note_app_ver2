/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#FAFAF2',
          200: '#F3F3E9',
          300: '#EBEBE1',
          400: '#E4E4D8',
          500: '#DCDCCF',
          600: '#C8C8BB',
          700: '#B3B3A6',
          800: '#9F9F92',
          900: '#8A8A7E',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography', "@tailwindcss/line-clamp"),
  ],
})
