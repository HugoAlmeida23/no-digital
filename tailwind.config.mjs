/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f7f8f0',
          100: '#eef0e1',
          200: '#dde1c3',
          300: '#c4ca9a',
          400: '#a9b06f',
          500: '#8d9650',
          600: '#6e773d',
          700: '#555c31',
          800: '#454a2a',
          900: '#3b4026',
          950: '#1e2112',
        },
        gold: {
          50: '#fdfaed',
          100: '#f9f0cb',
          200: '#f3e092',
          300: '#edcb5a',
          400: '#e8b832',
          500: '#d99b1a',
          600: '#c07814',
          700: '#a05614',
          800: '#834417',
          900: '#6c3816',
        },
        beige: {
          50: '#faf8f2',
          100: '#f4f0e2',
          200: '#e8dfc4',
          300: '#d9c99e',
          400: '#c8ae77',
          500: '#bc9a5a',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
    },
  },
  plugins: [],
};
