import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gd:      '#1b5e38',
        gm:      '#2d8653',
        gl:      '#5bbf85',
        gp:      '#d4f0e0',
        gpaper:  '#f2fbf5',
        gdot:    '#8fd4ad',
        ink:     '#1a3328',
        inks:    '#3d6b52',
        line:    '#b5e3cc',
        gold:    '#c9a84c',
      },
      fontFamily: {
        sans:  ['var(--font-quicksand)', 'sans-serif'],
        amiri: ['var(--font-amiri)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
