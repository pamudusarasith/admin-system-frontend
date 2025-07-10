import { createTheme } from '@mui/material/styles'
import { darkPalette, lightPalette } from './palette'
import { typography } from './typography'
import { shadows } from './spacing'
import { createComponents } from './components'
import type { Shadows } from '@mui/material/styles'

export const createAppTheme = (mode: 'light' | 'dark') => {
  // Create base theme first
  const baseTheme = createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography,
    shadows: (mode === 'light' ? shadows.light : shadows.dark) as Shadows,
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
    spacing: 8,
  })

  // Create final theme with components that depend on the base theme
  const theme = createTheme({
    ...baseTheme,
    components: createComponents(baseTheme),
  })

  return theme
}

// Export specific theme instances
export const lightTheme = createAppTheme('light')
export const darkTheme = createAppTheme('dark')
