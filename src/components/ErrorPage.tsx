import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { AnimatedIcon } from './AnimatedIcon'
import { ActionButtons } from './ActionButtons'

interface ActionButton {
  readonly label: string
  readonly icon: React.ReactElement
  readonly to: string
  readonly variant?: 'contained' | 'outlined'
}

interface ErrorPageProps {
  readonly errorCode: string
  readonly title: string
  readonly description: string
  readonly icon: React.ReactElement
  readonly buttons: ReadonlyArray<ActionButton>
  readonly helpText?: string
}

export function ErrorPage({
  errorCode,
  title,
  description,
  icon,
  buttons,
  helpText = 'Need help? Contact support or try refreshing the page',
}: ErrorPageProps) {
  const theme = useTheme()

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            maxWidth: 600,
            width: '100%',
          }}
        >
          <Stack spacing={4} alignItems="center">
            {/* Animated Icon */}
            <AnimatedIcon>{icon}</AnimatedIcon>

            {/* Error Code */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '4rem', md: '6rem' },
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {errorCode}
            </Typography>

            {/* Error Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              {title}
            </Typography>

            {/* Error Description */}
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 400,
                lineHeight: 1.6,
                fontSize: '1.1rem',
              }}
            >
              {description}
            </Typography>

            {/* Action Buttons */}
            <ActionButtons buttons={buttons} />

            {/* Additional Help Text */}
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                mt: 3,
                fontSize: '0.9rem',
              }}
            >
              {helpText}
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}
