import type { PaletteOptions } from '@mui/material/styles'

// Beautiful blue shades for primary color
const primaryBlue = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3', // Main blue
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
  A100: '#82b1ff',
  A200: '#448aff',
  A400: '#2979ff',
  A700: '#2962ff',
}

// Complementary orange for secondary
const secondaryOrange = {
  50: '#fff3e0',
  100: '#ffe0b2',
  200: '#ffcc80',
  300: '#ffb74d',
  400: '#ffa726',
  500: '#ff9800', // Main orange
  600: '#fb8c00',
  700: '#f57c00',
  800: '#ef6c00',
  900: '#e65100',
  A100: '#ffd180',
  A200: '#ffab40',
  A400: '#ff9100',
  A700: '#ff6d00',
}

// Success green
const successGreen = {
  50: '#e8f5e8',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50', // Main green
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
}

// Warning amber
const warningAmber = {
  50: '#fffbf0',
  100: '#fff4d9',
  200: '#ffedba',
  300: '#ffe69c',
  400: '#ffe082',
  500: '#ffca28', // Main amber
  600: '#ffc107',
  700: '#ffb300',
  800: '#ffa000',
  900: '#ff8f00',
}

// Error red
const errorRed = {
  50: '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350',
  500: '#f44336', // Main red
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c',
}

// Info cyan
const infoCyan = {
  50: '#e0f7fa',
  100: '#b2ebf2',
  200: '#80deea',
  300: '#4dd0e1',
  400: '#26c6da',
  500: '#00bcd4', // Main cyan
  600: '#00acc1',
  700: '#0097a7',
  800: '#00838f',
  900: '#006064',
}

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    ...primaryBlue,
    main: primaryBlue[600], // Slightly darker for better contrast in light mode
    contrastText: '#ffffff',
  },
  secondary: {
    ...secondaryOrange,
    main: secondaryOrange[600],
    contrastText: '#ffffff',
  },
  success: {
    ...successGreen,
    main: successGreen[600],
    contrastText: '#ffffff',
  },
  warning: {
    ...warningAmber,
    main: warningAmber[600],
    contrastText: '#000000',
  },
  error: {
    ...errorRed,
    main: errorRed[600],
    contrastText: '#ffffff',
  },
  info: {
    ...infoCyan,
    main: infoCyan[600],
    contrastText: '#ffffff',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  action: {
    active: 'rgba(0, 0, 0, 0.54)',
    hover: 'rgba(0, 0, 0, 0.04)',
    selected: 'rgba(0, 0, 0, 0.08)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(0, 0, 0, 0.12)',
  },
}

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    ...primaryBlue,
    main: primaryBlue[400], // Lighter for better contrast in dark mode
    contrastText: '#ffffff',
  },
  secondary: {
    ...secondaryOrange,
    main: secondaryOrange[400],
    contrastText: '#000000',
  },
  success: {
    ...successGreen,
    main: successGreen[400],
    contrastText: '#000000',
  },
  warning: {
    ...warningAmber,
    main: warningAmber[400],
    contrastText: '#000000',
  },
  error: {
    ...errorRed,
    main: errorRed[400],
    contrastText: '#ffffff',
  },
  info: {
    ...infoCyan,
    main: infoCyan[400],
    contrastText: '#000000',
  },
  background: {
    default: '#0a0e17',
    paper: '#1a1d29',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    active: '#ffffff',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(255, 255, 255, 0.12)',
  },
}
