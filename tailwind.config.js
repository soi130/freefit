/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Olive + Brick pastel cartoon palette
        cream: '#f7f5ee',
        ink: '#33321c',
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
        stroke: '0 3px 0 0 rgba(51,50,28,0.9)',
        'stroke-sm': '0 2px 0 0 rgba(51,50,28,0.9)',
      },
    },
  },
  plugins: [],
};
