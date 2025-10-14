import React from 'react'
import { Divider, Menu, MenuItem } from '@mui/material'
import {
  AssignmentInd as AssignmentIndIcon,
  AttachFile as AttachIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  NoteAdd as NoteAddIcon,
  Print as PrintIcon,
} from '@mui/icons-material'
import type { Letter } from '@/api'
import { Permission as P, useAuth } from '@/core'

interface LetterActionMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  letter: Letter
  onAddNote: () => void
  onAssignDivision: () => void
  onAssignUser: () => void
}

export const LetterActionMenu: React.FC<LetterActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  letter,
  onAddNote,
  onAssignDivision,
  onAssignUser,
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
  const canAddNote = hasAnyAuthority([
    P.letterAllAddNote,
    P.letterUnassignedAddNote,
    P.letterDivisionAddNote,
    P.letterOwnAddNote,
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
        <MenuItem
          onClick={() => {
            onAssignDivision()
            onClose()
          }}
        >
          <AssignmentIndIcon sx={{ mr: 2 }} />
          Assign To Division
        </MenuItem>
      )}
      {canAssignUser && (
        <MenuItem
          onClick={() => {
            onAssignUser()
            onClose()
          }}
        >
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
      {canAddNote && (
        <MenuItem
          onClick={() => {
            onAddNote()
            onClose()
          }}
        >
          <NoteAddIcon sx={{ mr: 2 }} />
          Add Note
        </MenuItem>
      )}
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
