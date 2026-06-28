/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F1E4",
        ink: "#1F2A24",
        rule: "#D9CFAF",
        income: "#2F6B4F",
        expense: "#A4402A",
        accent: "#C99A3B",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
