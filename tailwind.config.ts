import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}', // Your app components
    './src/components/**/*.{js,ts,jsx,tsx}', // Reusable components
    './src/styles/**/*.css', // Stylesheets
    './public/**/*.html', // Public HTML files
  ],
  safelist: [
    'bg-cyan-light', // Include specific classes that may be dynamically applied
    'text-cyan-dark',
    'hover:bg-pink-700',
  ],
  theme: {
    extend: {
      colors: {
        'cyan-light': '#E0F7FA',
        'cyan-DEFAULT': '#00BCD4', // The default cyan color
        'cyan-dark': '#0097A7',
        'pink-500': '#F21FBA',
        'pink-700': '#C51162', // Add additional pink shade for hover states
        'purple-600': '#7B1FA2',
        'purple-700': '#6A1B9A',
      },
      animation: {
        flip: 'flip 10s linear infinite', // Flip animation keyframes
      },
      keyframes: {
        flip: {
          '0%': { 
            transform: 'rotateY(0deg)', 
            '-webkit-transform': 'rotateY(0deg)', // Safari/Chrome prefix
          },
          '50%': { 
            transform: 'rotateY(90deg)', 
            '-webkit-transform': 'rotateY(90deg)',
          },
          '100%': { 
            transform: 'rotateY(0deg)', 
            '-webkit-transform': 'rotateY(0deg)',
          },
        },
      },
      fontFamily: {
        sans: ['"Patrick Hand"', 'cursive'], // Set Patrick Hand or any other handwritten font
      },
    },
  },
  plugins: [],
};

export default config;
