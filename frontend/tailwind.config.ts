import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Authentic Industrial Control Room & Engineering Software Palette
        industrial: {
          bg: "#14181C",          // Background / Blued Steel (main page background, hero, shell)
          surface: "#21262B",     // Surface / Control Panel Grey (cards, panels, navigation, tables)
          panel: "#21262B",       // Alias for surface
          hover: "#272D33",       // Secondary Surface / Selected panels / Hover states
          surfaceSecondary: "#272D33",
          border: "#3A4149",      // Structural Lines / Steel Edge (borders, dividers, grid lines)
          borderFocus: "#4A535D", // Focused outline
          text: {
            DEFAULT: "#E7E4D9",
            primary: "#E7E4D9",   // Primary Text / Technical Paper
            secondary: "#9BA2A9", // Secondary Text / Metadata & descriptions
            muted: "#6D7C86",     // Supporting steel text
          },
          blue: {
            DEFAULT: "#3E7C96",   // ACCENT — Technical / Open Weight (Cyanotype Blue)
            hover: "#4A8FAC",
            light: "#D5E3E9",
            subtle: "rgba(62, 124, 150, 0.12)",
          },
          red: {
            DEFAULT: "#A63C2B",   // ACCENT — Authority / Industrial (Oxide Red)
            hover: "#B84734",
            subtle: "rgba(166, 60, 43, 0.12)",
          },
          amber: {
            DEFAULT: "#A63C2B",   // Mapped to oxide red per exact tokens
            hover: "#B84734",
            subtle: "rgba(166, 60, 43, 0.12)",
          },
          success: {
            DEFAULT: "#6C8B78",   // Success: verified, completed, healthy, secure
            subtle: "rgba(108, 139, 120, 0.15)",
          },
          warning: {
            DEFAULT: "#A63C2B",   // Critical/warning alert mapped to authority red
            subtle: "rgba(166, 60, 43, 0.15)",
          },
          error: {
            DEFAULT: "#A63C2B",   // Critical hazard
            subtle: "rgba(166, 60, 43, 0.15)",
          },
          steel: "#6D7C86",
        },
        background: "#14181C",
        foreground: "#E7E4D9",
        card: {
          DEFAULT: "#21262B",
          foreground: "#E7E4D9",
        },
        primary: {
          DEFAULT: "#3E7C96",
          foreground: "#E7E4D9",
        },
        secondary: {
          DEFAULT: "#21262B",
          foreground: "#E7E4D9",
        },
        muted: {
          DEFAULT: "#3A4149",
          foreground: "#9BA2A9",
        },
        accent: {
          DEFAULT: "#3E7C96",
          foreground: "#E7E4D9",
        },
        border: "#3A4149",
        input: "#14181C",
        ring: "#3E7C96",
      },
      fontFamily: {
        sans: [
          "Inter",
          '"IBM Plex Sans"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"IBM Plex Mono"',
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
