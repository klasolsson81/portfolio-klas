/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // VIKTIGT: Detta gör att vi kan styra temat manuellt
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00f3ff",
          purple: "#bd00ff",
          pink: "#ff00ff",
          dark: "#0a0a12",
          darkbg: "#0a0b1e",
          darkerbg: "#050614",
          // Nya ljusa färger (Cyber Light)
          lightbg: "#f3f4f6",      // Ljusgrå bakgrund
          lighterbg: "#ffffff",    // Vitare ytor
          lighttext: "#1f2937",    // Mörkgrå text
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 10s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        
      }
    },
  },
  plugins: [],
}