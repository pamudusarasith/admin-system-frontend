import type { PaletteOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    purple: Palette['primary']
    pink: Palette['primary']
  }
  interface PaletteOptions {
    purple?: PaletteOptions['primary']
    pink?: PaletteOptions['primary']
  }
}

declare module '@mui/material' {
  // allow `color="purple"` on components like Chip if needed
  interface PaletteColorOptions extends Record<string, any> {}
}
