import React from 'react'
import { Box, useTheme } from '@mui/material'

interface AnimatedIconProps {
  readonly children: React.ReactNode
  readonly size?: number
}

export function AnimatedIcon({ children, size = 120 }: AnimatedIconProps) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'relative',
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
            },
            '50%': {
              transform: 'scale(1.05)',
              boxShadow: `0 12px 48px ${theme.palette.primary.main}60`,
            },
            '100%': {
              transform: 'scale(1)',
              boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
            },
          },
        }}
      >
        <Box
          sx={{
            fontSize: size * 0.5,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
