/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FBF7F1',
          200: '#F5EFE0',
        },
        lavender: {
          100: '#E6E6FA',
          200: '#D8D8F0',
          300: '#C3C3E5'
        },
        rose: {
          50: '#FFF0F5',
          100: '#FFE4E1',
          200: '#FFD1DC',
          300: '#FFAEC9',
          500: '#FF69B4', // Hot pink
        },
        charcoal: {
          700: '#374151',
          800: '#2D3748',
          900: '#1A202C',
        },
        sos: {
          red: '#FF6B6B',
          glow: 'rgba(255, 107, 107, 0.5)',
        }
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        'glow': '0 0 20px rgba(255, 107, 107, 0.6)',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
