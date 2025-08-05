/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        aqua: {
          // Classic Aqua blue colors
          blue: "#4A90E2",
          "blue-light": "#7BB3F0",
          "blue-dark": "#2E6DA4",

          // Window and chrome colors
          chrome: "#E8E8E8",
          "chrome-dark": "#D0D0D0",
          border: "#A0A0A0",
          "border-light": "#C0C0C0",

          // Background gradients
          "bg-start": "#E0E0E0",
          "bg-end": "#CCCCCC",

          // Selection and highlight colors
          selection: "#316AC5",
          highlight: "#B4D5FF",

          // Text colors
          text: "#000000",
          "text-secondary": "#666666",
          "text-disabled": "#999999",

          // Button and control colors
          button: "#F0F0F0",
          "button-hover": "#E0E0E0",
          "button-active": "#D0D0D0",

          // Traffic light colors
          red: "#FF5F57",
          yellow: "#FFBD2E",
          green: "#28CA42",

          // Brushed metal colors
          metal: "#C0C0C0",
          "metal-light": "#D0D0D0",
          "metal-dark": "#A0A0A0",
        },
      },
      fontFamily: {
        system: [
          "-apple-system",
          "BlinkMacSystemFont",
          "San Francisco",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        // Classic Aqua window shadows
        "aqua-window":
          "0 8px 24px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
        "aqua-button":
          "inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.2)",
        "aqua-pressed": "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
        "aqua-selection": "0 0 8px rgba(49, 106, 197, 0.6)",

        // Traffic light shadows
        "traffic-light":
          "inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)",

        // Menu bar shadow
        "menu-bar": "0 1px 3px rgba(0, 0, 0, 0.2)",
      },
      backgroundImage: {
        // Classic Aqua gradients
        "aqua-button": "linear-gradient(to bottom, #F8F8F8, #E8E8E8)",
        "aqua-button-hover": "linear-gradient(to bottom, #FFFFFF, #F0F0F0)",
        "aqua-button-active": "linear-gradient(to bottom, #E0E0E0, #D0D0D0)",
        "aqua-window": "linear-gradient(to bottom, #F0F0F0, #E8E8E8)",
        "aqua-titlebar":
          "linear-gradient(to bottom, #E8E8E8 0%, #D0D0D0 50%, #C8C8C8 100%)",
        "aqua-selection": "linear-gradient(to bottom, #4A90E2, #316AC5)",
        "aqua-desktop":
          "linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)",

        // Brushed metal texture
        "brushed-metal":
          "linear-gradient(90deg, #C8C8C8 0%, #D0D0D0 50%, #C8C8C8 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
        wallpaper: "wallpaperFloat 20s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wallpaperFloat: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "25%": { transform: "translateY(-10px) translateX(5px)" },
          "50%": { transform: "translateY(-5px) translateX(-5px)" },
          "75%": { transform: "translateY(-15px) translateX(3px)" },
        },
      },
    },
  },
  plugins: [],
};
