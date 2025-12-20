/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F172A', // slate-900
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          600: '#2563EB', // blue-600
          700: '#1D4ED8', // blue-700
        },
        accent: {
          DEFAULT: '#2563EB', // blue-600
          teal: '#0EA5A4', // teal-500
        },
        success: {
          DEFAULT: '#16A34A', // green-600
        },
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
        'control': '8px',
        'control-lg': '12px',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 12px 32px rgba(15, 23, 42, 0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
})
