/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1a1a2e',
        primary: {
          light: '#3b82f6',
          DEFAULT: '#1e3a8a',
          dark: '#172554',
        },
        accent: {
          light: '#ff9e9e',
          DEFAULT: '#ff6b6b',
          dark: '#e63946',
        },
        node: {
          light: '#a5b4fc',
          DEFAULT: '#4f46e5',
          dark: '#312e81',
        },
        arrow: {
          light: '#93c5fd',
          DEFAULT: '#4da6ff',
          dark: '#1d4ed8',
        },
        subnode: {
          light: '#d8b4fe',
          DEFAULT: '#9966cc',
          dark: '#331166',
        },
      },
      spacing: {},
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}