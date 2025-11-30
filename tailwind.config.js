/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neon colors (Dark mode)
        neon: {
          cyan: "#00f3ff",
          purple: "#bd00ff",
          pink: "#ff00ff",
          dark: "#0a0a12",
          darkbg: "#0a0b1e",
          darkerbg: "#050614",
        },
        // Soft warm colors (Light mode)
        warm: {
          bg: "#faf7f2",         // Huvudbakgrund - varm cream
          card: "#fffcf8",       // Kortbakgrund - ljusare varm vit
          panel: "#f5f0e8",      // Sidopanel/nav bakgrund
          text: "#4a4036",       // Primär text - espresso-brun
          muted: "#7a6f63",      // Sekundär text - varm grå-brun
          subtle: "#a39889",     // Subtle text/ikoner
          border: "#e8dfd3",     // Borders - sand/beige
          hover: "#f0e9df",      // Hover states
          active: "#ebe3d6",     // Active/selected states
          accent: "#9333ea",     // Accent lila (mjukare än neon)
          accentLight: "#f3e8ff", // Ljus lila bakgrund
        }
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