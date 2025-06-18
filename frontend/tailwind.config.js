/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4dabf5',
          main: '#2196f3',
          dark: '#1769aa',
          contrastText: '#fff',
        },
        secondary: {
          light: '#f73378',
          main: '#f50057',
          dark: '#ab003c',
          contrastText: '#fff',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // This ensures Tailwind's utility classes have higher specificity than MUI's styles
  important: '#root',
}