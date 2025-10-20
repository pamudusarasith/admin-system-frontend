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
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/api'
import type { CabinetPaperFormData } from '@/schemas'
import { FileUploadField, useSnackbar } from '@/components'
import { createCabinetPaper } from '@/api'
import { getCategories } from '@/api/categories'
import { cabinetPaperFormDataSchema, cabinetPaperStatusEnum } from '@/schemas'

interface AddCabinetPaperDialogProps {
  open: boolean
  onClose: () => void
}

export const AddCabinetPaperDialog: React.FC<AddCabinetPaperDialogProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const { showSnackbar } = useSnackbar()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Fetch categories
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery(
    {
      queryKey: ['cabinet-paper-categories'],
      queryFn: () => getCategories(),
      enabled: open,
    },
  )

  const categories = categoriesResponse?.data || []

  const createCabinetPaperMutation = useMutation({
    mutationFn: (paperFormData: CabinetPaperFormData) => {
      return createCabinetPaper(paperFormData)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cabinet-papers'] })
      handleClose()
      showSnackbar({
        message: data.message?.trim() || 'Cabinet paper created successfully!',
        severity: 'success',
      })
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
      referenceId: '',
      subject: '',
      summary: '',
      categoryId: 0,
      status: 'DRAFT' as const,
      attachments: [] as Array<File>,
    } as CabinetPaperFormData,
    onSubmit: ({ value }) => {
      createCabinetPaperMutation.mutate(value)
    },
    validators: {
      onChange: cabinetPaperFormDataSchema,
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`,
              }}
            >
              <ArticleIcon
                sx={{
                  fontSize: 28,
                  color: 'primary.main',
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Create Cabinet Paper
            </Typography>
          </Box>
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
                {/* Reference ID */}
                <form.Field name="referenceId">
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
                        Reference ID *
                      </Typography>
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="e.g., CP-2025-001"
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
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

                {/* Subject */}
                <form.Field name="subject">
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
                        Subject *
                      </Typography>
                      <TextField
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter cabinet paper subject..."
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
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

                {/* Summary */}
                <form.Field name="summary">
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
                        Summary
                      </Typography>
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Enter a brief summary of the cabinet paper..."
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
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

                {/* Category and Status Row */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {/* Category */}
                  <form.Field name="categoryId">
                    {(field) => (
                      <FormControl
                        fullWidth
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1,
                          }}
                        >
                          Category *
                        </Typography>
                        <Select
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          onBlur={field.handleBlur}
                          disabled={isLoadingCategories}
                          sx={{
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          <MenuItem value={0} disabled>
                            Select a category
                          </MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {!field.state.meta.isValid &&
                          field.state.meta.isTouched && (
                            <FormHelperText>
                              {field.state.meta.errors
                                .map((e) => e?.message)
                                .join(', ')}
                            </FormHelperText>
                          )}
                      </FormControl>
                    )}
                  </form.Field>

                  {/* Status */}
                  <form.Field name="status">
                    {(field) => (
                      <FormControl
                        fullWidth
                        error={
                          !field.state.meta.isValid &&
                          field.state.meta.isTouched
                        }
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1,
                          }}
                        >
                          Status *
                        </Typography>
                        <Select
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(e.target.value as any)
                          }
                          onBlur={field.handleBlur}
                          sx={{
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          {cabinetPaperStatusEnum.options.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status.replaceAll('_', ' ')}
                            </MenuItem>
                          ))}
                        </Select>
                        {!field.state.meta.isValid &&
                          field.state.meta.isTouched && (
                            <FormHelperText>
                              {field.state.meta.errors
                                .map((e) => e?.message)
                                .join(', ')}
                            </FormHelperText>
                          )}
                      </FormControl>
                    )}
                  </form.Field>
                </Stack>

                {/* File Attachments */}
                <form.Field name="attachments" mode="array">
                  {(field) => (
                    <FileUploadField
                      field={{
                        ...field,
                        state: {
                          ...field.state,
                          value: field.state.value || [],
                        },
                      }}
                      label="Attachments"
                      accept={{
                        'image/*': ['.png', '.jpg', '.jpeg'],
                        'application/pdf': ['.pdf'],
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                          ['.docx'],
                        'text/plain': ['.txt'],
                      }}
                      maxSize={200 * 1024 * 1024} // 200MB
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
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!canSubmit || createCabinetPaperMutation.isPending}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 140,
                  boxShadow: theme.shadows[2],
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {createCabinetPaperMutation.isPending || isSubmitting
                  ? 'Creating...'
                  : 'Create Paper'}
              </Button>
            )}
          </form.Subscribe>
        </DialogActions>
      </form>
    </Dialog>
  )
}
