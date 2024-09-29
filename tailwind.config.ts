import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.css',
  ],
  darkMode: 'media', // Dark mode based on user's system preference
  theme: {
    extend: {
      colors: {
        'cyan-light': '#E0F7FA',
        'cyan-DEFAULT': '#00BCD4',
        'cyan-dark': '#0097A7',
        'pink-500': '#F21FBA',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite', 
        flip: 'flip 10s linear infinite', 
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      backgroundImage: {
        'gradient-to-bottom': 'linear-gradient(to bottom, var(--background-start-rgb), var(--background-end-rgb))',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
