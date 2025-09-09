/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fosis-blue': {
          light: '#60a5fa',
          DEFAULT: '#0053a4',
          dark: '#003c77',
        },
        'fosis-green': {
          light: '#4ade80',
          DEFAULT: '#00a79d',
          dark: '#007a72',
        },
        primary: {
          DEFAULT: '#0053a4',
          dark: '#003c77',
          light: '#60a5fa',
        },
        secondary: {
            DEFAULT: '#00a79d',
            dark: '#007a72',
            light: '#4ade80',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
    },
  },
  plugins: [],
}
