/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutrals + accents that flip between light/dark via CSS variables.
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        subtle: 'rgb(var(--c-subtle) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        // Olive + Brick pastel cartoon palette (fills, buttons, chips)
        olive: {
          50: '#f3f4ea',
          100: '#e4e7cf',
          200: '#cdd3a4',
          300: '#b3bd78',
          400: '#9aa654',
          500: '#7f8d3f',
          600: '#6b7d3a',
          700: '#525e2e',
          800: '#3f4825',
        },
        brick: {
          50: '#fbeeea',
          100: '#f5d6cc',
          200: '#eab0a0',
          300: '#dd8770',
          400: '#cf6347',
          500: '#bf4a2e',
          600: '#a53b24',
          700: '#82301f',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
      },
      boxShadow: {
        stroke: '0 3px 0 0 rgb(var(--c-stroke))',
        'stroke-sm': '0 2px 0 0 rgb(var(--c-stroke))',
      },
    },
  },
  plugins: [],
};
