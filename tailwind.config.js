/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
        },
        // SOLAR TECH - Varmt ljust tema
        warm: {
          bg: "#FFF6E5",           // Varm guld-beige (matchar CSS gradient)
          card: "#FFFFFF",         // Vit kortbakgrund
          cardAlt: "#FFF8F2",      // Alternativ kortfärg (persika-ton)
          text: "#1A1E29",         // Mörk blågrå (gunmetal) - rubriker
          muted: "#4A4A5E",        // Grå med lila ton - brödtext
          subtle: "#7A7A8E",       // Svagare text
          accent: "#7C3AED",       // Stark lila (Violet-600)
          accentLight: "#EDE9FE",  // Ljus lila bakgrund (Violet-100)
          accentDark: "#5B21B6",   // Mörkare lila (Violet-800)
          border: "#E8DFD3",       // Varm beige kantlinje
          hover: "#FFF5EB",        // Ljus persika hover
          active: "#FFEDD5",       // Aktiv state (orange-100)
          glow: "#FFE4C4",         // Varm glow-färg (bisque)
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
        'warm-gradient': 'linear-gradient(135deg, #FFECD2 0%, #FFF6E5 50%, #FFE4C4 100%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}