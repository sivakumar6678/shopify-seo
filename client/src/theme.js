import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5048E5',
      light: '#828DF8',
      dark: '#3832A0',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#10B981',
      light: '#3FC79A',
      dark: '#0B815A',
      contrastText: '#FFFFFF'
    },
    success: {
      main: '#14B8A6',
      light: '#43C6B7',
      dark: '#0E8074',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#2196F3',
      light: '#64B6F7',
      dark: '#0B79D0',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#FFB020',
      light: '#FFBF4C',
      dark: '#B27B16',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#D14343',
      light: '#DA6868',
      dark: '#922E2E',
      contrastText: '#FFFFFF'
    },
    grey: {
      50: '#F9FAFC',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    },
    background: {
      default: '#F9FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#121828',
      secondary: '#65748B',
      disabled: 'rgba(55, 65, 81, 0.48)'
    },
    divider: '#E6E8F0',
    action: {
      active: '#6B7280',
      hover: 'rgba(55, 65, 81, 0.04)',
      selected: 'rgba(55, 65, 81, 0.08)',
      disabled: 'rgba(55, 65, 81, 0.26)',
      disabledBackground: 'rgba(55, 65, 81, 0.12)',
      focus: 'rgba(55, 65, 81, 0.12)'
    }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.08)',
    '0px 1px 5px rgba(0, 0, 0, 0.08)',
    '0px 1px 8px rgba(0, 0, 0, 0.08)',
    '0px 1px 10px rgba(0, 0, 0, 0.08)',
    '0px 1px 14px rgba(0, 0, 0, 0.08)',
    '0px 1px 18px rgba(0, 0, 0, 0.08)',
    '0px 2px 16px rgba(0, 0, 0, 0.08)',
    '0px 3px 14px rgba(0, 0, 0, 0.08)',
    '0px 3px 16px rgba(0, 0, 0, 0.08)',
    '0px 4px 18px rgba(0, 0, 0, 0.08)',
    '0px 4px 20px rgba(0, 0, 0, 0.08)',
    '0px 5px 22px rgba(0, 0, 0, 0.08)',
    '0px 5px 24px rgba(0, 0, 0, 0.08)',
    '0px 5px 26px rgba(0, 0, 0, 0.08)',
    '0px 6px 28px rgba(0, 0, 0, 0.08)',
    '0px 6px 30px rgba(0, 0, 0, 0.08)',
    '0px 6px 32px rgba(0, 0, 0, 0.08)',
    '0px 7px 34px rgba(0, 0, 0, 0.08)',
    '0px 7px 36px rgba(0, 0, 0, 0.08)',
    '0px 8px 38px rgba(0, 0, 0, 0.08)',
    '0px 8px 40px rgba(0, 0, 0, 0.08)',
    '0px 8px 42px rgba(0, 0, 0, 0.08)',
    '0px 9px 44px rgba(0, 0, 0, 0.08)',
    '0px 9px 46px rgba(0, 0, 0, 0.08)'
  ],
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    button: {
      fontWeight: 600
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.2
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.2
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.2
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66
    },
    overline: {
      fontWeight: 600,
      fontSize: '0.75rem',
      letterSpacing: '0.5px',
      lineHeight: 2.5,
      textTransform: 'uppercase'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          height: '100%',
          width: '100%',
          overflowX: 'hidden'
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
          backgroundColor: '#F9FAFC',
          overflowY: 'auto',
          overflowX: 'hidden'
        },
        '#root': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 5px rgba(100, 116, 139, 0.12), 0px 1px 1px rgba(100, 116, 139, 0.06)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600
        },
        sizeSmall: {
          padding: '6px 16px'
        },
        sizeMedium: {
          padding: '8px 20px'
        },
        sizeLarge: {
          padding: '11px 24px'
        },
        textSizeSmall: {
          padding: '7px 12px'
        },
        textSizeMedium: {
          padding: '9px 16px'
        },
        textSizeLarge: {
          padding: '12px 16px'
        }
      }
    }
  }
});

export default theme;