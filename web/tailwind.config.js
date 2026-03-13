/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a', // Fundo preto premium
        surface: '#171717',    // Fundo de cards/dashboards
        primary: '#3b82f6',    // Azul corporativo para botões
        textMain: '#f5f5f5',   // Texto principal
        textMuted: '#a3a3a3',  // Texto secundário
      }
    },
  },
  plugins: [],
}