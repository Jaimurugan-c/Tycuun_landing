/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        cardHover: 'var(--card-hover)',
        accent: 'var(--accent)',
        accentLight: 'var(--accent-light)',
        accentDark: 'var(--accent-dark)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        main: 'var(--text-main)'
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: [],
}
