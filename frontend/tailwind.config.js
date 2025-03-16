/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        quantico: ['Quantico', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none', /* IE & Edge */
          'scrollbar-width': 'none',    /* Firefox */
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',             /* Chrome, Safari */
        },
      })
    }
  ],
}

