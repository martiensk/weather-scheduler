/**
 * @file This file contains the Tailwind CSS configuration.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      animnation: {
        loader: 'icon-loader 1s ease-in-out infinite'
      },
      keyframes: {
        'icon-loader': {
          '0%': { transform: 'scale(2.5) rotation(0deg)' },
          '100%': { transform: 'scale(2.5) rotation(360deg)' }
        }
      }
    },
  },
  plugins: [],
};

