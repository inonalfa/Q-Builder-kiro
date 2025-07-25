/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // Support for dark mode
  theme: {
    extend: {
      // Apple-inspired color palette
      colors: {
        primary: {
          50: '#CCE7FF',
          100: '#99D5FF',
          200: '#66C2FF',
          300: '#33B0FF',
          400: '#009DFF',
          500: '#007AFF', // iOS Blue
          600: '#0056CC',
          700: '#004299',
          800: '#002E66',
          900: '#001A33',
        },
        secondary: {
          50: '#E6E5F7',
          100: '#CCCCEF',
          200: '#B3B2E7',
          300: '#9999DF',
          400: '#807FD7',
          500: '#5856D6', // iOS Purple
          600: '#4644AB',
          700: '#343380',
          800: '#222155',
          900: '#11102B',
        },
        success: {
          50: '#E8F5E8',
          100: '#D1EBD1',
          200: '#A3D7A3',
          300: '#75C375',
          400: '#47AF47',
          500: '#34C759', // iOS Green
          600: '#2A9F47',
          700: '#1F7735',
          800: '#154F23',
          900: '#0A2712',
        },
        warning: {
          50: '#FFF4E6',
          100: '#FFE9CC',
          200: '#FFD399',
          300: '#FFBD66',
          400: '#FFA733',
          500: '#FF9500', // iOS Orange
          600: '#CC7700',
          700: '#995900',
          800: '#663B00',
          900: '#331E00',
        },
        error: {
          50: '#FFE6E5',
          100: '#FFCCCA',
          200: '#FF9995',
          300: '#FF6660',
          400: '#FF332B',
          500: '#FF3B30', // iOS Red
          600: '#CC2F26',
          700: '#99231D',
          800: '#661713',
          900: '#330C0A',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // Background colors
        background: {
          primary: '#FFFFFF',
          secondary: '#F9FAFB',
          tertiary: '#F3F4F6',
        },
        // Text colors
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
        }
      },

      // Apple's font system
      fontFamily: {
        'primary': ['SF Pro Display', 'Rubik', 'Heebo', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'secondary': ['SF Pro Text', 'Rubik', 'Heebo', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['SF Mono', 'Fira Code', 'Courier New', 'monospace'],
        'hebrew': ['Rubik', 'Heebo', 'Arial', 'sans-serif'],
      },

      // Apple's type scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
        'base': ['1rem', { lineHeight: '1.5' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.5' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.5' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.25' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '1.25' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1.25' }],       // 48px
        'display': ['3rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
      },

      // Font weights
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'black': '900',
      },

      // Apple's 8-point grid spacing system
      spacing: {
        '0': '0',
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
      },

      // Apple device breakpoints
      screens: {
        'sm': '390px',   // iPhone 12 Pro
        'md': '768px',   // iPad Mini
        'lg': '1024px',  // iPad Pro
        'xl': '1280px',  // Desktop
        '2xl': '1536px', // Large Desktop
      },

      // Border radius following Apple's design
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        'full': '9999px',
      },

      // Box shadows with Apple-style depth
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 8px 10px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        'none': 'none',
        // Apple-specific shadows
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'apple-md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'apple-primary': '0 4px 12px rgba(0, 122, 255, 0.3)',
        'apple-error': '0 4px 12px rgba(255, 59, 48, 0.3)',
      },

      // Animation and transitions
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },

      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'apple-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      // Backdrop blur for Apple-style glass effects
      backdropBlur: {
        'apple': '20px',
      },

      // Custom animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'modal-enter': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.3s ease forwards',
        'slide-in-right': 'slide-in-right 0.3s ease forwards',
        'modal-enter': 'modal-enter 0.2s ease forwards',
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class-based form styling
    }),
    // Custom plugin for Apple-style components
    function ({ addComponents, theme }) {
      addComponents({
        // Button components
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.md'),
          fontSize: theme('fontSize.base[0]'),
          fontWeight: theme('fontWeight.semibold'),
          fontFamily: theme('fontFamily.secondary').join(', '),
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          minHeight: '44px', // Apple's minimum touch target
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          border: 'none',
          '&:disabled': {
            cursor: 'not-allowed',
            opacity: '0.5',
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.500'),
          color: 'white',
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.primary.600'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.apple-primary'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.background.primary'),
          color: theme('colors.primary.500'),
          border: `1px solid ${theme('colors.gray.300')}`,
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.gray.50'),
            borderColor: theme('colors.primary.500'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.apple-md'),
          },
        },
        '.btn-destructive': {
          backgroundColor: theme('colors.error.500'),
          color: 'white',
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.error.600'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.apple-error'),
          },
        },

        // Card components
        '.card': {
          backgroundColor: theme('colors.background.primary'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.DEFAULT'),
          border: `1px solid ${theme('colors.gray.200')}`,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.md'),
            transform: 'translateY(-1px)',
          },
        },
        '.card-header': {
          marginBottom: theme('spacing.4'),
          paddingBottom: theme('spacing.4'),
          borderBottom: `1px solid ${theme('colors.gray.200')}`,
        },
        '.card-title': {
          fontFamily: theme('fontFamily.primary').join(', '),
          fontSize: theme('fontSize.xl[0]'),
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.text.primary'),
          margin: '0',
        },
        '.card-subtitle': {
          fontFamily: theme('fontFamily.secondary').join(', '),
          fontSize: theme('fontSize.sm[0]'),
          color: theme('colors.text.secondary'),
          marginTop: theme('spacing.1'),
        },

        // Form components
        '.form-group': {
          marginBottom: theme('spacing.6'),
        },
        '.form-label': {
          display: 'block',
          fontFamily: theme('fontFamily.secondary').join(', '),
          fontSize: theme('fontSize.sm[0]'),
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.text.primary'),
          marginBottom: theme('spacing.2'),
        },
        '.form-input': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          border: `1px solid ${theme('colors.gray.300')}`,
          borderRadius: theme('borderRadius.md'),
          fontFamily: theme('fontFamily.secondary').join(', '),
          fontSize: theme('fontSize.base[0]'),
          backgroundColor: theme('colors.background.primary'),
          color: theme('colors.text.primary'),
          transition: 'all 0.2s ease',
          minHeight: '44px',
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}1A`, // 10% opacity
          },
          '&::placeholder': {
            color: theme('colors.text.tertiary'),
          },
          '&:disabled': {
            backgroundColor: theme('colors.gray.100'),
            color: theme('colors.text.tertiary'),
            cursor: 'not-allowed',
          },
        },
        '.form-error': {
          color: theme('colors.error.500'),
          fontSize: theme('fontSize.sm[0]'),
          marginTop: theme('spacing.1'),
        },

        // Navigation components
        '.navbar': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme('colors.gray.200')}`,
          padding: `${theme('spacing.4')} 0`,
          position: 'sticky',
          top: '0',
          zIndex: '100',
        },
        '.sidebar': {
          backgroundColor: theme('colors.background.primary'),
          borderLeft: `1px solid ${theme('colors.gray.200')}`, // RTL
          width: '280px',
          height: '100vh',
          position: 'fixed',
          right: '0', // RTL
          top: '0',
          padding: theme('spacing.6'),
          overflowY: 'auto',
        },
        '.nav-item': {
          display: 'flex',
          alignItems: 'center',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.md'),
          color: theme('colors.text.primary'),
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          marginBottom: theme('spacing.1'),
          '&:hover': {
            backgroundColor: theme('colors.gray.100'),
          },
          '&.active': {
            backgroundColor: theme('colors.primary.50'),
            color: theme('colors.primary.500'),
            fontWeight: theme('fontWeight.semibold'),
          },
        },
        '.nav-icon': {
          width: '20px',
          height: '20px',
          marginLeft: theme('spacing.3'), // RTL
        },

        // Table components
        '.table': {
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: theme('colors.background.primary'),
          borderRadius: theme('borderRadius.md'),
          overflow: 'hidden',
          boxShadow: theme('boxShadow.apple-sm'),
        },
        '.table th': {
          backgroundColor: theme('colors.gray.50'),
          padding: theme('spacing.4'),
          textAlign: 'right', // RTL
          fontFamily: theme('fontFamily.secondary').join(', '),
          fontSize: theme('fontSize.sm[0]'),
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.text.secondary'),
          borderBottom: `1px solid ${theme('colors.gray.200')}`,
        },
        '.table td': {
          padding: theme('spacing.4'),
          textAlign: 'right', // RTL
          borderBottom: `1px solid ${theme('colors.gray.200')}`,
          fontFamily: theme('fontFamily.secondary').join(', '),
          fontSize: theme('fontSize.base[0]'),
          color: theme('colors.text.primary'),
        },
        '.table tr:hover': {
          backgroundColor: theme('colors.gray.50'),
        },

        // Modal components
        '.modal-overlay': {
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000',
          backdropFilter: 'blur(4px)',
        },
        '.modal': {
          backgroundColor: theme('colors.background.primary'),
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.8'),
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: theme('boxShadow.2xl'),
          animation: 'modal-enter 0.2s ease forwards',
        },
        '.modal-header': {
          marginBottom: theme('spacing.6'),
          textAlign: 'center',
        },
        '.modal-title': {
          fontFamily: theme('fontFamily.primary').join(', '),
          fontSize: theme('fontSize.2xl[0]'),
          fontWeight: theme('fontWeight.bold'),
          color: theme('colors.text.primary'),
          margin: '0',
        },
        '.modal-actions': {
          display: 'flex',
          gap: theme('spacing.3'),
          justifyContent: 'flex-end',
          marginTop: theme('spacing.8'),
        },

        // Typography classes
        '.text-display': {
          fontFamily: theme('fontFamily.primary').join(', '),
          fontSize: theme('fontSize.5xl[0]'),
          fontWeight: theme('fontWeight.bold'),
          lineHeight: theme('fontSize.5xl[1].lineHeight'),
          letterSpacing: '-0.025em',
        },
        '.text-title-1': {
          fontFamily: theme('fontFamily.primary').join(', '),
          fontSize: theme('fontSize.4xl[0]'),
          fontWeight: theme('fontWeight.bold'),
          lineHeight: theme('fontSize.4xl[1].lineHeight'),
        },
        '.text-title-2': {
          fontFamily: theme('fontFamily.primary').join(', '),
          fontSize: theme('fontSize.3xl[0]'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('fontSize.3xl[1].lineHeight'),
        },
        '.text-title-3': {
          fontFamily: theme('fontFamily.primary').join(', '),
          fontSize: theme('fontSize.2xl[0]'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('fontSize.2xl[1].lineHeight'),
        },
        '.text-body': {
          fontFamily: theme('fontFamily.secondary').join(', '),
          fontSize: theme('fontSize.base[0]'),
          fontWeight: theme('fontWeight.normal'),
          lineHeight: theme('fontSize.base[1].lineHeight'),
        },
        '.text-body-emphasis': {
          fontFamily: theme('fontFamily.secondary').join(', '),
          fontSize: theme('fontSize.base[0]'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('fontSize.base[1].lineHeight'),
        },
        '.text-caption': {
          fontFamily: theme('fontFamily.secondary').join(', '),
          fontSize: theme('fontSize.sm[0]'),
          fontWeight: theme('fontWeight.normal'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          color: theme('colors.text.secondary'),
        },
      })
    },
    // RTL support plugin
    function ({ addUtilities }) {
      addUtilities({
        '[dir="rtl"]': {
          direction: 'rtl',
          textAlign: 'right',
        },
        '[dir="rtl"] .sidebar': {
          right: '0',
          left: 'auto',
          borderRight: `1px solid ${theme('colors.gray.200')}`,
          borderLeft: 'none',
        },
        '[dir="rtl"] .nav-icon': {
          marginRight: '0',
          marginLeft: theme('spacing.3'),
        },
        '[dir="rtl"] .table th, [dir="rtl"] .table td': {
          textAlign: 'right',
        },
        '[dir="rtl"] .form-input': {
          textAlign: 'right',
        },
        // Focus styles
        '*:focus': {
          outline: 'none',
          boxShadow: `0 0 0 3px ${theme('colors.primary.500')}4D`, // 30% opacity
          borderRadius: '4px',
        },
        // Screen reader only
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        // Loading spinner
        '.loading-spinner': {
          animation: 'spin 1s linear infinite',
        },
      })
    },
  ],
}