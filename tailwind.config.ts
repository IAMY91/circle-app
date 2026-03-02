import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fire-base': {
          '0%, 100%': { transform: 'scaleX(1) scaleY(1) skewX(0deg)' },
          '33%': { transform: 'scaleX(1.08) scaleY(0.94) skewX(-3deg)' },
          '66%': { transform: 'scaleX(0.94) scaleY(1.06) skewX(2deg)' },
        },
        'fire-mid': {
          '0%, 100%': { transform: 'scaleX(0.9) scaleY(1.1) skewX(2deg)', opacity: '0.9' },
          '50%': { transform: 'scaleX(1.1) scaleY(0.92) skewX(-2deg)', opacity: '1' },
        },
        'fire-tip': {
          '0%, 100%': { transform: 'scaleY(1) translateX(0)', opacity: '0.7' },
          '40%': { transform: 'scaleY(1.2) translateX(3px)', opacity: '0.5' },
          '70%': { transform: 'scaleY(0.9) translateX(-3px)', opacity: '0.8' },
        },
        'candle-flicker': {
          '0%, 100%': { transform: 'scaleX(1) scaleY(1) rotate(-1deg)', opacity: '0.95' },
          '25%': { transform: 'scaleX(0.95) scaleY(1.05) rotate(1.5deg)', opacity: '1' },
          '50%': { transform: 'scaleX(1.05) scaleY(0.97) rotate(-0.5deg)', opacity: '0.92' },
          '75%': { transform: 'scaleX(0.97) scaleY(1.03) rotate(1deg)', opacity: '0.98' },
        },
        'hand-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.7' },
        },
      },
      animation: {
        'fire-base': 'fire-base 1.6s ease-in-out infinite',
        'fire-mid': 'fire-mid 1.3s ease-in-out infinite',
        'fire-tip': 'fire-tip 1.0s ease-in-out infinite',
        'candle-flicker': 'candle-flicker 2.8s ease-in-out infinite',
        'hand-pulse': 'hand-pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
