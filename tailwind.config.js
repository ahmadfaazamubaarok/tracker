/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#141414',
          soft: '#262626',
        },
        muted: '#707070',
        faint: '#adadad',
        canvas: {
          DEFAULT: '#ffffff',
          soft: '#f3f3f3',
        },
        field: '#f0f0f0',
        hairline: {
          DEFAULT: '#e0e0e0',
          soft: '#f0f0f0',
        },
        accent: '#0066ff',
        overdue: '#A83236',
      },
      borderRadius: {
        'sm': '16px',
        'md': '24px',
        'full': '9999px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
