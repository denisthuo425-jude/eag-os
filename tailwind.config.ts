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
        primary: "#1e3a8a", // Deep trust-building blue
        secondary: "#64748b", // Soft slate gray
        background: "#f8fafc", // Clean clinical white/light gray
        danger: "#ef4444", // Red for warnings
        success: "#22c55e", // Green for positive metrics
      },
    },
  },
  plugins: [],
};
export default config;
