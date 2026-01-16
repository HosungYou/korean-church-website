/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ===========================================
      // VS Design Diverge: OKLCH Color System
      // Editorial Minimalism + 한복 청색 + Liturgical Gold
      // ===========================================
      colors: {
        // Primary - Deep Indigo (한복 청색 + 영적 깊이)
        church: {
          primary: {
            DEFAULT: 'oklch(0.45 0.12 265)',
            50: 'oklch(0.97 0.01 265)',
            100: 'oklch(0.93 0.02 265)',
            200: 'oklch(0.85 0.04 265)',
            300: 'oklch(0.72 0.07 265)',
            400: 'oklch(0.58 0.10 265)',
            500: 'oklch(0.45 0.12 265)',
            600: 'oklch(0.38 0.11 265)',
            700: 'oklch(0.30 0.09 265)',
            800: 'oklch(0.22 0.07 265)',
            900: 'oklch(0.15 0.05 265)',
            950: 'oklch(0.10 0.04 265)',
          },
          // Secondary - Warm Stone (한국 건축)
          secondary: {
            DEFAULT: 'oklch(0.65 0.03 75)',
            50: 'oklch(0.97 0.005 75)',
            100: 'oklch(0.93 0.01 75)',
            200: 'oklch(0.85 0.02 75)',
            300: 'oklch(0.75 0.025 75)',
            400: 'oklch(0.65 0.03 75)',
            500: 'oklch(0.55 0.035 75)',
            600: 'oklch(0.45 0.03 75)',
            700: 'oklch(0.35 0.025 75)',
            800: 'oklch(0.25 0.02 75)',
            900: 'oklch(0.18 0.015 75)',
          },
          // Accent - Liturgical Gold (절제된 금색)
          accent: {
            DEFAULT: 'oklch(0.72 0.10 75)',
            light: 'oklch(0.82 0.08 75)',
            dark: 'oklch(0.58 0.11 75)',
          },
          // Neutral - Warm Grays (한지 느낌)
          neutral: {
            50: 'oklch(0.985 0.003 75)',
            100: 'oklch(0.96 0.004 75)',
            200: 'oklch(0.92 0.005 75)',
            300: 'oklch(0.85 0.006 75)',
            400: 'oklch(0.70 0.008 75)',
            500: 'oklch(0.55 0.01 75)',
            600: 'oklch(0.45 0.01 75)',
            700: 'oklch(0.35 0.008 75)',
            800: 'oklch(0.25 0.006 75)',
            900: 'oklch(0.15 0.004 75)',
            950: 'oklch(0.10 0.003 75)',
          },
        },
        // Fallback hex values for older browsers
        primary: {
          DEFAULT: '#2d3a6b',
          light: '#4a5a8c',
        },
        secondary: {
          DEFAULT: '#9d9486',
          light: '#c5beb4',
        },
        accent: {
          DEFAULT: '#b89968',
          light: '#d4bc94',
        },
        background: '#faf9f7',
      },

      // ===========================================
      // Typography System
      // Pretendard Variable + IBM Plex Sans + Noto Serif KR
      // ===========================================
      fontFamily: {
        // 한글 헤드라인 - Pretendard Variable
        'headline': ['Pretendard Variable', 'Pretendard', 'Noto Sans KR', 'sans-serif'],
        // 한글 본문 - Noto Sans KR
        'korean': ['Noto Sans KR', 'sans-serif'],
        // 영문 - IBM Plex Sans
        'english': ['IBM Plex Sans', 'Inter', 'sans-serif'],
        // 성경 인용 - Noto Serif KR
        'scripture': ['Noto Serif KR', 'Georgia', 'serif'],
        // 장식용 세리프 - Playfair Display
        'display': ['Playfair Display', 'serif'],
      },

      // ===========================================
      // Font Size Scale (극단적 대비)
      // ===========================================
      fontSize: {
        // Micro labels
        'micro': ['0.625rem', { lineHeight: '1', letterSpacing: '0.08em' }],
        'xs': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.05em' }],
        'sm': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],
        '2xl': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        // Hero sizes (극단적 크기)
        'hero': ['clamp(3.5rem, 8vw, 7rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
        'hero-sub': ['clamp(1.25rem, 2.5vw, 2rem)', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
      },

      // ===========================================
      // Spacing Scale (엄격한 리듬)
      // ===========================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '128': '32rem',
        '144': '36rem',
      },

      // ===========================================
      // Box Shadow (레이어드, 방향성)
      // ===========================================
      boxShadow: {
        // Church-themed shadows with primary color tint
        'church-sm': '0 1px 2px oklch(0.45 0.12 265 / 0.05)',
        'church': '0 2px 8px oklch(0.45 0.12 265 / 0.08), 0 1px 2px oklch(0.45 0.12 265 / 0.04)',
        'church-md': '0 4px 16px oklch(0.45 0.12 265 / 0.08), 0 2px 4px oklch(0.45 0.12 265 / 0.04)',
        'church-lg': '0 8px 32px oklch(0.45 0.12 265 / 0.10), 0 4px 8px oklch(0.45 0.12 265 / 0.05)',
        'church-xl': '0 16px 48px oklch(0.45 0.12 265 / 0.12), 0 8px 16px oklch(0.45 0.12 265 / 0.06)',
        // Elevated card
        'card': '0 2px 4px oklch(0.15 0.04 265 / 0.04), 0 8px 24px oklch(0.15 0.04 265 / 0.08)',
        'card-hover': '0 4px 8px oklch(0.15 0.04 265 / 0.06), 0 16px 40px oklch(0.15 0.04 265 / 0.12)',
        // Glass effect shadow
        'glass': '0 4px 30px oklch(0 0 0 / 0.1)',
        // Inner shadow for depth
        'inner-soft': 'inset 0 2px 4px oklch(0 0 0 / 0.05)',
      },

      // ===========================================
      // Border Radius (극단적 선택)
      // ===========================================
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'pill': '9999px',
      },

      // ===========================================
      // Animation & Transition
      // ===========================================
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'ken-burns': 'kenBurns 12s ease-in-out infinite alternate',
        'ken-burns-slow': 'kenBurns 20s ease-in-out infinite alternate',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.08) translate(-1%, -1%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },

      // Transition timing
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },

      // ===========================================
      // Backdrop Blur (Glass 효과)
      // ===========================================
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
        'heavy': '20px',
      },

      // ===========================================
      // Z-Index Scale
      // ===========================================
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}
