/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0A0A",
          red: "#E32227",
          blue: "#1E5FCC",
          blueDeep: "#164A9E",
          chrome: "#C0C0C0",
          chromeLight: "#E5E5E5",
        },
        surface: {
          DEFAULT: "#171717",
          light: "#FFFFFF",
          card: "#1F1F1F",
          cardLight: "#F1F1F1",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "swoosh-gradient":
          "linear-gradient(90deg, #1E5FCC 0%, #E32227 100%)",
      },
    },
  },
  plugins: [],
};
