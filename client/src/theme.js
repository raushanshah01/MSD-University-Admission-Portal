import { createTheme } from '@mui/material/styles';

// Professional Color Palette - Clean & Modern
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',      // Professional dark slate
      light: '#34495e',
      dark: '#1a252f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#546e7a',      // Sophisticated blue gray
      light: '#78909c',
      dark: '#37474f',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',      // Deep green
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#f57c00',      // Deep orange
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#c62828',      // Deep red
      light: '#e53935',
      dark: '#b71c1c',
    },
    info: {
      main: '#0277bd',      // Deep blue
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: '#fafafa',   // Very light gray
      paper: '#ffffff',     // White
    },
    text: {
      primary: '#212121',   // Almost black
      secondary: '#616161', // Medium gray
      disabled: '#9e9e9e',  // Light gray
    },
    divider: '#e0e0e0',     // Light gray divider
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: 'clamp(0.875rem, 1.5vw, 0.95rem)',
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
    },
    body2: {
      fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(0,0,0,0.18)',
    '0px 2px 4px rgba(102,126,234,0.1)',
    '0px 4px 8px rgba(102,126,234,0.15)',
    '0px 8px 16px rgba(102,126,234,0.2)',
    '0px 12px 24px rgba(102,126,234,0.25)',
    '0px 16px 32px rgba(102,126,234,0.3)',
    '0px 20px 40px rgba(102,126,234,0.35)',
    '0px 24px 48px rgba(102,126,234,0.4)',
    '0px 28px 56px rgba(102,126,234,0.45)',
    '0px 32px 64px rgba(102,126,234,0.5)',
    '0px 36px 72px rgba(102,126,234,0.55)',
    '0px 40px 80px rgba(102,126,234,0.6)',
    '0px 44px 88px rgba(102,126,234,0.65)',
    '0px 48px 96px rgba(102,126,234,0.7)',
    '0px 52px 104px rgba(102,126,234,0.75)',
    '0px 56px 112px rgba(102,126,234,0.8)',
    '0px 60px 120px rgba(102,126,234,0.85)',
    '0px 64px 128px rgba(102,126,234,0.9)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 'clamp(8px, 2vw, 10px) clamp(16px, 4vw, 24px)',
          fontSize: 'clamp(0.875rem, 1.5vw, 0.95rem)',
          fontWeight: 600,
          boxShadow: 'none',
          minHeight: '40px',
          touchAction: 'manipulation',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
          },
          '@media (max-width: 600px)': {
            fontSize: '0.875rem',
            padding: '8px 16px',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0,0,0,0.2)',
          },
        },
        sizeSmall: {
          padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
          fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
          minHeight: '32px',
        },
        sizeLarge: {
          padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 32px)',
          fontSize: 'clamp(0.9375rem, 1.75vw, 1rem)',
          minHeight: '48px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0,0,0,0.12)',
          },
          '@media (max-width: 600px)': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '@media (max-width: 600px)': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          },
          '& .MuiInputLabel-root': {
            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 'clamp(0.75rem, 1.25vw, 0.8125rem)',
          height: 'auto',
          minHeight: '24px',
          padding: '4px 0',
        },
        sizeSmall: {
          fontSize: 'clamp(0.6875rem, 1vw, 0.75rem)',
          minHeight: '20px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
          padding: 'clamp(8px, 2vw, 16px)',
          '@media (max-width: 600px)': {
            padding: '8px 4px',
          },
        },
        head: {
          fontWeight: 600,
          fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          margin: 16,
          maxWidth: 'calc(100% - 32px)',
          '@media (max-width: 600px)': {
            margin: 8,
            maxWidth: 'calc(100% - 16px)',
            borderRadius: 12,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0',
          '@media (max-width: 600px)': {
            width: '80vw',
            maxWidth: '300px',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)',
          borderRadius: 6,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 'clamp(6px, 1.5vw, 8px)',
          touchAction: 'manipulation',
          '@media (max-width: 600px)': {
            padding: 8,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 'clamp(32px, 8vw, 40px)',
          height: 'clamp(32px, 8vw, 40px)',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
    },
  },
});

export default theme;
