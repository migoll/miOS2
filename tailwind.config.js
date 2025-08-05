/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Vercel Design System Colors
        vercel: {
          // Dark mode (default)
          "dark-bg": "#111111",
          "dark-text": "#F0F0F0",
          "dark-text-secondary": "#999999",
          "dark-panel": "#181818",
          "dark-border": "#2A2A2A",

          // Light mode
          "light-bg": "#F0F0F0",
          "light-text": "#111111",
          "light-text-secondary": "#333333",
          "light-panel": "#ffffff",
          "light-border": "#DDDDDD",
        },
      },
      fontFamily: {
        mono: [
          "Geist Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Monaco",
          "Cascadia Code",
          "Roboto Mono",
          "Menlo",
          "monospace",
        ],
        sans: [
          "Geist Mono", // Use mono for everything
          "ui-monospace",
          "SFMono-Regular",
          "Monaco",
          "Cascadia Code",
          "Roboto Mono",
          "Menlo",
          "monospace",
        ],
      },
      maxWidth: {
        container: "800px",
      },
      spacing: {
        container: "2rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        // Vercel-style minimal shadows
        "vercel-panel":
          "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "vercel-window":
          "0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)",
        "vercel-button": "0 1px 2px rgba(0, 0, 0, 0.05)",
        "vercel-focus": "0 0 0 2px rgba(255, 255, 255, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
        "slide-in": "slideIn 0.2s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-4px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      transitionTimingFunction: {
        "ease-vercel": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};
