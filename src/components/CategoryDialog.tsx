import React, { useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import type { Category, CategoryFormData } from '@/api/categories'
import { createCategory, updateCategory } from '@/api/categories'
import { categoryFormDataSchema } from '@/schemas'
import { useSnackbar } from '@/components'

interface CategoryDialogProps {
  open: boolean
  onClose: () => void
  category?: Category | null
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  category,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()

  const isEditing = Boolean(category)

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({
        queryKey: ['cabinet-paper-categories-search'],
      })
      handleClose()
      showSnackbar({
        message: data.message?.trim() || 'Category created successfully!',
        severity: 'success',
      })
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to create category. Please try again.'
      showSnackbar({
        message,
        severity: 'error',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
      updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({
        queryKey: ['cabinet-paper-categories-search'],
      })
      handleClose()
      showSnackbar({
        message: data.message?.trim() || 'Category updated successfully!',
        severity: 'success',
      })
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message =
        error.response?.data.message?.trim() ||
        'Failed to update category. Please try again.'
      showSnackbar({
        message,
        severity: 'error',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    } as CategoryFormData,
    onSubmit: ({ value }) => {
      if (isEditing && category) {
        updateMutation.mutate({ id: String(category.id), data: value })
      } else {
        createMutation.mutate(value)
      }
    },
    validators: {
      onChange: categoryFormDataSchema,
    },
  })

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      form.reset()
      if (category) {
        form.setFieldValue('name', category.name)
        form.setFieldValue('description', category.description || '')
      }
    }
  }, [open, category, form])

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
            variant="h6"
            sx={{ fontWeight: 700, color: theme.palette.text.primary }}
          >
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
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
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Name Field */}
            <form.Field name="name">
              {(field) => (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    Category Name *
                  </Typography>
                  <TextField
                    fullWidth
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter category name..."
                    error={
                      !field.state.meta.isValid && field.state.meta.isTouched
                    }
                    helperText={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                            .map((e) => e?.message)
                            .join(', ')
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
                </Box>
              )}
            </form.Field>

            {/* Description Field */}
            <form.Field name="description">
              {(field) => (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      mb: 1,
                    }}
                  >
                    Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter category description..."
                    error={
                      !field.state.meta.isValid && field.state.meta.isTouched
                    }
                    helperText={
                      field.state.meta.isTouched
                        ? field.state.meta.errors
                            .map((e) => e?.message)
                            .join(', ')
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
                </Box>
              )}
            </form.Field>
          </Box>
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
              const isLoading =
                createMutation.isPending ||
                updateMutation.isPending ||
                isSubmitting

              let buttonText = 'Create'
              if (isLoading) {
                buttonText = 'Saving...'
              } else if (isEditing) {
                buttonText = 'Update'
              }

              return (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    !canSubmit ||
                    createMutation.isPending ||
                    updateMutation.isPending
                  }
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
