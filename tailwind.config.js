/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aqua: {
          blue: '#007AFF',
          light: '#5AC8FA',
          dark: '#0051D5',
          accent: '#34C759',
          warning: '#FF9500',
          error: '#FF3B30',
          background: '#F2F2F7',
          surface: '#FFFFFF',
          border: '#C6C6C8',
          text: '#000000',
          secondary: '#8E8E93'
        }
      },
      fontFamily: {
        system: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif']
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        aqua: '0 4px 12px rgba(0, 0, 0, 0.15)',
        'aqua-lg': '0 10px 25px rgba(0, 0, 0, 0.2)',
        'aqua-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'wallpaper': 'wallpaperFloat 20s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wallpaperFloat: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-10px) translateX(5px)' },
          '50%': { transform: 'translateY(-5px) translateX(-5px)' },
          '75%': { transform: 'translateY(-15px) translateX(3px)' },
        }
      }
    },
  },
  plugins: [],
}