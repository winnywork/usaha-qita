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
        // Palet Baru Sesuai Permintaan:
        brand: {
          primary: "#0857C3",   // Warna ke-2: Biru Utama Elegan
          secondary: "#307FE3", // Warna ke-3: Biru Terang Interaktif
          accent: "#71C5E8",    // Warna ke-4: Biru Langit / Cyan Lembut
          light: "#F0F7FD",     // Latar belakang lembut kartu
          dark: "#053E8C",      // Shading kontras
        },
        bri: {
          blue: {
            DEFAULT: "#0857C3",
            hover: "#307FE3",
            light: "#F0F7FD",
            dark: "#053E8C",
          },
          secondary: "#307FE3",
          accent: "#71C5E8",
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