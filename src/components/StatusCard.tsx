import React from 'react'
import {
  Box,
  Typography,
  useTheme,
} from '@mui/material'

interface StatusCardProps {
  statusText: string
  value: string
  icon: React.ReactNode
  isSelected: boolean
  color: string
  onClick: () => void
}

export const StatusCard: React.FC<StatusCardProps> = ({
  statusText,
  value,
  icon,
  isSelected,
  color,
  onClick,
}) => {
  const theme = useTheme()

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        cursor: 'pointer',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: isSelected 
          ? `${color}20` // Very subtle background tint when selected
          : theme.palette.background.paper,
        '&:hover': {
          backgroundColor: `${color}30`, // Subtle hover effect
          borderColor: `${color}50`,
        },
        transition: 'all 0.15s ease',
        minHeight: 120,
      }}
    >
      {/* Icon */}
      <Box 
        sx={{ 
          color: isSelected ? color : theme.palette.text.secondary,
          fontSize: 24,
        }}
      >
        {icon}
      </Box>

      {/* Value */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600,
          color: isSelected ? color : theme.palette.text.primary,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
        }}
      >
        {value}
      </Typography>

      {/* Status Type */}
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500,
          color: theme.palette.text.secondary,
          textAlign: 'center',
          fontSize: '0.875rem',
        }}
      >
        {statusText}
      </Typography>
    </Box>
  )
}
