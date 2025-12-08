/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

    // remotes
    "../../apps/redux-app/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/zustand-app/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/context-app/src/**/*.{js,ts,jsx,tsx}",

    // todo-app
    "../../packages/main-app/src/**/*.{js,ts,jsx,tsx}",

    // shared
    "../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared-core/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
