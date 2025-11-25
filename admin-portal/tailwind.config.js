/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#b18c5a',
          dark: '#8f6e41',
          light: '#d7bf98',
        },
      },
    },
  },
  plugins: [],
}


