import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        garamond: ['var(--font-garamond)', 'serif'],
        granjon: ['var(--font-granjon)', 'serif'],
        oldstyle: ['var(--font-granjon)', 'serif'], // Map oldstyle to granjon for backwards compatibility
        caravagesque: ['Caravagesque', 'serif'],
      },
      fontSize: {
        // Custom large font sizes
        'huge': '6rem',
        '5xl': '4rem',
        '4xl': '3.5rem',
        '3xl': '2.8rem',
        '2xl': '2.2rem',
        'xl': '1.8rem',
        'lg': '1.5rem',
        'base': '1.25rem',
        'sm': '1.1rem',
        'menu': '2rem',
        'menu-mobile': '2.4rem',
      },
      colors: {
        ink: '#0c0c0d',
        parchment: '#f2e8d5',
        'pirate-red': '#8b2020',
        gold: '#d4a574',
        'sea-mist': '#1e3a3a',
        navy: '#1a2332',
        bone: '#faf8f3',
        wood: '#3e2f2a',
        copper: '#4e7c7b',
      },
    },
  },
  plugins: [],
};
export default config;