import React from 'react'
import {
  alpha,
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  Zoom,
} from '@mui/material'

interface StatusCardProps {
  statusType: string
  count: number
  icon: React.ReactNode
  isSelected: boolean
  color: string
  onClick: () => void
  animationDelay?: number
}

export const StatusCard: React.FC<StatusCardProps> = ({
  statusType,
  count,
  icon,
  isSelected,
  color,
  onClick,
  animationDelay = 0,
}) => {
  const theme = useTheme()

  return (
    <Zoom in timeout={600 + animationDelay}>
      <Card
        sx={{
          cursor: statusType !== 'All' ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'visible',
          borderRadius: 3,
          border: `2px solid ${isSelected ? color : 'transparent'}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: isSelected 
            ? `0 8px 32px ${alpha(color, 0.3)}` 
            : theme.shadows[2],
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 40px ${alpha(color, 0.4)}`,
            borderColor: color,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: color,
            borderRadius: '12px 12px 0 0',
            opacity: isSelected ? 1 : 0.3,
            transition: 'opacity 0.3s ease',
          },
        }}
        onClick={onClick}
      >
        <CardContent 
          sx={{ 
            textAlign: 'center', 
            py: 3, 
            px: 2,
            position: 'relative',
          }}
        >
          {/* Icon with background circle */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: alpha(color, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                fontSize: 24,
                transition: 'all 0.3s ease',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                ...(isSelected && {
                  backgroundColor: color,
                  color: 'white',
                  boxShadow: `0 4px 20px ${alpha(color, 0.4)}`,
                }),
              }}
            >
              {icon}
            </Box>
          </Box>

          {/* Count */}
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 1,
              color: isSelected ? color : theme.palette.text.primary,
              transition: 'color 0.3s ease',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            {count}
          </Typography>

          {/* Status Type */}
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              color: isSelected ? color : theme.palette.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: '0.75rem',
              transition: 'color 0.3s ease',
            }}
          >
            {statusType}
          </Typography>

          {/* Selection indicator */}
          {isSelected && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: color,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.2)',
                    opacity: 0.7,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                },
              }}
            />
          )}
        </CardContent>
      </Card>
    </Zoom>
  )
}
