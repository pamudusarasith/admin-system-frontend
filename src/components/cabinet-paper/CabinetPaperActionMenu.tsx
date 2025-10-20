import React from 'react'
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import {
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import type { CabinetPaper } from '@/api'

interface CabinetPaperActionMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  paper: CabinetPaper
  onEdit: () => void
  onDelete: () => void
  onDownloadAll: () => void
}

export const CabinetPaperActionMenu: React.FC<CabinetPaperActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  paper,
  onEdit,
  onDelete,
  onDownloadAll,
}) => {
  const hasAttachments = paper.attachments && paper.attachments.length > 0

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          borderRadius: 2,
        },
      }}
    >
      <MenuItem
        onClick={() => {
          onEdit()
          onClose()
        }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>

      {hasAttachments && (
        <MenuItem
          onClick={() => {
            onDownloadAll()
            onClose()
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download All Attachments</ListItemText>
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          onDelete()
          onClose()
        }}
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  )
}
