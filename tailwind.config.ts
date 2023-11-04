import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
  ],
  theme: {
    extend: {
      colors: {
        "dark-tremor": {
          brand: {
            faint: "#0B1229", // custom
            muted: "#172554", // blue-950
            subtle: "#3b82f6", // blue-800
            DEFAULT: "#3b82f6", // blue-500
            emphasis: "#60a5fa", // blue-400
            inverted: "#030712", // gray-950
          },
          background: {
            muted: "#131A2B", // custom
            subtle: "#1f2937", // gray-800
            DEFAULT: "#232323", // gray-900
            emphasis: "#d1d5db", // gray-300
          },
          border: {
            DEFAULT: "#ffffff1a", // gray-700
          },
          ring: {
            DEFAULT: "#1f2937", // gray-800
          },
          content: {
            subtle: "#4b5563", // gray-600
            DEFAULT: "#ffffff", // gray-500
            emphasis: "#e5e7eb", // gray-200
            strong: "#f9fafb", // gray-50
            inverted: "#ffffff", // black
          },
        },
      },
      width: {
        88: "362px",
        md: "448px",
      },
      fontFamily: {
        uncut: ["UncutSans"],
        inter: ["Inter"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        m: "10px",
        "tremor-small": "0.55rem",
        "tremor-default": "0.75rem",
        "tremor-full": "9999px",
      },
      letterSpacing: {
        sm: "-0.01em",
      },
      boxShadow: {
        l: "0px 0px 14px 1.5px rgba(0,0,0,0.1)",
        lgb: "0px 0px 32px 2px rgba(0,0,0,0.1)",
        ins: "inset -1px -1px 30px 0px rgba(255,255,255,0.1)",
        ins2: "inset 0px -1px 10px 0px rgba(255,255,255,0.05)",
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card":
          "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown":
          "0 1px 6px 0px rgb(0 0 0 / 0.12), 0 2px 6px 0px rgb(0 0 0 / 0.12)",
      },
      fontSize: {
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
        "tremor-label": ["0.75rem", {}],
      },
      animation: {
        spinslow: "spin 2.5s linear infinite",
        pingslow: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [],
};
export default config;
