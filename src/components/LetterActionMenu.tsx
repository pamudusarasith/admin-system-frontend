import React from 'react'
import { Divider, Menu, MenuItem } from '@mui/material'
import {
  AssignmentInd as AssignmentIndIcon,
  AttachFile as AttachIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  Print as PrintIcon,
} from '@mui/icons-material'
import type { Letter } from '@/api'
import { useAuth } from '@/core/auth'
import { Permission as P } from '@/core/permission'

interface LetterActionMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  letter: Letter
}

export const LetterActionMenu: React.FC<LetterActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  letter,
}) => {
  const { hasAnyAuthority } = useAuth()

  const canEdit = hasAnyAuthority([
    P.letterAllUpdate,
    P.letterUnassignedUpdate,
    P.letterDivisionUpdate,
    P.letterOwnUpdate,
  ])
  const canAssignDivision =
    !letter.assignedDivision && hasAnyAuthority([P.letterAssignDivision])
  const canAssignUser =
    letter.assignedDivision &&
    !letter.assignedUser &&
    hasAnyAuthority([P.letterAssignUser])
  const canChangePriority = hasAnyAuthority([
    P.letterAllUpdatePriority,
    P.letterUnassignedUpdatePriority,
    P.letterDivisionUpdatePriority,
    P.letterOwnUpdatePriority,
  ])
  const canAddAttachment = hasAnyAuthority([
    P.letterAllAddAttachments,
    P.letterUnassignedAddAttachments,
    P.letterDivisionAddAttachments,
    P.letterOwnAddAttachments,
  ])
  const canMarkCompleted = hasAnyAuthority([
    P.letterAllMarkComplete,
    P.letterUnassignedMarkComplete,
    P.letterDivisionMarkComplete,
    P.letterOwnMarkComplete,
  ])

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {canEdit && (
        <MenuItem onClick={onClose}>
          <EditIcon sx={{ mr: 2 }} />
          Edit Letter Details
        </MenuItem>
      )}
      {canAssignDivision && (
        <MenuItem onClick={onClose}>
          <AssignmentIndIcon sx={{ mr: 2 }} />
          Assign To Division
        </MenuItem>
      )}
      {canAssignUser && (
        <MenuItem onClick={onClose}>
          <AssignmentIndIcon sx={{ mr: 2 }} />
          Assign To User
        </MenuItem>
      )}
      {canChangePriority && (
        <MenuItem onClick={onClose}>
          <FlagIcon sx={{ mr: 2 }} />
          Change Priority
        </MenuItem>
      )}
      <Divider />
      {canAddAttachment && (
        <MenuItem onClick={onClose}>
          <AttachIcon sx={{ mr: 2 }} />
          Add Attachment
        </MenuItem>
      )}
      <MenuItem onClick={onClose}>
        <PrintIcon sx={{ mr: 2 }} />
        Print
      </MenuItem>
      <Divider />
      {canMarkCompleted && (
        <MenuItem onClick={onClose}>
          <CheckIcon sx={{ mr: 2 }} />
          Mark as Completed
        </MenuItem>
      )}
    </Menu>
  )
}
