import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import { markAsComplete } from '@/api/letters'
import type { Letter } from '@/api/letters'
import { useSnackbar } from '@/components'

interface MarkAsCompleteDialogProps {
  letter: Letter
  open: boolean
  onClose: () => void
}

export const MarkAsCompleteDialog: React.FC<MarkAsCompleteDialogProps> = ({
  letter,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()

  const mutation = useMutation({
    mutationFn: () => markAsComplete(letter.id),
    onSuccess: (response: ApiResponse<any>) => {
      queryClient.invalidateQueries({ queryKey: ['letter', letter.id] })
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      const message = response.message?.trim() || 'Letter marked as completed.'
      showSnackbar({ message, severity: 'success' })
      onClose()
    },
    onError: (e: AxiosError<ApiResponse<any>>) => {
      const message = e.response?.data?.message?.trim() || 'Failed to mark as complete.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Mark Letter as Completed</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to mark this letter as completed? You may be able to reopen it later if permitted.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => mutation.mutate()} variant="contained" color="success" disabled={mutation.isPending}>
          {mutation.isPending ? 'Processing...' : 'Mark as Completed'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
