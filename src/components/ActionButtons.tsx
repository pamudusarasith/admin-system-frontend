import { Button, Stack, useTheme } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { NavigateOptions } from '@tanstack/react-router'

interface ActionButton {
  readonly label: string
  readonly icon: React.ReactElement
  readonly to: string
  readonly variant?: 'contained' | 'outlined'
  readonly navigateOptions?: NavigateOptions
}

interface ActionButtonsProps {
  readonly buttons: ReadonlyArray<ActionButton>
}

export function ActionButtons({ buttons }: ActionButtonsProps) {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleNavigation = (to: string, options?: NavigateOptions) => {
    navigate({ to: to as any, ...options })
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ mt: 4, width: '100%', justifyContent: 'center' }}
    >
      {buttons.map((button, index) => (
        <Button
          key={button.label}
          variant={button.variant ?? (index === 0 ? 'contained' : 'outlined')}
          size="large"
          startIcon={button.icon}
          onClick={() => handleNavigation(button.to, button.navigateOptions)}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            ...(button.variant === 'contained' ||
            (!button.variant && index === 0)
              ? {
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                  },
                }
              : {
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                  },
                }),
            transition: 'all 0.3s ease',
          }}
        >
          {button.label}
        </Button>
      ))}
    </Stack>
  )
}
