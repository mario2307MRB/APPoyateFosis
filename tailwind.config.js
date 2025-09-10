/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fosis-blue': {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#badcff',
          300: '#91c7ff',
          400: '#60aaff',
          500: '#3b8eff',
          600: '#1d6ef2',
          700: '#1a59de',
          800: '#0D47A1', // Original FOSIS Blue
          900: '#173b82',
          950: '#112650',
        },
        'fosis-green': {
          50: '#f0fdf8',
          100: '#dcfce9',
          200: '#bbf7d5',
          300: '#86efb8',
          400: '#4ade8f',
          500: '#10B981', // Original FOSIS Green
          600: '#059669', // Original FOSIS Green Dark
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        slate: {
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
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'soft-md': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'soft-lg': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)',
        'soft-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
            '0%': { opacity: '0', transform: 'scale(0.9)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
            '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bubble-pop': {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'pop-in': 'pop-in 0.3s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'gradient-pan': 'gradient-pan 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'bubble-pop': 'bubble-pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
      },
    },
  },
  plugins: [],
}