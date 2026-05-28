/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#bef264', // Lime 300
          DEFAULT: '#a3e635', // Lime 400
          dark: '#65a30d', // Lime 600
        },
        background: '#0a0a0a',
        surface: '#171717',
        accent: '#8b5cf6', // Violet 500
        text: '#f8fafc',
        textSecondary: '#94a3b8',
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
