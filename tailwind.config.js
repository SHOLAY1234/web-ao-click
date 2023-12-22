module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        green: '#00ff00', // Add your preferred green color code
      },
      
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ["night-owl"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "night-owl",
  },
};
