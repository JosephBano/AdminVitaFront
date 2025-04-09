/** @type {import('tailwindcss').Config} */
const primeui = require('tailwindcss-primeui');

module.exports = {
  darkMode: ['class', '.app-dark'],
  content: [
    "./src/**/*.{html,js,ts,scss,css}", 
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Valores existentes (mantenidos para compatibilidad)
        primary: '#1F295B',
        secondary: '#C4A857',
        
        // Nuevos valores basados en variables CSS
        'primary-var': 'var(--primary)',
        'surface': 'var(--surface)',
        'text': 'var(--text)',
        'background': 'var(--background)'
      },
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1920px'
    }
  },
  plugins: [primeui],
}