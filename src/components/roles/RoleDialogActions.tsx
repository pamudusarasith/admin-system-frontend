import { Button, DialogActions } from '@mui/material'

interface RoleDialogActionsProps {
  readonly editMode: boolean
  readonly isSubmitting: boolean
  readonly onClose: () => void
  readonly onSubmit: () => void
}

export function RoleDialogActions({
  editMode,
  isSubmitting,
  onClose,
  onSubmit,
}: RoleDialogActionsProps) {
  const getButtonText = () => {
    if (editMode) {
      return isSubmitting ? 'Updating...' : 'Update Role'
    }
    return isSubmitting ? 'Creating...' : 'Create Role'
  }

  return (
    <DialogActions sx={{ p: 2, gap: 1 }}>
      <Button onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button onClick={onSubmit} variant="contained" disabled={isSubmitting}>
        {getButtonText()}
      </Button>
    </DialogActions>
  )
}
