/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel:    ['"Cinzel"', 'Georgia', 'serif'],
        decorative:['"Cinzel Decorative"', '"Cinzel"', 'serif'],
        serif:     ['"Playfair Display"', 'Georgia', 'serif'],
        sans:      ['"Cormorant Garamond"', 'Garamond', 'serif'],
        body:      ['"Lato"', 'sans-serif'],
        samarkan:  ['Samarkan', 'sans-serif'],
      },
      colors: {
        heritage: {
          50:  '#fdf8f0',
          100: '#f9edd6',
          200: '#f2d9ac',
          300: '#e8be7a',
          400: '#dca04a',
          500: '#c8832a',
          600: '#a8641e',
          700: '#86491a',
          800: '#6e3b1b',
          900: '#5c3119',
          950: '#3a1e0d',
        },
        parchment: '#f5ead0',
        ink:       '#2c1a0e',
        // Imperial accent palette
        regal: {
          gold:    '#d4a853',
          amber:   '#b8860b',
          maroon:  '#5c1a1a',
          emerald: '#1a3c2a',
          bronze:  '#8b6f47',
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':    'fadeIn 0.8s ease forwards',
        'slide-up':   'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ken-burns':  'kenBurns 25s ease-in-out infinite alternate',
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 3s ease-in-out infinite',
        'grain':      'grain 8s steps(10) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'reveal':     'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'border-glow':'borderGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        kenBurns: {
          '0%':   { transform: 'scale(1)   translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-2%, -1%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%':      { transform: 'translate(-5%, -10%)' },
          '30%':      { transform: 'translate(3%, -15%)' },
          '50%':      { transform: 'translate(12%, 9%)' },
          '70%':      { transform: 'translate(9%, 4%)' },
          '90%':      { transform: 'translate(-1%, 7%)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 83, 0.15)' },
          '50%':      { boxShadow: '0 0 40px rgba(212, 168, 83, 0.35)' },
        },
        reveal: {
          from: { opacity: 0, transform: 'translateY(40px) scale(0.97)', filter: 'blur(4px)' },
          to:   { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(212, 168, 83, 0.3)' },
          '50%':      { borderColor: 'rgba(212, 168, 83, 0.7)' },
        },
      },
      boxShadow: {
        'heritage': '0 4px 24px rgba(92, 49, 25, 0.12)',
        'gold':     '0 4px 30px rgba(212, 168, 83, 0.2)',
        'cinematic':'0 20px 60px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
