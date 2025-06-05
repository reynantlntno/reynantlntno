module.exports = {
  content: [
    "./src/components/**/*.{js,vue,ts}",
    "./src/layouts/**/*.vue",
    "./src/pages/**/*.vue",
    "./src/plugins/**/*.{js,ts}",
    "./src/app.vue"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'sans-serif']
      },
      colors: {
        'custom': {
          'slate': {
            600: '#475569',
            700: '#334155',
            800: '#1e293b'
          },
          'zinc': {
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a'
          },
          'blue': {
            50: '#eff6ff',
            100: '#dbeafe',
            400: '#60a5fa',
            600: '#2563eb',
            800: '#1e40af',
            900: '#1e3a8a'
          },
          'navy': '#0f172a',
          'indigo': '#312e81',
          'emerald': '#065f46',
          'amber': '#b45309',
          'rose': '#881337',
          'teal': '#115e59',
          'stone': '#44403c',
          'cool-gray': '#2d2d2d'
        }
      },
      backdropBlur: {
        'xs': '2px'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'hero-fade-in': 'heroFadeIn 1s ease-out forwards',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'mouse-wheel': 'mouseWheel 2s ease-in-out infinite',
        'fade-in-out': 'fadeInOut 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        heroFadeIn: {
          'from': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        mouseWheel: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
          '50%': {
            opacity: '0.5',
            transform: 'translateY(8px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeInOut: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
}