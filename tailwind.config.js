/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf7f1',
          100: '#f3e8d6',
          200: '#e6d0ad',
          300: '#d6b27c',
          400: '#c69155',
          500: '#b3753b',
          600: '#9a5e30',
          700: '#7d4a2a',
          800: '#5f3a25',
          900: '#3f2818',
          950: '#22150c',
        },
        sky: {
          50: '#fbf7f1',
          100: '#f3e8d6',
          200: '#e6d0ad',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(154, 94, 48, 0.12)',
        glow: '0 8px 32px -4px rgba(198, 145, 85, 0.40)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
    },
  },
  plugins: [],
};
