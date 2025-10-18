import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import type { Letter } from '@/api/letters'
import { reopenLetter } from '@/api/letters'
import { useSnackbar } from '@/components'

interface ReOpenDialogProps {
  letter: Letter
  open: boolean
  onClose: () => void
}

export const ReOpenDialog: React.FC<ReOpenDialogProps> = ({
  letter,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()

  const mutation = useMutation({
    mutationFn: () => reopenLetter(letter.id),
    onSuccess: (response: ApiResponse<any>) => {
      queryClient.invalidateQueries({ queryKey: ['letter', letter.id] })
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      const message =
        response.message?.trim() || 'Letter reopened successfully.'
      showSnackbar({ message, severity: 'success' })
      onClose()
    },
    onError: (e: AxiosError<ApiResponse<any>>) => {
      const message =
        e.response?.data.message?.trim() || 'Failed to reopen letter.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reopen Letter</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to reopen this letter? This will move the letter
          back to an active state and allow further actions.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => mutation.mutate()}
          variant="contained"
          color="primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Processing...' : 'Reopen Letter'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
