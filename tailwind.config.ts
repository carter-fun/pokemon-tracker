import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pokemon-inspired dark theme
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Pokemon theme colors
        pokemon: {
          red: '#FF1C1C',
          blue: '#1C6CFF',
          yellow: '#FFD733',
          green: '#4DAD5B',
          purple: '#7B62A3',
          orange: '#FF9C54',
          pink: '#FF6B9D',
          // Type-specific colors
          fire: '#F08030',
          water: '#6890F0',
          grass: '#78C850',
          electric: '#F8D030',
          psychic: '#F85888',
          ice: '#98D8D8',
          dragon: '#7038F8',
          darkType: '#705848',
          fairy: '#EE99AC',
          normal: '#A8A878',
          fighting: '#C03028',
          flying: '#A890F0',
          poison: '#A040A0',
          ground: '#E0C068',
          rock: '#B8A038',
          bug: '#A8B820',
          ghost: '#705898',
          steel: '#B8B8D0',
        },
        
        // Dark theme colors (separate from pokemon types)
        'pokemon-dark': {
          900: '#0a0a0f',
          800: '#12121a',
          700: '#1a1a25',
          600: '#252532',
          500: '#32324a',
        },
        
        // Accent colors
        pokeball: {
          red: '#EE1515',
          white: '#F0F0F0',
          black: '#222224',
        },
        
        // Gold for coins/points
        gold: {
          400: '#FFD700',
          500: '#DAA520',
          600: '#B8860B',
        },
      },
      fontFamily: {
        pokemon: ['Pokemon Solid', 'system-ui', 'sans-serif'],
        game: ['Press Start 2P', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'pokeball-shake': 'pokeball-shake 0.8s ease-in-out infinite',
        'holo-shimmer': 'holo-shimmer 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'pop': 'pop 0.3s ease-out',
        'squish': 'squish 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        'pokeball-shake': {
          '0%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(-20deg)' },
          '40%': { transform: 'rotate(20deg)' },
          '60%': { transform: 'rotate(-20deg)' },
          '80%': { transform: 'rotate(20deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'holo-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        squish: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.9, 1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'holo-gradient': 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
        'pokeball-gradient': 'linear-gradient(180deg, #EE1515 0%, #EE1515 45%, #222224 45%, #222224 55%, #F0F0F0 55%, #F0F0F0 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
