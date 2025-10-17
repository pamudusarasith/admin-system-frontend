import { Box, DialogTitle, IconButton, Typography } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

interface RoleDialogHeaderProps {
  readonly editMode: boolean
  readonly onClose: () => void
}

export function RoleDialogHeader({ editMode, onClose }: RoleDialogHeaderProps) {
  return (
    <DialogTitle>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">
          {editMode ? 'Edit Role' : 'Add New Role'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
  )
}
