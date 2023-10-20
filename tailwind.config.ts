import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "576px",
        "3xl": "2100px",
      },
    },
  },
  plugins: [],
} satisfies Config;
