/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // VS Code inspired primary colors
        accent: {
          50: '#f0f8ff',
          100: '#e0f1ff',
          200: '#bae3ff',
          300: '#7dd0ff',
          400: '#3fb8ff',
          500: '#007acc', // VS Code blue
          600: '#0066b3',
          700: '#005299',
          800: '#003d80',
          900: '#002966',
        },
        // Dark mode colors (VS Code Dark+)
        carbon: {
          50: '#ffffff',
          100: '#f3f3f3',
          200: '#e8e8e8',
          300: '#c4c4c4',
          400: '#9d9d9d',
          500: '#6c6c6c',
          600: '#525252',
          700: '#3c3c3c',
          800: '#2d2d30', // VS Code editor background
          900: '#1e1e1e', // VS Code sidebar background
          950: '#0d1117', // GitHub dark
        },
        // Light mode colors (VS Code Light+)
        slate: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Syntax highlighting inspired colors
        syntax: {
          keyword: '#569cd6',    // Blue
          string: '#ce9178',     // Orange
          comment: '#6a9955',    // Green
          variable: '#9cdcfe',   // Light blue
          function: '#dcdcaa',   // Yellow
          type: '#4ec9b0',       // Teal
          error: '#f14c4c',      // Red
          warning: '#ffcc02',    // Yellow
          success: '#89d185',    // Green
        },
        // Status colors
        status: {
          info: '#007acc',
          success: '#89d185',
          warning: '#ffcc02',
          error: '#f14c4c',
          modified: '#e2c08d',
          added: '#89d185',
          deleted: '#f14c4c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Consolas', 'monospace'],
        code: ['Cascadia Code', 'JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        'code': ['0.875rem', { lineHeight: '1.25rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-out': 'fadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-out': 'slideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #007acc' },
          '100%': { boxShadow: '0 0 20px #007acc, 0 0 30px #007acc' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'blink-caret': {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: '#007acc' },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },
      backgroundImage: {
        // Dark mode gradients
        'dark-gradient': 'linear-gradient(135deg, #1e1e1e 0%, #2d2d30 50%, #3c3c3c 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 50%, #2d2d30 0%, #1e1e1e 100%)',
        'editor-dark': 'linear-gradient(180deg, #2d2d30 0%, #252526 50%, #1e1e1e 100%)',
        'sidebar-dark': 'linear-gradient(180deg, #252526 0%, #2d2d30 50%, #1e1e1e 100%)',
        
        // Light mode gradients  
        'light-gradient': 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #e5e5e5 100%)',
        'light-radial': 'radial-gradient(circle at 50% 50%, #f5f5f5 0%, #ffffff 100%)',
        'editor-light': 'linear-gradient(180deg, #ffffff 0%, #f8f8f8 50%, #f5f5f5 100%)',
        'sidebar-light': 'linear-gradient(180deg, #f8f8f8 0%, #f5f5f5 50%, #ffffff 100%)',
        
        // Accent gradients
        'accent-gradient': 'linear-gradient(135deg, #007acc 0%, #005299 100%)',
        'accent-radial': 'radial-gradient(circle at 50% 50%, #007acc 0%, #005299 100%)',
        'code-highlight': 'linear-gradient(90deg, transparent 0%, rgba(0, 122, 204, 0.1) 50%, transparent 100%)',
        
        // Special effects
        'grid-pattern': 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type= "fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.05"/%3E%3C/svg%3E")',
      },
      boxShadow: {
        'ide': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'ide-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'ide-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glow-accent': '0 0 20px rgba(0, 122, 204, 0.3)',
        'glow-success': '0 0 20px rgba(137, 209, 133, 0.3)',
        'glow-error': '0 0 20px rgba(241, 76, 76, 0.3)',
        'inner-ide': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'ide': '0.375rem',
        'ide-lg': '0.5rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}