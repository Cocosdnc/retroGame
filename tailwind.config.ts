import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/spinner.js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
      "xxl": { 'max': "10035px" },
      "2xl": { 'max': "1535px" },
      "xl": { 'max': "1279px" },
      "mlg": { 'max': "1100px" },
      "lg": { 'max': "1023px" },
      "md": { 'max': "767px" },
      "sm": { 'max': "639px" },
      "xs": { 'max': "479px" },
      "xss": { 'max': "40px" },

    }
  },
  plugins: [nextui()],
} satisfies Config;
