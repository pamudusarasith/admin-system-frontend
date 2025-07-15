import React from 'react'
import { Divider, Menu, MenuItem } from '@mui/material'
import {
  Archive as ArchiveIcon,
  AssignmentInd as AssignmentIndIcon,
  AttachFile as AttachIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material'

interface LetterActionMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

export const LetterActionMenu: React.FC<LetterActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={onClose}>
        <AssignmentIndIcon sx={{ mr: 2 }} />
        Reassign Letter
      </MenuItem>
      <MenuItem onClick={onClose}>
        <EditIcon sx={{ mr: 2 }} />
        Change Status
      </MenuItem>
      <MenuItem onClick={onClose}>
        <FlagIcon sx={{ mr: 2 }} />
        Change Priority
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose}>
        <AttachIcon sx={{ mr: 2 }} />
        Add Attachment
      </MenuItem>
      <MenuItem onClick={onClose}>
        <PrintIcon sx={{ mr: 2 }} />
        Print Letter
      </MenuItem>
      <MenuItem onClick={onClose}>
        <ShareIcon sx={{ mr: 2 }} />
        Share Letter
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClose}>
        <DownloadIcon sx={{ mr: 2 }} />
        Export as PDF
      </MenuItem>
      <MenuItem onClick={onClose}>Mark as Completed</MenuItem>
      <Divider />
      <MenuItem onClick={onClose} sx={{ color: 'warning.main' }}>
        <ArchiveIcon sx={{ mr: 2 }} />
        Archive Letter
      </MenuItem>
    </Menu>
  )
}
