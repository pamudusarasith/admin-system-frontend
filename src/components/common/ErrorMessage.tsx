import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ErrorOutline as ErrorOutlineIcon,
} from '@mui/icons-material'
import { useNavigate } from '@tanstack/react-router'

interface ErrorMessageProps {
  readonly message: string | React.ReactNode
  readonly title?: string
  readonly backLabel?: string
  readonly hideIcon?: boolean
  readonly fallbackTo?: string
}

export function ErrorMessage({
  message,
  title = 'Something went wrong',
  backLabel = 'Go Back',
  hideIcon = false,
  fallbackTo = '/',
}: ErrorMessageProps) {
  const theme = useTheme()
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      navigate({ to: fallbackTo as any, replace: true })
    }
  }

  return (
    <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 640,
          borderRadius: 3,
          textAlign: 'center',
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
        }}
      >
        <Stack spacing={3} alignItems="center">
          {!hideIcon && (
            <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
          )}

          {title && (
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          )}

          <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
            {message}
          </Alert>

          <Button
            variant="contained"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {backLabel}
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
