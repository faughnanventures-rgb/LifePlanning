import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e7e3',
          200: '#c7d0c7',
          300: '#a3b1a3',
          400: '#7c9885',
          500: '#5f7d69',
          600: '#4a6353',
          700: '#3d5144',
          800: '#344239',
          900: '#2c3830',
        },
        teal: {
          50: '#f0f9f9',
          100: '#d9f0f0',
          200: '#b6e1e2',
          300: '#84cbcc',
          400: '#4dadaf',
          500: '#339194',
          600: '#2d757a',
          700: '#2a6064',
          800: '#284e52',
          900: '#254246',
        },
      },
    },
  },
  plugins: [],
}
export default config
