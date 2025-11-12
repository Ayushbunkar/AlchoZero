/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0b10',
          subtle: '#15151d',
        },
        accent: {
          yellow: '#f6d32d',
          red: '#ff3b3b',
          green: '#00d17a',
        },
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
}
