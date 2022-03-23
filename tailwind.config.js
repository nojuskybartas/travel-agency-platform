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
        background: '#d3e0d6',
        primary: '#587355',
        secondary: '#2f402d',
        shadow: '#2f402d',
        footer: '#a9b8ac',
        form: {
          navbar: '#274029',
          navbarBorder: '#97A097',
          navbarBorderActive: '#349134',
          navbarText: '#DEF0DF',
          form: '#9DBF9E',
          formText: '#1d1f1d',
        }
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')]
}

