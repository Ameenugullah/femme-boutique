/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfaf6',
          100: '#faf4ec',
          200: '#f4e9d8',
        },
        blush: {
          100: '#fce8e8',
          200: '#f9d0d0',
          300: '#f4a8a8',
          400: '#eb7070',
          500: '#e04a4a',
          600: '#c93333',
        },
        charcoal: {
          700: '#2d2d2d',
          800: '#1e1e1e',
          900: '#111111',
        },
        sand: {
          100: '#f5f0e8',
          200: '#ede5d4',
          300: '#d4c5a9',
        },
      },
      fontFamily: {
        script: ['Great Vibes', 'cursive'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0,0,0,0.06)',
        'medium': '0 8px 40px rgba(0,0,0,0.10)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
