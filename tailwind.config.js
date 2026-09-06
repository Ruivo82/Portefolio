/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#222222',
          surface: '#181818',
          card: '#272727',
          hover: '#303030',
          border: '#383838',
          muted: '#8e8e8e',
        },
        brand: {
          red: '#ff0000',
          'red-dark': '#cc0000',
          'red-light': '#ff4d4d',
          'red-glow': 'rgba(255, 0, 0, 0.45)',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(255, 0, 0, 0.35)',
        'glow-md': '0 0 20px rgba(255, 0, 0, 0.45)',
        'glow-lg': '0 0 35px rgba(255, 0, 0, 0.6)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 4s infinite ease-in-out',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 0, 0, 0.65)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
