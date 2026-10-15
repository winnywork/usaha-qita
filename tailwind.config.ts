import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bri: {
          blue: {
            DEFAULT: "#00529C",
            dark: "#003A70",
            light: "#E6F0FA",
            hover: "#004380",
          },
          orange: {
            DEFAULT: "#F37021",
            dark: "#D4580D",
            light: "#FEF2E8",
          },
        },
      },
      screens: {
        xs: "360px",
        sm: "390px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
