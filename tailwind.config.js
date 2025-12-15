const path = require("node:path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, "apps/**/*.{js,ts,jsx,tsx,html}"),
    path.join(__dirname, "packages/**/*.{js,ts,jsx,tsx,html}")
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
