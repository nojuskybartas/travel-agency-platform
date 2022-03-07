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
        secondary: '#9DBF9E',
        footer: '#CC978E',
        form: {
          navbar: '#274029',
          navbarBorder: '#97A097',
          navbarBorderActive: '#ACD1AD',
          navbarText: '#DEF0DF',
          form: '#9DBF9E',
          formText: '#FFFFFF',
        }
      }
    },
  },
  plugins: [require('tailwind-scrollbar-hide')]
}

