import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import type { BoxProps } from '@mui/material'

interface LoadingSpinnerProps {
  message?: string
  subMessage?: string
  size?: number
  fullScreen?: boolean
  sx?: BoxProps['sx']
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  subMessage,
  size = 60,
  fullScreen = false,
  sx = {},
}) => {
  const containerSx = fullScreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        bgcolor: 'background.default',
        ...sx,
      }
    : {
        minHeight: '200px',
        ...sx,
      }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        ...containerSx,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={size}
          thickness={4}
          sx={{
            color: 'primary.main',
            animationDuration: '1.2s',
          }}
        />
      </Box>

      <Typography
        variant="h6"
        color="text.primary"
        sx={{
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}
      >
        {message}
      </Typography>

      {subMessage && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 300,
            textAlign: 'center',
            opacity: 0.8,
          }}
        >
          {subMessage}
        </Typography>
      )}
    </Box>
  )
}

// Auth-specific loader
export const AuthLoadingSpinner: React.FC = () => (
  <LoadingSpinner
    message="Loading Application..."
    subMessage="Please wait while we initialize your session"
    fullScreen={true}
  />
)

export default LoadingSpinner
