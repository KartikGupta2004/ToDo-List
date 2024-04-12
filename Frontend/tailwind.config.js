/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      width:{
        "450":"450px"
      },
      height:{
        "799":"799px"
      },
      backgroundImage: {
        'HomeBg': "linear-gradient(rgba(4,9,30,0.7),rgba(4,9,30,0.7)), url('https://www.sheknows.com/wp-content/uploads/2018/08/dgldbejjyofmcsfvkfd9.jpeg?w=1920')",
     },
    },
  },
  plugins: [],
}

