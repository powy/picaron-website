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
        oldstyle: ['var(--font-oldstyle)', 'serif'],
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