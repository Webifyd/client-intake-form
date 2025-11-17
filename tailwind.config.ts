import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        webifyd: {
          navy: '#1B2951',
          blue: '#2E86C1',
          'blue-bright': '#3498DB',
          'gray-light': '#F8F9FA',
          'gray-medium': '#6C757D',
          'gray-dark': '#343A40',
          success: '#28A745',
          warning: '#FFC107',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
