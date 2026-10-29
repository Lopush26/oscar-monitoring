/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover:      'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        nav: {
          DEFAULT:    'hsl(var(--nav-bg))',
          border:     'hsl(var(--nav-border))',
          text:       'hsl(var(--nav-text))',
          textMuted:  'hsl(var(--nav-text-muted))',
          activeBg:   'hsl(var(--nav-active-bg))',
          activeText: 'hsl(var(--nav-active-text))',
        },
        // Artistic Medical Status Colors
        status: {
          success: {
            light:  { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },
            dark:   { bg: 'rgba(34,197,94,0.15)', text: '#4ADE80', border: 'rgba(34,197,94,0.3)' },
          },
          warning: {
            light:  { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
            dark:   { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24', border: 'rgba(245,158,11,0.3)' },
          },
          danger: {
            light:  { bg: '#FEE2E2', text: '#B91C1C', border: '#FECACA' },
            dark:   { bg: 'rgba(239,68,68,0.15)', text: '#FCA5A5', border: 'rgba(239,68,68,0.3)' },
          },
          info: {
            light:  { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
            dark:   { bg: 'rgba(37,99,235,0.15)', text: '#93C5FD', border: 'rgba(37,99,235,0.3)' },
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius)',
        sm: 'calc(var(--radius) - 2px)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 24px 36px -8px rgba(37, 99, 235, 0.06)',
        'elegant-hover': '0 10px 16px -2px rgba(15, 23, 42, 0.08), 0 24px 32px -4px rgba(15, 23, 42, 0.12), 0 32px 48px -8px rgba(37, 99, 235, 0.1)',
        'elegant-sm': '0 2px 4px -1px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.06)',
        'elegant-md': '0 4px 10px -2px rgba(15, 23, 42, 0.08), 0 14px 20px -4px rgba(15, 23, 42, 0.07)',
        'elegant-dark': '0 6px 16px -2px rgba(0, 0, 0, 0.45), 0 16px 28px -4px rgba(0, 0, 0, 0.35)',
        'elegant-hover-dark': '0 10px 24px -2px rgba(0, 0, 0, 0.55), 0 24px 38px -4px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(180deg, #3B72B4 0%, #BFDBFE 50%, #FFFFFF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A192F 0%, #112240 50%, #0F1C35 100%)',
        'radial-spotlight': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.35) 0%, transparent 60%)',
        'radial-spotlight-dark': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59, 114, 180, 0.15) 0%, transparent 60%)',
      },
      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'elegant-slow': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};