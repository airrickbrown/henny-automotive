/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface-bright':              '#3a3939',
        'surface-container':           '#201f1f',
        'surface-container-highest':   '#353534',
        'surface-container-high':      '#2a2a2a',
        'surface-container-low':       '#1c1b1b',
        'surface-container-lowest':    '#0e0e0e',
        'surface-variant':             '#353534',
        'surface':                     '#131313',
        'surface-dim':                 '#131313',
        'background':                  '#131313',
        'primary-container':           '#e11d2e',
        'on-primary-fixed-variant':    '#930015',
        'on-primary-container':        '#fff8f7',
        'secondary':                   '#41e575',
        'on-secondary':                '#003915',
        'secondary-container':         '#06c825',
        'on-surface':                  '#e5e2e1',
        'on-surface-variant':          '#e6bdb9',
        'on-background':               '#e5e2e1',
        'outline-variant':             '#5d3f3d',
        'footer-bg':                   '#0a0a0a',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg:      '0.25rem',
        xl:      '0.5rem',
        full:    '0.75rem',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
        label:    ['Inter', 'sans-serif'],
      },
      boxShadow: {
        fab:       '0 8px 32px rgba(0, 0, 0, 0.5)',
        glow:      '0 0 20px rgba(225, 29, 46, 0.4)',
        'nav-top': '0 -8px 32px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'ignition': 'linear-gradient(135deg, #E11D2E 0%, #930015 100%)',
      },
    },
  },
  plugins: [],
}
