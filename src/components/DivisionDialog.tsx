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
import {
  Add as AddIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import type { DivisionFormData } from '@/schemas'
import type { Division } from '@/api/divisions'
import { useSnackbar } from '@/components'
import { createDivision, updateDivision } from '@/api/divisions'
import { divisionSchema } from '@/schemas'
import { Permission as P, useAuth } from '@/core'

interface DivisionDialogProps {
  open: boolean
  onClose: () => void
  division?: Division | null
}

export const DivisionDialog: React.FC<DivisionDialogProps> = ({
  open,
  onClose,
  division,
}) => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const { hasAuthority } = useAuth()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isEditMode = !!division

  // Check permissions
  const canCreate = hasAuthority(P.divisionCreate)
  const canUpdate = hasAuthority(P.divisionUpdate)

  // Determine if user can perform the action
  const canPerformAction = isEditMode ? canUpdate : canCreate

  // Create mutation
  const createDivisionMutation = useMutation({
    mutationFn: (data: DivisionFormData) => createDivision(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
      handleClose()
      if (data.message?.trim())
        showSnackbar({ message: data.message, severity: 'success' })
      else
        showSnackbar({
          message: 'Division created successfully',
          severity: 'success',
        })
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to create division. Please try again.'
      showSnackbar({
        message,
        severity: 'error',
      })
    },
  })

  // Update mutation
  const updateDivisionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DivisionFormData }) =>
      updateDivision(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
      handleClose()
      if (data.message?.trim())
        showSnackbar({ message: data.message, severity: 'success' })
      else
        showSnackbar({
          message: 'Division updated successfully',
          severity: 'success',
        })
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to update division. Please try again.'
      showSnackbar({
        message,
        severity: 'error',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      name: division?.name || '',
      description: division?.description || '',
    } as DivisionFormData,
    onSubmit: ({ value }) => {
      if (!canPerformAction) {
        showSnackbar({
          message: `You don't have permission to ${isEditMode ? 'update' : 'create'} divisions`,
          severity: 'error',
        })
        return
      }

      if (isEditMode && canUpdate) {
        updateDivisionMutation.mutate({ id: String(division.id), data: value })
      } else if (!isEditMode && canCreate) {
        createDivisionMutation.mutate(value)
      }
    },
    validators: {
      onChange: divisionSchema,
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const isPending =
    createDivisionMutation.isPending || updateDivisionMutation.isPending

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
            {isEditMode ? 'Edit Division' : 'Add New Division'}
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
                {/* Division Name */}
                <form.Field name="name">
                  {(field) => (
                    <Box>
                      <TextField
                        fullWidth
                        label="Division Name"
                        variant="outlined"
                        placeholder="Enter the division name"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!field.state.meta.isValid}
                        helperText={field.state.meta.errors
                          .map((e) => e?.message)
                          .join(', ')}
                        disabled={!canPerformAction}
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

                {/* Description */}
                <form.Field name="description">
                  {(field) => (
                    <Box>
                      <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={4}
                        placeholder="Provide a detailed description of the division's responsibilities..."
                        value={field.state.value || ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        error={!field.state.meta.isValid}
                        helperText={field.state.meta.errors
                          .map((e) => e?.message)
                          .join(', ')}
                        disabled={!canPerformAction}
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
            {([canSubmit, isSubmitting]) => {
              const isLoading = isPending || isSubmitting
              let buttonText = 'Create Division'
              if (isLoading) {
                buttonText = isEditMode ? 'Updating...' : 'Creating...'
              } else if (isEditMode) {
                buttonText = 'Update Division'
              }

              return (
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isEditMode ? <EditIcon /> : <AddIcon />}
                  disabled={!canSubmit || isPending || !canPerformAction}
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
                  {buttonText}
                </Button>
              )
            }}
          </form.Subscribe>
        </DialogActions>
      </form>
    </Dialog>
  )
}
