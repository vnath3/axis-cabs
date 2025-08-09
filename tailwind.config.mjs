/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: '#FF6A00',
          text: '#111827',
          link: '#2563EB',
          bg: '#F9FAFB'
        },
        boxShadow: {
          soft: '0 8px 24px rgba(0,0,0,0.08)'
        }
      }
    },
    plugins: []
  };