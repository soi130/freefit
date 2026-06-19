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
        // Primary + secondary accent ramps. Values come from CSS variables so a
        // color scheme (olive/brick vs ultramarine/teal) can swap them.
        olive: {
          50: 'rgb(var(--olive-50) / <alpha-value>)',
          100: 'rgb(var(--olive-100) / <alpha-value>)',
          200: 'rgb(var(--olive-200) / <alpha-value>)',
          300: 'rgb(var(--olive-300) / <alpha-value>)',
          400: 'rgb(var(--olive-400) / <alpha-value>)',
          500: 'rgb(var(--olive-500) / <alpha-value>)',
          600: 'rgb(var(--olive-600) / <alpha-value>)',
          700: 'rgb(var(--olive-700) / <alpha-value>)',
          800: 'rgb(var(--olive-800) / <alpha-value>)',
        },
        brick: {
          50: 'rgb(var(--brick-50) / <alpha-value>)',
          100: 'rgb(var(--brick-100) / <alpha-value>)',
          200: 'rgb(var(--brick-200) / <alpha-value>)',
          300: 'rgb(var(--brick-300) / <alpha-value>)',
          400: 'rgb(var(--brick-400) / <alpha-value>)',
          500: 'rgb(var(--brick-500) / <alpha-value>)',
          600: 'rgb(var(--brick-600) / <alpha-value>)',
          700: 'rgb(var(--brick-700) / <alpha-value>)',
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
