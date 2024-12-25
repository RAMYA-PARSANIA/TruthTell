/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'scan-lines': {
          '0%, 100%': { transform: 'translateY(-50%)' },
          '50%': { transform: 'translateY(50%)' }
        }
      },
      animation: {
        'scan-lines': 'scan-lines 2s linear infinite'
      }
    },
  },
  plugins: [],
}
