import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Add this line
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      animation: {
        flash: 'flash 0.5s',
      },
      keyframes: {
        flash: {
          '0%, 100%': { opacity: 0 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
}

export default config