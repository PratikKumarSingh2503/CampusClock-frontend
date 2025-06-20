/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  safelist: [
    {
      pattern: /^rbc-/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
