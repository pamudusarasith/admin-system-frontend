import { Menu, MenuItem } from '@mui/material'
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
import type { Role } from '@/api'

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
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem
        onClick={() => {
          if (role) onEdit(role)
        }}
      >
        <EditIcon sx={{ mr: 1 }} fontSize="small" />
        Edit Role
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (role) onDelete(role)
        }}
      >
        <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
        Delete Role
      </MenuItem>
    </Menu>
  )
}
