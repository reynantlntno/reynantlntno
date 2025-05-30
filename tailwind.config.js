// filepath: /Users/reynantolentino/reynantlntno/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Source Code Pro"', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#007bff',
          dark: '#0056b3',
          light: '#3395ff',
        },
        dark: {
          DEFAULT: '#333',
          muted: '#555',
        },
        light: {
          DEFAULT: '#f8feff',
          muted: '#e6f4f1',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}