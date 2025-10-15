import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  CheckCircleOutline as CheckCircleIcon,
  Close as CloseIcon,
  ErrorOutline as ErrorIcon,
  HelpOutline as HelpIcon,
  InfoOutlined as InfoIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material'

export type ConfirmationVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'help'

interface ConfirmationDialogProps {
  readonly open: boolean
  readonly onClose: () => void
  readonly onConfirm: () => void | Promise<void>
  readonly title: string
  readonly message: string | React.ReactNode
  readonly confirmText?: string
  readonly cancelText?: string
  readonly variant?: ConfirmationVariant
  readonly loading?: boolean
  readonly danger?: boolean
  readonly icon?: React.ReactNode
  readonly maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const variantConfig = {
  info: {
    icon: InfoIcon,
    color: 'info.main',
    bgGradient: (color: string) =>
      `linear-gradient(135deg, ${color}15, ${color}05)`,
  },
  success: {
    icon: CheckCircleIcon,
    color: 'success.main',
    bgGradient: (color: string) =>
      `linear-gradient(135deg, ${color}15, ${color}05)`,
  },
  warning: {
    icon: WarningIcon,
    color: 'warning.main',
    bgGradient: (color: string) =>
      `linear-gradient(135deg, ${color}15, ${color}05)`,
  },
  error: {
    icon: ErrorIcon,
    color: 'error.main',
    bgGradient: (color: string) =>
      `linear-gradient(135deg, ${color}15, ${color}05)`,
  },
  help: {
    icon: HelpIcon,
    color: 'primary.main',
    bgGradient: (color: string) =>
      `linear-gradient(135deg, ${color}15, ${color}05)`,
  },
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'help',
  loading = false,
  danger = false,
  icon,
  maxWidth = 'sm',
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const config = variantConfig[variant]
  const IconComponent = config.icon

  const handleConfirm = async () => {
    try {
      await onConfirm()
    } catch (error) {
      // Error handling should be done in the onConfirm function
      console.error('Confirmation error:', error)
    }
  }

  // Determine button colors
  const getConfirmButtonColor = () => {
    if (danger) return 'error'
    if (variant === 'success') return 'success'
    return 'primary'
  }
  const confirmButtonColor = getConfirmButtonColor()

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 2,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1.5,
          pt: 2.5,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          {icon || (
            <IconComponent
              sx={{
                fontSize: 24,
                color: config.color,
                mt: 0.25,
              }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: '1.1rem',
              }}
            >
              {title}
            </Typography>
          </Box>
          {!loading && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                mt: -0.5,
                mr: -0.5,
                color: theme.palette.text.secondary,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </DialogTitle>

      <DialogContent
        sx={{
          pb: 2,
          pt: 1,
        }}
      >
        {typeof message === 'string' ? (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
            }}
          >
            {message}
          </Typography>
        ) : (
          message
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1,
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            minWidth: 80,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmButtonColor}
          disabled={loading}
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            minWidth: 100,
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
