/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,svelte}"],
  theme: {
    screens: {
      xs: "420px",
      ...defaultTheme.screens,
    },

    extend: {},
  },
  plugins: [],
};
