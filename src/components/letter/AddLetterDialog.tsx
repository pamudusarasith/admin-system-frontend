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
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Close as CloseIcon,
} from '@mui/icons-material'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import type { LetterFormData } from '@/schemas'
import type { ApiResponse, Letter } from '@/api'
import { createLetter, updateLetter } from '@/api'
import { FileUploadField, useSnackbar } from '@/components'
import { createLetterSchema } from '@/schemas'

interface AddLetterDialogProps {
  open: boolean
  onClose: () => void
  // when provided, dialog switches to edit mode and pre-fills values
  letter?: Letter
}

export const AddLetterDialog: React.FC<AddLetterDialogProps> = ({
  open,
  onClose,
  letter,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()

  // TanStack Query mutation for creating a letter
  const createLetterMutation = useMutation({
    mutationFn: createLetter,
    onSuccess: (data) => {
      // Invalidate and refetch letters query
      queryClient.invalidateQueries({ queryKey: ['letters'] })
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

      console.error('Failed to create letter:', error)
    },
  })

  // Mutation for updating a letter (used when `letter` prop is provided)
  const updateLetterMutation = useMutation<
    ApiResponse<any>,
    AxiosError<ApiResponse<any>>,
    { id: number; data: LetterFormData }
  >({
    mutationFn: ({ id, data }) => updateLetter(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['letters'] })
      if (letter)
        queryClient.invalidateQueries({ queryKey: ['letter', letter.id] })
      handleClose()
      if (data.message)
        showSnackbar({ message: data.message, severity: 'success' })
    },
    onError: (error) => {
      const message =
        error.response?.data.message?.trim() ||
        'An unexpected error occurred. Please try again.'
      showSnackbar({ message, severity: 'error' })
      console.error('Failed to update letter:', error)
    },
  })

  // TanStack Form setup
  const form = useForm({
    defaultValues: {
      reference: '',
      sender_details: {
        name: '',
        email: '',
        phone_number: '',
        address: '',
      },
      receiver_details: {
        name: '',
        designation: '',
        division_name: '',
      },
      priority: 'NORMAL',
      mode_of_arrival: 'REGISTERED_POST',
      received_date: new Date().toISOString().split('T')[0],
      sent_date: undefined,
      subject: '',
      content: '',
      attachments: [],
    } as LetterFormData,
    onSubmit: ({ value }) => {
      // decide whether to create or update based on presence of `letter` prop
      if (letter) {
        updateLetterMutation.mutate({ id: letter.id, data: value })
      } else {
        createLetterMutation.mutate(value)
      }
    },
    validators: {
      onChange: createLetterSchema,
    },
  })

  const priorities = [
    { value: 'NORMAL', color: theme.palette.success.main, label: 'Normal' },
    { value: 'HIGH', color: theme.palette.error.main, label: 'High' },
    { value: 'URGENT', color: theme.palette.warning.main, label: 'Urgent' },
  ]

  const modesOfArrival = [
    'REGISTERED_POST',
    'UNREGISTERED_POST',
    'EMAIL',
    'WHATSAPP',
    'HAND_DELIVERED',
    'FAX',
    'OTHER',
  ]

  const handleClose = () => {
    form.reset()
    onClose()
  }

  // When dialog opens in edit mode, populate the form with letter values
  React.useEffect(() => {
    if (letter && open) {
      form.reset({
        reference: letter.reference,
        sender_details: {
          name: letter.senderDetails.name,
          email: (letter.senderDetails as any).email || '',
          phone_number: (letter.senderDetails as any).phone_number || '',
          address: (letter.senderDetails as any).address || '',
        },
        receiver_details: {
          name: letter.receiverDetails.name,
          designation: (letter.receiverDetails as any).designation || '',
          division_name: (letter.receiverDetails as any).division_name || '',
        },
        priority: letter.priority,
        mode_of_arrival: letter.modeOfArrival,
        received_date:
          letter.receivedDate || new Date().toISOString().split('T')[0],
        sent_date: letter.sentDate,
        subject: letter.subject || '',
        content: letter.content || '',
        attachments: [],
      } as LetterFormData)
    }
  }, [letter, open])

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
          {letter ? 'Edit Letter' : 'Add New Letter'}
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
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
            >
              <Stack spacing={3}>
                {/* Reference Number */}
                <form.Field name="reference">
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Reference Number"
                      variant="outlined"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={
                        !field.state.meta.isValid && field.state.meta.isTouched
                      }
                      helperText={
                        field.state.meta.isTouched
                          ? field.state.meta.errors[0]?.message
                          : ''
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  )}
                </form.Field>

                {/* Subject */}
                <form.Field name="subject">
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={
                        !field.state.meta.isValid && field.state.meta.isTouched
                      }
                      helperText={
                        field.state.meta.isTouched
                          ? field.state.meta.errors[0]?.message
                          : ''
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  )}
                </form.Field>

                {/* Sender Details Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: 'primary.main' }}
                  >
                    Sender Details
                  </Typography>
                  <Stack spacing={2}>
                    <form.Field name="sender_details.name">
                      {(field) => (
                        <TextField
                          fullWidth
                          label="Sender Name"
                          variant="outlined"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={
                            !field.state.meta.isValid &&
                            field.state.meta.isTouched
                          }
                          helperText={
                            field.state.meta.isTouched
                              ? field.state.meta.errors[0]?.message
                              : ''
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    </form.Field>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <form.Field name="sender_details.email">
                        {(field) => (
                          <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={
                              !field.state.meta.isValid &&
                              field.state.meta.isTouched
                            }
                            helperText={
                              field.state.meta.isTouched
                                ? field.state.meta.errors[0]?.message
                                : ''
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      </form.Field>
                      <form.Field name="sender_details.phone_number">
                        {(field) => (
                          <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={
                              !field.state.meta.isValid &&
                              field.state.meta.isTouched
                            }
                            helperText={
                              field.state.meta.isTouched
                                ? field.state.meta.errors[0]?.message
                                : ''
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      </form.Field>
                    </Stack>
                    <form.Field name="sender_details.address">
                      {(field) => (
                        <TextField
                          fullWidth
                          label="Address"
                          variant="outlined"
                          multiline
                          rows={2}
                          value={field.state.value || ''}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={
                            !field.state.meta.isValid &&
                            field.state.meta.isTouched
                          }
                          helperText={
                            field.state.meta.isTouched
                              ? field.state.meta.errors[0]?.message
                              : ''
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    </form.Field>
                  </Stack>
                </Box>

                {/* Receiver Details Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: 'primary.main' }}
                  >
                    Receiver Details
                  </Typography>
                  <Stack spacing={2}>
                    <form.Field name="receiver_details.name">
                      {(field) => (
                        <TextField
                          fullWidth
                          label="Receiver Name"
                          variant="outlined"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={
                            !field.state.meta.isValid &&
                            field.state.meta.isTouched
                          }
                          helperText={
                            field.state.meta.isTouched
                              ? field.state.meta.errors[0]?.message
                              : ''
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />
                      )}
                    </form.Field>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <form.Field name="receiver_details.designation">
                        {(field) => (
                          <TextField
                            fullWidth
                            label="Designation"
                            variant="outlined"
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={
                              !field.state.meta.isValid &&
                              field.state.meta.isTouched
                            }
                            helperText={
                              field.state.meta.isTouched
                                ? field.state.meta.errors[0]?.message
                                : ''
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      </form.Field>
                      <form.Field name="receiver_details.division_name">
                        {(field) => (
                          <TextField
                            fullWidth
                            label="Division Name"
                            variant="outlined"
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={
                              !field.state.meta.isValid &&
                              field.state.meta.isTouched
                            }
                            helperText={
                              field.state.meta.isTouched
                                ? field.state.meta.errors[0]?.message
                                : ''
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                        )}
                      </form.Field>
                    </Stack>
                  </Stack>
                </Box>

                {/* Priority and Mode of Arrival */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <form.Field name="priority">
                    {(field) => (
                      <FormControl
                        sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                      >
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={field.state.value}
                          label="Priority"
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={!field.state.meta.isValid}
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: 2,
                            },
                          }}
                        >
                          {priorities.map((priority) => (
                            <MenuItem
                              key={priority.value}
                              value={priority.value}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: priority.color,
                                  }}
                                />
                                {priority.value}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </form.Field>

                  <form.Field name="mode_of_arrival">
                    {(field) => (
                      <FormControl
                        sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                      >
                        <InputLabel>Mode of Arrival</InputLabel>
                        <Select
                          value={field.state.value}
                          label="Mode of Arrival"
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          error={!field.state.meta.isValid}
                          sx={{
                            borderRadius: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderRadius: 2,
                            },
                          }}
                        >
                          {modesOfArrival.map((mode) => (
                            <MenuItem key={mode} value={mode}>
                              {mode.replaceAll('_', ' ')}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </form.Field>
                </Stack>

                {/* Date Fields */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <form.Field name="received_date">
                    {(field) => (
                      <TextField
                        fullWidth
                        label="Receiving Date"
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                        helperText={
                          field.state.meta.isTouched
                            ? field.state.meta.errors[0]?.message
                            : ''
                        }
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  </form.Field>
                  <form.Field name="sent_date">
                    {(field) => (
                      <TextField
                        fullWidth
                        label="Sent Date (Optional)"
                        type="date"
                        value={field.state.value || ''}
                        onChange={(e) =>
                          field.handleChange(e.target.value || undefined)
                        }
                        onBlur={field.handleBlur}
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                        helperText={
                          field.state.meta.isTouched
                            ? field.state.meta.errors[0]?.message
                            : ''
                        }
                        slotProps={{
                          inputLabel: {
                            shrink: true,
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  </form.Field>
                </Stack>

                {/* Content/Description */}
                <form.Field name="content">
                  {(field) => (
                    <TextField
                      fullWidth
                      label="Content"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={
                        !field.state.meta.isValid && field.state.meta.isTouched
                      }
                      helperText={
                        field.state.meta.isTouched
                          ? field.state.meta.errors[0]?.message
                          : ''
                      }
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                        },
                      }}
                    />
                  )}
                </form.Field>

                {/* File Attachments (only for create mode) */}
                {!letter && (
                  <form.Field name="attachments" mode="array">
                    {(field) => (
                      <FileUploadField
                        field={{
                          state: {
                            value: field.state.value || [],
                            meta: field.state.meta,
                          },
                          pushValue: field.pushValue,
                          removeValue: field.removeValue,
                          validate: field.validate,
                        }}
                        label="Attachments"
                        accept={{
                          'image/png': ['.png'],
                          'image/jpeg': ['.jpg', '.jpeg'],
                          'application/pdf': ['.pdf'],
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            ['.docx'],
                        }}
                        maxSize={10 * 1024 * 1024}
                        multiple
                        helperText="Drag & drop files here, or click to select (PNG, JPEG, PDF, DOCX - Max 10MB each)"
                      />
                    )}
                  </form.Field>
                )}
              </Stack>
            </form>
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
              disabled={!canSubmit || createLetterMutation.isPending}
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
              {createLetterMutation.isPending || isSubmitting
                ? 'Submitting...'
                : 'Submit Letter'}
            </Button>
          )}
        </form.Subscribe>
      </DialogActions>
    </Dialog>
  )
}

export default AddLetterDialog
