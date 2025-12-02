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
          bg: "#FBF7F0",           // Krämig varm bakgrund
          card: "#FFFFFF",         // Vit kortbakgrund (med glassmorphism i CSS)
          cardAlt: "#FFF8F2",      // Alternativ kortfärg (persika-ton)
          text: "#1A1E29",         // Mörk blågrå (gunmetal) - rubriker
          muted: "#4A4A5E",        // Grå med lila ton - brödtext
          subtle: "#7A7A8E",       // Svagare text
          accent: "#8B5CF6",       // Elektrisk lila (Violet-500)
          accentLight: "#EDE9FE",  // Ljus lila bakgrund (Violet-100)
          accentDark: "#6D28D9",   // Mörkare lila för hover
          border: "#E8E0D5",       // Varm beige kantlinje
          hover: "#FFF5EB",        // Ljus persika hover
          active: "#FFEDD5",       // Aktiv state (orange-100)
          glow: "#F5E6D3",         // Varm glow-färg
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
        // Varm gradient för ljust läge
        'warm-gradient': 'linear-gradient(135deg, #FBF7F0 0%, #FFF5EB 50%, #FEF3E2 100%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}