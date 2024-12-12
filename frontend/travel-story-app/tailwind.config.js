/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"],
    },
    extend: {
      // Colors used in the application
      colors: {
        primary: "#9E0031",
        secondary: "#EF863E",
      },
      backgroundImage: {
        'login-bg-img': "url('/src/assets/images/bg-image.png')",
        'signup-bg-img': "url('/src/assets/images/image1.jpg')",
      }
    },
    plugins: [],
  }
}