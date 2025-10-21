import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { Delete, LockReset, MoreVert } from '@mui/icons-material'
import type { User } from '@/api'

interface UserActionsMenuProps {
  user: User
  canDelete?: boolean
  canResetPassword?: boolean
  onDelete: (user: User) => void
  onResetPassword: (user: User) => void
}

export const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  user,
  canDelete = false,
  canResetPassword = false,
  onDelete,
  onResetPassword,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteClick = () => {
    handleClose()
    setDeleteDialogOpen(true)
  }

  const handleResetPasswordClick = () => {
    handleClose()
    setResetPasswordDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false)
    onDelete(user)
  }

  const handleResetPasswordConfirm = () => {
    setResetPasswordDialogOpen(false)
    onResetPassword(user)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const handleResetPasswordCancel = () => {
    setResetPasswordDialogOpen(false)
  }

  // Don't render if user has no permissions
  if (!canDelete && !canResetPassword) {
    return null
  }

  return (
    <>
      <IconButton size="small" onClick={handleClick} title="More actions">
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {canResetPassword && (
          <MenuItem onClick={handleResetPasswordClick}>
            <ListItemIcon>
              <LockReset fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reset Password</ListItemText>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem onClick={handleDeleteClick}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: 'error.main' }}>Delete User</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user{' '}
            <strong>{user.fullName || user.username}</strong>? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={handleResetPasswordCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the password for user{' '}
            <strong>{user.fullName || user.username}</strong>? A new temporary
            password will be generated and the user will be required to set up
            their account again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetPasswordCancel} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleResetPasswordConfirm}
            color="warning"
            variant="contained"
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
