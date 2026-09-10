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
        leetcode: {
          dark: '#1a1a1a',
          panel: '#282828',
          card: '#1f1f1f',
          border: '#3e3e3e',
          text: '#eff1f6',
          muted: '#8a8a8a',
          green: '#2cbb5d',
          'green-hover': '#26a350',
          yellow: '#ffc01e',
          red: '#ff375f',
          cyan: '#00b8a3',
        },
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
