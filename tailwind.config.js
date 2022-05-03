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
          complete: '#587355',
          incomplete: '#7b9678',
          disabled: '#949e93',
          submitButton: '#587355',
          navbar: '#6a7d70',
          navbarBorder: '#869189',
          navbarBorderActive: '#349134',
          navbarBorderDisabled: '#99a39c',
          navbarText: '#3b423d',
          form: '#9DBF9E',
          formText: '#1d1f1d',
        }
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')]
}

