import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SelectChangeEvent } from '@mui/material'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import type { Letter } from '@/api/letters'
import { changePriority } from '@/api/letters'
import { useSnackbar } from '@/components'

interface ChangePriorityDialogProps {
  letter: Letter
  open: boolean
  onClose: () => void
}

export const ChangePriorityDialog: React.FC<ChangePriorityDialogProps> = ({
  letter,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const [priority, setPriority] = React.useState(letter.priority)

  React.useEffect(() => {
    setPriority(letter.priority)
  }, [letter.priority])

  const mutation = useMutation({
    mutationFn: (p: typeof priority) => changePriority(letter.id, p),
    onSuccess: (response: ApiResponse<any>) => {
      queryClient.invalidateQueries({ queryKey: ['letter', letter.id] })
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      const message = response.message?.trim() || 'Priority updated.'
      showSnackbar({ message, severity: 'success' })
      onClose()
    },
    onError: (e: AxiosError<ApiResponse<any>>) => {
      const message =
        e.response?.data.message?.trim() || 'Failed to change priority.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const handleChange = (e: SelectChangeEvent) => {
    setPriority(e.target.value as 'NORMAL' | 'HIGH' | 'URGENT')
  }

  const handleSubmit = () => {
    if (priority === letter.priority) {
      onClose()
      return
    }
    mutation.mutate(priority)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Change Letter Priority</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Select a new priority for this letter.
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            value={priority}
            label="Priority"
            onChange={handleChange}
          >
            <MenuItem value="NORMAL">Normal</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="URGENT">Urgent</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Updating...' : 'Update Priority'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePriorityDialog
