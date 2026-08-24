import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        azure: '#2192FF',
        vitality: '#38E54D',
        lime: '#9CFF2E',
        radiant: '#FDFF00',
        obsidian: {
          DEFAULT: '#090A0F',
          surface: '#12151E',
          soft: '#181C28',
          border: '#262C3D',
          hover: '#1F2433',
        },
      },
      fontFamily: {
        editorial: ['var(--font-editorial)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
    },
  },
  plugins: [],
};
export default config;
