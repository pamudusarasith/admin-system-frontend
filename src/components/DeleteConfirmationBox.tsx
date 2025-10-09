import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'

interface DeleteConfirmationBoxProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  itemName?: string
  loading?: boolean
}

export const DeleteConfirmationBox: React.FC<DeleteConfirmationBoxProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message,
  itemName,
  loading = false,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const defaultMessage = itemName
    ? `Are you sure you want to delete "${itemName}" ?`
    : 'Are you sure you want to delete this item? This action cannot be undone.'

  const displayMessage = message || defaultMessage

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10],
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          width: isMobile ? '90vw' : '580px',
          maxWidth: isMobile ? '90vw' : '480px',
          m: isMobile ? 2 : 'auto',
        },
      }}
    >
      {/* Dialog Title */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: theme.palette.error.light + '20',
              color: theme.palette.error.main,
            }}
          >
            <WarningIcon fontSize="medium" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: `${theme.palette.error.main}20`,
              color: theme.palette.error.main,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent sx={{ py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2,
          }}
        >
          {/* Message */}
          <Typography
            variant="body1"
            sx={{
              pt: 3,
              color: theme.palette.text.primary,
              lineHeight: 1.6,
              maxWidth: 400,
            }}
          >
            {displayMessage}
          </Typography>

          {/* Warning Note */}
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.warning.light + '10',
              border: `1px solid ${theme.palette.warning.light}40`,
              borderRadius: 2,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.warning.dark,
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              ⚠️ This action is permanent and cannot be reversed
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            minWidth: isMobile ? 'auto' : 120,
            borderColor: theme.palette.grey[300],
            color: theme.palette.text.secondary,
            '&:hover': {
              borderColor: theme.palette.grey[400],
              backgroundColor: theme.palette.grey[50],
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          fullWidth={isMobile}
          startIcon={loading ? undefined : <DeleteIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            minWidth: isMobile ? 'auto' : 120,
            backgroundColor: theme.palette.error.main,
            boxShadow: theme.shadows[2],
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.error.dark,
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[4],
            },
            '&:disabled': {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
            },
          }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationBox
