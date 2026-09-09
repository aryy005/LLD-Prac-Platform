/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        nexcent: {
          green: '#4CAF4F',
          'green-dark': '#388E3C',
          'green-light': '#E8F5E9',
          'green-tint': '#F1F8F2',
          charcoal: '#263238',
          gray: '#717171',
          silver: '#F5F7FA',
          border: '#E4E7EB',
          dark: '#18191F',
          muted: '#89939E'
        }
      }
    },
  },
  plugins: [],
}
