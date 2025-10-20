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
  Restore as RestoreIcon,
  KeyboardReturn as ReturnIcon,
} from '@mui/icons-material'
import type { Letter } from '@/api'
import { Permission as P, useAuth } from '@/core'

interface LetterActionMenuProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  letter: Letter
  onAddNote: () => void
  onAddAttachment: () => void
  onChangePriority: () => void
  onEdit?: () => void
  onAssignDivision: () => void
  onAssignUser: () => void
  onAcceptLetter: () => void
  onMarkAsComplete: () => void
  onReopen: () => void
  onReturnFromDivision: () => void
  onReturnFromUser: () => void
}

export const LetterActionMenu: React.FC<LetterActionMenuProps> = ({
  anchorEl,
  open,
  onClose,
  letter,
  onAddNote,
  onAddAttachment,
  onChangePriority,
  onAssignDivision,
  onAssignUser,
  onAcceptLetter,
  onMarkAsComplete,
  onReopen,
  onReturnFromDivision,
  onReturnFromUser,
  onEdit,
}) => {
  const { user, hasAuthority, hasAnyAuthority } = useAuth()

  const canEdit =
    letter.status !== 'CLOSED' &&
    hasAnyAuthority([
      P.letterAllUpdate,
      P.letterUnassignedUpdate,
      P.letterDivisionUpdate,
      P.letterOwnManage,
    ])
  const canAssignDivision =
    !letter.assignedDivision &&
    letter.status !== 'CLOSED' &&
    hasAuthority(P.letterAssignDivision)
  const canAssignUser =
    letter.status !== 'CLOSED' &&
    letter.assignedDivision &&
    letter.assignedDivision.id === user?.divisionId &&
    !letter.assignedUser &&
    hasAuthority(P.letterAssignUser)
  const canReturnFromDivision =
    letter.status !== 'CLOSED' &&
    letter.assignedDivision &&
    letter.assignedDivision.id === user?.divisionId &&
    !letter.assignedUser &&
    hasAuthority(P.letterReturnFromDivision)

  const canReturnFromUser =
    letter.status !== 'CLOSED' &&
    letter.assignedDivision &&
    letter.assignedDivision.id === user?.divisionId &&
    letter.assignedUser &&
    letter.assignedUser.id === user.id &&
    hasAuthority(P.letterReturnFromUser)
  const canAcceptLetter =
    letter.status !== 'CLOSED' &&
    letter.assignedDivision &&
    letter.assignedUser &&
    letter.assignedUser.id === user?.id &&
    letter.status === 'PENDING_ACCEPTANCE'
  const canChangePriority =
    letter.status !== 'CLOSED' &&
    hasAnyAuthority([
      P.letterAllUpdatePriority,
      P.letterUnassignedUpdatePriority,
      P.letterDivisionUpdatePriority,
      P.letterOwnManage,
    ])
  const canAddNote =
    letter.status !== 'CLOSED' &&
    hasAnyAuthority([
      P.letterAllAddNote,
      P.letterUnassignedAddNote,
      P.letterDivisionAddNote,
      P.letterOwnManage,
    ])
  const canAddAttachment =
    letter.status !== 'CLOSED' &&
    hasAnyAuthority([
      P.letterAllAddAttachments,
      P.letterUnassignedAddAttachments,
      P.letterDivisionAddAttachments,
      P.letterOwnManage,
    ])
  const canMarkCompleted =
    letter.status !== 'CLOSED' &&
    hasAnyAuthority([
      P.letterAllMarkComplete,
      P.letterUnassignedMarkComplete,
      P.letterDivisionMarkComplete,
      P.letterOwnManage,
    ])

  const canReopen =
    letter.status === 'CLOSED' &&
    hasAnyAuthority([
      P.letterAllReopen,
      P.letterUnassignedReopen,
      P.letterDivisionReopen,
      P.letterOwnManage,
    ])

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {canEdit && (
        <MenuItem
          onClick={() => {
            if (onEdit) onEdit()
            onClose()
          }}
        >
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
      {canReturnFromDivision && (
        <MenuItem
          onClick={() => {
            onReturnFromDivision()
            onClose()
          }}
        >
          <ReturnIcon sx={{ mr: 2 }} />
          Return from Division
        </MenuItem>
      )}
      {canReturnFromUser && (
        <MenuItem
          onClick={() => {
            onReturnFromUser()
            onClose()
          }}
        >
          <ReturnIcon sx={{ mr: 2 }} />
          Return from User
        </MenuItem>
      )}
      {canAcceptLetter && (
        <MenuItem
          onClick={() => {
            onAcceptLetter()
            onClose()
          }}
        >
          <CheckIcon sx={{ mr: 2 }} />
          Accept Letter
        </MenuItem>
      )}
      {canChangePriority && (
        <MenuItem
          onClick={() => {
            onChangePriority()
            onClose()
          }}
        >
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
        <MenuItem
          onClick={() => {
            onAddAttachment()
            onClose()
          }}
        >
          <AttachIcon sx={{ mr: 2 }} />
          Add Attachment
        </MenuItem>
      )}
      {canReopen && (
        <MenuItem
          onClick={() => {
            onReopen()
            onClose()
          }}
        >
          <RestoreIcon sx={{ mr: 2 }} />
          Reopen
        </MenuItem>
      )}
      <MenuItem onClick={onClose}>
        <PrintIcon sx={{ mr: 2 }} />
        Print
      </MenuItem>
      <Divider />
      {canMarkCompleted && (
        <MenuItem
          onClick={() => {
            onMarkAsComplete()
            onClose()
          }}
        >
          <CheckIcon sx={{ mr: 2 }} />
          Mark as Completed
        </MenuItem>
      )}
    </Menu>
  )
}
