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
          yellow: '#2563eb',
          red: '#ef4444',
          green: '#22c55e',
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
