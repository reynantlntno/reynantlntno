/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        dark: '#333',
        muted: '#555',
        light: '#f8feff',
        'glass-light': 'rgba(255, 255, 255, 0.7)',
        'glass-dark': 'rgba(30, 30, 30, 0.7)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Source Code Pro"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient-shift': 'gradient 8s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}