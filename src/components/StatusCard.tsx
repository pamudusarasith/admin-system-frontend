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
        p: 1.5,
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
        minHeight: 80,
      }}
    >
      {/* Icon */}
      <Box 
        sx={{ 
          color: isSelected ? color : theme.palette.text.secondary,
          fontSize: 20,
          mb: 0.5,
        }}
      >
        {icon}
      </Box>

      {/* Value */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          color: isSelected ? color : theme.palette.text.primary,
          fontSize: { xs: '1rem', sm: '1.125rem' },
          mb: 0.25,
        }}
      >
        {value}
      </Typography>

      {/* Status Type */}
      <Typography 
        variant="caption" 
        sx={{ 
          fontWeight: 500,
          color: theme.palette.text.secondary,
          textAlign: 'center',
          fontSize: '0.75rem',
          lineHeight: 1.2,
        }}
      >
        {statusText}
      </Typography>
    </Box>
  )
}
