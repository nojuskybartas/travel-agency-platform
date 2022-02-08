module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'default': '1080px'
      },
      colors: {
        primary: '#A393EB',
        secondary: '#875870',
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')]
}

