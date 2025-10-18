import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close as CloseIcon, Send as SendIcon } from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import type { AddNoteFormData } from '@/schemas'
import { addNoteSchema } from '@/schemas'
import { FileUploadField, useSnackbar } from '@/components'
import { sendReply } from '@/api/letters'

interface AddReplyDialogProps {
  letterId: number
  open: boolean
  onClose: () => void
}

export const AddReplyDialog: React.FC<AddReplyDialogProps> = ({
  letterId,
  open,
  onClose,
}) => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const mutation = useMutation({
    mutationFn: (noteFormData: AddNoteFormData) =>
      sendReply(
        Number(letterId),
        noteFormData.content,
        noteFormData.attachments,
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['letter', Number(letterId)] })
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      if (data.message?.trim())
        showSnackbar({ message: data.message, severity: 'success' })
      onClose()
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'An unexpected error occurred. Please try again.'
      showSnackbar({ message, severity: 'error' })
    },
  })

  const form = useForm({
    defaultValues: {
      content: '',
      attachments: [] as Array<File>,
    } as AddNoteFormData,
    onSubmit: ({ value }) => {
      mutation.mutate(value)
    },
    validators: {
      onChange: addNoteSchema,
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            borderRadius: isMobile ? 0 : 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          },
        },
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Reply to Letter
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{ color: theme.palette.text.secondary }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Card
            elevation={0}
            sx={{ borderRadius: 0, background: 'transparent' }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                <form.Field name="content">
                  {(field) => (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 2,
                        }}
                      >
                        Reply Content *
                      </Typography>
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Type your reply here..."
                        error={!field.state.meta.isValid}
                        helperText={field.state.meta.errors
                          .map((e) => e?.message)
                          .join(', ')}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </form.Field>

                <form.Field name="attachments" mode="array">
                  {(field) => (
                    <FileUploadField
                      field={field}
                      label="Attachments"
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg'],
                        'application/pdf': ['.pdf'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                          ['.docx'],
                        'text/plain': ['.txt'],
                      }}
                      maxSize={10 * 1024 * 1024}
                      multiple={true}
                      helperText="Drag & drop files here, or click to select (PNG, JPEG, PDF, DOCX, TXT)"
                    />
                  )}
                </form.Field>
              </Stack>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions
          sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                onClick={form.handleSubmit}
                variant="contained"
                startIcon={<SendIcon />}
                disabled={!canSubmit || mutation.isPending}
              >
                {mutation.isPending || isSubmitting
                  ? 'Sending...'
                  : 'Send Reply'}
              </Button>
            )}
          </form.Subscribe>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddReplyDialog
