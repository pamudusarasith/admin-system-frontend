import { Menu, MenuItem } from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import type { Role } from '@/api'
import { Permission as P, useAuth } from '@/core'

interface RoleActionMenuProps {
  anchorEl: HTMLElement | null
  role: Role | null
  onClose: () => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleActionMenu({
  anchorEl,
  role,
  onClose,
  onEdit,
  onDelete,
}: Readonly<RoleActionMenuProps>) {
  const { hasAuthority } = useAuth()

  const canUpdate = hasAuthority(P.roleUpdate)
  const canDelete = hasAuthority(P.roleDelete)

  // Don't render menu if user has no permissions
  if (!canUpdate && !canDelete) {
    return null
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {canUpdate && (
        <MenuItem
          onClick={() => {
            if (role) onEdit(role)
          }}
        >
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit Role
        </MenuItem>
      )}
      {canDelete && (
        <MenuItem
          onClick={() => {
            if (role) onDelete(role)
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete Role
        </MenuItem>
      )}
    </Menu>
  )
}
