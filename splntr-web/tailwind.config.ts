import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0C10",        // page background — near-black with a cold cast
        panel: "#10141B",       // raised surfaces
        line: "#1C2530",        // hairline borders
        volt: "#26A8FF",        // SPLNTR electric blue
        "volt-dim": "#1272B8",
        "volt-ice": "#9FD9FF",  // pale blue for fine text on dark
        haze: "#8B98A9",        // muted body text
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        volt: "0 0 8px rgba(38,168,255,0.35), 0 0 18px rgba(38,168,255,0.10)",
      },
      backgroundImage: {
        "volt-fade": "linear-gradient(180deg, rgba(38,168,255,0.14) 0%, rgba(38,168,255,0) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
