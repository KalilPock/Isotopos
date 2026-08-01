/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        eva: {
          purple: '#60289b',
          green: '#b8e84c'
        }
      }
    },
  },
  plugins: [],
}