/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a237e',
        secondary: '#0d47a1',
        danger: '#e74c3c',
        success: '#2ecc71',
        warning: '#f39c12',
      },
    },
  },
  plugins: [],
}