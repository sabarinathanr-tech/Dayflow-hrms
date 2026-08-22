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
        dark: {
          950: '#07080d',
          900: '#0b0d14',
          850: '#10121b',
          800: '#141724',
          750: '#1a1e30',
          700: '#20253c',
          600: '#2d3454',
          500: '#3d466e',
        },
        brand: {
          purple: '#9333ea',
          'purple-light': '#a855f7',
          'purple-dark': '#7e22ce',
          magenta: '#d946ef',
          'magenta-light': '#e879f9',
          cyan: '#06b6d4',
          'cyan-light': '#38bdf8',
          'cyan-dark': '#0891b2',
        },
        status: {
          present: '#10b981',
          'present-bg': 'rgba(16, 185, 129, 0.12)',
          absent: '#f43f5e',
          'absent-bg': 'rgba(244, 63, 94, 0.12)',
          halfday: '#f59e0b',
          'halfday-bg': 'rgba(245, 158, 11, 0.12)',
          leave: '#a855f7',
          'leave-bg': 'rgba(168, 85, 247, 0.12)',
          pending: '#06b6d4',
          'pending-bg': 'rgba(6, 182, 212, 0.12)',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 20px -5px rgba(168, 85, 247, 0.35)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.35)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-light': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
