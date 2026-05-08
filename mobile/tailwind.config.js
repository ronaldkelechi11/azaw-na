/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#d9f99d', // Lime green 200
          DEFAULT: '#84cc16', // Lime green 500
          dark: '#4d7c0f', // Lime green 700
        },
        background: '#ffffff',
        surface: '#f3f4f6', // Gray 100
        text: '#111827', // Gray 900
        textSecondary: '#6b7280', // Gray 500
      }
    },
  },
  plugins: [],
}
