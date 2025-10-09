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
import { Close as CloseIcon, NoteAdd as NoteAddIcon } from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { getRouteApi } from '@tanstack/react-router'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import type { AddNoteFormData } from '@/schemas'
import { FileUploadField, useSnackbar } from '@/components'
import { addNote } from '@/api'
import { addNoteSchema } from '@/schemas'

const Route = getRouteApi('/_authenticated/letters/$letterId')

interface AddNoteDialogProps {
  open: boolean
  onClose: () => void
}

export const AddNoteDialog: React.FC<AddNoteDialogProps> = ({
  open,
  onClose,
}) => {
  const { letterId } = Route.useParams()
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const addNoteMutation = useMutation({
    mutationFn: (noteFormData: AddNoteFormData) => {
      return addNote(Number(letterId), noteFormData)
    },
    onSuccess: (data) => {
      // Invalidate and refetch the letter data to reflect the new note
      queryClient.invalidateQueries({ queryKey: ['letter', letterId] })
      handleClose()
      if (data.message?.trim())
        showSnackbar({ message: data.message, severity: 'success' })
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'An unexpected error occurred. Please try again.'
      showSnackbar({
        message,
        severity: 'error',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      content: '',
      attachments: [] as Array<File>,
    } as AddNoteFormData,
    onSubmit: ({ value }) => {
      addNoteMutation.mutate(value)
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
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Add Note to Letter
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.error.main,
                backgroundColor: `${theme.palette.error.main}10`,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 0,
              background: 'transparent',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Note Content */}
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
                        Content *
                      </Typography>
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter your note content here..."
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

                {/* File Attachments */}
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
                      maxSize={10 * 1024 * 1024} // 10MB
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
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 100,
            }}
          >
            Cancel
          </Button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                onClick={form.handleSubmit}
                variant="contained"
                startIcon={<NoteAddIcon />}
                disabled={!canSubmit || addNoteMutation.isPending}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 120,
                  boxShadow: theme.shadows[2],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {addNoteMutation.isPending || isSubmitting
                  ? 'Adding Note...'
                  : 'Add Note'}
              </Button>
            )}
          </form.Subscribe>
        </DialogActions>
      </form>
    </Dialog>
  )
}
