import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        'cyan-light': '#E0F7FA',
        'cyan-DEFAULT': '#00BCD4',
        'cyan-dark': '#0097A7',
        'pink-500': '#F21FBA',
        'pink-700': '#C51162', // Add additional pink shade for hover states
        'purple-600': '#7B1FA2',
        'purple-700': '#6A1B9A',
      },
      animation: {
        flip: 'flip 10s linear infinite', 
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
